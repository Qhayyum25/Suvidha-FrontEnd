// ── [D] SHARED ATOMS · Stamp ──────────────────────────────────────────────────
import { FONTS } from "../../constants/theme";

export function Stamp({ text, color }) {
    return (
        <div style={{
            border: `2px solid ${color}`, borderRadius: 4,
            padding: "2px 8px", fontSize: 9,
            fontFamily: FONTS.mono, color, letterSpacing: 3, fontWeight: 700, opacity: 0.75,
        }}>{text}</div>
    );
}
