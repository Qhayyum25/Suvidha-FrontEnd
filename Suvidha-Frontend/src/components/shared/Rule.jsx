// ── [D] SHARED ATOMS · Rule ───────────────────────────────────────────────────
import { T } from "../../constants/theme";

export function Rule({ color = T.rule }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", flexShrink: 0 }}>
            <div style={{ flex: 1, height: 1, background: color }} />
            <div style={{ width: 6, height: 6, background: color, transform: "rotate(45deg)", flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, background: color }} />
        </div>
    );
}
