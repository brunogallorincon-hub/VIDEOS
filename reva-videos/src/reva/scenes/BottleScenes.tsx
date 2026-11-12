import React from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SAFE_SIDE, anton } from "../brand";
import { Bottle } from "../characters/Bottle";
import { MACHINE_VIEW, RevaMachine } from "../characters/RevaMachine";
import { RescueArm, Sparkle, TrashCan } from "../characters/Props";
import { Caption } from "../ui/Caption";
import { Burst, Sfx } from "../ui/Effects";
import { GROUND_Y } from "../ui/Scenery";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Medidas compartidas de la escena del bote de basura
const BOTTLE_SIZE = 260;
const BOTTLE_W = (BOTTLE_SIZE * 80) / 180;
const CAN_H = 520;
const CAN_W = (CAN_H * 220) / 280;
const CAN_LEFT = 540 - CAN_W / 2;
const CAN_TOP = GROUND_Y - CAN_H;
const RIM_Y = CAN_TOP + (40 / 280) * CAN_H;
const BOTTLE_REST_TOP = RIM_Y - 190; // la carita queda asomada sobre el borde

// Mundo gris y triste: piso, lluvia y fondo apagado
const GrayWorld: React.FC<{ color?: number }> = ({ color = 0 }) => {
  const frame = useCurrentFrame();
  const rain = new Array(36).fill(0).map((_, i) => {
    const x = random(`rx${i}`) * 1080;
    const y = ((random(`ry${i}`) * 1920 + frame * 34) % 2100) - 100;
    return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4, height: 60, borderRadius: 2, background: C.white, opacity: 0.12 * (1 - color), rotate: "12deg" }} />;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: color > 0 ? C.forest : "#26302C" }}>
      <AbsoluteFill style={{ backgroundColor: "#26302C", opacity: 1 - color }} />
      {rain}
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 10, bottom: 0, background: color > 0.5 ? C.forestDark : "#1B2320" }} />
    </AbsoluteFill>
  );
};

// ===================== 1 · "I was trash." =====================
export const TrashScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const LAND = 34;
  // cae desde debajo del título, gira y rebota dentro del bote
  const top = frame < LAND
    ? interpolate(frame, [0, LAND], [560, BOTTLE_REST_TOP + 90], { ...clamp, easing: Easing.in(Easing.quad) })
    : BOTTLE_REST_TOP + 90 - spring({ frame: frame - LAND, fps, config: { damping: 9 } }) * 90;
  const rot = interpolate(frame, [0, LAND], [-160, 0], clamp);
  const lid = interpolate(frame, [0, 10, LAND - 4, LAND + 4, LAND + 20], [0, 70, 70, 20, 0], clamp);
  const shake = frame >= LAND && frame < LAND + 14 ? Math.sin(frame * 2.2) * (LAND + 14 - frame) * 0.4 : 0;
  return (
    <AbsoluteFill>
      <GrayWorld />
      <div style={{ position: "absolute", left: 540 - BOTTLE_W / 2, top, rotate: `${rot}deg` }}>
        <Bottle kind="plastic" mood="sad" size={BOTTLE_SIZE} gray />
      </div>
      <TrashCan height={CAN_H} lidAngle={lid} style={{ position: "absolute", left: CAN_LEFT, top: CAN_TOP, rotate: `${shake}deg` }} />
      <Caption text={caption} fontSize={130} />
      <Sfx at={LAND} kind="pop" volume={0.35} />
    </AbsoluteFill>
  );
};

