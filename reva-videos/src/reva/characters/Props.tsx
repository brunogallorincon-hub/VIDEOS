import React from "react";
import { C, anton } from "../brand";

// ---------- Bote de basura gris (viewBox 220 x 280) ----------
// lidAngle: grados que se abre la tapa (pivote a la izquierda).
export const TrashCan: React.FC<{ height?: number; lidAngle?: number; style?: React.CSSProperties }> = ({
  height = 520,
  lidAngle = 0,
  style,
}) => (
  <svg width={(height * 220) / 280} height={height} viewBox="0 0 220 280" style={{ overflow: "visible", ...style }}>
    <ellipse cx={110} cy={276} rx={100} ry={8} fill={C.ink} opacity={0.4} />
    {/* cuerpo */}
    <path d="M 22 52 L 198 52 L 182 272 Q 110 280 38 272 Z" fill="#7C8783" />
    {[62, 92, 128, 158].map((x) => (
      <path key={x} d={`M ${x} 72 L ${x + (x < 110 ? 4 : -4)} 252`} stroke="#5E6864" strokeWidth={9} strokeLinecap="round" />
    ))}
    <rect x={14} y={40} width={192} height={18} rx={8} fill="#646E6A" />
    {/* tapa */}
    <g transform={`rotate(${-lidAngle} 14 40)`}>
      <rect x={8} y={20} width={204} height={22} rx={10} fill="#8F9A96" />
      <rect x={88} y={6} width={44} height={16} rx={6} fill="#646E6A" />
    </g>
  </svg>
);

// ---------- Brazo + mano que rescata (en coordenadas del frame) ----------
// La manga es verde hoja (es Leo). `grip` 0 → 1 cierra los dedos.
export const RescueArm: React.FC<{
  from: { x: number; y: number };
  hand: { x: number; y: number };
  grip?: number;
}> = ({ from, hand, grip = 0 }) => {
  const angle = (Math.atan2(hand.y - from.y, hand.x - from.x) * 180) / Math.PI;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <line x1={from.x} y1={from.y} x2={hand.x} y2={hand.y} stroke={C.leaf} strokeWidth={84} strokeLinecap="round" />
      <line
        x1={hand.x - Math.cos((angle * Math.PI) / 180) * 70}
        y1={hand.y - Math.sin((angle * Math.PI) / 180) * 70}
        x2={hand.x - Math.cos((angle * Math.PI) / 180) * 50}
        y2={hand.y - Math.sin((angle * Math.PI) / 180) * 50}
        stroke={C.leafDark}
        strokeWidth={86}
      />
      <g transform={`translate(${hand.x} ${hand.y}) rotate(${angle})`}>
        {/* palma */}
        <ellipse cx={10} cy={0} rx={48} ry={42} fill={C.skin} />
        {/* dedos: se cierran con grip */}
        {[-26, -9, 8, 25].map((y, i) => (
          <rect
            key={i}
            x={40 - grip * 22}
            y={y - 8}
            width={44 - grip * 14}
            height={17}
            rx={8}
            fill={C.skin}
            stroke="#C08A63"
            strokeWidth={2}
          />
        ))}
        {/* pulgar */}
        <ellipse cx={20 - grip * 10} cy={42 - grip * 10} rx={14} ry={24} fill={C.skin} transform={`rotate(${-30 + grip * 30} 20 42)`} />
      </g>
    </svg>
  );
};

// ---------- Destello de 4 puntas ----------
export const Sparkle: React.FC<{ size: number; color?: string; style?: React.CSSProperties }> = ({
  size,
  color = C.white,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M20 0 Q22 18 40 20 Q22 22 20 40 Q18 22 0 20 Q18 18 20 0 Z" fill={color} />
  </svg>
);

// ---------- Íconos de recompensas (viewBox 120 x 120) ----------
export const CoffeeIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <path d="M 46 14 Q 40 22 46 30 M 62 10 Q 56 20 62 30 M 78 14 Q 72 22 78 30" stroke={C.white} strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
    <path d="M 26 40 L 94 40 L 86 106 Q 60 112 34 106 Z" fill={C.white} />
    <rect x={28} y={58} width={64} height={22} fill={C.leaf} />
    <path d="M 92 54 Q 112 56 106 74 Q 102 86 88 84" stroke={C.white} strokeWidth={8} fill="none" />
  </svg>
);

export const DiscountIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 120 120">
    <path d="M 20 30 L 66 18 L 108 60 L 60 108 L 18 66 Z" fill={C.glass} />
    <circle cx={42} cy={40} r={8} fill={C.ink} />
    <text x={66} y={80} textAnchor="middle" fontFamily={anton} fontSize={34} fill={C.ink} transform="rotate(-8 66 70)">
      10%
    </text>
  </svg>
);

export const TicketsIcon: React.FC<{ size: number }> = ({ size }) => {
  const ticket = (x: number, y: number, r: number, color: string) => (
    <g transform={`translate(${x} ${y}) rotate(${r})`}>
      <rect x={-40} y={-24} width={80} height={48} rx={6} fill={C.white} />
      <rect x={-40} y={-24} width={20} height={48} rx={5} fill={color} />
      <circle cx={-20} cy={-24} r={6} fill={C.ink} />
      <circle cx={-20} cy={24} r={6} fill={C.ink} />
      <text x={10} y={10} textAnchor="middle" fontFamily={anton} fontSize={28} fill={C.ink}>
        2x1
      </text>
    </g>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      {ticket(54, 46, -12, C.glass)}
      {ticket(66, 78, 8, C.leaf)}
    </svg>
  );
};
