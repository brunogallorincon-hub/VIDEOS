import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SAFE_SIDE, SAFE_TOP, W, anton } from "../brand";

// Texto grande en Anton que entra palabra por palabra.
// *palabra* = verde hoja (plástico) · _palabra_ = azul vidrio.
// " | " fuerza un salto de línea. Las líneas largas se parten solas (flex-wrap) y,
// si una palabra no cabe, la fuente se reduce para respetar SAFE_SIDE en ambos lados.
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
  const maxWidth = W - 2 * SAFE_SIDE;
  const lines = text.split("|").map((l) => l.trim().split(/\s+/).filter(Boolean));
  // Estimación conservadora del ancho de Anton en mayúsculas (~0.52 em por carácter).
  const longestWord = Math.max(...lines.flat().map((w) => w.replace(/^[*_]|[*_]$/g, "").length));
  const size = Math.min(fontSize, Math.floor(maxWidth / (longestWord * 0.52)));
  let wordIndex = 0;
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: SAFE_SIDE,
        right: SAFE_SIDE,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: anton,
        fontSize: size,
        lineHeight: 1.08,
        color: C.white,
        textAlign: "center",
        textTransform: "uppercase",
        opacity: 1 - out,
        translate: `0 ${-out * 40}px`,
      }}
    >
      {lines.map((words, li) => (
        <div
          key={li}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.24, maxWidth }}
        >
          {words.map((raw) => {
        const i = wordIndex++;
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
              translate: `0 ${(1 - s) * size * 0.7}px`,
              rotate: `${(1 - s) * 8}deg`,
              textShadow: `0 6px 0 ${C.ink}55`,
            }}
          >
            {w}
          </span>
        );
          })}
        </div>
      ))}
    </div>
  );
};
