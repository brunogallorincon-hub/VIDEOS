# Clipper: saca clips virales de streams de GTA 6

Le das un stream (enlace o archivo) y te devuelve clips verticales 9:16 con subtítulos,
listos para TikTok, YouTube Shorts y Reels.

## Instalación (una sola vez, en tu PC)

**Windows**
1. Instala Python 3: https://www.python.org/downloads/ (marca "Add Python to PATH").
2. Abre la terminal (PowerShell) y ejecuta:
   ```
   winget install Gyan.FFmpeg
   pip install yt-dlp faster-whisper numpy
   ```
**Mac:** `brew install ffmpeg` y luego `pip3 install yt-dlp faster-whisper numpy`

## Uso

```
python clipper.py "https://www.twitch.tv/videos/XXXXXXX"
```
Crea la carpeta `clips/` con 5 clips de 30 s y un `resumen.json` con el minuto de cada uno.

| Opción | Para qué |
|---|---|
| `--clips 10` | cuántos clips sacar |
| `--duracion 45` | segundos por clip |
| `--antes 10` | segundos de contexto antes del momento fuerte |
| `--desde 01:00:00 --hasta 02:00:00` | buscar solo en un tramo del stream |
| `--facecam 1500,700,420,380` | pone la cámara del streamer arriba y el juego abajo (x,y,ancho,alto de la cámara en el vídeo original 1920x1080) |
| `--sin-subs` | sin subtítulos (más rápido) |
| `--modelo medium` | subtítulos más precisos (más lento) |

Para saber los valores de `--facecam`, haz una captura del stream en 1920x1080 y mira en Paint
la posición (x,y) de la esquina superior izquierda de la cámara y su ancho y alto.

## Cómo elige los momentos
- Picos de volumen respecto a lo normal en ese tramo del stream (gritos, risas, sustos, explosiones).
- Palabras de reacción en lo que dice el streamer ("no puede ser", "jajaja", "hermano", "mira"...).
  Puedes añadir más en la lista `REACCIONES` al principio de `clipper.py`.

Revisa siempre los clips: la herramienta encuentra candidatos y **tú** eliges los mejores.

## Importante: permisos
Haz clipping de streamers que lo permitan (muchos tienen **programas de clipping que pagan
por visitas**, por ejemplo en Whop "Content Rewards" o en sus Discord) o de tus propios
streams. Si subes clips de otros sin permiso, te pueden tumbar el vídeo o la cuenta.
Menciona siempre al streamer en el vídeo o la descripción.
