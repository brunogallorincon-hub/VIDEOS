// ============================================================
//  REVA · tema visual
//  Cambia aquí los colores y las tipografías de los 3 videos.
// ============================================================
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const anton = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily;

export const inter = loadInter("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
}).fontFamily;

export const C = {
  forest: "#0D3B2E", // fondo principal
  leaf: "#5FD07A", // acento / plástico
  glass: "#8CC2EA", // vidrio
  white: "#F6F8F4",
  ink: "#0A1812",
  // tonos derivados (para escenarios)
  forestLight: "#15503F",
  forestDark: "#092C22",
  leafDark: "#3E9C5A",
  skin: "#D9A27A",
  pants: "#1E3530",
  gray: "#6E7A75",
};

// Formato 1080x1920 · zonas seguras de Instagram
export const W = 1080;
export const H = 1920;
export const SAFE_TOP = Math.round(H * 0.12); // 230 px libres arriba
export const SAFE_BOTTOM = Math.round(H * 0.8); // nada importante por debajo de 1536 px
