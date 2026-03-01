// ── [H] LANDING SCREEN ────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { T, FONTS } from "../../constants/theme";
import { LANGS } from "../../constants/languages";
import { RangoliCorner } from "../shared/RangoliCorner";
import { Rule } from "../shared/Rule";
import Logo from "../../images/logo.webp";

const LANG_KEYS = Object.keys(LANGS); // ["EN", "HI", "TE"]

export function LandingScreen({ t, onStart }) {
  // Blink tick for the touch-prompt background pulse
  const [tick, setTick] = useState(0);
  // Index into LANG_KEYS for the cycling display language
  const [langIdx, setLangIdx] = useState(0);
  // Controls fade-out / fade-in opacity
  const [visible, setVisible] = useState(true);

  // Touch-prompt blink every 800ms
  useEffect(() => {
    const i = setInterval(() => setTick((n) => n + 1), 800);
    return () => clearInterval(i);
  }, []);

  // Language cycle every 5s — fade out → swap → fade in
  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setLangIdx((i) => (i + 1) % LANG_KEYS.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  // Text from the currently cycling language
  const cycleT = LANGS[LANG_KEYS[langIdx]];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onStart();
    }
  };

  return (
    <div
      onClick={onStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={t.touch || "Touch anywhere to begin"}
      aria-describedby="landing-desc"
      style={{
        flex: 1,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        position: "relative",
        background: "transparent",
        outline: "none",
      }}
    >
      <RangoliCorner color={T.saffron} size={120} />
      <RangoliCorner color={T.saffron} size={120} flip />
      <RangoliCorner color={T.gold} size={60} />

      {/* Govt seal */}
      <div style={{
        width: 140, height: 140, borderRadius: "50%",
        border: `3px solid ${T.saffron}`, background: T.paper,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        marginBottom: 32, position: "relative",
        boxShadow: `0 0 0 8px ${T.saffron}18, 0 8px 40px ${T.saffron}22`,
      }}>
        <div style={{
          position: "absolute", inset: -12, borderRadius: "50%",
          border: `2px dashed ${T.saffron}44`, animation: "spinRing 30s linear infinite",
        }} />
        <img
          src={Logo}
          alt="SUVIDHA logo"
          style={{ width: "3.5rem", height: "3.5rem", objectFit: "cover", borderRadius: "50%" }}
        />
        <div style={{ fontSize: 8, letterSpacing: 2, color: T.saffron, fontFamily: FONTS.mono, fontWeight: 700, marginTop: 4 }}>
          C-DAC · MeitY
        </div>
      </div>

      {/* ── Title — fades + changes in sync with content every 5s ── */}
      <div style={{
        fontFamily: FONTS.serif,
        fontSize: "clamp(52px,10vw,88px)",
        fontWeight: 900,
        color: T.saffron,
        letterSpacing: -2,
        lineHeight: 0.95,
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
      }}>
        {cycleT.welcome}
      </div>

      <div style={{ margin: "16px 0", width: "100%", maxWidth: 400 }}>
        <Rule color={T.rule} />
      </div>

      {/* ── Cycling text block ── */}
      <div style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        {/* Sub-heading */}
        <div style={{
          fontFamily: FONTS.serif, fontSize: "clamp(13px,2vw,16px)",
          color: T.inkMid, textAlign: "center", maxWidth: 400, lineHeight: 1.5,
          fontWeight: 600,
        }}>
          {cycleT.sub}
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily: FONTS.sans, fontSize: "clamp(11px,1.6vw,13px)",
          color: T.inkLight, textAlign: "center", maxWidth: 400, lineHeight: 1.6,
          letterSpacing: 0.3,
        }}>
          {cycleT.tagline}
        </div>
      </div>

      <div style={{ height: 28 }} />

      {/* Touch prompt — text cycles too */}
      <div style={{
        border: `1.5px solid ${T.saffron}`, padding: "16px 52px", borderRadius: 2,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
        background: tick % 2 === 0 ? T.saffronPale : T.paper, transition: "background 0.7s",
      }}>
        <div style={{ fontSize: 30, animation: "pulse 1.5s ease infinite" }}>👆</div>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 14, color: T.saffron, fontWeight: 700, letterSpacing: 1,
          opacity: visible ? 1 : 0, transition: "opacity 0.4s ease",
        }}>
          {cycleT.touch}
        </div>
      </div>

      {/* Language indicator dots */}
      <div style={{ display: "flex", gap: 6, marginTop: 20 }} role="tablist" aria-label="Language indicator">
        {LANG_KEYS.map((k, i) => (
          <div key={k} role="tab" aria-selected={i === langIdx} aria-label={k} style={{
            width: i === langIdx ? 20 : 6, height: 6, borderRadius: 3,
            background: i === langIdx ? T.saffron : T.rule,
            transition: "all 0.4s ease",
          }} />
        ))}
      </div>

      {/* Footer — security copy */}
      <div style={{
        position: "absolute", bottom: 18,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <div style={{
          display: "flex", gap: 10, alignItems: "center",
          fontFamily: FONTS.mono, fontSize: 9, color: T.inkLight, letterSpacing: 1,
        }}>
          <span>GOVT. OF INDIA</span>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: T.rule }} />
          <span>MEITY</span>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: T.rule }} />
          <span>SMART CITIES MISSION</span>
        </div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 9, color: T.green,
          letterSpacing: 0.5, opacity: 0.7,
        }}>
          🔒 256-bit TLS Secured Government Portal
        </div>
      </div>
    </div>
  );
}