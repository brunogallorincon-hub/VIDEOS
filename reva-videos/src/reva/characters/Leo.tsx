import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "../brand";

export type LeoPose = "idle" | "walk" | "throw" | "celebrate";
export type LeoExpression = "neutral" | "happy" | "surprised";

type Props = {
  pose?: LeoPose;
  expression?: LeoExpression;
  /** Alto en px del personaje (de la cabeza a los tenis). */
  height?: number;
  /** Lo que lleva en las manos. */
  holding?: "none" | "bag" | "tickets";
  /** Para pose "throw": frame en que empieza el primer lanzamiento y cada cuánto se repite. */
  throwStart?: number;
  throwPeriod?: number;
  style?: React.CSSProperties;
};

// Leo: estudiante de 19 años, sudadera verde hoja, mochila y tenis blancos.
// Hecho con formas SVG simples. viewBox 200 x 410 (los pies tocan y = 405).
export const Leo: React.FC<Props> = ({
  pose = "idle",
  expression = "neutral",
  height = 700,
  holding = "none",
  throwStart = 0,
  throwPeriod = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Respirar y parpadear (siempre activos)
  const breath = Math.sin((frame / fps) * Math.PI * 2 * 0.45);
  const b = frame % 100;
  const blink = b >= 94 ? Math.abs(b - 97) / 3 : 1;

  // Ángulos (grados). Positivo = la mano se va hacia la izquierda de la pantalla.
  let armL = 8 + 2 * breath;
  let armR = -8 - 2 * breath;
  let liftL = 0;
  let liftR = 0;
  let bodyY = 0;
  let tilt = 0;

  if (pose === "walk") {
    const s = Math.sin((frame / (0.62 * fps)) * Math.PI * 2);
    armL = 10 + 16 * s;
    armR = -10 + 16 * s;
    liftL = Math.max(0, s) * 16;
    liftR = Math.max(0, -s) * 16;
    bodyY = -Math.abs(s) * 7;
    tilt = s * 1.5;
  }
  if (pose === "throw") {
    const local = frame - throwStart;
    const p = local < 0 ? 0 : (local % throwPeriod) / throwPeriod;
    armR = interpolate(p, [0, 0.28, 0.45, 0.62, 1], [-10, 28, -128, -95, -10]);
    armL = 14 + 2 * breath;
    tilt = interpolate(p, [0, 0.28, 0.45, 1], [0, -3, 5, 0]);
  }
  if (pose === "celebrate") {
    const j = Math.abs(Math.sin((frame / (0.7 * fps)) * Math.PI));
    bodyY = -j * 34;
    armL = 152 + 10 * Math.sin(frame / 4);
    armR = -152 - 10 * Math.sin(frame / 4);
    liftL = j * 8;
    liftR = j * 8;
  }

  const breathScale = pose === "idle" ? 1 + 0.012 * breath : 1;

  // Brazo: sale del hombro hacia abajo con una curva suave; mano al final (y + 86).
  const Arm: React.FC<{ sx: number; angle: number; dir: 1 | -1; item?: React.ReactNode }> = ({
    sx,
    angle,
    dir,
    item,
  }) => (
    <g transform={`rotate(${angle} ${sx} 172)`}>
      <path
        d={`M ${sx} 172 Q ${sx - dir * 12} 214 ${sx} 254`}
        stroke={C.leaf}
        strokeWidth={24}
        fill="none"
        strokeLinecap="round"
      />
      <path d={`M ${sx - 11} 244 L ${sx + 11} 244`} stroke={C.leafDark} strokeWidth={6} strokeLinecap="round" />
      <circle cx={sx} cy={262} r={13} fill={C.skin} />
      {item ? <g transform={`rotate(${-angle} ${sx} 262)`}>{item}</g> : null}
    </g>
  );

  const bag = (
    <g transform="translate(150 262)">
      {/* bolsa con botellas asomándose */}
      <rect x={-8} y={4} width={12} height={22} rx={3} fill={C.leaf} />
      <rect x={6} y={0} width={10} height={26} rx={3} fill={C.glass} />
      <rect x={-20} y={2} width={9} height={22} rx={3} fill={C.leaf} />
      <path d="M -30 14 L 30 14 L 24 78 Q 0 86 -24 78 Z" fill={C.white} />
      <path d="M -14 14 Q 0 -6 14 14" stroke={C.white} strokeWidth={5} fill="none" />
      <path d="M -6 38 L 6 38 M 0 32 L 0 44" stroke={C.leafDark} strokeWidth={4} strokeLinecap="round" />
    </g>
  );

  const ticket = (x: number, rot: number, color: string) => (
    <g transform={`translate(${x} 250) rotate(${rot})`}>
      <rect x={-26} y={-16} width={52} height={32} rx={4} fill={C.white} />
      <rect x={-26} y={-16} width={14} height={32} rx={3} fill={color} />
      <circle cx={-12} cy={-16} r={4} fill={C.forest} />
      <circle cx={-12} cy={16} r={4} fill={C.forest} />
      <text x={8} y={7} textAnchor="middle" fontFamily="Anton, sans-serif" fontSize={18} fill={C.ink}>
        2x1
      </text>
    </g>
  );

  const eyeRy = (expression === "surprised" ? 9 : 7) * blink;

  return (
    <svg
      width={(height * 200) / 410}
      height={height}
      viewBox="0 0 200 410"
      style={{ overflow: "visible", ...style }}
    >
      {/* sombra en el piso */}
      <ellipse cx={100} cy={404} rx={58 - Math.abs(bodyY) * 0.6} ry={9} fill={C.ink} opacity={0.35} />

      <g transform={`translate(0 ${bodyY}) rotate(${tilt} 100 400)`}>
        {/* piernas + tenis blancos */}
        <g transform={`translate(0 ${-liftL})`}>
          <rect x={73} y={266} width={22} height={112} rx={10} fill={C.pants} />
          <rect x={60} y={370} width={40} height={26} rx={13} fill={C.white} />
          <rect x={60} y={389} width={40} height={7} rx={3} fill={C.glass} opacity={0.7} />
        </g>
        <g transform={`translate(0 ${-liftR})`}>
          <rect x={105} y={266} width={22} height={112} rx={10} fill={C.pants} />
          <rect x={100} y={370} width={40} height={26} rx={13} fill={C.white} />
          <rect x={100} y={389} width={40} height={7} rx={3} fill={C.glass} opacity={0.7} />
        </g>

        <g transform={`translate(100 280) scale(1 ${breathScale}) translate(-100 -280)`}>
          {/* mochila (detrás del cuerpo) */}
          <rect x={44} y={160} width={112} height={108} rx={28} fill={C.leafDark} />
          {/* cuerpo tipo cápsula = sudadera */}
          <rect x={58} y={146} width={84} height={136} rx={40} fill={C.leaf} />
          {/* gorro de la sudadera */}
          <path d="M 70 156 Q 100 178 130 156" stroke={C.leafDark} strokeWidth={9} fill="none" strokeLinecap="round" />
          {/* cordones */}
          <path d="M 92 168 L 90 198 M 108 168 L 110 198" stroke={C.white} strokeWidth={3.5} strokeLinecap="round" />
          {/* bolsillo canguro */}
          <rect x={74} y={222} width={52} height={30} rx={12} fill={C.leafDark} opacity={0.55} />
          {/* tirantes de la mochila */}
          <path d="M 66 158 Q 68 190 70 222 M 134 158 Q 132 190 130 222" stroke={C.forest} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.6} />
        </g>

        {/* brazos */}
        <Arm
          sx={56}
          angle={armL}
          dir={1}
          item={holding === "tickets" ? ticket(56, -12, C.leaf) : undefined}
        />
        <Arm
          sx={144}
          angle={armR}
          dir={-1}
          item={
            holding === "tickets" ? ticket(144, 12, C.glass) : holding === "bag" ? bag : undefined
          }
        />

        {/* cabeza */}
        <g transform={`translate(0 ${breath * 1.2})`}>
          <rect x={90} y={128} width={20} height={22} rx={6} fill={C.skin} />
          <circle cx={100} cy={96} r={52} fill={C.skin} />
          {/* orejas */}
          <circle cx={48} cy={100} r={9} fill={C.skin} />
          <circle cx={152} cy={100} r={9} fill={C.skin} />
          {/* pelo */}
          <path
            d="M 47 92 Q 46 40 100 38 Q 156 38 153 92 Q 146 66 124 62 Q 118 74 98 70 Q 80 66 74 60 Q 54 70 47 92 Z"
            fill={C.ink}
          />
          {/* cejas */}
          <path
            d={expression === "surprised" ? "M 72 74 Q 82 66 92 72 M 108 72 Q 118 66 128 74" : "M 72 82 Q 82 78 92 81 M 108 81 Q 118 78 128 82"}
            stroke={C.ink}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          {/* ojos */}
          <ellipse cx={82} cy={98} rx={5.5} ry={eyeRy} fill={C.ink} />
          <ellipse cx={118} cy={98} rx={5.5} ry={eyeRy} fill={C.ink} />
          {/* cachetes */}
          {expression === "happy" ? (
            <>
              <circle cx={70} cy={116} r={8} fill="#E98A7A" opacity={0.55} />
              <circle cx={130} cy={116} r={8} fill="#E98A7A" opacity={0.55} />
            </>
          ) : null}
          {/* boca */}
          {expression === "happy" ? (
            <path d="M 84 118 Q 100 142 116 118 Z" fill={C.ink} />
          ) : expression === "surprised" ? (
            <ellipse cx={100} cy={126} rx={7} ry={10} fill={C.ink} />
          ) : (
            <path d="M 89 124 Q 100 130 111 124" stroke={C.ink} strokeWidth={4} fill="none" strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
};
