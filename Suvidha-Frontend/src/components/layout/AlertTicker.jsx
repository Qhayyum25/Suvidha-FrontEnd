// ── [E] ALERT TICKER ─────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { T, FONTS } from "../../constants/theme";

export function AlertTicker({ alerts, highContrast }) {
  const [idx, setIdx] = useState(0);
  const [vis, setVis] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx((i) => (i + 1) % alerts.length); setVis(true); }, 350);
    }, 5000);
    return () => clearInterval(id);
  }, [alerts.length]);

  return (
    <div
      role="marquee"
      aria-label="Live government alerts"
      aria-live="polite"
      style={{
        background: highContrast ? "#000" : T.ink,
        border: highContrast ? "1px solid #444" : "none",
        minHeight: 44, padding: "0 24px",
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}
    >
      <div style={{
        background: highContrast ? "#fff" : T.saffron,
        color: highContrast ? "#000" : "#fff",
        fontSize: 9, fontWeight: 700, letterSpacing: 2,
        fontFamily: FONTS.mono, padding: "3px 10px", borderRadius: 2, whiteSpace: "nowrap",
      }} aria-hidden="true">
        LIVE
      </div>

      <div style={{ width: 1, height: 22, background: highContrast ? "#444" : "#3C2A1E", flexShrink: 0 }} aria-hidden="true" />

      <div
        aria-atomic="true"
        style={{
          color: highContrast ? "#fff" : "#D4B8A8",
          fontSize: 13, fontFamily: FONTS.sans,
          opacity: vis ? 1 : 0, transition: "opacity 0.3s",
          flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}
      >
        📡 &nbsp;{alerts[idx]}
      </div>

      <div style={{ display: "flex", gap: 4, flexShrink: 0 }} aria-hidden="true">
        {alerts.map((_, i) => (
          <div key={i} style={{
            width: i === idx ? 16 : 4, height: 4, borderRadius: 2,
            background: i === idx ? (highContrast ? "#fff" : T.saffron) : (highContrast ? "#333" : "#3C2A1E"),
            transition: "width 0.4s",
          }} />
        ))}
      </div>
    </div>
  );
}
