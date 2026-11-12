import { Composition, Folder } from "remotion";
import { LEO_RECYCLES_DURATION, LeoRecycles, leoRecyclesSchema } from "./reva/videos/LeoRecycles";
import { BOTTLE_JOURNEY_DURATION, BottleJourney, bottleJourneySchema } from "./reva/videos/BottleJourney";
import { REWARDS_LEVELS_DURATION, RewardsLevels, rewardsLevelsSchema } from "./reva/videos/RewardsLevels";
import { detectMusic } from "./reva/ui/Effects";

// REVA · videos para Instagram (1080x1920, 30 fps)
// Los textos se cambian aquí (defaultProps) o en el panel "Props" de Remotion Studio.
// *palabra* = verde hoja · _palabra_ = azul vidrio · " | " = salto de línea
export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="REVA">
      <Composition
        id="LeoRecycles"
        component={LeoRecycles}
        schema={leoRecyclesSchema}
        durationInFrames={LEO_RECYCLES_DURATION}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={async ({ props }) => ({ props: { ...props, hasMusic: await detectMusic() } })}
        defaultProps={{
          caption1: "*30* bottles. Now what?",
          caption2: "Find a *REVA.*",
          caption3: "*+10* *plastic* | _+15_ _glass_",
          bottlesNote: "30 BOTTLES LATER...",
          caption4: "*300* *pts* = 2-for-1 movie",
          slogan: "*Recycle.* Earn. _Transform._",
          endCta: "Link in bio",
          hasMusic: false,
        }}
      />
      <Composition
        id="BottleJourney"
        component={BottleJourney}
        schema={bottleJourneySchema}
        durationInFrames={BOTTLE_JOURNEY_DURATION}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={async ({ props }) => ({ props: { ...props, hasMusic: await detectMusic() } })}
        defaultProps={{
          caption1: "I was *trash.*",
          caption2: "Then someone | picked me up.",
          caption3: "Into the *REVA.*",
          caption4: "Now I'm *worth* | something.",
          slogan: "*Recycle.* Earn. _Transform._",
          endCta: "Link in bio",
          hasMusic: false,
        }}
      />
      <Composition
        id="RewardsLevels"
        component={RewardsLevels}
        schema={rewardsLevelsSchema}
        durationInFrames={REWARDS_LEVELS_DURATION}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={async ({ props }) => ({ props: { ...props, hasMusic: await detectMusic() } })}
        defaultProps={{
          levels: [
            { bottles: 10, reward: "Free coffee", caption: "*LVL* *1* | 10 bottles = | Free coffee" },
            { bottles: 15, reward: "10% off", caption: "*LVL* *2* | 15 bottles = | 10% off" },
            { bottles: 30, reward: "2-for-1 movie", caption: "*LVL* *3* | 30 bottles = | 2-for-1 movie" },
          ],
          endLine: "*Points,* not cash.",
          endCta: "Link in bio",
          hasMusic: false,
        }}
      />
    </Folder>
  );
};
