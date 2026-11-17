#!/usr/bin/env python3
"""
Generador de Shorts verticales (1080x1920, 30 fps) a partir de un guion.json.

Uso:
  python3 generar_short.py carpeta/guion.json [musica.mp3]
  python3 generar_short.py --todos            # renderiza todas las carpetas con guion.json

guion.json:
{
  "tema": "atardecer" | "noche" | "playa",          (opcional)
  "slides": [
    {"tag": "#1", "grande": "212 GB", "texto": "línea 1\\nlínea 2", "dur": 4.5},
    ...
  ]
}
Fondo neón animado (sol, palmeras, cuadrícula en movimiento), cifra grande con
efecto rebote, textos que entran deslizando y barra de progreso.
Todo es gráfico original: sin imágenes ni música con copyright.
"""
import glob, json, math, os, random, subprocess, sys
from multiprocessing import Pool
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H, FPS = 1080, 1920, 30
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
HORIZONTE = 1290

TEMAS = {
    "atardecer": dict(cielo=[(20, 6, 48), (110, 18, 120), (255, 60, 140), (255, 150, 70)],
                      sol=[(255, 230, 90), (255, 70, 150)], rejilla=(255, 60, 200), suelo=(18, 4, 40)),
    "noche":     dict(cielo=[(4, 4, 24), (30, 10, 80), (90, 20, 160), (0, 170, 255)],
                      sol=[(120, 240, 255), (180, 60, 255)], rejilla=(0, 220, 255), suelo=(6, 4, 30)),
    "playa":     dict(cielo=[(10, 30, 80), (40, 90, 200), (255, 120, 170), (255, 210, 120)],
                      sol=[(255, 245, 160), (255, 110, 90)], rejilla=(255, 180, 60), suelo=(30, 10, 50)),
}
AMARILLO, ROSA, BLANCO = (255, 216, 64), (255, 45, 149), (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def grad(colores, t):
    t = min(max(t, 0), 1) * (len(colores) - 1)
    i = min(int(t), len(colores) - 2)
    return lerp(colores[i], colores[i + 1], t - i)


def ease_out_cubic(p):
    return 1 - (1 - p) ** 3


def ease_out_back(p):
    c1 = 1.70158; c3 = c1 + 1
    return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2


# ---------------------------------------------------------------- fondo
def palmera(alto, flip=False):
    im = Image.new("RGBA", (520, alto + 200), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    col = (12, 2, 24, 255)
    # tronco curvado
    pts = []
    for i in range(41):
        f = i / 40
        x = 300 - 120 * f ** 2
        y = alto + 190 - f * alto
        pts.append((x, y))
    for i in range(40):
        w = 34 - 18 * (i / 40)
        d.line([pts[i], pts[i + 1]], fill=col, width=int(w))
    cx, cy = pts[-1]
    # hojas
    for ang in [-160, -130, -100, -60, -25, 10, 35]:
        a = math.radians(ang)
        hoja = []
        largo = 230
        for s in range(13):
            f = s / 12
            px = cx + math.cos(a) * largo * f
            py = cy + math.sin(a) * largo * f + 90 * f ** 2
            hoja.append((px, py))
        for s in range(12):
            d.line([hoja[s], hoja[s + 1]], fill=col, width=int(26 * (1 - s / 12)) + 4)
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    return im


def crear_fondo(tema):
    T = TEMAS[tema]
    bg = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(bg)
    for y in range(HORIZONTE):
        d.line([(0, y), (W, y)], fill=grad(T["cielo"], y / HORIZONTE))
    random.seed(7)
    for _ in range(140):  # estrellas
        x, y = random.randrange(W), random.randrange(int(HORIZONTE * 0.55))
        r = random.choice([1, 1, 2, 3])
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 255))
    # sol con franjas
    sol = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ds = ImageDraw.Draw(sol)
    cx, cy, r = W // 2, HORIZONTE - 120, 330
    for y in range(cy - r, cy + r):
        dx = int(math.sqrt(max(r * r - (y - cy) ** 2, 0)))
        f = (y - (cy - r)) / (2 * r)
        if f > 0.5 and int((y - cy) / 22) % 2 == 1 and (y - cy) % 22 < 4 + 10 * (f - 0.5) * 2:
            continue
        ds.line([(cx - dx, y), (cx + dx, y)], fill=grad(T["sol"], f) + (255,))
    glow = sol.filter(ImageFilter.GaussianBlur(60))
    bg.paste(glow, (0, 0), glow)
    bg.paste(sol, (0, 0), sol)
    # suelo
    for y in range(HORIZONTE, H):
        f = (y - HORIZONTE) / (H - HORIZONTE)
        d.line([(0, y), (W, y)], fill=lerp(T["suelo"], (0, 0, 0), f * 0.6))
    d.line([(0, HORIZONTE), (W, HORIZONTE)], fill=T["rejilla"], width=4)
    return bg


