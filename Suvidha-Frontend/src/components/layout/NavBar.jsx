// ── [G] NAV BAR ────────────────────────────────────────────────────────────────
import { T, FONTS } from "../../constants/theme";

export function NavBar({ t, onBack, onHome, canBack, highContrast }) {
  const hc = highContrast;
  return (
    <nav aria-label="Main navigation" style={{
      background: hc ? "#111" : T.paper,
      borderBottom: `1px solid ${hc ? "#444" : T.rule}`,
      padding: "6px 20px", display: "flex", alignItems: "center", gap: 12,
      flexShrink: 0,
    }}>
      {canBack ? (
        <button
          onClick={onBack}
          aria-label={t.back || "Go back"}
          style={{
            background: "none", border: `1px solid ${hc ? "#555" : T.rule}`, borderRadius: 3,
            padding: "8px 16px", minHeight: 40, minWidth: 80,
            fontFamily: FONTS.sans, fontSize: 13,
            color: hc ? "#fff" : T.inkMid, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 4,
          }}
        >
          ← {t.back}
        </button>
      ) : (
        <div style={{ width: 80 }} />
      )}

      <div style={{ flex: 1, height: 1, background: hc ? "#333" : T.rule }} aria-hidden="true" />

      <button
        onClick={onHome}
        aria-label={t.home || "Go home"}
        style={{
          background: "none",
          border: `1px solid ${hc ? "#555" : T.rule}`,
          borderRadius: 3,
          padding: "8px 16px", minHeight: 40, minWidth: 80,
          fontFamily: FONTS.sans, fontSize: 12,
          color: hc ? "#fff" : T.inkMid, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        🏠 {t.home}
      </button>
    </nav>
  );
}
