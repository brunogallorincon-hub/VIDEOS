import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, anton, inter } from "../brand";

// Marcador de puntos: el número sube con interpolate (ej. 120 → 130).
// Admite varios tramos: steps = [{at: frame, value}] y va de uno a otro.
export const PointsCounter: React.FC<{
  steps: { at: number; value: number }[];
  /** Frames que tarda cada subida. */
  rampFrames?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ steps, rampFrames = 10, fontSize = 96, style }) => {
  const frame = useCurrentFrame();
  let value = steps[0]?.value ?? 0;
  let bump = 0;
  for (let i = 1; i < steps.length; i++) {
    const prev = steps[i - 1].value;
    const s = steps[i];
    const dur = i === steps.length - 1 && s.value - prev > 50 ? rampFrames * 2.5 : rampFrames;
    if (frame >= s.at) {
      value = interpolate(frame, [s.at, s.at + dur], [prev, s.value], {
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      bump = interpolate(frame, [s.at, s.at + 4, s.at + 12], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
    }
  }
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: fontSize * 0.15,
        padding: `${fontSize * 0.12}px ${fontSize * 0.4}px`,
        borderRadius: fontSize,
        background: C.ink,
        border: `${Math.max(4, fontSize * 0.05)}px solid ${C.leaf}`,
        scale: String(1 + bump * 0.08),
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: anton,
          fontSize,
          color: C.white,
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.1,
        }}
      >
        {Math.round(value)}
      </span>
      <span style={{ fontFamily: inter, fontWeight: 800, fontSize: fontSize * 0.34, color: C.leaf, letterSpacing: 2 }}>
        PTS
      </span>
    </div>
  );
};
