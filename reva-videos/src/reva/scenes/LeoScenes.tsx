import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SAFE_SIDE, anton, inter } from "../brand";
import { Leo } from "../characters/Leo";
import { Bottle, BottleKind } from "../characters/Bottle";
import { MACHINE_VIEW, RevaMachine } from "../characters/RevaMachine";
import { Caption } from "../ui/Caption";
import { PointsCounter } from "../ui/PointsCounter";
import { Burst, Confetti, Sfx } from "../ui/Effects";
import { Campus, GROUND_Y, Room } from "../ui/Scenery";
import { Leaf } from "../ui/Logo";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const spike = (f: number, at: number) => interpolate(f, [at - 2, at + 2, at + 20], [0, 1, 0], clamp);

// ===================== Escena 1 · El cuarto (0–3 s) =====================
const PILE: { x: number; row: number; kind: BottleKind }[] = [
  { x: 560, row: 0, kind: "plastic" }, { x: 640, row: 0, kind: "glass" }, { x: 720, row: 0, kind: "plastic" },
  { x: 800, row: 0, kind: "plastic" }, { x: 880, row: 0, kind: "glass" }, { x: 960, row: 0, kind: "plastic" },
  { x: 600, row: 1, kind: "plastic" }, { x: 680, row: 1, kind: "plastic" }, { x: 760, row: 1, kind: "glass" },
  { x: 840, row: 1, kind: "plastic" }, { x: 920, row: 1, kind: "plastic" },
  { x: 680, row: 2, kind: "glass" }, { x: 760, row: 2, kind: "plastic" }, { x: 840, row: 2, kind: "plastic" },
  { x: 760, row: 3, kind: "plastic" },
];

export const RoomScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const q = spring({ frame: frame - 30, fps, config: { damping: 9 } });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ scale: String(interpolate(frame, [0, 100], [1, 1.06], clamp)), transformOrigin: "50% 75%" }}>
        <Room />
        {PILE.map((b, i) => {
          const s = spring({ frame: frame - 2 - i * 1.5, fps, config: { damping: 11, stiffness: 150 } });
          const size = 170;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: b.x - 40 - (size * 80) / 180 / 2,
                top: GROUND_Y - size - b.row * 140 + 6,
                translate: `0 ${(1 - s) * -900}px`,
                rotate: `${((i * 37) % 17) - 8}deg`,
              }}
            >
              <Bottle kind={b.kind} mood={i % 4 === 0 ? "surprised" : "neutral"} size={size} blinkOffset={i * 11} />
            </div>
          );
        })}
        <Leo
          pose="idle"
          expression={frame < 26 ? "neutral" : "surprised"}
          height={760}
          style={{ position: "absolute", left: SAFE_SIDE, top: GROUND_Y - 760 }}
        />
        {/* signo de pregunta sobre Leo */}
        <div
          style={{
            position: "absolute",
            left: 400,
            top: 640,
            fontFamily: anton,
            fontSize: 150,
            color: C.leaf,
            scale: String(q),
            rotate: `${12 + Math.sin(frame / 5) * 6}deg`,
          }}
        >
          ?
        </div>
      </AbsoluteFill>
      <Caption text={caption} />
      <Sfx at={4} kind="pop" volume={0.5} />
      <Sfx at={16} kind="pop" volume={0.5} />
      <Sfx at={30} kind="pop" />
    </AbsoluteFill>
  );
};

