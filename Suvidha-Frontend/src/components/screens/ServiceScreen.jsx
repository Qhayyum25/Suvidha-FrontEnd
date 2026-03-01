// ── [J] SERVICE GRID  +  [K] ACTION MENU ─────────────────────────────────────
// SUVIDHA Hackathon C-DAC 2026 · Hero-image cards — 90% image, crystal clear
import { useState } from "react";
import { T, FONTS } from "../../constants/theme";
import { SVC_THEME } from "../../constants/serviceThemes";
import electricityImg from "../../images/electricity.jpg";
import gasCylinderImg from "../../images/gas_cylinder.png";
import waterImg from "../../images/water.png";
import municipalImg from "../../images/municipal.png";

// Municipal-specific card images
import propertyTaxImg from "../../images/property_tax.png";
import certificateImg from "../../images/certificate.png";
import civicComplaintImg from "../../images/civic_complaint.png";
import tradeLicenseImg from "../../images/trade_license.png";

// Gas-specific card images
import gasComplaintImg from "../../images/gas_complaint.png";
import gasTrackImg from "../../images/gas_track.png";

// Water uses existing waterImg for cards

// ── CARD VISUAL CONFIG ─────────────────────────────────────────────────────────
const CARD_META = [
  {
    gradient: "linear-gradient(140deg, #FF6B1A 0%, #E8530A 55%, #B83800 100%)",
    // Only fades to card color in the BOTTOM 30% — rest of image is crystal clear
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 45%, rgba(184,56,0,0.85) 72%, #B83800 100%)",
    solidColor: "#B83800",
    glow: "0 20px 55px rgba(232,83,10,0.50)",
    badge: "VIDYUT",
    tag: "Energy",
    accentColor: "#FF8C42",
    svcIdx: 0,
    img: electricityImg,
    imgPosition: "center center",
  },
  {
    gradient: "linear-gradient(140deg, #1976D2 0%, #0A3D8C 55%, #052260 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 45%, rgba(5,34,96,0.85) 72%, #052260 100%)",
    solidColor: "#052260",
    glow: "0 20px 55px rgba(10,61,140,0.50)",
    badge: "INDHAN",
    tag: "Fuel",
    accentColor: "#64B5FF",
    svcIdx: 1,
    img: gasCylinderImg,
    imgPosition: "center 40%",
  },
  {
    gradient: "linear-gradient(140deg, #00897B 0%, #0A6B4B 55%, #024D36 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 45%, rgba(2,77,54,0.85) 72%, #024D36 100%)",
    solidColor: "#024D36",
    glow: "0 20px 55px rgba(10,107,75,0.50)",
    badge: "JAL",
    tag: "Water",
    accentColor: "#4DE8C8",
    svcIdx: 2,
    img: waterImg,
    imgPosition: "center center",
  },
  {
    gradient: "linear-gradient(140deg, #8E24AA 0%, #6A0DAD 55%, #430080 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(67,0,128,0.0) 0%, rgba(67,0,128,0.0) 45%, rgba(67,0,128,0.85) 72%, #430080 100%)",
    solidColor: "#430080",
    glow: "0 20px 55px rgba(106,13,173,0.50)",
    badge: "NAGAR",
    tag: "Civic",
    accentColor: "#CE93D8",
    svcIdx: 3,
    img: municipalImg,
    imgPosition: "center center",
  },
];

// ── DECORATIVE: Ashoka Chakra ──────────────────────────────────────────────────
function ChakraMotif({ size = 90, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90" fill="none"
      aria-hidden="true" style={{ pointerEvents: "none", ...style }}>
      <circle cx="45" cy="45" r="42" stroke="white" strokeWidth="1.5" />
      <circle cx="45" cy="45" r="28" stroke="white" strokeWidth="1.2" />
      <circle cx="45" cy="45" r="5" fill="white" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        return <line key={i} x1={45 + 28 * Math.cos(a)} y1={45 + 28 * Math.sin(a)} x2={45 + 42 * Math.cos(a)} y2={45 + 42 * Math.sin(a)} stroke="white" strokeWidth="1" />;
      })}
    </svg>
  );
}