// ===================== 2 · Una mano la rescata =====================
export const RescueScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const GRAB = 22;
  const from = { x: 1300, y: 420 };
  const bottleCenterY = BOTTLE_REST_TOP + BOTTLE_SIZE * 0.55;
  const grabPoint = { x: 540 + 70, y: bottleCenterY };
  const liftTo = { x: 700, y: 760 };
  const hand =
    frame < GRAB
      ? {
          x: interpolate(frame, [0, GRAB], [1180, grabPoint.x], { ...clamp, easing: Easing.out(Easing.cubic) }),
          y: interpolate(frame, [0, GRAB], [560, grabPoint.y], { ...clamp, easing: Easing.out(Easing.cubic) }),
        }
      : {
          x: interpolate(frame, [GRAB + 4, GRAB + 30], [grabPoint.x, liftTo.x], { ...clamp, easing: Easing.inOut(Easing.cubic) }),
          y: interpolate(frame, [GRAB + 4, GRAB + 30], [grabPoint.y, liftTo.y], { ...clamp, easing: Easing.inOut(Easing.cubic) }),
        };
  const grip = interpolate(frame, [GRAB - 2, GRAB + 4], [0, 1], clamp);
  const held = frame >= GRAB;
  const color = interpolate(frame, [GRAB + 6, GRAB + 32], [0, 1], clamp); // vuelve el color
  const bottleLeft = held ? hand.x - 70 - BOTTLE_W / 2 : 540 - BOTTLE_W / 2;
  const bottleTop = held ? hand.y - BOTTLE_SIZE * 0.55 : BOTTLE_REST_TOP;
  return (
    <AbsoluteFill>
      <GrayWorld color={color} />
      <div style={{ position: "absolute", left: bottleLeft, top: bottleTop, rotate: `${held ? interpolate(frame, [GRAB, GRAB + 30], [0, 10], clamp) : 0}deg` }}>
        <Bottle
          kind="plastic"
          mood={frame < GRAB ? "sad" : frame < GRAB + 14 ? "surprised" : "happy"}
          size={BOTTLE_SIZE}
          gray={color < 0.5}
        />
      </div>
      <TrashCan height={CAN_H} style={{ position: "absolute", left: CAN_LEFT, top: CAN_TOP, filter: `saturate(${1 - color})`, opacity: 1 - color * 0.35 }} />
      <RescueArm from={from} hand={hand} grip={grip} />
      {/* destellos cuando recupera el color */}
      {[[-150, -60], [130, -120], [150, 90]].map(([dx, dy], i) => {
        const s = interpolate(frame, [GRAB + 20 + i * 3, GRAB + 30 + i * 3, GRAB + 44 + i * 3], [0, 1, 0], clamp);
        return <Sparkle key={i} size={60} color={i === 1 ? C.leaf : C.white} style={{ position: "absolute", left: liftTo.x - 70 + dx, top: liftTo.y + dy, scale: String(s) }} />;
      })}
      <Caption text={caption} />
      <Sfx at={GRAB} kind="pop" />
      <Sfx at={GRAB + 8} kind="whoosh" volume={0.4} />
    </AbsoluteFill>
  );
};

// ===================== 3 · Entra a la REVA: aro verde + "+10" =====================
const M_H = 1000;
const M_SCALE = M_H / MACHINE_VIEW.h;
const M_W = MACHINE_VIEW.w * M_SCALE;
const M_LEFT = 1080 - SAFE_SIDE - M_W + 20;
const M_TOP = GROUND_Y + 10 - M_H;
const SLOT = { x: M_LEFT + MACHINE_VIEW.slotX * M_SCALE, y: M_TOP + MACHINE_VIEW.plasticY * M_SCALE };

