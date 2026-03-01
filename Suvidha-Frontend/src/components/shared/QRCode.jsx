// ── [D] SHARED · QRCode ───────────────────────────────────────────────────────
// Deterministic SVG QR-like pattern derived from a reference string.
// Visual trust indicator — not a scannable QR code.
import { T, FONTS } from "../../constants/theme";

function hashChar(str, idx) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h + str.charCodeAt(i) + idx * 7) | 0;
    }
    return h;
}

export function QRCode({ value, size = 100, timestamp }) {
    const grid = 8;
    const cellSize = size / (grid + 2); // leave 1-cell quiet zone
    const cells = [];

    for (let r = 0; r < grid; r++) {
        for (let c = 0; c < grid; c++) {
            const h = hashChar(value || "", r * grid + c);
            if (h % 3 !== 0) {
                cells.push(
                    <rect
                        key={`${r}-${c}`}
                        x={(c + 1) * cellSize}
                        y={(r + 1) * cellSize}
                        width={cellSize - 1}
                        height={cellSize - 1}
                        rx={1}
                        fill={T.ink}
                    />
                );
            }
        }
    }

    // Corner finder patterns (3 corners)
    const finderPositions = [
        [1, 1],
        [1, grid - 2],
        [grid - 2, 1],
    ];
    const finders = finderPositions.map(([r, c], i) => (
        <g key={`finder-${i}`}>
            <rect
                x={(c) * cellSize}
                y={(r) * cellSize}
                width={cellSize * 3}
                height={cellSize * 3}
                rx={2}
                fill="none"
                stroke={T.ink}
                strokeWidth={2}
            />
            <rect
                x={(c + 0.75) * cellSize}
                y={(r + 0.75) * cellSize}
                width={cellSize * 1.5}
                height={cellSize * 1.5}
                rx={1}
                fill={T.ink}
            />
        </g>
    ));

    const ts = timestamp || new Date().toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ background: "#fff", borderRadius: 4, border: `1px solid ${T.rule}` }}
                role="img"
                aria-label={`QR pattern for ${value}`}
            >
                {cells}
                {finders}
            </svg>
            <div style={{
                fontFamily: FONTS.mono, fontSize: 9, color: T.inkLight,
                letterSpacing: 1, textAlign: "center",
            }}>
                {ts}
            </div>
        </div>
    );
}
