// ── [F] HEADER — with Accessibility Toolbar ───────────────────────────────────
import { T, FONTS } from "../../constants/theme";
import { LANGS } from "../../constants/languages";
import { Clock } from "../shared/Clock";

export function Header({ lang, setLang, fontSize, setFontSize, highContrast, setHighContrast }) {
  const t = LANGS[lang];

  const adjustFont = (delta) => {
    setFontSize((f) => Math.min(130, Math.max(85, f + delta)));
  };

  return (
    <header
      role="banner"
      aria-label="SUVIDHA header"
      className="no-print"
      style={{
        background: highContrast ? "#000" : T.paper,
        borderBottom: `2px solid ${highContrast ? "#fff" : T.ink}`,
        padding: "0 20px",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Tricolor bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex" }}>
        <div style={{ flex: 1, background: "#FF6B00" }} />
        <div style={{ flex: 1, background: highContrast ? "#ccc" : "#FFFFFF" }} />
        <div style={{ flex: 1, background: "#138808" }} />
      </div>

      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, marginTop: 4 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            border: `2px solid ${highContrast ? "#fff" : T.saffron}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, background: highContrast ? "#111" : T.saffronPale,
          }} aria-hidden="true">🏛</div>
          <div>
            <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 900, color: highContrast ? "#fff" : T.ink, letterSpacing: 1 }}>
              SUVIDHA
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 7, color: highContrast ? "#ccc" : T.inkLight, letterSpacing: 2 }}>
              C-DAC · MeitY · SMART CITIES MISSION
            </div>
          </div>
        </div>

        {/* Right side: Language + Accessibility + Clock */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>

          {/* Language switcher */}
          <div role="group" aria-label={t.langSelectLabel || "Language selector"} style={{ display: "flex", gap: 4 }}>
            {Object.entries(LANGS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setLang(k)}
                aria-pressed={lang === k}
                aria-label={`${v.nativeLabel || v.label} — Switch language`}
                style={{
                  padding: "5px 10px", borderRadius: 2, minHeight: 36,
                  border: `1.5px solid ${lang === k ? (highContrast ? "#fff" : T.saffron) : (highContrast ? "#555" : T.rule)}`,
                  background: lang === k ? (highContrast ? "#fff" : T.saffron) : "transparent",
                  color: lang === k ? (highContrast ? "#000" : "#fff") : (highContrast ? "#ccc" : T.inkLight),
                  fontFamily: FONTS.sans, fontSize: 11, fontWeight: 700,
                  cursor: "pointer", letterSpacing: 1, transition: "all 0.15s",
                }}
              >
                {v.nativeLabel || v.label}
              </button>
            ))}
          </div>

          <div style={{ width: 1, height: 28, background: highContrast ? "#555" : T.rule }} aria-hidden="true" />

          <div style={{ width: 1, height: 28, background: highContrast ? "#555" : T.rule }} aria-hidden="true" />
          <Clock highContrast={highContrast} />
        </div>
      </div>
    </header>
  );
}
