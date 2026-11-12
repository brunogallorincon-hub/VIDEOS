import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, colors, displayFont, gradient } from "../brand";

// Titular que entra palabra por palabra con desenfoque + muelle.
// Las palabras entre *asteriscos* se pintan con el degradado de marca.
export const WordReveal: React.FC<{
  text: string;
  fontSize: number;
  delay?: number;
  stagger?: number;
  align?: "center" | "left";
}> = ({ text, fontSize, delay = 0, stagger = 4, align = "center" }) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: fontSize * 0.28,
        rowGap: fontSize * 0.05,
        fontFamily: displayFont,
        fontWeight: 900,
        fontSize,
        lineHeight: 1.05,
        color: colors.text,
        textAlign: align,
      }}
    >
      {words.map((raw, i) => {
        const hl = raw.startsWith("*") && raw.endsWith("*");
        const w = hl ? raw.slice(1, -1) : raw;
        const s = spring({
          frame: frame - i * stagger,
          fps,
          config: { damping: 15, stiffness: 140 },
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: s,
              translate: `0 ${(1 - s) * fontSize * 0.6}px`,
              filter: `blur(${(1 - s) * 12}px)`,
              ...(hl
                ? {
                    backgroundImage: gradient,
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }
                : {}),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const FadeUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, delay = 0, style }) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 200 } });
  return (
    <div
      style={{
        fontFamily: bodyFont,
        color: colors.muted,
        opacity: s,
        translate: `0 ${(1 - s) * 40}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Contador numérico animado.
export const Counter: React.FC<{
  to: number;
  suffix?: string;
  prefix?: string;
  fontSize: number;
  delay?: number;
}> = ({ to, suffix = "", prefix = "", fontSize, delay = 0 }) => {
  const frame = useCurrentFrame() - delay;
  const { fps } = useVideoConfig();
  const v = interpolate(frame, [0, 1.4 * fps], [0, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 4),
  });
  return (
    <span
      style={{
        fontFamily: displayFont,
        fontWeight: 900,
        fontSize,
        backgroundImage: gradient,
        WebkitBackgroundClip: "text",
        color: "transparent",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {Math.round(v).toLocaleString("es-ES")}
      {suffix}
    </span>
  );
};
