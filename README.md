# VIDEOS · Reva

Vídeos animados de **Reva** hechos con [Remotion](https://www.remotion.dev) y los Remotion Agent Skills oficiales (`.agents/skills`).

```bash
cd reva-videos
npm install
npm run dev          # abre Remotion Studio (vista previa + editar textos en "Props")
npx remotion render Reva-Promo-Vertical out/promo.mp4
```

| Composición | Formato | Duración |
|---|---|---|
| Reva-Intro-Vertical / Horizontal | 1080×1920 / 1920×1080 | 5 s |
| Reva-Promo-Vertical / Horizontal | 1080×1920 / 1920×1080 | 22 s |
| Reva-Anuncio-Vertical | 1080×1920 | 14,5 s |

- Colores y tipografías: `reva-videos/src/brand.ts`
- Textos por defecto: `reva-videos/src/Root.tsx` (`*palabra*` = resaltada con degradado)
- Escenas animadas: `reva-videos/src/components/Scenes.tsx`
