import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, colors, displayFont, gradient, gradientHot } from "../brand";
import { Background } from "./Background";
import { Logo } from "./Logo";
import { Counter, FadeUp, WordReveal } from "./AnimatedText";

// Escala tipográfica relativa al ancho (diseñado para 1080 de ancho).
const useUnit = () => {
  const { width, height } = useVideoConfig();
  const vertical = height > width;
  return { u: Math.min(width, height) / 1080, vertical, width, height };
};

const Pad: React.FC<{ children: React.ReactNode; gap?: number }> = ({
  children,
  gap = 40,
}) => {
  const { u } = useUnit();
  return (
    <AbsoluteFill
      style={{
        padding: `${110 * u}px ${90 * u}px`,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: gap * u,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- 1. Logo / intro ----------
export const LogoScene: React.FC<{ tagline: string }> = ({ tagline }) => {
  const { u } = useUnit();
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0.45 * fps, 0.6 * fps, 1 * fps], [0, 0.5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Background seed="logo" />
      <Pad gap={60}>
        <div
          style={{
            scale: String(
              interpolate(frame, [0, 4 * fps], [0.92, 1.04], {
                extrapolateRight: "clamp",
              }),
            ),
          }}
        >
          <Logo size={340 * u} />
        </div>
        <FadeUp
          delay={1.6 * fps}
          style={{
            fontSize: 46 * u,
            letterSpacing: 10 * u,
            textTransform: "uppercase",
            color: colors.text,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          {tagline}
        </FadeUp>
      </Pad>
      <AbsoluteFill style={{ backgroundColor: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------- 2. Gancho / hook ----------
export const HookScene: React.FC<{ headline: string; sub: string }> = ({
  headline,
  sub,
}) => {
  const { u, vertical } = useUnit();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background seed="hook" />
      <Pad>
        <WordReveal text={headline} fontSize={(vertical ? 120 : 110) * u} />
        <FadeUp delay={0.8 * fps} style={{ fontSize: 48 * u, textAlign: "center", maxWidth: 900 * u }}>
          {sub}
        </FadeUp>
      </Pad>
    </AbsoluteFill>
  );
};

// ---------- 3. Beneficios (tarjetas) ----------
export type Feature = { icon: string; title: string; text: string };

const FeatureCard: React.FC<{ f: Feature; i: number; delay: number }> = ({
  f,
  i,
  delay,
}) => {
  const { u, vertical } = useUnit();
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const shine = interpolate(frame, [0.4 * fps, 1.2 * fps], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        gap: 34 * u,
        width: vertical ? 900 * u : 520 * u,
        flexDirection: vertical ? "row" : "column",
        textAlign: vertical ? "left" : "center",
        padding: 40 * u,
        borderRadius: 36 * u,
        background: "rgba(255,255,255,0.06)",
        border: "1.5px solid rgba(255,255,255,0.14)",
        boxShadow: `0 ${20 * u}px ${60 * u}px rgba(0,0,0,0.35)`,
        opacity: s,
        translate: vertical ? `${(1 - s) * (i % 2 ? 1 : -1) * 300 * u}px 0` : `0 ${(1 - s) * 200 * u}px`,
        rotate: `${(1 - s) * (i % 2 ? 6 : -6)}deg`,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 120 * u,
          height: 120 * u,
          borderRadius: 30 * u,
          background: i === 1 ? gradientHot : gradient,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 64 * u,
        }}
      >
        {f.icon}
      </div>
      <div>
        <div style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 56 * u, color: colors.text }}>
          {f.title}
        </div>
        <div style={{ fontFamily: bodyFont, fontSize: 38 * u, color: colors.muted, marginTop: 6 * u }}>
          {f.text}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${shine}%`,
          width: "30%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
          rotate: "15deg",
        }}
      />
    </div>
  );
};

export const FeaturesScene: React.FC<{ title: string; features: Feature[] }> = ({
  title,
  features,
}) => {
  const { u, vertical } = useUnit();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Background seed="features" intensity={0.8} />
      <Pad gap={vertical ? 44 : 70}>
        <WordReveal text={title} fontSize={96 * u} />
        <div
          style={{
            display: "flex",
            flexDirection: vertical ? "column" : "row",
            gap: 36 * u,
          }}
        >
          {features.map((f, i) => (
            <FeatureCard key={i} f={f} i={i} delay={0.6 * fps + i * 0.35 * fps} />
          ))}
        </div>
      </Pad>
    </AbsoluteFill>
  );
};

// ---------- 4. Cifras ----------
export type Stat = { value: number; prefix?: string; suffix: string; label: string };

export const StatsScene: React.FC<{ title: string; stats: Stat[] }> = ({ title, stats }) => {
  const { u, vertical } = useUnit();
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Background seed="stats" intensity={0.7} />
      <Pad gap={70}>
        <WordReveal text={title} fontSize={92 * u} />
        <div style={{ display: "flex", flexDirection: vertical ? "column" : "row", gap: 60 * u }}>
          {stats.map((s, i) => {
            const d = 0.5 * fps + i * 0.3 * fps;
            const bar = interpolate(frame - d, [0, 1.4 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            return (
              <FadeUp key={i} delay={d} style={{ textAlign: "center", minWidth: 420 * u }}>
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} fontSize={150 * u} delay={d} />
                <div
                  style={{
                    height: 8 * u,
                    margin: `${10 * u}px auto ${18 * u}px`,
                    width: `${bar * 70}%`,
                    borderRadius: 8 * u,
                    background: gradient,
                  }}
                />
                <div style={{ fontSize: 42 * u, color: colors.text, fontWeight: 500 }}>{s.label}</div>
              </FadeUp>
            );
          })}
        </div>
      </Pad>
    </AbsoluteFill>
  );
};

// ---------- 5. Llamada a la acción ----------
export const CTAScene: React.FC<{ cta: string; button: string; url: string }> = ({
  cta,
  button,
  url,
}) => {
  const { u } = useUnit();
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const btn = spring({ frame: frame - 1 * fps, fps, config: { damping: 10, stiffness: 120 } });
  const pulse = 1 + 0.04 * Math.sin(Math.max(0, frame - 1.6 * fps) / 4);
  return (
    <AbsoluteFill>
      <Background seed="cta" intensity={1.2} />
      <Pad gap={60}>
        <Logo size={170 * u} showWord={false} />
        <WordReveal text={cta} fontSize={112 * u} delay={0.3 * fps} />
        <div
          style={{
            scale: String(btn * pulse),
            padding: `${34 * u}px ${80 * u}px`,
            borderRadius: 999,
            background: gradientHot,
            fontFamily: displayFont,
            fontWeight: 700,
            fontSize: 56 * u,
            color: "white",
            boxShadow: `0 0 ${60 * u}px ${colors.primary}`,
          }}
        >
          {button}
        </div>
        <FadeUp delay={1.5 * fps} style={{ fontSize: 44 * u, color: colors.text, letterSpacing: 2 * u }}>
          {url}
        </FadeUp>
      </Pad>
    </AbsoluteFill>
  );
};