// ===================== Escena 2 · Camino al campus (3–7 s) =====================
export const WalkScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scroll = interpolate(frame, [0, 108], [0, 720], { ...clamp, easing: Easing.out(Easing.quad) });
  const arrived = frame >= 100;
  const machineH = 820;
  const pin = spring({ frame: frame - 92, fps, config: { damping: 8 } });
  return (
    <AbsoluteFill>
      <Campus scroll={scroll} />
      <div style={{ position: "absolute", left: 1306 - scroll, top: GROUND_Y - machineH }}>
        <RevaMachine height={machineH} screenText="REVA" glowPlastic={arrived ? 0.5 + 0.5 * Math.sin(frame / 4) : 0} />
        {/* pin de ubicación */}
        <div
          style={{
            position: "absolute",
            left: 192 - 60,
            top: -150,
            width: 120,
            height: 120,
            borderRadius: "50% 50% 50% 0",
            rotate: "-45deg",
            background: C.leaf,
            scale: String(pin),
            translate: `0 ${Math.sin(frame / 5) * 8}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.forest }} />
        </div>
      </div>
      <Leo
        pose={arrived ? "idle" : "walk"}
        expression={arrived ? "happy" : "neutral"}
        holding="bag"
        height={700}
        style={{ position: "absolute", left: SAFE_SIDE, top: GROUND_Y - 700 }}
      />
      <Caption text={caption} />
      <Sfx at={0} kind="whoosh" volume={0.5} />
      <Sfx at={94} kind="ding" volume={0.5} />
    </AbsoluteFill>
  );
};

// ===================== Escena 3 · Meter botellas (7–11 s) =====================
const M_H = 980;
const M_SCALE = M_H / MACHINE_VIEW.h;
const M_LEFT = 1080 - SAFE_SIDE + 20 - (M_H * MACHINE_VIEW.w) / MACHINE_VIEW.h; // borde der. ~90 px
const M_TOP = GROUND_Y + 10 - M_H;
const SLOT_X = M_LEFT + MACHINE_VIEW.slotX * M_SCALE;
const SLOT_Y = { plastic: M_TOP + MACHINE_VIEW.plasticY * M_SCALE, glass: M_TOP + MACHINE_VIEW.glassY * M_SCALE };
const HAND = { x: 460, y: 1010 }; // mano de Leo al soltar la botella
const FLIGHT = 14;
const THROWS: { at: number; kind: BottleKind; pts: number }[] = [
  { at: 14, kind: "plastic", pts: 10 },
  { at: 44, kind: "plastic", pts: 10 },
  { at: 74, kind: "glass", pts: 15 },
];
const FAST_FORWARD = 98;

const FlyingBottle: React.FC<{ at: number; kind: BottleKind }> = ({ at, kind }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + FLIGHT], [0, 1], clamp);
  if (frame < at || frame > at + FLIGHT + 1) return null;
  const tx = SLOT_X;
  const ty = SLOT_Y[kind];
  const x = interpolate(p, [0, 1], [HAND.x, tx]);
  const y = interpolate(p, [0, 1], [HAND.y, ty]) - Math.sin(Math.PI * p) * 260;
  const size = 130;
  return (
    <div
      style={{
        position: "absolute",
        left: x - (size * 80) / 180 / 2,
        top: y - size / 2,
        rotate: `${p * 300}deg`,
        scale: String(interpolate(p, [0, 0.75, 1], [1, 1, 0.3])),
      }}
    >
      <Bottle kind={kind} mood="happy" size={size} />
    </div>
  );
};

export const InsertScene: React.FC<{ caption: string; bottlesNote: string }> = ({ caption, bottlesNote }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrivals = THROWS.map((t) => t.at + FLIGHT);
  const lastArrival = [...arrivals].reverse().find((a) => frame >= a);
  const lastThrow = THROWS[arrivals.indexOf(lastArrival ?? -1)];
  const screenPop = lastArrival === undefined ? 1 : spring({ frame: frame - lastArrival, fps, config: { damping: 9 } });
  const ff = spring({ frame: frame - FAST_FORWARD, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill>
      <Campus scroll={720} />
      <AbsoluteFill style={{ backgroundColor: C.forest, opacity: 0.35 }} />
      <div style={{ position: "absolute", left: M_LEFT, top: M_TOP }}>
        <RevaMachine
          height={M_H}
          screenText={lastThrow ? `+${lastThrow.pts}` : "REVA"}
          screenColor={lastThrow?.kind === "glass" ? C.glass : C.leaf}
          screenPop={screenPop}
          glowPlastic={Math.max(spike(frame, arrivals[0]), spike(frame, arrivals[1]))}
          glowGlass={spike(frame, arrivals[2])}
        />
      </div>
      <Leo
        pose={frame < FAST_FORWARD ? "throw" : "celebrate"}
        expression="happy"
        throwStart={1}
        throwPeriod={30}
        height={720}
        style={{ position: "absolute", left: 90, top: GROUND_Y - 720 }}
      />
      {THROWS.map((t, i) => (
        <FlyingBottle key={i} at={t.at} kind={t.kind} />
      ))}
      {/* marcador de puntos 0 → 300 */}
      <div style={{ position: "absolute", left: SAFE_SIDE, top: 560, display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
        <PointsCounter
          fontSize={100}
          steps={[
            { at: 0, value: 0 },
            { at: arrivals[0], value: 10 },
            { at: arrivals[1], value: 20 },
            { at: arrivals[2], value: 35 },
            { at: FAST_FORWARD, value: 300 },
          ]}
        />
        <div
          style={{
            fontFamily: inter,
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 2,
            color: C.ink,
            background: C.glass,
            padding: "8px 20px",
            borderRadius: 40,
            opacity: ff,
            scale: String(ff),
            transformOrigin: "left center",
          }}
        >
          {bottlesNote}
        </div>
      </div>
      <Caption text={caption} fontSize={100} />
      {THROWS.map((t, i) => (
        <React.Fragment key={i}>
          <Sfx at={t.at} kind="whoosh" volume={0.25} />
          <Sfx at={t.at + FLIGHT} kind="pop" />
          <Sfx at={t.at + FLIGHT + 3} kind="ding" volume={0.45} />
        </React.Fragment>
      ))}
      <Sfx at={FAST_FORWARD} kind="whoosh" volume={0.4} />
      <Sfx at={FAST_FORWARD + 24} kind="ding" />
    </AbsoluteFill>
  );
};

// ===================== Escena 4 · Celebración (11–13 s) =====================
export const CelebrateScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.forest }}>
      <Burst opacity={0.1} cy={0.62} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 10, bottom: 0, background: C.forestDark }} />
      {[120, 900, 180, 960].map((x, i) => (
        <Leaf
          key={i}
          size={70}
          style={{ position: "absolute", left: x, top: 800 + i * 140, rotate: `${frame * (i % 2 ? 3 : -3)}deg`, opacity: 0.6 }}
        />
      ))}
      <Leo
        pose="celebrate"
        expression="happy"
        holding="tickets"
        height={780}
        style={{ position: "absolute", left: 350, top: GROUND_Y - 780 }}
      />
      <Confetti start={2} seed="leo" />
      <Caption text={caption} fontSize={104} />
      <Sfx at={2} kind="ding" />
      <Sfx at={4} kind="pop" />
    </AbsoluteFill>
  );
};