// Civic SVG illustration
function CivicIllustration() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 280" fill="none" aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <rect width="320" height="280" fill="url(#civicG)" />
      <defs>
        <linearGradient id="civicG" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#5c0099" />
          <stop offset="100%" stopColor="#430080" />
        </linearGradient>
      </defs>
      {[30, 80, 130, 190, 250, 290, 55, 155, 215, 305].map((x, i) => (
        <circle key={i} cx={x} cy={[18, 38, 12, 25, 10, 42, 55, 6, 38, 22][i]} r={0.9} fill="white" opacity={0.55} />
      ))}
      {/* Clouds */}
      <ellipse cx="60" cy="50" rx="30" ry="12" fill="rgba(255,255,255,0.06)" />
      <ellipse cx="250" cy="38" rx="22" ry="9" fill="rgba(255,255,255,0.05)" />
      {/* Building */}
      <rect x="85" y="120" width="150" height="120" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      {/* Pillars */}
      {[100, 122, 144, 166, 188, 210].map((x, i) => (
        <rect key={i} x={x} y="120" width="10" height="120" rx="1" fill="rgba(255,255,255,0.12)" />
      ))}
      {/* Entablature */}
      <rect x="82" y="116" width="156" height="8" fill="rgba(255,255,255,0.18)" />
      {/* Dome */}
      <ellipse cx="160" cy="116" rx="58" ry="24" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.20)" strokeWidth="1.2" />
      <ellipse cx="160" cy="110" rx="38" ry="18" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <ellipse cx="160" cy="105" rx="20" ry="10" fill="rgba(255,255,255,0.07)" />
      {/* Flag */}
      <line x1="160" y1="50" x2="160" y2="105" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" />
      <rect x="160" y="50" width="22" height="13" rx="1.5" fill="rgba(255,255,255,0.38)" />
      {/* Steps */}
      <rect x="72" y="238" width="176" height="7" rx="1" fill="rgba(255,255,255,0.10)" />
      <rect x="80" y="231" width="160" height="7" rx="1" fill="rgba(255,255,255,0.09)" />
      <rect x="88" y="224" width="144" height="7" rx="1" fill="rgba(255,255,255,0.08)" />
      {/* Windows */}
      {[98, 130, 162, 194].map((x, i) => (
        <rect key={i} x={x} y="148" width="20" height="26" rx="2" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      ))}
      {/* Door */}
      <rect x="148" y="195" width="24" height="45" rx="3" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.20)" strokeWidth="1" />
      <circle cx="168" cy="220" r="2" fill="rgba(255,255,255,0.5)" />
    </svg>
  );
}

