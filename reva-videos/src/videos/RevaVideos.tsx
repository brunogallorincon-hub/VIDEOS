import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { z } from "zod";
import {
  CTAScene,
  FeaturesScene,
  HookScene,
  LogoScene,
  StatsScene,
} from "../components/Scenes";

const T = 15; // duración de cada transición (frames)

// ====================== Esquemas (editables en Studio) ======================
const featureSchema = z.object({ icon: z.string(), title: z.string(), text: z.string() });
const statSchema = z.object({
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string(),
  label: z.string(),
});

export const introSchema = z.object({ tagline: z.string() });

export const promoSchema = z.object({
  tagline: z.string(),
  headline: z.string(),
  sub: z.string(),
  featuresTitle: z.string(),
  features: z.array(featureSchema),
  statsTitle: z.string(),
  stats: z.array(statSchema),
  cta: z.string(),
  button: z.string(),
  url: z.string(),
});

export const adSchema = z.object({
  headline: z.string(),
  sub: z.string(),
  featuresTitle: z.string(),
  features: z.array(featureSchema),
  cta: z.string(),
  button: z.string(),
  url: z.string(),
});

// ====================== 1. Intro de logo (5 s) ======================
export const RevaIntro: React.FC<z.infer<typeof introSchema>> = ({ tagline }) => (
  <AbsoluteFill>
    <LogoScene tagline={tagline} />
  </AbsoluteFill>
);

// ====================== 2. Promo completa (~24 s) ======================
export const PROMO_DURATION = 120 + 120 + 180 + 150 + 150 - 4 * T;

export const RevaPromo: React.FC<z.infer<typeof promoSchema>> = (p) => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Logo" durationInFrames={120}>
      <LogoScene tagline={p.tagline} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
    <TransitionSeries.Sequence name="Gancho" durationInFrames={120}>
      <HookScene headline={p.headline} sub={p.sub} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-bottom" })}
      timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
    />
    <TransitionSeries.Sequence name="Beneficios" durationInFrames={180}>
      <FeaturesScene title={p.featuresTitle} features={p.features} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={wipe({ direction: "from-left" })}
      timing={linearTiming({ durationInFrames: T })}
    />
    <TransitionSeries.Sequence name="Cifras" durationInFrames={150}>
      <StatsScene title={p.statsTitle} stats={p.stats} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={flip()} timing={linearTiming({ durationInFrames: T })} />
    <TransitionSeries.Sequence name="CTA" durationInFrames={150}>
      <CTAScene cta={p.cta} button={p.button} url={p.url} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);

// ====================== 3. Anuncio corto para redes (15 s) ======================
export const AD_DURATION = 120 + 180 + 165 - 2 * T;

export const RevaAd: React.FC<z.infer<typeof adSchema>> = (p) => (
  <TransitionSeries>
    <TransitionSeries.Sequence name="Gancho" durationInFrames={120}>
      <HookScene headline={p.headline} sub={p.sub} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition
      presentation={slide({ direction: "from-right" })}
      timing={springTiming({ config: { damping: 200 }, durationInFrames: T })}
    />
    <TransitionSeries.Sequence name="Beneficios" durationInFrames={180}>
      <FeaturesScene title={p.featuresTitle} features={p.features} />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: T })} />
    <TransitionSeries.Sequence name="CTA" durationInFrames={165}>
      <CTAScene cta={p.cta} button={p.button} url={p.url} />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
