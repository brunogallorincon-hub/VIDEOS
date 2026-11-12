import { Composition, Folder } from "remotion";
import { LEO_RECYCLES_DURATION, LeoRecycles, leoRecyclesSchema } from "./reva/videos/LeoRecycles";
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
          website: "claude.ai/artifact/2wpJ9LccYNjjLB8xveKSXL",
          hasMusic: false,
        }}
      />
    </Folder>
  );
};