// ── SERVICE CARD ───────────────────────────────────────────────────────────────
function ServiceCard({ label, desc, onClick, index }) {
  const [hov, setHov] = useState(false);
  const meta = CARD_META[index];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`${label} — ${desc}`}
      style={{
        background: meta.gradient,
        border: "none",
        borderRadius: 22,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        minHeight: 340,
        boxShadow: hov
          ? meta.glow
          : "0 8px 32px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.10)",
        transform: hov ? "translateY(-10px) scale(1.022)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `svTileIn 0.5s ease both`,
        animationDelay: `${index * 0.1}s`,
        outline: "none",
        padding: 0,
      }}
    >

      {/* ── HERO IMAGE — 90% of card ───────────────────────── */}
      <div style={{
        position: "absolute",
        inset: 0,
        bottom: 0, // image covers full card height
      }}>
        {meta.img ? (
          <img
            src={meta.img}
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: meta.imgPosition,
              display: "block",
              // Enhance image clarity
              filter: hov
                ? "brightness(1.12) contrast(1.06) saturate(1.10)"
                : "brightness(1.05) contrast(1.04) saturate(1.05)",
              transform: hov ? "scale(1.07)" : "scale(1.02)",
              transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease",
            }}
          />
        ) : (
          <CivicIllustration />
        )}

        {/* Gradient that ONLY darkens the bottom 35% — rest is clear */}
        <div style={{
          position: "absolute", inset: 0,
          background: meta.imgOverlay,
          pointerEvents: "none",
        }} />

        {/* Very subtle vignette on edges only */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.18) 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* ── TOP BADGES — float over image ──────────────────── */}
      {/* Category pill — top left */}
      <div style={{
        position: "absolute", top: 14, left: 14,
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 20, padding: "4px 11px",
        fontFamily: FONTS.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2,
        color: "rgba(255,255,255,0.95)",
        zIndex: 3,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: meta.accentColor,
          boxShadow: `0 0 7px ${meta.accentColor}`,
          flexShrink: 0,
        }} />
        {meta.tag.toUpperCase()}
      </div>

      {/* Badge pill — top right */}
      <div style={{
        position: "absolute", top: 14, right: 14,
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 6, padding: "4px 11px",
        fontFamily: FONTS.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: 2.5,
        color: "rgba(255,255,255,0.95)",
        zIndex: 3,
      }}>
        {meta.badge}
      </div>

      {/* Chakra watermark — mid-right of image, very subtle */}
      <div style={{
        position: "absolute", right: -16, top: "28%",
        opacity: 0.10, pointerEvents: "none", zIndex: 2,
        transform: "translateY(-50%)",
      }}>
        <ChakraMotif size={100} />
      </div>

      {/* ── BOTTOM CONTENT STRIP — ~10% of card ──────────────── */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        padding: "14px 18px 16px",
        zIndex: 4,
        background: meta.gradient,
        // Dot texture
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.07) 1.2px, transparent 1.2px),
          ${meta.gradient}
        `,
        backgroundSize: "16px 16px, auto",
      }}>
        {/* Seamless blend — gradient from transparent to card color above the strip */}
        <div style={{
          position: "absolute",
          top: -60, left: 0, right: 0,
          height: 60,
          background: `linear-gradient(to bottom, transparent 0%, ${meta.solidColor} 100%)`,
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Service name */}
            <div style={{
              fontFamily: FONTS.serif, fontSize: 19, fontWeight: 800,
              color: "#fff", lineHeight: 1.2, marginBottom: 3,
              textShadow: "0 1px 6px rgba(0,0,0,0.30)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {label}
            </div>
            {/* Description */}
            <div style={{
              fontFamily: FONTS.sans, fontSize: 11,
              color: "rgba(255,255,255,0.75)", lineHeight: 1.5,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {desc}
            </div>
          </div>

          {/* Arrow CTA */}
          <div style={{
            flexShrink: 0, marginLeft: 14,
            width: 36, height: 36, borderRadius: "50%",
            background: hov ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.40)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#fff",
            transition: "all 0.25s ease",
            transform: hov ? "translateX(3px) scale(1.1)" : "scale(1)",
            boxShadow: hov ? `0 0 14px rgba(255,255,255,0.25)` : "none",
          }}>→</div>
        </div>

        {/* SELECT label */}
        <div style={{
          marginTop: 10, paddingTop: 9,
          borderTop: "1px solid rgba(255,255,255,0.18)",
          fontFamily: FONTS.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: 3.5, color: "rgba(255,255,255,0.80)",
        }}>
          SELECT
        </div>
      </div>
    </button>
  );
}

// ── SERVICE SCREEN ─────────────────────────────────────────────────────────────
export function ServiceScreen({ t, onSelectService }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "28px 28px", gap: 12, overflow: "hidden",
      background: "transparent",
    }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: 4,
            color: "#C8520A", marginBottom: 6, textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ display: "inline-block", width: 28, height: 2, background: "linear-gradient(90deg, #C8520A, #E8530A88)", borderRadius: 2 }} />
            Services
          </div>
          <div style={{ fontFamily: FONTS.serif, fontSize: 25, fontWeight: 800, color: "#1C0A00", lineHeight: 1.2 }}>
            {t.selectService}
          </div>
        </div>
        <div style={{
          background: "#1C0A00", color: "#FFF5E8",
          fontFamily: FONTS.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: 1.5,
          borderRadius: 20, padding: "5px 14px", opacity: 0.7, flexShrink: 0,
        }}>
          {t.services.length} SECTORS
        </div>
      </div>

      <div style={{ height: 2, background: "linear-gradient(90deg, #E8530A 0%, #C8951A 45%, transparent 100%)", borderRadius: 2, opacity: 0.38 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, flex: 1 }}>
        {t.services.map((s, i) => (
          <ServiceCard key={i} label={s} desc={t.serviceDesc[i]} index={i} onClick={() => onSelectService(i)} />
        ))}
      </div>

      <div style={{ textAlign: "center", fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 2.5, color: "#B0A090" }}>
        SUVIDHA · C-DAC 2026 · DIGITAL INDIA INITIATIVE
      </div>
    </div>
  );
}

// ── ACTION CARD CONFIG ─────────────────────────────────────────────────────────
function buildActionMeta() {
  return [
    {
      gradient: (c) => `linear-gradient(140deg, ${c}EE 0%, ${c}CC 50%, ${c}AA 100%)`,
      iconBg: "rgba(255,255,255,0.18)",
      label: "PAYMENT",
      svgIcon: (c) => (
        <svg width={46} height={46} viewBox="0 0 46 46" fill="none">
          <rect x="5" y="13" width="36" height="22" rx="4" fill="white" opacity="0.9" />
          <rect x="5" y="19" width="36" height="6" fill="white" opacity="0.35" />
          <rect x="10" y="27" width="12" height="3" rx="1.5" fill={c} />
          <circle cx="34" cy="28.5" r="3" fill={c} opacity="0.9" />
          <circle cx="38" cy="28.5" r="3" fill={c} opacity="0.5" />
        </svg>
      ),
    },
    {
      gradient: () => `linear-gradient(140deg, #1A5C2A 0%, #0F3D1C 55%, #082A12 100%)`,
      iconBg: "rgba(255,255,255,0.16)",
      label: "CONNECT",
      svgIcon: () => (
        <svg width={46} height={46} viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="18" fill="white" opacity="0.12" />
          <line x1="23" y1="10" x2="23" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="10" y1="23" x2="36" y2="23" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="23" cy="23" r="4" fill="white" opacity="0.9" />
        </svg>
      ),
    },
    {
      gradient: () => `linear-gradient(140deg, #B45309 0%, #92400E 55%, #6B2D05 100%)`,
      iconBg: "rgba(255,255,255,0.16)",
      label: "COMPLAINT",
      svgIcon: () => (
        <svg width={46} height={46} viewBox="0 0 46 46" fill="none">
          <rect x="10" y="7" width="26" height="32" rx="3" fill="white" opacity="0.15" stroke="white" strokeWidth="1.5" />
          <line x1="16" y1="16" x2="30" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="22" x2="30" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <line x1="16" y1="28" x2="24" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="33" cy="31" r="6" fill="white" opacity="0.9" />
          <text x="33" y="35" textAnchor="middle" style={{ fontSize: 9, fontWeight: 800, fill: "#92400E" }}>!</text>
        </svg>
      ),
    },
    {
      gradient: () => `linear-gradient(140deg, #1E40AF 0%, #1E3A8A 55%, #172554 100%)`,
      iconBg: "rgba(255,255,255,0.16)",
      label: "TRACK",
      svgIcon: () => (
        <svg width={46} height={46} viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="14" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
          <circle cx="23" cy="23" r="9" fill="none" stroke="white" strokeWidth="2" opacity="0.65" />
          <circle cx="23" cy="23" r="4" fill="white" opacity="0.9" />
          <line x1="29" y1="29" x2="36" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="36" cy="36" r="3" fill="white" opacity="0.7" />
        </svg>
      ),
    },
    {
      gradient: () => `linear-gradient(140deg, #4B5563 0%, #374151 55%, #1F2937 100%)`,
      iconBg: "rgba(255,255,255,0.16)",
      label: "SERVICE",
      svgIcon: () => (
        <svg width={46} height={46} viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="14" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
          <path d="M17 23 L21 27 L29 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];
}

// ── ACTION CARD ────────────────────────────────────────────────────────────────
function ActionCard({ label, actionIndex, themeIdx, onClick, index }) {
  const [hov, setHov] = useState(false);
  const theme = SVC_THEME[themeIdx] || SVC_THEME[0];
  const cards = buildActionMeta();
  const card = cards[actionIndex] || cards[0];
  const bg = card.gradient(theme.color);
  const glowColors = [theme.color, "#1A5C2A", "#B45309", "#1E40AF", "#374151"];
  const glow = `0 18px 48px ${glowColors[actionIndex] || theme.color}55`;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={label}
      style={{
        background: bg,
        border: "none",
        borderRadius: 18,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        minHeight: 220,
        boxShadow: hov ? glow : "0 5px 22px rgba(0,0,0,0.18)",
        transform: hov ? "translateY(-6px) scale(1.025)" : "translateY(0) scale(1)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `svTileIn 0.5s ease both`,
        animationDelay: `${index * 0.1}s`,
        outline: "none",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1.4px, transparent 1.4px)",
        backgroundSize: "18px 18px",
      }} />
      <ChakraMotif size={85} style={{ opacity: 0.13, position: "absolute", right: -14, top: -14 }} />
      <svg viewBox="0 0 300 48" preserveAspectRatio="none" aria-hidden="true"
        style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", height: 48, pointerEvents: "none" }}>
        <path d="M0 28 Q75 8 150 24 Q225 40 300 20 L300 48 L0 48 Z" fill="white" opacity="0.10" />
      </svg>

      <div style={{ padding: "24px 22px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.28)",
          borderRadius: 6, padding: "2px 9px",
          fontFamily: FONTS.mono, fontSize: 8, fontWeight: 700, letterSpacing: 3,
          color: "rgba(255,255,255,0.88)",
        }}>
          {card.label}
        </div>
        <div style={{
          display: "inline-flex", background: "rgba(255,255,255,0.15)", borderRadius: 30,
          padding: "3px 11px", fontFamily: FONTS.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: 1.8, color: "rgba(255,255,255,0.78)", marginBottom: 18, alignSelf: "flex-start",
        }}>
          0{index + 1}
        </div>
        <div style={{
          background: card.iconBg, border: "1.5px solid rgba(255,255,255,0.28)",
          borderRadius: 14, width: 62, height: 62,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, flexShrink: 0,
          boxShadow: hov ? "0 8px 20px rgba(0,0,0,0.3)" : "0 3px 10px rgba(0,0,0,0.2)",
          transition: "box-shadow 0.25s",
        }}>
          {card.svgIcon(theme.color)}
        </div>
        <div style={{
          fontFamily: FONTS.serif, fontSize: 20, fontWeight: 800,
          color: "#fff", lineHeight: 1.2, marginBottom: 8,
          textShadow: "0 2px 10px rgba(0,0,0,0.25)",
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: FONTS.sans, fontSize: 11.5,
          color: "rgba(255,255,255,0.7)", lineHeight: 1.6, flex: 1,
        }}>
          {ACTION_DESCS[actionIndex]}
        </div>
        <div style={{
          marginTop: 18, paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.20)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: FONTS.mono, fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "rgba(255,255,255,0.88)" }}>
            {index === 0 ? "START" : "OPEN"}
          </span>
          <span style={{
            width: 30, height: 30, borderRadius: "50%",
            background: "rgba(255,255,255,0.22)", border: "1.5px solid rgba(255,255,255,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff",
            animation: hov ? "svArrowBounce 0.65s ease infinite" : "none",
          }}>→</span>
        </div>
      </div>
    </button>
  );
}

