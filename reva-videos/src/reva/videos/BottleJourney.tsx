import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { z } from "zod";
import { MachineScene, RebornScene, RescueScene, TrashScene } from "../scenes/BottleScenes";
import { EndCard } from "../ui/EndCard";
import { Music } from "../ui/Effects";

export const bottleJourneySchema = z.object({
  caption1: z.string(),
  caption2: z.string(),
  caption3: z.string(),
  caption4: z.string(),
  slogan: z.string(),
  endCta: z.string(),
  hasMusic: z.boolean(),
});

const T = 10;
// Total = suma − 4 transiciones = 360 (12 s)
const D = { trash: 90, rescue: 66, machine: 84, reborn: 90, end: 70 };
export const BOTTLE_JOURNEY_DURATION = D.trash + D.rescue + D.machine + D.reborn + D.end - 4 * T;

export const BottleJourney: React.FC<z.infer<typeof bottleJourneySchema>> = (p) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence name="1 · Basura" durationInFrames={D.trash}>
        <TrashScene caption={p.caption1} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="2 · Rescate" durationInFrames={D.rescue}>
        <RescueScene caption={p.caption2} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="3 · REVA" durationInFrames={D.machine}>
        <MachineScene caption={p.caption3} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={wipe({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="4 · Botella nueva" durationInFrames={D.reborn}>
        <RebornScene caption={p.caption4} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="5 · Logo" durationInFrames={D.end}>
        <EndCard line={p.slogan} cta={p.endCta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Music enabled={p.hasMusic} />
  </AbsoluteFill>
);
