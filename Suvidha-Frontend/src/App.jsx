// ── [P] APP ROOT — state machine + routing ────────────────────────────────────
import { useState } from "react";
import { T, FONTS } from "./constants/theme";
import { LANGS } from "./constants/languages";
import { getTransitionStyle } from "./constants/transitions";

// Layout
import { Header } from "./components/layout/Header";
import { NavBar } from "./components/layout/NavBar";
import { AlertTicker } from "./components/layout/AlertTicker";

// Screens
import { LandingScreen } from "./components/screens/LandingScreen";
import { LangScreen } from "./components/screens/LangScreen";
import { ServiceScreen } from "./components/screens/ServiceScreen";
import { ActionScreen } from "./components/screens/ActionScreen";
import { BillScreen } from "./components/screens/BillScreen";
import { ConnectionScreen } from "./components/screens/ConnectionScreen";
import { ComplaintScreen } from "./components/screens/ComplaintScreen";
import { TrackScreen } from "./components/screens/TrackScreen";

// Municipal screens
import { PropertyTaxScreen } from "./components/screens/PropertyTaxScreen";
import { CertificateScreen } from "./components/screens/CertificateScreen";
import { CivicComplaintScreen } from "./components/screens/CivicComplaintScreen";
import { TradeLicenseScreen } from "./components/screens/TradeLicenseScreen";

// Gas screening
import { BookCylinderScreen } from "./components/screens/BookCylinderScreen";

// Water screens
import { WaterTankerScreen } from "./components/screens/WaterTankerScreen";

