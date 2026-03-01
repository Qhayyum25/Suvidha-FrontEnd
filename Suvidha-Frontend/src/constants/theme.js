// ── [A] THEME ────────────────────────────────────────────────────────────────
// Edit these values to change the entire app's appearance

export const T = {
  cream:        "#FDF6EC",
  paper:        "#FFF9F2",
  saffron:      "#E8530A",
  saffronLight: "#FF7A35",
  saffronPale:  "#FFF0E8",
  ink:          "#1C0A00",
  inkMid:       "#5C3D2E",
  inkLight:     "#9C7B6E",
  gold:         "#C8951A",
  goldLight:    "#F5C842",
  green:        "#1A6B3C",
  greenLight:   "#F0FFF6",
  blue:         "#0A3D6B",
  red:          "#B91C1C",
  redLight:     "#FFF5F5",
  rule:         "#E8C4A0",
  ruleDark:     "#D4A87A",
};

export const FONTS = {
  serif:  "'Playfair Display', serif",
  sans:   "'DM Sans', sans-serif",
  mono:   "'Courier Prime', monospace",
};

// Service-specific colors
export const SERVICE_COLORS = {
  0: "#FF6B6B", // Electricity - Red
  1: "#FFA500", // Gas - Orange
  2: "#4A90E2", // Water - Blue
  3: "#50C878", // Municipal - Green
};

export const STATUS_COLORS = {
  0: T.blue,    // Received
  1: T.gold,    // Under Review
  2: T.saffron, // In Progress
  3: T.green,   // Resolved
};