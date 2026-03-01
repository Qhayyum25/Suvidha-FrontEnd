// ── [D] SHARED · ErrorBanner ──────────────────────────────────────────────────
// Red alert banner with retry button for API failure states.
import { T, FONTS } from "../../constants/theme";

export function ErrorBanner({ message, onRetry }) {
    return (
        <div
            role="alert"
            aria-live="assertive"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 18px",
                borderRadius: 4,
                border: `1.5px solid ${T.red}33`,
                background: T.redLight,
                animation: "fadeUp 0.3s ease",
            }}
        >
            <div style={{
                fontFamily: FONTS.sans, fontSize: 14, color: T.red,
                display: "flex", alignItems: "center", gap: 8,
            }}>
                <span style={{ fontSize: 18 }}>⚠️</span>
                {message || "Something went wrong. Please try again."}
            </div>
            {onRetry && (
                <button
                    onClick={onRetry}
                    aria-label="Retry"
                    style={{
                        padding: "8px 18px",
                        borderRadius: 4,
                        border: `1.5px solid ${T.red}`,
                        background: "#fff",
                        fontFamily: FONTS.sans,
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.red,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        transition: "all 0.15s",
                    }}
                >
                    ↻ Retry
                </button>
            )}
        </div>
    );
}
