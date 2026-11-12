import React from "react";
import { C, anton, inter } from "../brand";

type Props = {
  /** Alto en px. */
  height?: number;
  /** Texto en la pantalla, ej. "+10". */
  screenText?: string;
  /** Color del texto de la pantalla. */
  screenColor?: string;
  /** 0 → 1: rebote del texto de la pantalla cuando cambia. */
  screenPop?: number;
  /** 0 → 1: brillo del aro verde (plástico) y azul (vidrio). */
  glowPlastic?: number;
  glowGlass?: number;
  style?: React.CSSProperties;
};

// Posiciones de las ranuras dentro del viewBox (300 x 640), para que las escenas
// sepan a dónde lanzar las botellas.
export const MACHINE_VIEW = { w: 300, h: 640, slotX: 150, plasticY: 312, glassY: 462 };

// Máquina REVA: alta, verde bosque, pantalla, ranura verde (plástico) y azul (vidrio)
// con aros de luz que brillan cuando entra una botella.
export const RevaMachine: React.FC<Props> = ({
  height = 900,
  screenText = "REVA",
  screenColor = C.leaf,
  screenPop = 1,
  glowPlastic = 0,
  glowGlass = 0,
  style,
}) => {
  const ring = (cy: number, color: string, glow: number, label: string) => (
    <g>
      <circle cx={150} cy={cy} r={60} fill={color} opacity={glow * 0.85} filter="url(#machineBlur)" />
      <circle cx={150} cy={cy} r={48} fill="none" stroke={color} strokeWidth={10} opacity={0.4 + glow * 0.6} />
      <circle cx={150} cy={cy} r={34} fill={C.ink} />
      <rect x={124} y={cy - 6} width={52} height={12} rx={6} fill="#000" opacity={0.6} />
      <text x={150} y={cy + 74} textAnchor="middle" fontFamily={inter} fontWeight={800} fontSize={20} letterSpacing={3} fill={color}>
        {label}
      </text>
    </g>
  );

  return (
    <svg
      width={(height * 300) / 640}
      height={height}
      viewBox="0 0 300 640"
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <filter id="machineBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={14} />
        </filter>
      </defs>
      <ellipse cx={150} cy={630} rx={150} ry={14} fill={C.ink} opacity={0.4} />
      {/* cuerpo */}
      <rect x={20} y={14} width={260} height={612} rx={30} fill={C.forest} stroke={C.white} strokeWidth={7} />
      <rect x={36} y={30} width={18} height={580} rx={9} fill={C.white} opacity={0.08} />
      {/* encabezado con logo */}
      <g transform="translate(92 44)">
        <path d="M4 44 Q2 8 40 4 Q44 40 4 44 Z" fill={C.leaf} transform="scale(0.8)" />
        <text x={40} y={34} fontFamily={anton} fontSize={40} fill={C.white} letterSpacing={1}>
          REVA
        </text>
      </g>
      {/* pantalla */}
      <rect x={50} y={104} width={200} height={128} rx={16} fill={C.ink} stroke={screenColor} strokeWidth={3} strokeOpacity={0.6} />
      <g transform={`translate(150 168) scale(${0.6 + 0.4 * screenPop}) translate(-150 -168)`}>
        <text x={150} y={192} textAnchor="middle" fontFamily={anton} fontSize={70} fill={screenColor}>
          {screenText}
        </text>
      </g>
      {/* ranuras con aros de luz */}
      {ring(MACHINE_VIEW.plasticY, C.leaf, glowPlastic, "PLASTIC")}
      {ring(MACHINE_VIEW.glassY, C.glass, glowGlass, "GLASS")}
      {/* base */}
      <rect x={20} y={574} width={260} height={52} rx={0} fill={C.leaf} opacity={0.9} />
      <rect x={20} y={574} width={260} height={8} fill={C.white} opacity={0.4} />
    </svg>
  );
};
