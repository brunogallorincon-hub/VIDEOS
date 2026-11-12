import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../brand";

export const GROUND_Y = 1500;

// Cuarto de Leo: pared, ventana, póster y piso.
const Cloud: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 120 * s, height: 50 * s }}>
    <div style={{ position: "absolute", left: 0, top: 18 * s, width: 120 * s, height: 32 * s, borderRadius: 20 * s, background: C.white }} />
    <div style={{ position: "absolute", left: 22 * s, top: 4 * s, width: 44 * s, height: 44 * s, borderRadius: "50%", background: C.white }} />
    <div style={{ position: "absolute", left: 54 * s, top: -8 * s, width: 52 * s, height: 52 * s, borderRadius: "50%", background: C.white }} />
  </div>
);

export const Room: React.FC = () => {
  const frame = useCurrentFrame();
  return (
  <AbsoluteFill style={{ backgroundColor: C.forest }}>
    {/* ventana: cielo azul con nubes que pasan */}
    <div style={{ position: "absolute", left: 640, top: 590, width: 320, height: 270, borderRadius: 24, background: C.glass, border: `12px solid ${C.white}`, overflow: "hidden" }}>
      <Cloud x={20 + frame * 0.6} y={60} s={1} />
      <Cloud x={170 + frame * 0.35} y={150} s={0.7} />
      <div style={{ position: "absolute", left: 136, top: 0, width: 12, height: "100%", background: C.white }} />
    </div>
    {/* póster */}
    <div style={{ position: "absolute", left: 110, top: 620, width: 200, height: 230, borderRadius: 12, background: C.forestLight, rotate: "-4deg" }}>
      <div style={{ position: "absolute", left: 50, top: 60, width: 100, height: 100, borderRadius: "50%", background: C.leaf, opacity: 0.8 }} />
    </div>
    {/* piso */}
    <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 10, bottom: 0, background: C.forestDark }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 22, height: 14, background: C.forestLight }} />
    <div style={{ position: "absolute", left: 140, width: 800, top: GROUND_Y + 30, height: 70, borderRadius: "50%", background: C.forestLight, opacity: 0.7 }} />
  </AbsoluteFill>
  );
};

// Campus: edificios lejanos, árboles y banqueta. `scroll` = cuánto ha avanzado la cámara (px).
export const Campus: React.FC<{ scroll?: number }> = ({ scroll = 0 }) => {
  const buildings = [
    { x: 0, w: 260, h: 520 },
    { x: 300, w: 200, h: 380 },
    { x: 540, w: 300, h: 600 },
    { x: 880, w: 220, h: 440 },
    { x: 1140, w: 280, h: 560 },
    { x: 1460, w: 240, h: 400 },
    { x: 1740, w: 300, h: 520 },
  ];
  const trees = [80, 480, 900, 1320, 1740, 2160];
  return (
    <AbsoluteFill style={{ backgroundColor: C.forest, overflow: "hidden" }}>
      {/* sol/luna */}
      <div style={{ position: "absolute", left: 760, top: 470, width: 150, height: 150, borderRadius: "50%", background: C.glass, opacity: 0.35 }} />
      {/* edificios (lento) */}
      {buildings.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x - scroll * 0.2,
            top: GROUND_Y - b.h,
            width: b.w,
            height: b.h,
            background: C.forestLight,
            borderRadius: "14px 14px 0 0",
          }}
        >
          {[0, 1, 2].map((r) => (
            <div key={r} style={{ position: "absolute", left: 30, right: 30, top: 50 + r * 110, height: 40, borderRadius: 8, background: C.forest, opacity: 0.7 }} />
          ))}
        </div>
      ))}
      {/* árboles (medio) */}
      {trees.map((x, i) => (
        <div key={i} style={{ position: "absolute", left: x - scroll * 0.55, top: GROUND_Y - 330 }}>
          <div style={{ position: "absolute", left: 66, top: 180, width: 28, height: 150, background: C.forestDark, borderRadius: 10 }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 160, height: 220, borderRadius: "50%", background: i % 2 ? C.leafDark : C.leaf, opacity: 0.85 }} />
        </div>
      ))}
      {/* banqueta (rápido) */}
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 10, bottom: 0, background: C.forestDark }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: GROUND_Y - 10,
          height: 22,
          backgroundImage: `repeating-linear-gradient(90deg, ${C.white}33 0 120px, transparent 120px 180px)`,
          backgroundPosition: `${-scroll}px 0`,
        }}
      />
    </AbsoluteFill>
  );
};
