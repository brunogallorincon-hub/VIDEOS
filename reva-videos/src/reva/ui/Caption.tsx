import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SAFE_TOP, anton } from "../brand";

// Texto grande en Anton que entra palabra por palabra.
// *palabra* = verde hoja (plástico) · _palabra_ = azul vidrio.
// Se coloca justo debajo de la zona segura superior (12%).
export const Caption: React.FC<{
  text: string;
  delay?: number;
  fontSize?: number;
  top?: number;
  /** Frame (local) en el que el texto sale; si no se da, se queda. */
  exitAt?: number;
}> = ({ text, delay = 4, fontSize = 112, top = SAFE_TOP + 50, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const out =
    exitAt === undefined
      ? 0
      : interpolate(frame, [exitAt, exitAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 80,
        right: 80,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: fontSize * 0.24,
        fontFamily: anton,
        fontSize,
        lineHeight: 1.08,
        color: C.white,
        textAlign: "center",
        textTransform: "uppercase",
        opacity: 1 - out,
        translate: `0 ${-out * 40}px`,
      }}
    >
      {words.map((raw, i) => {
        const leaf = /^\*.*\*$/.test(raw);
        const glass = /^_.*_$/.test(raw);
        const w = leaf || glass ? raw.slice(1, -1) : raw;
        const s = spring({ frame: frame - delay - i * 3, fps, config: { damping: 13, stiffness: 170 } });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: leaf ? C.leaf : glass ? C.glass : C.white,
              opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              translate: `0 ${(1 - s) * fontSize * 0.7}px`,
              rotate: `${(1 - s) * 8}deg`,
              textShadow: `0 6px 0 ${C.ink}55`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
