import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, REVA, anton, inter } from "../brand";
import { Logo } from "./Logo";
import { Burst, Sfx } from "./Effects";

// Cierre común de los 3 videos: logo REVA + lema (o la frase que le pases).
// Palabras con *asteriscos* = verde, _guiones_ = azul vidrio.
export const EndCard: React.FC<{ line?: string; subline?: string; cta?: string }> = ({
  line = "*Recycle.* Earn. _Transform._",
  subline,
  cta = REVA.linkCta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = line.split(" ");
  return (
    <AbsoluteFill style={{ backgroundColor: C.forest, justifyContent: "center", alignItems: "center" }}>
      <Burst opacity={0.07} cy={0.45} />
      <Sfx at={3} kind="pop" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50, translate: "0 -80px" }}>
        <Logo fontSize={230} />
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", justifyContent: "center", maxWidth: 1000 }}>
          {words.map((raw, i) => {
            const leaf = /^\*.*\*$/.test(raw);
            const glass = /^_.*_$/.test(raw);
            const w = leaf || glass ? raw.slice(1, -1) : raw;
            const s = spring({ frame: frame - 14 - i * 5, fps, config: { damping: 14 } });
            return (
              <span
                key={i}
                style={{
                  fontFamily: anton,
                  fontSize: 84,
                  color: leaf ? C.leaf : glass ? C.glass : C.white,
                  opacity: s,
                  translate: `0 ${(1 - s) * 50}px`,
                  display: "inline-block",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {subline ? (
          <div
            style={{
              fontFamily: anton,
              fontSize: 64,
              color: C.white,
              opacity: spring({ frame: frame - 30, fps, config: { damping: 200 } }),
              letterSpacing: 2,
            }}
          >
            {subline}
          </div>
        ) : null}
        {cta ? (
          <div
            style={{
              marginTop: 10,
              fontFamily: inter,
              fontWeight: 800,
              fontSize: 40,
              letterSpacing: 1,
              color: C.white,
              background: C.ink,
              border: `3px solid ${C.leaf}`,
              borderRadius: 40,
              padding: "14px 36px",
              opacity: spring({ frame: frame - 26, fps, config: { damping: 200 } }),
            }}
          >
            {cta}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
