// ── [D] SHARED ATOMS · Clock ──────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { T, FONTS } from "../../constants/theme";

export function Clock({ highContrast }) {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const i = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(i);
    }, []);

    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-IN", {
        weekday: "short", day: "2-digit", month: "short", year: "numeric",
    }).toUpperCase();

    return (
        <div style={{ textAlign: "right", fontFamily: FONTS.mono }} aria-label={`Current time: ${timeStr}, ${dateStr}`}>
            <div style={{ fontSize: 18, fontWeight: 700, color: highContrast ? "#fff" : T.ink, letterSpacing: 2 }}>
                {timeStr}
            </div>
            <div style={{ fontSize: 10, color: highContrast ? "#bbb" : T.inkLight, letterSpacing: 1 }}>
                {dateStr}
            </div>
        </div>
    );
}
