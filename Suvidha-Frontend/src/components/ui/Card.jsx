// ── [UI] UploadTile — document upload button ──────────────────────────────────
import { T, FONTS } from "../../constants/theme";

export function UploadTile({ label, note, uploaded, onToggle }) {
    return (
        <div
            onClick={onToggle}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
            role="button"
            tabIndex={0}
            aria-label={`${label} — ${uploaded ? "Uploaded" : "Not uploaded"}`}
            aria-checked={uploaded}
            style={{
                border: `2px dashed ${uploaded ? T.green : T.rule}`,
                borderRadius: 4,
                padding: "20px 16px",
                background: uploaded ? T.greenLight : T.paper,
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
            }}
        >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{uploaded ? "✅" : "📎"}</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 700, color: T.ink }}>{label}</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: T.inkLight, marginTop: 4 }}>{note}</div>
        </div>
    );
}
