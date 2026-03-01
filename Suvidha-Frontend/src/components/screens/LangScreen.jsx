// ── [I] LANGUAGE SELECTION SCREEN ─────────────────────────────────────────────
// SUVIDHA 2026 · Touch kiosk — flex-fill layout, zero scrollbar
import { FONTS, T } from "../../constants/theme";

const LANG_META = {
  EN: {
    script: "English",
    region: "English",
    desc: "Select to continue in English",
    gradient: "linear-gradient(140deg, #1976D2 0%, #0A3D8C 55%, #052260 100%)",
    num: "01",
  },
  HI: {
    script: "हिन्दी",
    region: "Hindi",
    desc: "हिंदी में जारी रखने के लिए चुनें",
    gradient: "linear-gradient(140deg, #FF6B1A 0%, #E8530A 55%, #B83800 100%)",
    num: "02",
  },
  TE: {
    script: "తెలుగు",
    region: "Telugu",
    desc: "తెలుగులో కొనసాగించడానికి ఎంచుకోండి",
    gradient: "linear-gradient(140deg, #00897B 0%, #0A6B4B 55%, #024D36 100%)",
    num: "03",
  },
  MR: {
    script: "मराठी",
    region: "Marathi",
    desc: "मराठीत पुढे जाण्यासाठी निवडा",
    gradient: "linear-gradient(140deg, #8E24AA 0%, #6A0DAD 55%, #430080 100%)",
    num: "04",
  },
};

export function LangScreen({ current, onSelect, t, highContrast }) {
  return (
    <div style={{
      // Must fill parent exactly — no overflow
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 24px",
      gap: 12,
      overflow: "hidden",        // hard block on scroll
      minHeight: 0,              // critical — lets flex children shrink below content size
      background: highContrast ? "#111" : "transparent",  // inherits unified bg from App
      userSelect: "none",
      WebkitUserSelect: "none",
    }}>

      {/* ── Header — compact ── */}
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 4,
          color: highContrast ? "#aaa" : T.inkLight,
          marginBottom: 4, textTransform: "uppercase",
        }}>
          {t.selectLang}
        </div>
        <div style={{
          fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700,
          color: highContrast ? "#fff" : T.ink, marginBottom: 2,
        }}>
          भाषा चुनें · Choose Language
        </div>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 11,
          color: highContrast ? "#bbb" : T.inkLight,
        }}>
          భాష ఎంచుకోండి · भाषा निवडा
        </div>
      </div>

      {/* ── 2×2 Grid — takes all remaining space ── */}
      <div
        role="radiogroup"
        aria-label="Select language"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          // Rows grow to fill whatever height is left
          gridTemplateRows: "repeat(2, 1fr)",
          gap: 12,
          width: "100%",
          maxWidth: 700,
          // This is the key — grid fills available flex space
          flex: 1,
          minHeight: 0,          // lets it shrink, prevents overflow
        }}
      >
        {Object.entries(LANG_META).map(([k, meta]) => (
          <button
            key={k}
            role="radio"
            aria-checked={current === k}
            onClick={() => onSelect(k)}
            lang={k === "HI" || k === "MR" ? "hi" : k === "TE" ? "te" : "en"}
            style={{
              background: meta.gradient,
              border: "none",
              borderRadius: 18,
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              textAlign: "left",
              // No fixed height — fills grid cell
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              padding: 0,
              outline: "none",
              boxShadow: "0 5px 20px rgba(0,0,0,0.16)",
              transition: "transform 0.15s ease",
              WebkitTapHighlightColor: "rgba(255,255,255,0.18)",
              touchAction: "manipulation",
            }}
            onPointerDown={e => e.currentTarget.style.transform = "scale(0.96)"}
            onPointerUp={e => e.currentTarget.style.transform = "scale(1)"}
            onPointerLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* Dot texture */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }} />

            {/* Chakra watermark */}
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none"
              aria-hidden="true"
              style={{ position: "absolute", right: -14, bottom: -14, opacity: 0.10, pointerEvents: "none" }}>
              <circle cx="45" cy="45" r="42" stroke="white" strokeWidth="1.5" />
              <circle cx="45" cy="45" r="28" stroke="white" strokeWidth="1.2" />
              <circle cx="45" cy="45" r="5" fill="white" />
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i * 15 * Math.PI) / 180;
                return <line key={i}
                  x1={45 + 28 * Math.cos(a)} y1={45 + 28 * Math.sin(a)}
                  x2={45 + 42 * Math.cos(a)} y2={45 + 42 * Math.sin(a)}
                  stroke="white" strokeWidth="1" />;
              })}
            </svg>

            {/* Wave */}
            <svg viewBox="0 0 300 36" preserveAspectRatio="none" aria-hidden="true"
              style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: 32, pointerEvents: "none" }}>
              <path d="M0 18 Q75 4 150 16 Q225 28 300 12 L300 36 L0 36 Z" fill="white" opacity="0.08" />
            </svg>

            {/* Number pill */}
            <div style={{
              position: "absolute", top: 12, left: 12,
              background: "rgba(0,0,0,0.28)",
              border: "1px solid rgba(255,255,255,0.22)",
              borderRadius: 20, padding: "2px 9px",
              fontFamily: FONTS.mono, fontSize: 8.5, fontWeight: 700,
              letterSpacing: 2, color: "rgba(255,255,255,0.85)",
              zIndex: 3,
            }}>
              {meta.num}
            </div>

            {/* Content — flex column fills card */}
            <div style={{
              padding: "40px 20px 16px",
              display: "flex", flexDirection: "column",
              flex: 1, position: "relative", zIndex: 2,
              minHeight: 0,
            }}>

              {/* Native script */}
              <div style={{
                fontFamily: FONTS.serif,
                fontSize: "clamp(26px, 3.5vw, 40px)",  // scales with viewport
                fontWeight: 900,
                color: "#fff",
                lineHeight: 1.1,
                marginBottom: 4,
                textShadow: "0 2px 10px rgba(0,0,0,0.30)",
              }}>
                {meta.script}
              </div>

              {/* Region */}
              <div style={{
                fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 3.5,
                color: "rgba(255,255,255,0.60)", textTransform: "uppercase",
                marginBottom: 4,
              }}>
                {meta.region}
              </div>

              {/* Description */}
              <div style={{
                fontFamily: FONTS.sans, fontSize: 11,
                color: "rgba(255,255,255,0.70)", lineHeight: 1.4,
                flex: 1,
              }}>
                {meta.desc}
              </div>

              {/* CTA */}
              <div style={{
                marginTop: 10, paddingTop: 10,
                borderTop: "1px solid rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{
                  fontFamily: FONTS.mono, fontSize: 9, fontWeight: 700,
                  letterSpacing: 2.5, color: "rgba(255,255,255,0.72)",
                }}>
                  TOUCH TO SELECT
                </span>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.16)",
                  border: "1.5px solid rgba(255,255,255,0.28)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, color: "#fff", flexShrink: 0,
                }}>→</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        fontFamily: FONTS.mono, fontSize: 8.5,
        color: highContrast ? "#666" : T.inkLight,
        letterSpacing: 1.5, textAlign: "center",
        flexShrink: 0,
      }}>
        4 languages supported · 4 भाषाएं उपलब्ध · 4 భాషలు అందుబాటులో ఉన్నాయి · 4 भाषा उपलब्ध
      </div>
    </div>
  );
}
