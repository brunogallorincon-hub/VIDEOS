import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { z } from "zod";
import { LEVELS_SCENE_DURATION, LevelsScene } from "../scenes/LevelsScene";
import { EndCard } from "../ui/EndCard";
import { Music } from "../ui/Effects";

const levelSchema = z.object({ bottles: z.number(), reward: z.string(), caption: z.string() });

export const rewardsLevelsSchema = z.object({
  levels: z.array(levelSchema).length(3),
  endLine: z.string(),
  endCta: z.string(),
  hasMusic: z.boolean(),
});

const T = 10;
const END = 82;
// Total = 288 + 82 − 10 = 360 (12 s)
export const REWARDS_LEVELS_DURATION = LEVELS_SCENE_DURATION + END - T;

export const RewardsLevels: React.FC<z.infer<typeof rewardsLevelsSchema>> = (p) => (
  <AbsoluteFill>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Niveles" durationInFrames={LEVELS_SCENE_DURATION}>
        <LevelsScene levels={p.levels} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={linearTiming({ durationInFrames: T })} />
      <TransitionSeries.Sequence name="Logo" durationInFrames={END}>
        <EndCard line={p.endLine} cta={p.endCta} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <Music enabled={p.hasMusic} />
  </AbsoluteFill>
);