export default function SUVIDHA() {
  const [lang, setLang] = useState("EN");
  const [screen, setScreen] = useState("landing");
  const [svcIdx, setSvcIdx] = useState(0);
  const [billStep, setBillStep] = useState("form");
  const [connId, setConnId] = useState("");

  const [history, setHistory] = useState([]);
  const [prevScreen, setPrevScreen] = useState("landing");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hideBack, setHideBack] = useState(false);

  // ── Accessibility state ────────────────────────────────────────────────────
  const [fontSize, setFontSize] = useState(100);   // % of base font
  const [highContrast, setHighContrast] = useState(false);

  const t = LANGS[lang];

  // ── Navigation helpers ─────────────────────────────────────────────────────
  const go = (s) => {
    if (s === screen) return;
    setPrevScreen(screen);
    setHistory((h) => [...h, screen]);
    setIsTransitioning(true);
    setTimeout(() => { setScreen(s); setIsTransitioning(false); }, 250);
  };

  const back = () => {
    setHideBack(false);
    if (screen === "bill") {
      const steps = ["form", "pay", "done"];
      const i = steps.indexOf(billStep);
      if (i > 0) { setBillStep(steps[i - 1]); return; }
    }
    const h = [...history];
    const prev = h.pop();
    setHistory(h);
    if (prev) {
      setPrevScreen(screen);
      setIsTransitioning(true);
      setTimeout(() => { setScreen(prev); setIsTransitioning(false); }, 250);
    }
  };

  const home = () => {
    setHideBack(false);
    setHistory([]); setScreen("landing");
    setBillStep("form"); setConnId("");
  };

  const showNav = screen !== "landing";
  const canBack = history.length > 0 || (screen === "bill" && billStep !== "form");

  // High contrast theme overrides
  const HC = highContrast ? {
    background: "#000",
    color: "#fff",
  } : {};

  return (
    <div
      lang={lang === "HI" || lang === "MR" ? "hi" : lang === "TE" ? "te" : "en"}
      dir={LANGS[lang]?.dir || "ltr"}
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        height: "100vh",
        maxHeight: "100vh",
        overflow: "hidden",
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: highContrast ? "#000" : "linear-gradient(165deg, #FFF9F2 0%, #FFF0E4 35%, #FFE8D6 70%, #FFDFC8 100%)",
        fontSize: `${fontSize}%`,
        ...HC,
      }}
    >
      {/* ── Global styles & keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600;700&family=Courier+Prime:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        html, body { overflow: hidden !important; position: fixed !important; width: 100% !important; height: 100% !important; touch-action: none; }
        button { transition: transform 0.1s, box-shadow 0.15s; }
        button:active { transform: scale(0.97); }
        button:focus-visible {
          outline: 3px solid ${highContrast ? "#fff" : "#E8530A"};
          outline-offset: 3px;
        }
        a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
          outline: 3px solid ${highContrast ? "#fff" : "#E8530A"};
          outline-offset: 2px;
        }
        input, textarea, select { box-sizing: border-box; width: 100%; }
        textarea { font-family: 'DM Sans', sans-serif; }
        @keyframes spinRing { to { transform: rotate(360deg); } }
        @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes stampIn  {
          0%   { transform: scale(0.3) rotate(-15deg); opacity:0; }
          80%  { transform: scale(1.05) rotate(2deg); }
          100% { transform: scale(1) rotate(0deg); opacity:1; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes burstRing {
          0%   { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        ${highContrast ? `
          * { border-color: #555 !important; }
          input, textarea { background: #111 !important; color: #fff !important; border: 2px solid #fff !important; }
        ` : ""}
      `}</style>

      {/* Skip to main — keyboard accessibility */}
      <a
        href="#main-content"
        style={{
          position: "absolute", top: -60, left: 16, zIndex: 9999,
          background: T.saffron, color: "#fff",
          padding: "10px 20px", borderRadius: 4,
          fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
          textDecoration: "none",
          transition: "top 0.2s",
        }}
        onFocus={(e) => { e.target.style.top = "8px"; }}
        onBlur={(e) => { e.target.style.top = "-60px"; }}
      >
        {t.skipToMain || "Skip to main content"}
      </a>

      <Header
        lang={lang} setLang={setLang}
        fontSize={fontSize} setFontSize={setFontSize}
        highContrast={highContrast} setHighContrast={setHighContrast}
      />

      {showNav && (
        <NavBar
          t={t} onBack={back} onHome={home} canBack={canBack && !hideBack}
          highContrast={highContrast}
        />
      )}

      {/* ── Main content with screen transition ── */}
      <main
        id="main-content"
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="false"
        style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", minHeight: 0 }}
      >
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", overflow: "hidden",
          ...getTransitionStyle(prevScreen, screen, isTransitioning),
        }}>
          {screen === "landing" && (
            <LandingScreen t={t} onStart={() => go("lang")} highContrast={highContrast} />
          )}
          {screen === "lang" && (
            <LangScreen current={lang} onSelect={(k) => { setLang(k); go("services"); }} t={t} highContrast={highContrast} />
          )}
          {screen === "services" && (
            <ServiceScreen t={t} onSelectService={(i) => { setSvcIdx(i); go("action"); }} highContrast={highContrast} />
          )}
          {screen === "action" && (
            <ActionScreen t={t} serviceIdx={svcIdx} highContrast={highContrast} onAction={(i) => {
              if (i === 0) { setBillStep("form"); go("bill"); }
              if (i === 1) go("connection");
              if (i === 2) go("complaint");
              if (i === 3) go("track");
            }} onMunicipalAction={(i) => {
              if (i === 0) go("propertyTax");
              if (i === 1) go("certificate");
              if (i === 2) go("civicComplaint");
              if (i === 3) go("tradeLicense");
            }} onGasAction={(i) => {
              if (i === 0) go("bookCylinder");
            }} onWaterAction={(i) => {
              if (i === 0) go("waterTanker");
            }} />
          )}
          {screen === "bill" && (
            <BillScreen t={t} serviceIdx={svcIdx}
              step={billStep} setStep={(s) => { setBillStep(s); if (s === "done") setHideBack(true); }}
              connId={connId} setConnId={setConnId}
              onHome={home}
            />
          )}
          {screen === "connection" && (
            <ConnectionScreen t={t} serviceIdx={svcIdx} onHome={home} onFinalStep={() => setHideBack(true)} />
          )}
          {screen === "complaint" && (
            <ComplaintScreen t={t} serviceIdx={svcIdx} onHome={home} onFinalStep={() => setHideBack(true)} />
          )}
          {screen === "track" && <TrackScreen t={t} />}
          {screen === "propertyTax" && <PropertyTaxScreen t={t} onHome={home} onFinalStep={() => setHideBack(true)} />}
          {screen === "certificate" && <CertificateScreen t={t} onHome={home} onFinalStep={() => setHideBack(true)} />}
          {screen === "civicComplaint" && <CivicComplaintScreen t={t} onHome={home} onFinalStep={() => setHideBack(true)} />}
          {screen === "tradeLicense" && <TradeLicenseScreen t={t} onHome={home} onFinalStep={() => setHideBack(true)} />}
          {screen === "bookCylinder" && <BookCylinderScreen t={t} onHome={home} onFinalStep={() => setHideBack(true)} />}
          {screen === "waterTanker" && <WaterTankerScreen t={t} onHome={home} onFinalStep={() => setHideBack(true)} />}
        </div>
      </main>

      <footer className="no-print" role="contentinfo">
        <AlertTicker alerts={t.alerts} highContrast={highContrast} />
      </footer>
    </div>
  );
}
