import { Composition, Folder } from "remotion";
import {
  AD_DURATION,
  PROMO_DURATION,
  RevaAd,
  RevaIntro,
  RevaPromo,
  adSchema,
  introSchema,
  promoSchema,
} from "./videos/RevaVideos";

// Textos por defecto: edítalos aquí o en el panel "Props" de Remotion Studio.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Reva-Vertical">
        <Composition
          id="Reva-Intro-Vertical"
          component={RevaIntro}
          schema={introSchema}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ tagline: "El futuro empieza aquí" }}
        />
        <Composition
          id="Reva-Promo-Vertical"
          component={RevaPromo}
          schema={promoSchema}
          durationInFrames={PROMO_DURATION}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            tagline: "El futuro empieza aquí",
            headline: "¿Listo para ir *más* *lejos?*",
            sub: "Reva te da todo lo que necesitas en un solo lugar.",
            featuresTitle: "¿Por qué *Reva?*",
            features: [
              { icon: "⚡", title: "Rápido", text: "Resultados desde el primer día" },
              { icon: "✨", title: "Sencillo", text: "Diseñado para que todo fluya" },
              { icon: "🛡️", title: "Confiable", text: "Un equipo que te acompaña" },
            ],
            statsTitle: "Resultados que *hablan*",
            stats: [
              { value: 1000, prefix: "+", suffix: "", label: "Clientes felices" },
              { value: 98, suffix: "%", label: "Satisfacción" },
            ],
            cta: "Empieza hoy con *Reva*",
            button: "Descúbrelo",
            url: "www.reva.com",
          }}
        />
        <Composition
          id="Reva-Anuncio-Vertical"
          component={RevaAd}
          schema={adSchema}
          durationInFrames={AD_DURATION}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{
            headline: "Deja de *esperar.* Empieza a *crecer.*",
            sub: "Descubre lo que Reva puede hacer por ti.",
            featuresTitle: "Todo en *uno*",
            features: [
              { icon: "🚀", title: "Impulso", text: "Lleva tu día a otro nivel" },
              { icon: "🎯", title: "Precisión", text: "Justo lo que necesitas" },
              { icon: "💜", title: "Cercanía", text: "Siempre a tu lado" },
            ],
            cta: "Únete a *Reva*",
            button: "Pruébalo ya",
            url: "www.reva.com",
          }}
        />
      </Folder>
      <Folder name="Reva-Horizontal">
        <Composition
          id="Reva-Intro-Horizontal"
          component={RevaIntro}
          schema={introSchema}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{ tagline: "El futuro empieza aquí" }}
        />
        <Composition
          id="Reva-Promo-Horizontal"
          component={RevaPromo}
          schema={promoSchema}
          durationInFrames={PROMO_DURATION}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            tagline: "El futuro empieza aquí",
            headline: "¿Listo para ir *más* *lejos?*",
            sub: "Reva te da todo lo que necesitas en un solo lugar.",
            featuresTitle: "¿Por qué *Reva?*",
            features: [
              { icon: "⚡", title: "Rápido", text: "Resultados desde el primer día" },
              { icon: "✨", title: "Sencillo", text: "Diseñado para que todo fluya" },
              { icon: "🛡️", title: "Confiable", text: "Un equipo que te acompaña" },
            ],
            statsTitle: "Resultados que *hablan*",
            stats: [
              { value: 1000, prefix: "+", suffix: "", label: "Clientes felices" },
              { value: 98, suffix: "%", label: "Satisfacción" },
            ],
            cta: "Empieza hoy con *Reva*",
            button: "Descúbrelo",
            url: "www.reva.com",
          }}
        />
      </Folder>
    </>
  );
};
