import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { fade } from "@remotion/transitions/fade";
import { z } from "zod";
import { CelebrateScene, InsertScene, RoomScene, WalkScene } from "../scenes/LeoScenes";
import { EndCard } from "../ui/EndCard";
import { Music } from "../ui/Effects";

// Textos editables (también en el panel Props de Studio).
// *palabra* = verde hoja · _palabra_ = azul vidrio
export const leoRecyclesSchema = z.object({
  caption1: z.string(),
  caption2: z.string(),
  caption3: z.string(),
  bottlesNote: z.string(),
  caption4: z.string(),
  slogan: z.string(),
  endCta: z.string(),
  hasMusic: z.boolean(),
});

const T = 10; // frames de cada transición (cortes rápidos, al ritmo)

// Duraciones de escena (frames @30fps). Total = suma − 4 transiciones = 450 (15 s)
const D = { room: 96, walk: 126, insert: 126, celebrate: 78, end: 64 };
export const LEO_RECYCLES_DURATION = D.room + D.walk + D.insert + D.celebrate + D.end - 4 * T;

export const LeoRecycles: React.FC<z.infer<typeof leoRecyclesSchema>> = (p) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 · Cuarto" durationInFrames={D.room}>
        <RoomScene caption={p.caption1} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="2 · Caminata" durationInFrames={D.walk}>
        <WalkScene caption={p.caption2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="3 · Botellas" durationInFrames={D.insert}>
        <InsertScene caption={p.caption3} bottlesNote={p.bottlesNote} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="4 · Celebración" durationInFrames={D.celebrate}>
        <CelebrateScene caption={p.caption4} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="5 · Logo" durationInFrames={D.end}>
        <EndCard line={p.slogan} cta={p.endCta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Music enabled={p.hasMusic} />
  </AbsoluteFill>
);
