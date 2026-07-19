// Mirrors the @theme color tokens in styles/globals.css. Kept as plain hex
// here because SVG fill/stroke attributes inside recharts need real values,
// not CSS custom properties, for reliable rendering on older mobile WebViews.
export const CHART_COLORS = {
  accent: "#a3610f",
  accentDim: "#8a5209",
  danger: "#b23b2e",
  success: "#3f7a5c",
  ink: "#211c16",
  muted: "#746a5d",
  line: "#e7e2d9",
  surface: "#ffffff",
};
