#!/usr/bin/env python3
"""
CLIPPER: convierte un stream o vídeo largo en clips verticales listos para
TikTok / YouTube Shorts / Reels.

  1. Descarga el vídeo (YouTube, Twitch, Kick...) o usa un archivo local.
  2. Busca los mejores momentos: picos de volumen (gritos, risas, sustos,
     explosiones) y, si hay subtítulos, palabras de reacción ("no puede ser",
     "jajaja", "qué", "hermano"...).
  3. Corta cada momento en formato 9:16 (1080x1920).
  4. Le pone subtítulos grandes estilo TikTok (de 3 en 3 palabras).

Uso básico:
  python3 clipper.py "https://www.twitch.tv/videos/XXXX"
  python3 clipper.py partida.mp4 --clips 8 --duracion 35
  python3 clipper.py vod.mp4 --facecam 1500,700,420,380   # x,y,ancho,alto de la cámara
  python3 clipper.py vod.mp4 --desde 01:00:00 --hasta 02:30:00
"""
import argparse, json, os, re, subprocess, sys, wave
import numpy as np

REACCIONES = ["no puede ser", "jajaja", "jaja", "qué", "hostia", "dios", "madre mía",
              "hermano", "bro", "wtf", "corre", "cuidado", "increíble", "brutal",
              "no no no", "vamos", "lo tengo", "ay", "flipa", "mira"]

def run(cmd):
    subprocess.run(cmd, check=True)

def tiempo(s):
    if s is None: return None
    p = [float(x) for x in str(s).split(":")]
    return sum(v * 60 ** i for i, v in enumerate(reversed(p)))

def hms(t):
    t = int(t); return f"{t//3600:02d}h{t%3600//60:02d}m{t%60:02d}s"

def descargar(url, carpeta):
    out = os.path.join(carpeta, "fuente.%(ext)s")
    run(["yt-dlp", "-f", "bv*[height<=1080]+ba/b", "--merge-output-format", "mp4", "-o", out, url])
    return os.path.join(carpeta, "fuente.mp4")

def duracion_video(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())

def energia_audio(path, carpeta):
    """Volumen (dB) por cada 0.5 s del vídeo."""
    wav = os.path.join(carpeta, "audio.wav")
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", path,
         "-vn", "-ac", "1", "-ar", "8000", "-f", "wav", wav])
    with wave.open(wav) as w:
        x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
    paso = 4000  # 0.5 s a 8 kHz
    n = len(x) // paso
    rms = np.sqrt(np.mean(x[: n * paso].reshape(n, paso) ** 2, axis=1) + 1e-9)
    return 20 * np.log10(rms + 1e-9), 0.5

def transcribir(path, modelo, idioma, inicio=0, dur=None):
    from faster_whisper import WhisperModel
    global _MODELO
    if "_MODELO" not in globals():
        print(f"Cargando modelo de voz '{modelo}' (la primera vez se descarga)...")
        _MODELO = WhisperModel(modelo, device="auto", compute_type="int8")
    src = path
    if dur is not None:
        src = path + f".tmp_{int(inicio)}.wav"
        run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", str(inicio), "-t", str(dur),
             "-i", path, "-vn", "-ac", "1", "-ar", "16000", src])
    segs, _ = _MODELO.transcribe(src, language=idioma, word_timestamps=True, vad_filter=True)
    palabras = [(w.start, w.end, w.word.strip()) for s in segs for w in (s.words or [])]
    if src != path: os.remove(src)
    return palabras