const ACTION_DESCS = [
  "View dues & pay securely online",
  "Apply for a new service connection",
  "Report an issue or grievance",
  "Check status of your request",
];

// ── MUNICIPAL CARD CONFIG ──────────────────────────────────────────────────────
const MUNICIPAL_CARD_META = [
  {
    gradient: "linear-gradient(140deg, #6A1B9A 0%, #4A148C 55%, #311B92 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(49,27,146,0.85) 72%, #311B92 100%)",
    solidColor: "#311B92",
    glow: "0 18px 48px rgba(106,27,154,0.45)",
    accentColor: "#CE93D8",
    badge: "MC01",
    tag: "Tax",
    img: propertyTaxImg,
  },
  {
    gradient: "linear-gradient(140deg, #00695C 0%, #004D40 55%, #003329 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,51,41,0.85) 72%, #003329 100%)",
    solidColor: "#003329",
    glow: "0 18px 48px rgba(0,105,92,0.45)",
    accentColor: "#80CBC4",
    badge: "MC02",
    tag: "Certificate",
    img: certificateImg,
  },
  {
    gradient: "linear-gradient(140deg, #E65100 0%, #BF360C 55%, #8C1D00 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(140,29,0,0.85) 72%, #8C1D00 100%)",
    solidColor: "#8C1D00",
    glow: "0 18px 48px rgba(230,81,0,0.45)",
    accentColor: "#FFAB91",
    badge: "MC03",
    tag: "Civic",
    img: civicComplaintImg,
  },
  {
    gradient: "linear-gradient(140deg, #1565C0 0%, #0D47A1 55%, #0A2E6B 100%)",
    imgOverlay: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(10,46,107,0.85) 72%, #0A2E6B 100%)",
    solidColor: "#0A2E6B",
    glow: "0 18px 48px rgba(21,101,192,0.45)",
    accentColor: "#90CAF9",
    badge: "MC04",
    tag: "License",
    img: tradeLicenseImg,
  },
];