export const MachineScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const IN = 40;
  // salta desde la izquierda y entra en la ranura verde
  const p = interpolate(frame, [12, IN], [0, 1], clamp);
  const bx = interpolate(p, [0, 1], [270, SLOT.x]);
  const by = interpolate(p, [0, 1], [1180, SLOT.y]) - Math.sin(Math.PI * p) * 320;
  const size = 200;
  const hop = frame < 12 ? Math.abs(Math.sin(frame / 3)) * 30 : 0;
  const glow = interpolate(frame, [IN - 2, IN + 3, IN + 30], [0, 1, 0.35], clamp);
  const screenPop = spring({ frame: frame - IN, fps, config: { damping: 9 } });
  const plus = spring({ frame: frame - IN - 2, fps, config: { damping: 12 } });
  return (
    <AbsoluteFill style={{ backgroundColor: C.forest }}>
      <Burst opacity={0.06} cy={0.5} />
      <div style={{ position: "absolute", left: 0, right: 0, top: GROUND_Y - 10, bottom: 0, background: C.forestDark }} />
      <div style={{ position: "absolute", left: M_LEFT, top: M_TOP }}>
        <RevaMachine height={M_H} screenText={frame >= IN ? "+10" : "REVA"} screenPop={frame >= IN ? screenPop : 1} glowPlastic={glow} />
      </div>
      {frame <= IN ? (
        <div
          style={{
            position: "absolute",
            left: bx - (size * 80) / 180 / 2,
            top: by - size / 2 - hop,
            rotate: `${p * 200}deg`,
            scale: String(interpolate(p, [0, 0.8, 1], [1, 1, 0.3])),
          }}
        >
          <Bottle kind="plastic" mood="happy" size={size} />
        </div>
      ) : null}
      {/* "+10" que sube desde la ranura */}
      <div
        style={{
          position: "absolute",
          left: SAFE_SIDE,
          top: SLOT.y - 40 - plus * 130,
          fontFamily: anton,
          fontSize: 150,
          color: C.leaf,
          opacity: interpolate(frame, [IN, IN + 4, IN + 34, IN + 44], [0, 1, 1, 0], clamp),
          scale: String(plus),
        }}
      >
        +10
      </div>
      <Caption text={caption} />
      <Sfx at={IN} kind="pop" />
      <Sfx at={IN + 3} kind="ding" />
    </AbsoluteFill>
  );
};

// ===================== 4 · Sale reciclada como botella nueva =====================
export const RebornScene: React.FC<{ caption: string }> = ({ caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const FORM = 26;
  const cy = 1060;
  // hojuelas/fibras que giran y se juntan
  const flakes = new Array(28).fill(0).map((_, i) => {
    const a = (i / 28) * Math.PI * 2 + frame * 0.12;
    const r = interpolate(frame, [0, FORM], [380 + random(`fr${i}`) * 120, 0], { ...clamp, easing: Easing.in(Easing.cubic) });
    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 540 + Math.cos(a) * r - 12,
          top: cy + Math.sin(a) * r * 0.8 - 5,
          width: 26,
          height: 10,
          borderRadius: 5,
          background: i % 3 === 0 ? C.white : C.leaf,
          rotate: `${a * 57}deg`,
          opacity: frame < FORM + 2 ? 1 : 0,
        }}
      />
    );
  });
  const born = spring({ frame: frame - FORM, fps, config: { damping: 10, stiffness: 110 } });
  const flash = interpolate(frame, [FORM - 2, FORM + 2, FORM + 12], [0, 0.7, 0], clamp);
  const size = 420;
  return (
    <AbsoluteFill style={{ backgroundColor: C.forest }}>
      <Burst opacity={0.1} cy={cy / 1920} />
      {flakes}
      <div
        style={{
          position: "absolute",
          left: 540 - (size * 80) / 180 / 2,
          top: cy - size / 2 + Math.sin(frame / 8) * 10,
          scale: String(born),
          rotate: `${(1 - born) * 40}deg`,
        }}
      >
        <Bottle kind="plastic" mood="happy" size={size} />
      </div>
      {[[-250, -170, 70], [230, -230, 54], [260, 120, 64], [-230, 170, 46]].map(([dx, dy, s], i) => (
        <Sparkle
          key={i}
          size={s}
          color={i % 2 ? C.leaf : C.white}
          style={{
            position: "absolute",
            left: 540 + dx,
            top: cy + dy,
            scale: String(Math.max(0, born) * (0.7 + 0.3 * Math.sin(frame / 4 + i))),
            rotate: `${frame * 2}deg`,
          }}
        />
      ))}
      <AbsoluteFill style={{ backgroundColor: C.white, opacity: flash }} />
      <Caption text={caption} delay={FORM + 6} />
      <Sfx at={0} kind="whoosh" volume={0.5} />
      <Sfx at={FORM} kind="pop" />
      <Sfx at={FORM + 4} kind="ding" volume={0.6} />
    </AbsoluteFill>
  );
};
