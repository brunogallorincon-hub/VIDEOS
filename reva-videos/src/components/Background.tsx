import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors } from "../brand";

// Fondo animado: orbes de color que se desplazan, rejilla sutil y partículas.
export const Background: React.FC<{ seed?: string; intensity?: number }> = ({
  seed = "reva",
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const min = Math.min(width, height);

  const orb = (
    i: number,
    color: string,
    baseX: number,
    baseY: number,
    size: number,
  ) => {
    const t = frame / 60 + i * 2;
    const x = baseX * width + Math.sin(t) * width * 0.12;
    const y = baseY * height + Math.cos(t * 0.8) * height * 0.08;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: x - (size * min) / 2,
          top: y - (size * min) / 2,
          width: size * min,
          height: size * min,
          borderRadius: "50%",
          background: color,
          filter: `blur(${min * 0.14}px)`,
          opacity: 0.55 * intensity,
        }}
      />
    );
  };

  const particles = new Array(40).fill(0).map((_, i) => {
    const px = random(`${seed}-x-${i}`) * width;
    const speed = 0.4 + random(`${seed}-s-${i}`) * 1.4;
    const py =
      ((random(`${seed}-y-${i}`) * height - frame * speed * 2) % height +
        height) %
      height;
    const size = 2 + random(`${seed}-r-${i}`) * 4;
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: px,
          top: py,
          width: size,
          height: size,
          borderRadius: "50%",
          background: "white",
          opacity: 0.15 + random(`${seed}-o-${i}`) * 0.4,
        }}
      />
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg, overflow: "hidden" }}>
      {orb(0, colors.primary, 0.2, 0.25, 0.9)}
      {orb(1, colors.secondary, 0.85, 0.7, 0.8)}
      {orb(2, colors.accent, 0.5, 1.0, 0.6)}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: `${min / 12}px ${min / 12}px`,
          backgroundPosition: `0 ${interpolate(frame, [0, 300], [0, min / 12])}px`,
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {particles}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
