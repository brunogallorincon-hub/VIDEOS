import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SAFE_SIDE, W, anton, inter } from "../brand";
import { Leo } from "../characters/Leo";
import { Bottle } from "../characters/Bottle";
import { CoffeeIcon, DiscountIcon, TicketsIcon } from "../characters/Props";
import { Caption } from "../ui/Caption";
import { PointsCounter } from "../ui/PointsCounter";
import { Confetti, Sfx } from "../ui/Effects";
import { GROUND_Y } from "../ui/Scenery";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Niveles (solo datos reales de REVA: botella de plástico = 10 pts)
export type Level = { bottles: number; reward: string; caption: string };
const ICONS = [CoffeeIcon, DiscountIcon, TicketsIcon];
const PTS_PER_BOTTLE = 10;
const TOTAL = 30; // la barra va de 0 a 30 botellas

// Llegada de cada botella a la barra (frame local) y momento de cada desbloqueo.
// Se rellena hasta 10, pausa; hasta 15, pausa; hasta 30, pausa.
const SEGMENTS = [
  { from: 0, to: 10, start: 18, every: 6 },
  { from: 10, to: 15, start: 112, every: 6 },
  { from: 15, to: 30, start: 176, every: 4 },
];
const ARRIVALS: number[] = SEGMENTS.flatMap((s) =>
  new Array(s.to - s.from).fill(0).map((_, k) => s.start + k * s.every),
);
export const UNLOCKS = SEGMENTS.map((s) => s.start + (s.to - s.from - 1) * s.every + 6);
const SEG_START = [0, SEGMENTS[1].start - 6, SEGMENTS[2].start - 6];
export const LEVELS_SCENE_DURATION = 288;

// Barra
const BAR = { left: SAFE_SIDE, width: W - 2 * SAFE_SIDE, top: 770, height: 104, pad: 8 };
const SLOT_W = (BAR.width - BAR.pad * 2) / TOTAL;
const slotX = (i: number) => BAR.left + BAR.pad + (i + 0.5) * SLOT_W;
const BAR_BOTTLE = 70;

// Leo y su mano
const LEO_H = 460;
const LEO_LEFT = SAFE_SIDE;
const LEO_TOP = GROUND_Y - LEO_H;
const HAND = { x: LEO_LEFT + 215 * (LEO_H / 410), y: LEO_TOP + 117 * (LEO_H / 410) };
const FLIGHT = 10;

const FlyingBottle: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const arrive = ARRIVALS[i];
  if (frame < arrive - FLIGHT || frame >= arrive) return null;
  const p = interpolate(frame, [arrive - FLIGHT, arrive], [0, 1], clamp);
  const x = interpolate(p, [0, 1], [HAND.x, slotX(i)]);
  const y = interpolate(p, [0, 1], [HAND.y, BAR.top + BAR.height / 2]) - Math.sin(Math.PI * p) * 160;
  const size = interpolate(p, [0, 1], [110, BAR_BOTTLE]);
  return (
    <div style={{ position: "absolute", left: x - (size * 80) / 180 / 2, top: y - size / 2, rotate: `${p * 360}deg` }}>
      <Bottle kind="plastic" mood="happy" size={size} blinkOffset={i * 7} />
    </div>
  );
};

const LevelBadge: React.FC<{ n: number; x: number; unlockAt: number }> = ({ n, x, unlockAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = frame >= unlockAt;
  const pop = on ? spring({ frame: frame - unlockAt, fps, config: { damping: 7, stiffness: 160 } }) : 1;
  return (
    <div style={{ position: "absolute", left: x - 70, top: 590, width: 140, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 110,
          height: 110,
          borderRadius: "50%",
          background: on ? C.leaf : C.ink,
          border: `6px solid ${on ? C.white : C.forestLight}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: anton,
          fontSize: 62,
          color: on ? C.ink : C.forestLight,
          scale: String(pop),
        }}
      >
        {n}
      </div>
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, letterSpacing: 2, color: on ? C.leaf : C.forestLight }}>LVL {n}</div>
    </div>
  );
};

const RewardCard: React.FC<{ level: number; reward: string; bottles: number }> = ({ level, reward, bottles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 11, stiffness: 140 } });
  const Icon = ICONS[level];
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE_SIDE,
        top: 1050,
        width: 440,
        padding: "28px 24px",
        borderRadius: 36,
        background: C.ink,
        border: `5px solid ${C.leaf}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        scale: String(s),
        rotate: `${(1 - s) * -10}deg`,
      }}
    >
      <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 28, letterSpacing: 3, color: C.leaf }}>UNLOCKED</div>
      <Icon size={150} />
      <div style={{ fontFamily: anton, fontSize: 64, color: C.white, textAlign: "center", lineHeight: 1.05 }}>{reward}</div>
      <div style={{ fontFamily: inter, fontWeight: 600, fontSize: 30, color: C.glass }}>
        {bottles} bottles · {bottles * PTS_PER_BOTTLE} pts
      </div>
    </div>
  );
};

