# Shorts de GTA 6

- `PUBLICAR.md`: calendario, títulos, descripciones y guía paso a paso.
- `01-...` a `10-...`: cada carpeta tiene `guion.json` y el vídeo terminado `short.mp4`.
- `generar_short.py`: crea un Short a partir de un guion (`--todos` renderiza todas las carpetas).
  Requiere Python 3, Pillow y ffmpeg.
- Voz: cada slide tiene un campo `voz` con la narración (números escritos con letras, "GTA" como
  "ge te a"). La voz se genera gratis y sin conexión con Kokoro:
  ```
  pip install kokoro-onnx soundfile
  mkdir modelos && cd modelos
  curl -L -o kokoro.onnx https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.int8.onnx
  curl -L -o voices.bin https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
  ```
  Voces en español: `em_alex` (hombre, por defecto), `em_santa` (hombre), `ef_dora` (mujer).
  Se cambia con `"voz": "ef_dora"` en el guion.json; `"velocidad": 1.12` ajusta el ritmo.