def elegir_momentos(db, paso, total, n, dur, desde, hasta, palabras=None):
    """Devuelve los n instantes (s) más intensos, separados al menos 'dur' segundos."""
    k = 240  # media móvil de 2 min, con bordes replicados (evita falsos picos al inicio/fin)
    pad = np.pad(db, (k // 2, k // 2), mode="edge")
    base = np.convolve(pad, np.ones(k) / k, mode="same")[k // 2: k // 2 + len(db)]
    puntos = np.clip(db - base, 0, None) ** 2
    if palabras:
        for s, e, w in palabras:
            if any(r in w.lower() for r in REACCIONES):
                i = int(s / paso)
                if i < len(puntos): puntos[i] += 40
    score = np.convolve(puntos, np.ones(8), mode="same")  # momentos de ~4 s
    lo = int((desde or 0) / paso); hi = int((hasta or total) / paso)
    sep = int(dur / paso)
    elegidos = []
    for i in np.argsort(score)[::-1]:
        if score[i] <= 0: break
        if lo <= i < hi and all(abs(i - j) >= sep for j in elegidos):
            elegidos.append(int(i))
        if len(elegidos) >= n: break
    return sorted((i * paso, float(score[i])) for i in elegidos)

def ass_subtitulos(palabras, inicio, dur, ruta):
    def ts(t):
        t = max(0, t); return f"{int(t//3600)}:{int(t%3600//60):02d}:{t%60:05.2f}"
    cab = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,DejaVu Sans,92,&H0000FFFF,&H00FFFFFF,&H00000000,&H80000000,1,0,0,0,100,100,0,0,1,7,3,2,60,60,560,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ps = [(s - inicio, e - inicio, w) for s, e, w in palabras if inicio <= s < inicio + dur]
    lineas = []
    for k in range(0, len(ps), 3):
        g = ps[k:k + 3]
        fin = ps[k + 3][0] if k + 3 < len(ps) else g[-1][1]
        texto = " ".join(w for _, _, w in g).upper().replace("{", "").replace("}", "")
        lineas.append(f"Dialogue: 0,{ts(g[0][0])},{ts(min(fin, g[-1][1] + 0.6))},Sub,,0,0,0,,{{\\fscx115\\fscy115\\t(0,120,\\fscx100\\fscy100)}}{texto}")
    open(ruta, "w", encoding="utf-8").write(cab + "\n".join(lineas) + "\n")

def renderizar(src, inicio, dur, salida, facecam=None, subs=None):
    if facecam:
        x, y, w, h = facecam
        vf = (f"[0:v]split=2[a][b];"
              f"[a]crop={w}:{h}:{x}:{y},scale=1080:640:force_original_aspect_ratio=increase,crop=1080:640[cam];"
              f"[b]scale=-2:1280,crop=1080:1280[game];"
              f"[cam][game]vstack[v]")
    else:  # vídeo centrado con fondo desenfocado
        vf = (f"[0:v]split=2[a][b];"
              f"[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5,eq=brightness=-0.15[bg];"
              f"[b]scale=1080:-2[fg];[bg][fg]overlay=0:(H-h)/2[v]")
    if subs:
        vf += f";[v]ass='{subs}'[v]"
    run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-ss", str(inicio), "-t", str(dur),
         "-i", src, "-filter_complex", vf, "-map", "[v]", "-map", "0:a?",
         "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-af", "loudnorm=I=-14:TP=-1.5", "-r", "30",
         "-movflags", "+faststart", salida])

def main():
    ap = argparse.ArgumentParser(description="Saca clips virales verticales de un stream/vídeo.")
    ap.add_argument("fuente", help="URL (YouTube/Twitch/Kick...) o archivo de vídeo")
    ap.add_argument("--clips", type=int, default=5, help="cuántos clips sacar (5)")
    ap.add_argument("--duracion", type=float, default=30, help="segundos por clip (30)")
    ap.add_argument("--antes", type=float, default=8, help="segundos de contexto antes del momento (8)")
    ap.add_argument("--desde"); ap.add_argument("--hasta")
    ap.add_argument("--facecam", help="x,y,ancho,alto de la cámara del streamer en el vídeo original")
    ap.add_argument("--sin-subs", action="store_true", help="no generar subtítulos")
    ap.add_argument("--modelo", default="small", help="modelo de voz: tiny/base/small/medium")
    ap.add_argument("--idioma", default="es")
    ap.add_argument("--salida", default="clips")
    a = ap.parse_args()

    os.makedirs(a.salida, exist_ok=True)
    src = a.fuente
    if re.match(r"https?://", src):
        print("Descargando..."); src = descargar(src, a.salida)
    total = duracion_video(src)
    print(f"Vídeo de {hms(total)}. Analizando audio...")
    db, paso = energia_audio(src, a.salida)
    candidatos = elegir_momentos(db, paso, total, a.clips * 3, a.duracion, tiempo(a.desde), tiempo(a.hasta))

    palabras_por_clip = {}
    if not a.sin_subs:
        # transcribe solo los candidatos (mucho más rápido que todo el stream)
        print(f"Transcribiendo {len(candidatos)} momentos candidatos...")
        todas = []
        for t, _ in candidatos:
            ini = max(0, t - a.antes)
            ps = [(s + ini, e + ini, w) for s, e, w in transcribir(src, a.modelo, a.idioma, ini, a.duracion + a.antes)]
            palabras_por_clip[t] = ps; todas += ps
        candidatos = elegir_momentos(db, paso, total, a.clips, a.duracion, tiempo(a.desde), tiempo(a.hasta), todas)
    else:
        candidatos = sorted(sorted(candidatos, key=lambda c: -c[1])[: a.clips])

    fc = tuple(int(v) for v in a.facecam.split(",")) if a.facecam else None
    resumen = []
    for n, (t, score) in enumerate(candidatos, 1):
        ini = max(0, t - a.antes)
        nombre = os.path.join(a.salida, f"clip_{n:02d}_{hms(ini)}.mp4")
        subs = None
        if not a.sin_subs:
            ps = [p for k, v in palabras_por_clip.items() for p in v]
            if not palabras_por_clip.get(t):
                ps = [(s + ini, e + ini, w) for s, e, w in transcribir(src, a.modelo, a.idioma, ini, a.duracion)]
            subs = os.path.abspath(nombre.replace(".mp4", ".ass"))
            ass_subtitulos(sorted(set(ps)), ini, a.duracion, subs)
        print(f"[{n}/{len(candidatos)}] {hms(ini)} -> {nombre}")
        renderizar(src, ini, a.duracion, nombre, fc, subs)
        resumen.append({"clip": nombre, "inicio": hms(ini), "puntuacion": round(score, 1)})
    json.dump(resumen, open(os.path.join(a.salida, "resumen.json"), "w"), indent=2, ensure_ascii=False)
    print(f"\nListo: {len(resumen)} clips en '{a.salida}/'. Revísalos antes de publicar.")

if __name__ == "__main__":
    main()
