import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../brand";

export type BottleKind = "plastic" | "glass";
export type BottleMood = "neutral" | "happy" | "sad" | "surprised";

type Props = {
  kind?: BottleKind;
  mood?: BottleMood;
  /** Alto en px. */
  size?: number;
  /** Desfase para que no parpadeen todas a la vez. */
  blinkOffset?: number;
  /** Tono gris y triste (botella en la basura). */
  gray?: boolean;
  style?: React.CSSProperties;
};

// Botella mascota con ojitos y sonrisa. viewBox 80 x 180.
export const Bottle: React.FC<Props> = ({
  kind = "plastic",
  mood = "happy",
  size = 180,
  blinkOffset = 0,
  gray = false,
  style,
}) => {
  const frame = useCurrentFrame() + blinkOffset;
  const b = frame % 84;
  const blink = b >= 79 ? Math.abs(b - 81.5) / 2.5 : 1;

  const isGlass = kind === "glass";
  const body = isGlass
    ? "M 32 22 L 48 22 L 48 52 Q 64 62 64 80 L 64 162 Q 64 174 52 174 L 28 174 Q 16 174 16 162 L 16 80 Q 16 62 32 52 Z"
    : "M 30 22 L 50 22 L 50 34 Q 66 44 66 64 L 66 160 Q 66 174 52 174 L 28 174 Q 14 174 14 160 L 14 64 Q 14 44 30 34 Z";
  const bodyFill = isGlass ? C.glass : "#E2F5E8";
  const capFill = isGlass ? "#3D7FA8" : C.leaf;
  const faceY = isGlass ? 118 : 110;
  const eyeRy = (mood === "surprised" ? 6 : 4.5) * blink;

  return (
    <svg
      width={(size * 80) / 180}
      height={size}
      viewBox="0 0 80 180"
      style={{
        overflow: "visible",
        filter: gray ? "grayscale(1) brightness(0.75)" : undefined,
        ...style,
      }}
    >
      {/* tapa */}
      <rect x={isGlass ? 30 : 27} y={6} width={isGlass ? 20 : 26} height={18} rx={4} fill={capFill} />
      {/* cuerpo */}
      <path d={body} fill={bodyFill} />
      {/* brillo */}
      <path
        d={isGlass ? "M 24 86 L 24 150" : "M 22 70 L 22 150"}
        stroke={C.white}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.7}
      />
      {/* etiqueta (solo plástico) */}
      {!isGlass ? <rect x={14} y={92} width={52} height={40} fill={C.leaf} opacity={0.9} /> : null}
      {/* cara */}
      <ellipse cx={32} cy={faceY - 6} rx={3.8} ry={eyeRy} fill={C.ink} />
      <ellipse cx={50} cy={faceY - 6} rx={3.8} ry={eyeRy} fill={C.ink} />
      {mood === "happy" ? (
        <path d={`M 33 ${faceY + 4} Q 41 ${faceY + 13} 49 ${faceY + 4}`} stroke={C.ink} strokeWidth={3.2} fill="none" strokeLinecap="round" />
      ) : mood === "sad" ? (
        <>
          <path d={`M 34 ${faceY + 10} Q 41 ${faceY + 3} 48 ${faceY + 10}`} stroke={C.ink} strokeWidth={3.2} fill="none" strokeLinecap="round" />
          <path d={`M 26 ${faceY - 16} L 36 ${faceY - 13} M 56 ${faceY - 16} L 46 ${faceY - 13}`} stroke={C.ink} strokeWidth={2.6} strokeLinecap="round" />
        </>
      ) : mood === "surprised" ? (
        <ellipse cx={41} cy={faceY + 8} rx={4} ry={5.5} fill={C.ink} />
      ) : (
        <path d={`M 35 ${faceY + 7} L 47 ${faceY + 7}`} stroke={C.ink} strokeWidth={3.2} strokeLinecap="round" />
      )}
    </svg>
  );
};
