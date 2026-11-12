import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { BRAND_NAME, colors, displayFont, gradient } from "../brand";

// Isotipo "R" dentro de un anillo que se dibuja + wordmark letra a letra.
const RING =
  "M 100 10 A 90 90 0 1 1 99.99 10"; // círculo como path para animar el trazo

export const Logo: React.FC<{ size: number; delay?: number; showWord?: boolean }> = ({
  size,
  delay = 0,
  showWord = true,
}) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();

  const draw = interpolate(frame, [0, 1.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });
  const ring = evolvePath(draw, RING);

  const markPop = spring({ frame: frame - 0.5 * fps, fps, config: { damping: 12 } });
  const glow = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.18 }}>
      <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="revaG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
          <filter id="revaGlow">
            <feGaussianBlur stdDeviation={4 + glow * 4} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={RING}
          fill="none"
          stroke="url(#revaG)"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={ring.strokeDasharray}
          strokeDashoffset={ring.strokeDashoffset}
          filter="url(#revaGlow)"
        />
        <g
          style={{
            transformOrigin: "100px 100px",
            scale: String(markPop),
            opacity: Math.min(1, markPop * 1.5),
          }}
        >
          <text
            x="100"
            y="133"
            textAnchor="middle"
            fontFamily={displayFont}
            fontWeight={900}
            fontSize={100}
            fill="white"
          >
            R
          </text>
        </g>
      </svg>
      {showWord ? (
        <div style={{ display: "flex", gap: size * 0.04 }}>
          {BRAND_NAME.split("").map((ch, i) => {
            const s = spring({
              frame: frame - 0.9 * fps - i * 4,
              fps,
              config: { damping: 14, stiffness: 160 },
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: displayFont,
                  fontWeight: 900,
                  fontSize: size * 0.42,
                  letterSpacing: size * 0.02,
                  backgroundImage: gradient,
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  opacity: s,
                  translate: `0 ${(1 - s) * size * 0.3}px`,
                  display: "inline-block",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
