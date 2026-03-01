// ── [D] SHARED ATOMS · RangoliCorner ─────────────────────────────────────────
import { T } from "../../constants/theme";

export function RangoliCorner({ color = T.saffron, size = 80, flip = false }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 80 80"
            style={{
                position: "absolute",
                ...(flip
                    ? { bottom: 0, right: 0, transform: "rotate(180deg)" }
                    : { top: 0, left: 0 }),
                opacity: 0.13,
                pointerEvents: "none",
            }}
        >
            <path d="M0 0 L40 0 L0 40 Z" fill={color} />
            <path d="M0 0 L20 0 L0 20 Z" fill={color} opacity="0.6" />
            <circle cx="40" cy="40" r="4" fill={color} />
            <circle cx="20" cy="20" r="2" fill={color} />
            <line x1="0" y1="60" x2="60" y2="0" stroke={color} strokeWidth="1" />
            <line x1="0" y1="40" x2="40" y2="0" stroke={color} strokeWidth="0.5" />
        </svg>
    );
}
