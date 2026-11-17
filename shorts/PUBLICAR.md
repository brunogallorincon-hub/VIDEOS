# Canal GTA 6: 10 Shorts listos para publicar

Cada carpeta tiene su `short.mp4` (vertical 1080x1920, 21-29 s). Súbelo **igual** a
YouTube Shorts, TikTok e Instagram Reels: tres plataformas, el mismo trabajo.

## Calendario

Los vídeos de "antes de que salga" caducan el día 19, así que esos van primero.

| Día | Mediodía (~13:00) | Tarde (~18:00) | Noche (~21:00) |
|---|---|---|---|
| **Mié 18** (por la mañana, crea el canal) | 01 ¿A qué hora sale? | 09 Haz esto antes del 19 | 02 ¿Cuánto ocupa? |
| **Jue 19 (lanzamiento)** | 03 Precio | 04 ¿Sale en PC? | 10 13 años de espera |
| Vie 20 | | 05 Jason y Lucia | |
| Sáb 21 | | 06 Mapa de Leonida | |
| Dom 22 | | 07 Vuelve Vice City | |
| Lun 23 | | 08 Récords | |

El miércoles 18 van 3 vídeos porque el 01, el 09 y el 02 dejan de tener sentido cuando sale el juego.

Del 24 en adelante: clips de tus partidas o clipping (ver abajo).

## Títulos, descripciones y hashtags

Hashtags para todos: `#gta6 #gtavi #grandtheftauto6 #vicecity #gaming #shorts`

| # | Título | Descripción |
|---|---|---|
| 01 | ¿A qué hora sale GTA 6? ⏰ | GTA 6 sale el 19 de noviembre a medianoche, hora local de tu país. ¿Desde dónde lo vas a jugar? |
| 02 | ¿Te cabe GTA 6? Ocupa 212 GB 😳 | Lo que ocupa GTA 6 en PS5, Series S y Series X. ¿Ya lo tienes descargado? |
| 03 | ¿Cuánto cuesta GTA 6? 💸 | Precio de la edición estándar y la Ultimate. ¿Cuál te compras? |
| 04 | ¿GTA 6 sale en PC, PS4 o Xbox One? | Las consolas donde se puede jugar GTA 6 y qué pasa con PC. |
| 05 | Jason y Lucia explicados en 25 s | Los protagonistas de GTA 6. ¿Equipo Jason o equipo Lucia? |
| 06 | El mapa de GTA 6 en 30 segundos 🗺️ | Leonida, Vice City y las 6 zonas del mapa. ¿Cuál exploras primero? |
| 07 | 24 años después, volvemos a Vice City 🌴 | De GTA Vice City (2002) a GTA 6 (2026). ¿Jugaste al original? |
| 08 | Los récords de GTA 6 antes de salir 🤯 | 93 millones de visitas en 24 h y mucho más. ¿Superará a GTA V? |
| 09 | Haz ESTO antes de que salga GTA 6 ✅ | 5 cosas que tienes que hacer antes del 19 de noviembre. |
| 10 | 13 años esperando GTA 6 ⏳ | De GTA V (2013) a GTA 6 (2026). ¿Cuántos años tenías? |

## Paso a paso

### 1. Crear el canal (10 min, una sola vez)
1. **YouTube:** entra en youtube.com con tu cuenta de Google, pulsa tu foto, "Crear un canal".
   Nombre corto y fácil, por ejemplo "GTA 6 al Día" o "Leonida Diario".
2. **TikTok** e **Instagram:** crea una cuenta con **el mismo nombre**.
3. Foto de perfil: puedes usar un fotograma de cualquiera de los vídeos.

### 2. Subir cada vídeo (2 min por plataforma)
1. Pasa el `short.mp4` al móvil (Google Drive, WhatsApp a ti mismo, o descárgalo de GitHub).
2. Abre la app, pulsa **+**, elige el vídeo.
3. Los vídeos ya traen **voz narrada**. Si quieres, añade un sonido en tendencia desde la app
   y **bájale el volumen al 10-15 %** (en TikTok: "Sonidos" > "Volumen") para que no tape la voz.
4. Pega el título, la descripción y los hashtags de la tabla de arriba.
5. Publica.

### 3. Responde a los comentarios
Todos los vídeos terminan con una pregunta. Responder la primera hora ayuda mucho a que el
algoritmo enseñe el vídeo a más gente.

### 4. Para cobrar
- **YouTube:** pagan desde 1.000 suscriptores + 10 millones de visitas en Shorts en 90 días
  (o 4.000 horas de vídeos largos). Mientras tanto, crece.
- **TikTok:** el programa de creadores paga por vídeos de más de 1 minuto y pide 10.000 seguidores.
- **Clipping:** ver `../clipper/README.md`. Aquí pagan desde el primer clip con visitas.

> Importante: YouTube no monetiza canales de vídeos "en serie" sin aporte propio. Estos 10 son el
> arranque. Para que el canal pueda cobrar, a partir del día 20 mezcla clips de **tus partidas**
> (graba con el botón de compartir de la consola) y, si te animas, **tu voz**.

## Hacer más vídeos
Copia una carpeta, cambia el `guion.json` y ejecuta:
`python3 generar_short.py carpeta/guion.json`   (o `--todos` para renderizar todas).
