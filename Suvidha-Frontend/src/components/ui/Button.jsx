// ── [UI] Button & SuccessCard ─────────────────────────────────────────────────
import { useState, useEffect, useRef } from "react";
import { T, FONTS } from "../../constants/theme";
import { Rule } from "../shared/Rule";
import { QRCode } from "../shared/QRCode";

// Generic pill/block button
export function Button({ children, onClick, variant = "primary", disabled = false, fullWidth = false, ariaLabel }) {
    const bg = {
        primary: T.ink,
        saffron: T.saffron,
        outline: T.paper,
        ghost: "transparent",
    }[variant];

    const color = variant === "outline" ? T.inkMid : "#fff";
    const border = variant === "outline" ? `1px solid ${T.rule}` : "none";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-label={ariaLabel}
            style={{
                width: fullWidth ? "100%" : undefined,
                padding: "13px 28px",
                borderRadius: 4,
                border,
                background: disabled ? T.rule : bg,
                color: disabled ? T.inkLight : color,
                fontFamily: FONTS.sans,
                fontSize: 14,
                fontWeight: 700,
                cursor: disabled ? "default" : "pointer",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                opacity: disabled ? 0.7 : 1,
            }}
        >
            {children}
        </button>
    );
}

// ── Countdown Ring SVG ───────────────────────────────────────────────────────
function CountdownRing({ seconds = 15, onComplete, size = 64 }) {
    const [remaining, setRemaining] = useState(seconds);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setRemaining((r) => {
                if (r <= 1) {
                    clearInterval(intervalRef.current);
                    onComplete?.();
                    return 0;
                }
                return r - 1;
            });
        }, 1000);
        return () => clearInterval(intervalRef.current);
    }, [onComplete]);

    const r = (size - 6) / 2;
    const circumference = 2 * Math.PI * r;
    const progress = (remaining / seconds) * circumference;

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={`Redirecting in ${remaining} seconds`}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}
        >
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background ring */}
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.rule} strokeWidth={3} />
                {/* Progress ring */}
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none"
                    stroke={T.green}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                {/* Seconds countdown */}
                <text
                    x={size / 2} y={size / 2}
                    textAnchor="middle" dominantBaseline="central"
                    style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700, fill: T.ink }}
                >
                    {remaining}
                </text>
            </svg>
        </div>
    );
}

// ── BurstRing Animation ──────────────────────────────────────────────────────
function BurstRings() {
    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        border: `2px solid ${T.green}`,
                        opacity: 0,
                        animation: `burstRing 1.2s ease-out ${i * 0.25}s forwards`,
                    }}
                />
            ))}
        </div>
    );
}

// Shared success card used by Bill, Connection, and Complaint flows
export function SuccessCard({ icon, title, msg, refLabel, refValue, onPrint, onHome, tHome }) {
    return (
        <div
            style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,               // tighter gap — was 20
                padding: "16px 24px",  // less padding — was 32px
                overflow: "hidden",
                minHeight: 0,
            }}
            className="success-card-printable"
        >
            {/* Animated success circle — smaller */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BurstRings />
                <div style={{
                    width: 80,           // was 120
                    height: 80,
                    borderRadius: "50%",
                    border: `3px solid ${T.green}`,
                    background: T.greenLight,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 0 8px ${T.greenLight}, 0 0 0 10px ${T.green}22`,
                    animation: "stampIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                    position: "relative",
                    zIndex: 1,
                }}>
                    <div style={{ fontSize: 34 }}>{icon}</div>  {/* was 50 */}
                </div>
            </div>

            {/* Title + message — compact */}
            <div style={{ textAlign: "center", flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 22, fontWeight: 700, color: T.ink }}>
                    {title}
                </div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: T.inkLight, marginTop: 4 }}>
                    {msg}
                </div>
            </div>

            <Rule color={T.rule} />

            {/* Ref number + QR side by side to save vertical space */}
            <div style={{
                display: "flex", alignItems: "center", gap: 20,
                flexShrink: 0, flexWrap: "wrap", justifyContent: "center",
            }}>
                {/* Reference box */}
                <div style={{
                    background: T.paper, border: `1px solid ${T.rule}`,
                    padding: "12px 28px", borderRadius: 4, textAlign: "center",
                }}>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 9, color: T.inkLight, letterSpacing: 2, marginBottom: 6 }}>
                        {refLabel.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 17, color: T.ink, fontWeight: 700, letterSpacing: 2 }}>
                        {refValue}
                    </div>
                </div>

                {/* QR Code — smaller */}
                <QRCode value={refValue} size={72} />  {/* was 100 */}
            </div>

            {/* Security + countdown in one row */}
            <div style={{
                display: "flex", alignItems: "center", gap: 20,
                flexShrink: 0,
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontFamily: FONTS.mono, fontSize: 9.5, color: T.green, letterSpacing: 0.5,
                }}>
                    <span>🔒</span> AES-256 encrypted · Receipt ID verified
                </div>
                <CountdownRing seconds={15} onComplete={onHome} size={48} />  {/* was 64 */}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }} className="no-print">
                {onPrint && (
                    <button
                        onClick={() => window.print()}
                        aria-label="Print receipt"
                        style={{
                            padding: "11px 20px", borderRadius: 4,
                            border: `1px solid ${T.rule}`, background: T.paper,
                            fontFamily: FONTS.sans, fontSize: 13, fontWeight: 600,
                            color: T.inkMid, cursor: "pointer",
                        }}
                    >
                        🖨️ &nbsp;Print
                    </button>
                )}
                <button
                    onClick={onHome}
                    aria-label={`Go to ${tHome || "Home"}`}
                    style={{
                        padding: "11px 28px", borderRadius: 4, border: "none",
                        background: T.ink, color: "#fff",
                        fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700,
                        cursor: "pointer", letterSpacing: 0.5,
                    }}
                >
                    🏠 {tHome}
                </button>
            </div>
        </div>
    );
}