const MUNICIPAL_DESCS = [
  "Pay property tax, view arrears & penalties",
  "Apply for birth or death certificate",
  "Report potholes, street lights, garbage issues",
  "Apply, renew or track trade licenses",
];

// (Removed GAS_CARD_META and WATER_CARD_META as requested)


// ── DEPARTMENT CARD COMPONENT ─────────────────────────────────────────────────
function DeptCard({ label, desc, onClick, meta }) {
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      aria-label={`${label} — ${desc}`}
      style={{
        background: meta.gradient,
        border: "none",
        borderRadius: 18,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
        minHeight: 200,
        boxShadow: hov ? meta.glow : "0 5px 22px rgba(0,0,0,0.18)",
        transform: hov ? "translateY(-6px) scale(1.025)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        animation: `svTileIn 0.5s ease both`,
        animationDelay: `0s`,
        outline: "none",
        padding: 0,
      }}
    >
      {/* Hero image */}
      <div style={{
        position: "absolute", inset: 0, bottom: 0,
      }}>
        <img
          src={meta.img}
          alt=""
          aria-hidden="true"
          style={{
            width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center center",
            display: "block",
            filter: hov
              ? "brightness(1.10) contrast(1.06) saturate(1.08)"
              : "brightness(1.02) contrast(1.04) saturate(1.05)",
            transform: hov ? "scale(1.06)" : "scale(1.02)",
            transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.4s ease",
          }}
        />
        {/* Bottom gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: meta.imgOverlay,
          pointerEvents: "none",
        }} />
        {/* Subtle vignette */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.15) 100%)",
          pointerEvents: "none",
        }} />
      </div>

      {/* Category pill */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        display: "inline-flex", alignItems: "center", gap: 5,
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 20, padding: "4px 11px",
        fontFamily: FONTS.mono, fontSize: 9, fontWeight: 700, letterSpacing: 2,
        color: "rgba(255,255,255,0.95)", zIndex: 3,
      }}>
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: meta.accentColor, boxShadow: `0 0 7px ${meta.accentColor}`,
          flexShrink: 0,
        }} />
        {meta.tag.toUpperCase()}
      </div>

      {/* Badge */}
      <div style={{
        position: "absolute", top: 12, right: 12,
        background: "rgba(0,0,0,0.38)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 6, padding: "4px 11px",
        fontFamily: FONTS.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: 2.5,
        color: "rgba(255,255,255,0.95)", zIndex: 3,
      }}>
        {meta.badge}
      </div>

      {/* Bottom content strip */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "12px 16px 14px", zIndex: 4,
        background: meta.gradient,
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1.2px, transparent 1.2px), ${meta.gradient}`,
        backgroundSize: "16px 16px, auto",
      }}>
        {/* Seamless blend from image into strip */}
        <div style={{
          position: "absolute",
          top: -50, left: 0, right: 0, height: 50,
          background: `linear-gradient(to bottom, transparent 0%, ${meta.solidColor} 100%)`,
          pointerEvents: "none", zIndex: 0,
        }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 16, fontWeight: 800,
              color: "#fff", lineHeight: 1.2, marginBottom: 2,
              textShadow: "0 1px 6px rgba(0,0,0,0.30)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: FONTS.sans, fontSize: 10.5,
              color: "rgba(255,255,255,0.75)", lineHeight: 1.4,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {desc}
            </div>
          </div>
          <div style={{
            flexShrink: 0, marginLeft: 12,
            width: 32, height: 32, borderRadius: "50%",
            background: hov ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.18)",
            border: "1.5px solid rgba(255,255,255,0.40)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#fff",
            transition: "all 0.25s ease",
            transform: hov ? "translateX(3px) scale(1.1)" : "scale(1)",
          }}>→</div>
        </div>
      </div>
    </button>
  );
}

// ── ACTION SCREEN ──────────────────────────────────────────────────────────────
export function ActionScreen({ t, serviceIdx, onAction, onMunicipalAction, onGasAction, onWaterAction }) {
  const theme = SVC_THEME[serviceIdx];
  const meta = CARD_META[serviceIdx];
  const isMunicipal = serviceIdx === 3;
  const isGas = serviceIdx === 1;
  const isWater = serviceIdx === 2;

  // Build the actions array
  let currentActions = [...t.actions];
  if (isGas) {
    currentActions.push(t.bookCylinder || "Book Cylinder");
  } else if (isWater) {
    currentActions.push(t.tankerRequest || "Tanker Water Request");
  }

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "28px 28px", gap: 10, overflow: "hidden",
      background: "transparent",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: meta.gradient,
        borderRadius: 16, padding: "0",
        position: "relative", overflow: "hidden",
        boxShadow: `0 8px 28px ${theme.color}33`,
        minHeight: 70,
      }}>
        {meta.img && (
          <img src={meta.img} alt="" aria-hidden="true" style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", objectPosition: "center 35%",
            filter: "brightness(0.42) saturate(0.7)",
          }} />
        )}
        {!meta.img && <div style={{ position: "absolute", inset: 0, background: meta.gradient }} />}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 22px", zIndex: 1, position: "relative" }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)", overflow: "hidden",
          }}>
            {meta.img
              ? <img src={meta.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <CivicIllustration />
            }
          </div>
          <div>
            <div style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: 20, padding: "2px 10px", marginBottom: 4,
              fontFamily: FONTS.mono, fontSize: 8.5, fontWeight: 700,
              letterSpacing: 2.5, color: "rgba(255,255,255,0.9)",
            }}>
              {meta.badge} · {meta.tag}
            </div>
            <div style={{
              fontFamily: FONTS.serif, fontSize: 22, fontWeight: 800,
              color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.2)", lineHeight: 1.15,
            }}>
              {t.services[serviceIdx]}
            </div>
          </div>
        </div>
      </div>

      {/* Actions section label */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ display: "inline-block", width: 24, height: 2, background: theme.color, borderRadius: 2, opacity: 0.6 }} />
        <span style={{ fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: 3, color: "#A09080", textTransform: "uppercase" }}>
          {isMunicipal ? "Municipal Services" : "Choose an Action"}
        </span>
      </div>

      {/* Municipal-specific cards OR generic action cards */}
      {isMunicipal ? (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`, gap: 10, flex: 1 }}>
          {(t.municipalActions || []).map((label, i) => (
            <DeptCard
              key={i}
              label={label}
              desc={MUNICIPAL_DESCS[i]}
              meta={MUNICIPAL_CARD_META[i]}
              onClick={() => onMunicipalAction && onMunicipalAction(i)}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, flex: 1 }}>
          {currentActions.map((a, i) => (
            <ActionCard key={i} label={a} actionIndex={i} themeIdx={serviceIdx} index={i} onClick={() => {
              if (i < 4) {
                onAction(i);
              } else {
                if (isGas) onGasAction(0);
                if (isWater) onWaterAction(0);
              }
            }} />
          ))}
        </div>
      )}
    </div>
  );
}