// ============================================================
//  REVA · Identidad de marca
//  Cambia aquí colores, tipografía y textos por defecto.
//  (Los textos también se pueden editar en Remotion Studio,
//   en el panel de "Props" de cada composición.)
// ============================================================
import { loadFont as loadDisplay } from "@remotion/google-fonts/Outfit";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";

export const displayFont = loadDisplay("normal", {
  weights: ["400", "700", "900"],
  subsets: ["latin"],
}).fontFamily;

export const bodyFont = loadBody("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
}).fontFamily;

export const colors = {
  bg: "#07060F",
  bgSoft: "#12102A",
  primary: "#7C5CFF", // violeta eléctrico
  secondary: "#21D4FD", // cian
  accent: "#FF4FD8", // magenta
  text: "#FFFFFF",
  muted: "#A9A6C9",
};

export const gradient = `linear-gradient(120deg, ${colors.primary}, ${colors.secondary})`;
export const gradientHot = `linear-gradient(120deg, ${colors.accent}, ${colors.primary} 55%, ${colors.secondary})`;

export const BRAND_NAME = "REVA";