def dibujar_rejilla(frame, t, color):
    d = ImageDraw.Draw(frame)
    vx = W // 2
    for i in range(-14, 15):  # líneas que convergen
        d.line([(vx + i * 18, HORIZONTE), (vx + i * 260, H)], fill=color, width=3)
    fase = (t * 0.9) % 1
    for k in range(12):  # líneas horizontales que avanzan
        z = (k + fase) / 12
        y = HORIZONTE + (H - HORIZONTE) * z ** 2.2
        d.line([(0, int(y)), (W, int(y))], fill=color, width=2 + int(z * 4))


# ---------------------------------------------------------------- texto
def texto_img(txt, size, fill, stroke=8, glow=None, glow_r=14):
    font = ImageFont.truetype(FONT, size)
    l, t, r, b = font.getbbox(txt, stroke_width=stroke)
    pad = 50
    im = Image.new("RGBA", (r - l + pad * 2, b - t + pad * 2), (0, 0, 0, 0))
    pos = (pad - l, pad - t)
    if glow:
        g = Image.new("RGBA", im.size, (0, 0, 0, 0))
        ImageDraw.Draw(g).text(pos, txt, font=font, fill=glow + (255,), stroke_width=stroke + 6,
                               stroke_fill=glow + (255,))
        g = g.filter(ImageFilter.GaussianBlur(glow_r))
        im = Image.alpha_composite(im, g)
    ImageDraw.Draw(im).text(pos, txt, font=font, fill=fill + (255,), stroke_width=stroke,
                            stroke_fill=(0, 0, 0, 255))
    return im


def ajustar(lineas, maxpx, base):
    size = base
    font = ImageFont.truetype(FONT, size)
    while size > 30 and max(font.getlength(l) for l in lineas) > maxpx:
        size -= 2
        font = ImageFont.truetype(FONT, size)
    return size


