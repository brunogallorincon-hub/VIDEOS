import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../theme";

// ---------- Sonido ----------
// public/audio/pop.wav, ding.wav y whoosh.wav se generaron por código (sin derechos).
// Puedes reemplazarlos por los tuyos con el mismo nombre.
export const Sfx: React.FC<{ at: number; kind: "pop" | "ding" | "whoosh"; volume?: number }> = ({
  at,
  kind,
  volume = 0.7,
}) => (
  <Sequence from={Math.round(at)} durationInFrames={30} layout="none" name={`sfx-${kind}`}>
    <Audio src={staticFile(`audio/${kind}.wav`)} volume={volume} />
  </Sequence>
);

// Música de fondo: public/audio/music.mp3 (la pones tú). Si no existe, no suena nada.
export const Music: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const { durationInFrames, fps } = useVideoConfig();
  if (!enabled) return null;
  return (
    <Audio
      src={staticFile("audio/music.mp3")}
      volume={(f) =>
        interpolate(f, [0, 0.5 * fps, durationInFrames - fps, durationInFrames], [0, 0.45, 0.45, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

// Revisa si existe music.mp3 (se usa en calculateMetadata de cada Composition).
export const detectMusic = async (): Promise<boolean> => {
  try {
    const res = await fetch(staticFile("audio/music.mp3"), { method: "HEAD" });
    const type = res.headers.get("content-type") ?? "";
    return res.ok && !type.includes("text/html");
  } catch {
    return false;
  }
};

// ---------- Confeti plano ----------
export const Confetti: React.FC<{ start?: number; count?: number; seed?: string }> = ({
  start = 0,
  count = 70,
  seed = "c",
}) => {
  const frame = useCurrentFrame() - start;
  const { width, height } = useVideoConfig();
  if (frame < 0) return null;
  const colors = [C.leaf, C.glass, C.white, C.leaf];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${seed}-${k}-${i}`);
        const angle = -Math.PI / 2 + (r("a") - 0.5) * 2.2;
        const speed = 28 + r("s") * 30;
        const x = width / 2 + Math.cos(angle) * speed * frame;
        const y = height * 0.5 + Math.sin(angle) * speed * frame + 0.9 * frame * frame;
        const isRect = r("t") > 0.4;
        const sz = 14 + r("z") * 16;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: isRect ? sz * 0.5 : sz,
              borderRadius: isRect ? 3 : "50%",
              background: colors[i % colors.length],
              rotate: `${frame * (8 + r("r") * 14)}deg`,
              opacity: interpolate(frame, [40, 70], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Rayos giratorios de fondo ----------
export const Burst: React.FC<{ color?: string; opacity?: number; cy?: number }> = ({
  color = C.leaf,
  opacity = 0.12,
  cy = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rays = 14;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg width={width} height={height}>
        <g transform={`translate(${width / 2} ${height * cy}) rotate(${frame * 0.6})`}>
          {new Array(rays).fill(0).map((_, i) => {
            const a = (i / rays) * Math.PI * 2;
            const a2 = a + Math.PI / rays;
            const R = 2000;
            return (
              <path
                key={i}
                d={`M0 0 L ${Math.cos(a) * R} ${Math.sin(a) * R} L ${Math.cos(a2) * R} ${Math.sin(a2) * R} Z`}
                fill={color}
                opacity={opacity}
              />
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
