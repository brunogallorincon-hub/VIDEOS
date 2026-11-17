#!/usr/bin/env python3
"""Genera un Short vertical (1080x1920) a partir de un guion.json.
Uso: python3 generar_short.py carpeta/guion.json [musica.mp3]
Fondo animado + textos con aparición. Si pasas música, se añade de fondo."""
import json, subprocess, sys, os, tempfile

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def esc(p):
    return p.replace("\\", "/").replace(":", "\\:").replace("'", "\\'")

def main():
    guion_path = sys.argv[1]
    musica = sys.argv[2] if len(sys.argv) > 2 else None
    g = json.load(open(guion_path, encoding="utf-8"))
    outdir = os.path.dirname(os.path.abspath(guion_path))
    tmp = tempfile.mkdtemp()
    total = sum(s["dur"] for s in g["slides"])
    filters, t = [], 0.0
    for i, s in enumerate(g["slides"]):
        a, b = t, t + s["dur"]
        lines = s["texto"].split("\n")
        fs = int(min(84, 940 / (0.60 * max(len(l) for l in lines))))
        lh = int(fs * 1.35)
        top = 1920 / 2 - len(lines) * lh / 2 + 80
        for j, line in enumerate(lines):
            if not line.strip():
                continue
            tf = os.path.join(tmp, f"t{i}_{j}.txt"); open(tf, "w", encoding="utf-8").write(line)
            alpha = f"if(lt(t,{a}+0.3),(t-{a})/0.3,if(gt(t,{b}-0.25),({b}-t)/0.25,1))"
            ypos = f"{top + j*lh}+60*max(0,1-(t-{a}-{j*0.08})/0.3)"
            filters.append(
                f"drawtext=fontfile={FONT}:textfile='{esc(tf)}':fontsize={fs}:fontcolor=white:"
                f"borderw=6:bordercolor=black@0.85:x=(w-text_w)/2:y='{ypos}':"
                f"alpha='{alpha}':enable='between(t,{a},{b})'")
        if s.get("tag"):
            tg = os.path.join(tmp, f"g{i}.txt"); open(tg, "w", encoding="utf-8").write(s["tag"])
            filters.append(
                f"drawtext=fontfile={FONT}:textfile='{esc(tg)}':fontsize=150:fontcolor=#ffd23f:"
                f"borderw=8:bordercolor=#ff2d95:x=(w-text_w)/2:y=330:alpha='{alpha}':"
                f"enable='between(t,{a},{b})'")
        t = b
    # barra de progreso abajo (retención)
    filters.append(f"drawbox=x=0:y=ih-24:w=iw*t/{total}:h=24:color=#ffd23f:t=fill")
    vf = ",".join(filters)
    bg = (f"gradients=s=1080x1920:c0=0xff2d95:c1=0x6a00f4:c2=0x00c2ff:"
          f"x0=0:y0=0:x1=1080:y1=1920:nb_colors=3:speed=0.02:d={total}:r=30")
    out = os.path.join(outdir, "short.mp4")
    cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-f", "lavfi", "-i", bg]
    if musica:
        cmd += ["-stream_loop", "-1", "-i", musica]
    else:
        cmd += ["-f", "lavfi", "-i", f"anullsrc=r=44100:cl=stereo:d={total}"]
    cmd += ["-vf", vf, "-map", "0:v", "-map", "1:a", "-t", str(total),
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "20",
            "-c:a", "aac", "-b:a", "160k", "-shortest", out]
    subprocess.run(cmd, check=True)
    print("OK ->", out)

if __name__ == "__main__":
    main()
