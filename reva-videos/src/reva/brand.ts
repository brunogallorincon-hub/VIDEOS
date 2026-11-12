// ============================================================
//  REVA · brand + facts
//  Single source for colors, fonts and REVA facts used by all 3 videos.
//  Do NOT add facts or numbers that aren't listed here.
// ============================================================
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ---------- Fonts ----------
export const anton = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
}).fontFamily; // headlines

export const inter = loadInter("normal", {
  weights: ["400", "600", "800"],
  subsets: ["latin"],
}).fontFamily; // body

// ---------- Colors (flat, no gradients on words) ----------
export const C = {
  forest: "#0D3B2E", // main background
  leaf: "#5FD07A", // accent · plastic · emphasized words
  glass: "#8CC2EA", // glass
  white: "#F6F8F4",
  ink: "#0A1812",
  // derived tints for scenery only
  forestLight: "#15503F",
  forestDark: "#092C22",
  leafDark: "#3E9C5A",
  skin: "#D9A27A",
  pants: "#1E3530",
  gray: "#6E7A75",
};

// ---------- Format · Instagram safe zones ----------
export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const SAFE_TOP = Math.round(H * 0.12); // keep top 12% clear (230 px)
export const SAFE_BOTTOM = Math.round(H * 0.8); // nothing important below 1536 px
// Side margin for captions and UI. 110 px (not just 60) so nothing gets cut when a
// phone/iPad player zooms the 9:16 video to fill a taller screen (~100 px lost per side).
export const SAFE_SIDE = 110;

// ---------- REVA facts ----------
export const REVA = {
  name: "REVA",
  what: "A recycling machine for a school project in Zacatecas, Mexico",
  slogan: "Recycle. Earn. Transform.",
  website: "https://claude.ai/artifact/2wpJ9LccYNjjLB8xveKSXL",
  // shown on screen without "https://"
  websiteShort: "claude.ai/artifact/2wpJ9LccYNjjLB8xveKSXL",
  pointsOnly: "Points only, never cash.",
  points: { plastic: 10, glass: 15 },
  rewards: [
    { pts: 100, reward: "Free coffee" },
    { pts: 150, reward: "10% off" },
    { pts: 200, reward: "Ice cream" },
    { pts: 300, reward: "2-for-1 movie" },
  ],
  machines: [
    "UAZ Siglo XXI",
    "Tec de Zacatecas",
    "Galerías",
    "Plaza Bicentenario",
    "Mercado González Ortega",
  ],
} as const;
