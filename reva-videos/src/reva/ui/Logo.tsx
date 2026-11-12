import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, anton } from "../brand";

// Hojita verde (también se usa en la máquina y como decoración).
export const Leaf: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.leaf,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" style={style}>
    <path d="M8 52 Q6 12 52 6 Q56 48 8 52 Z" fill={color} />
    <path d="M10 50 Q26 30 44 14" stroke={C.forest} strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </svg>
);

// Logo: hojita + "REVA" en Anton. Anima la hoja con un muelle y las letras una a una.
export const Logo: React.FC<{ fontSize: number; delay?: number; animate?: boolean }> = ({
  fontSize,
  delay = 0,
  animate = true,
}) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const leafIn = animate ? spring({ frame, fps, config: { damping: 9, stiffness: 120 } }) : 1;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: fontSize * 0.12 }}>
      <Leaf
        size={fontSize * 0.78}
        style={{
          scale: String(leafIn),
          rotate: `${(1 - leafIn) * -90 + Math.sin(frame / 12) * 4}deg`,
          translate: `0 ${-fontSize * 0.05}px`,
        }}
      />
      <div style={{ display: "flex" }}>
        {"REVA".split("").map((ch, i) => {
          const s = animate
            ? spring({ frame: frame - 4 - i * 3, fps, config: { damping: 14, stiffness: 180 } })
            : 1;
          return (
            <span
              key={i}
              style={{
                fontFamily: anton,
                fontSize,
                lineHeight: 1,
                color: C.white,
                letterSpacing: fontSize * 0.02,
                display: "inline-block",
                opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                translate: `0 ${(1 - s) * fontSize * 0.5}px`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
};