def preparar_slide(s, primera):
    """Devuelve lista de elementos: (img, cx, y, retardo, tipo)."""
    elems = []
    retardo0 = -5 if primera else 0.0
    if s.get("tag"):
        im = texto_img(s["tag"], 120, AMARILLO, 8, ROSA, 18)
        elems.append([im, W // 2, 190, retardo0, "pop"])
    bloque = []
    if s.get("grande"):
        size = ajustar([s["grande"]], 940, 190)
        bloque.append((texto_img(s["grande"], size, AMARILLO, 10, ROSA, 22), "pop"))
    lineas = [l for l in s["texto"].split("\n")]
    size = ajustar([l for l in lineas if l.strip()] or ["x"], 900, 82)
    for l in lineas:
        if l.strip():
            bloque.append((texto_img(l, size, BLANCO, 7), "slide"))
        else:
            bloque.append((None, "hueco"))
    alto = sum((im.height - 70) if im else 50 for im, _ in bloque)
    y = 640 - alto // 2 if s.get("grande") else 700 - alto // 2
    y = max(y, 400 if s.get("tag") else 300)
    k = 0
    for im, tipo in bloque:
        if im is None:
            y += 50; continue
        elems.append([im, W // 2, y - 35, retardo0 + 0.12 + 0.09 * k, tipo])
        y += im.height - 70
        k += 1
    # panel oscuro detrás del bloque
    top = min(e[2] for e in elems if e[2] > 300) + 2 if bloque else 400
    panel = Image.new("RGBA", (W - 60, y - top + 70), (0, 0, 0, 0))
    ImageDraw.Draw(panel).rounded_rectangle([0, 0, panel.width - 1, panel.height - 1], 40,
                                            fill=(8, 0, 24, 165), outline=ROSA + (200,), width=4)
    elems.insert(0, [panel, W // 2, top, retardo0, "fade"])
    return elems


def pegar(frame, im, cx, y, alpha, escala=1.0):
    if alpha <= 0.01:
        return
    if abs(escala - 1) > 0.01:
        im = im.resize((max(1, int(im.width * escala)), max(1, int(im.height * escala))), Image.BILINEAR)
        y = y + int((im.height / escala - im.height) / 2)
    m = im.getchannel("A")
    if alpha < 0.99:
        m = m.point([int(v * alpha) for v in range(256)])
    frame.paste(im, (cx - im.width // 2, int(y)), m)


# ---------------------------------------------------------------- voz
MODELOS = os.environ.get("VOZ_MODELOS", os.path.join(os.path.dirname(os.path.abspath(__file__)), "modelos"))


def sintetizar_voz(g, carpeta):
    """Genera voz.wav con la narración ('voz' de cada slide) y ajusta las duraciones."""
    if not any(s.get("voz") for s in g["slides"]):
        return None
    import numpy as np, soundfile as sf
    from kokoro_onnx import Kokoro
    k = Kokoro(os.path.join(MODELOS, "kokoro.onnx"), os.path.join(MODELOS, "voices.bin"))
    voz, vel = g.get("voz", "em_alex"), g.get("velocidad", 1.12)
    trozos, sr = [], 24000
    for s in g["slides"]:
        if s.get("voz"):
            a, sr = k.create(s["voz"], voice=voz, speed=vel, lang="es")
            nz = np.where(np.abs(a) > 0.01)[0]
            a = a[nz[0]: nz[-1] + 1] if len(nz) else a
        else:
            a = np.zeros(0, dtype=np.float32)
        trozos.append(a)
        s["dur"] = max(s["dur"] if not s.get("voz") else 0, len(a) / sr + 0.55)
    pista = np.concatenate([np.concatenate([np.zeros(int(0.12 * sr), np.float32), a,
                                            np.zeros(int((s["dur"] - 0.12) * sr) - len(a), np.float32)])
                            for s, a in zip(g["slides"], trozos)])
    ruta = os.path.join(carpeta, "voz.wav")
    sf.write(ruta, pista, sr)
    return ruta


# ---------------------------------------------------------------- render
def render(guion_path, musica=None):
    g = json.load(open(guion_path, encoding="utf-8"))
    carpeta = os.path.dirname(os.path.abspath(guion_path))
    voz = sintetizar_voz(g, carpeta)
    tema = g.get("tema", "atardecer")
    T = TEMAS[tema]
    fondo = crear_fondo(tema)
    palmas = [(palmera(760), -150, HORIZONTE - 760), (palmera(620, True), W - 370, HORIZONTE - 600)]
    slides = g["slides"]
    preparados = [preparar_slide(s, i == 0) for i, s in enumerate(slides)]
    total = sum(s["dur"] for s in slides)
    inicios, acc = [], 0.0
    for s in slides:
        inicios.append(acc); acc += s["dur"]

    out = os.path.join(os.path.dirname(os.path.abspath(guion_path)), "short.mp4")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-"]
    if voz and musica:
        cmd += ["-i", voz, "-stream_loop", "-1", "-i", musica, "-filter_complex",
                "[1:a]loudnorm=I=-14:TP=-1.5[v];[2:a]volume=0.12[m];[v][m]amix=inputs=2:duration=first:normalize=0[a]"]
        amap = "[a]"
    elif voz:
        cmd += ["-i", voz, "-af", "loudnorm=I=-14:TP=-1.5"]
        amap = "1:a"
    elif musica:
        cmd += ["-stream_loop", "-1", "-i", musica]
        amap = "1:a"
    else:
        cmd += ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"]
        amap = "1:a"
    cmd += ["-map", "0:v", "-map", amap, "-t", f"{total:.2f}", "-c:v", "libx264", "-preset", "medium",
            "-crf", "19", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-ar", "44100",
            "-movflags", "+faststart", out]
    ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    nframes = int(total * FPS)
    for f in range(nframes):
        t = f / FPS
        frame = fondo.copy()
        dibujar_rejilla(frame, t, T["rejilla"])
        for im, x, y in palmas:
            frame.paste(im, (x, y), im)
        i = max(k for k in range(len(slides)) if inicios[k] <= t)
        lt = t - inicios[i]
        dur = slides[i]["dur"]
        salida = 1.0 if (i == len(slides) - 1 or lt < dur - 0.18) else max(0, (dur - lt) / 0.18)
        for im, cx, y, ret, tipo in preparados[i]:
            p = min(max((lt - ret) / 0.38, 0), 1)
            if p <= 0:
                continue
            if tipo == "pop":
                esc = 0.5 + 0.5 * ease_out_back(p)
                if p >= 1:
                    esc = 1 + 0.025 * math.sin((lt - ret) * 5)
                pegar(frame, im, cx, y, min(1, p * 2) * salida, esc)
            elif tipo == "slide":
                pegar(frame, im, cx, y + (1 - ease_out_cubic(p)) * 70, p * salida)
            else:
                pegar(frame, im, cx, y, p * salida)
        d = ImageDraw.Draw(frame)  # barra de progreso arriba
        d.rectangle([0, 0, int(W * t / total), 14], fill=AMARILLO)
        ff.stdin.write(frame.tobytes())
    ff.stdin.close()
    ff.wait()
    print("OK ->", out, f"({total:.1f} s)")
    return out


def _r(p):
    return render(p)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--todos":
        base = os.path.dirname(os.path.abspath(__file__))
        guiones = sorted(glob.glob(os.path.join(base, "*", "guion.json")))
        with Pool(min(4, os.cpu_count() or 1)) as pool:
            pool.map(_r, guiones)
    else:
        render(sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else None)