export const LevelsScene: React.FC<{ levels: Level[] }> = ({ levels }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const barIn = spring({ frame, fps, config: { damping: 200 } });
  const count = ARRIVALS.filter((a) => frame >= a).length;
  const filling = SEGMENTS.some((s) => frame >= s.start - FLIGHT - 4 && frame < s.start + (s.to - s.from) * s.every - FLIGHT);
  const fillW = interpolate(
    frame,
    [ARRIVALS[0], ...ARRIVALS.map((a) => a + 3)],
    [0, ...ARRIVALS.map((_, i) => (i + 1) * SLOT_W)],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const markers = levels.map((l) => l.bottles);
  return (
    <AbsoluteFill style={{ backgroundColor: C.forest }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 10, bottom: 0, background: C.forestDark }} />

      {/* título por nivel */}
      {levels.map((l, k) => (
        <Sequence key={k} from={SEG_START[k]} durationInFrames={(SEG_START[k + 1] ?? LEVELS_SCENE_DURATION) - SEG_START[k]} layout="none" name={`Título LVL ${k + 1}`}>
          <Caption text={l.caption} fontSize={80} top={262} />
        </Sequence>
      ))}

      {/* insignias de nivel */}
      {[0, 1, 2].map((k) => (
        <LevelBadge key={k} n={k + 1} x={W / 2 + (k - 1) * 290} unlockAt={UNLOCKS[k]} />
      ))}

      {/* barra de progreso */}
      <div style={{ opacity: barIn, translate: `0 ${(1 - barIn) * 40}px` }}>
        <div
          style={{
            position: "absolute",
            left: BAR.left,
            top: BAR.top,
            width: BAR.width,
            height: BAR.height,
            borderRadius: 30,
            background: C.ink,
            border: `5px solid ${C.white}`,
            overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: BAR.pad + fillW, background: C.leaf, opacity: 0.35 }} />
        </div>
        {/* botellas dentro de la barra */}
        {ARRIVALS.map((a, i) => {
          if (frame < a) return null;
          const s = spring({ frame: frame - a, fps, config: { damping: 9, stiffness: 200 } });
          return (
            <div key={i} style={{ position: "absolute", left: slotX(i) - (BAR_BOTTLE * 80) / 180 / 2, top: BAR.top + (BAR.height - BAR_BOTTLE) / 2, scale: String(s) }}>
              <Bottle kind="plastic" mood="happy" size={BAR_BOTTLE} blinkOffset={i * 5} />
            </div>
          );
        })}
        {/* marcas 10 · 15 · 30 */}
        {markers.map((m, k) => {
          const x = BAR.left + BAR.pad + m * SLOT_W;
          const on = frame >= UNLOCKS[k];
          const last = k === markers.length - 1;
          return (
            <React.Fragment key={k}>
              {!last ? <div style={{ position: "absolute", left: x - 3, top: BAR.top - 12, width: 6, height: BAR.height + 24, borderRadius: 3, background: on ? C.leaf : C.white }} /> : null}
              <div
                style={{
                  position: "absolute",
                  left: last ? undefined : x - 80,
                  right: last ? SAFE_SIDE : undefined,
                  width: 160,
                  top: BAR.top + BAR.height + 16,
                  textAlign: last ? "right" : "center",
                  fontFamily: inter,
                  fontWeight: 800,
                  fontSize: 28,
                  color: on ? C.leaf : C.white,
                }}
              >
                {m * PTS_PER_BOTTLE} PTS
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* contador de botellas y puntos */}
      <div style={{ position: "absolute", left: SAFE_SIDE, top: 940, display: "flex", alignItems: "center", gap: 20 }}>
        <PointsCounter fontSize={76} rampFrames={3} steps={[{ at: 0, value: 0 }, ...ARRIVALS.map((a, i) => ({ at: a, value: (i + 1) * PTS_PER_BOTTLE }))]} />
        <div style={{ fontFamily: inter, fontWeight: 800, fontSize: 30, color: C.white, letterSpacing: 1 }}>
          {count}/{TOTAL} BOTTLES
        </div>
      </div>

      <Leo
        pose={filling ? "throw" : count > 0 ? "celebrate" : "idle"}
        expression="happy"
        throwStart={8}
        throwPeriod={12}
        height={LEO_H}
        style={{ position: "absolute", left: LEO_LEFT, top: LEO_TOP }}
      />
      {ARRIVALS.map((_, i) => (
        <FlyingBottle key={i} i={i} />
      ))}

      {/* tarjeta de recompensa + confeti + sonido en cada desbloqueo */}
      {levels.map((l, k) => (
        <Sequence key={k} from={UNLOCKS[k]} durationInFrames={(UNLOCKS[k + 1] ?? LEVELS_SCENE_DURATION + 20) - UNLOCKS[k]} layout="none" name={`Desbloqueo LVL ${k + 1}`}>
          <RewardCard level={k} reward={l.reward} bottles={l.bottles} />
          <Confetti seed={`lvl${k}`} count={60} />
          <Sfx at={0} kind="pop" volume={0.9} />
          <Sfx at={2} kind="ding" />
        </Sequence>
      ))}
      {ARRIVALS.map((a, i) => (
        <Sfx key={i} at={a} kind="pop" volume={0.18} />
      ))}
    </AbsoluteFill>
  );
};
