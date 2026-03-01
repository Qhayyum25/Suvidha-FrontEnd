// ── [D] SHARED ATOMS · StepBar ────────────────────────────────────────────────
import { T, FONTS } from "../../constants/theme";

export function StepBar({ current, total, t }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        height: 4,
                        flex: 1,
                        borderRadius: 2,
                        background: i < current ? T.saffron : T.rule,
                        transition: "background 0.3s",
                    }}
                />
            ))}
            <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: T.inkLight, whiteSpace: "nowrap" }}>
                {t.step} {current}/{total}
            </span>
        </div>
    );
}
