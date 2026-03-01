// ── [D] SHARED · Spinner ──────────────────────────────────────────────────────
// Inline SVG ring spinner for loading states on buttons and async operations.
import { T } from "../../constants/theme";

export function Spinner({ size = 22, color = "#fff", className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={{ animation: "spinRing 0.8s linear infinite", display: "inline-block", verticalAlign: "middle" }}
            role="status"
            aria-label="Loading"
            className={className}
        >
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="3" strokeOpacity="0.25" />
            <path
                d="M12 2 A10 10 0 0 1 22 12"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}
