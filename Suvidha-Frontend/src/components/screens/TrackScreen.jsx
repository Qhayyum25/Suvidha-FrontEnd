// ── [O] TRACK STATUS SCREEN ───────────────────────────────────────────────────
// Search by reference / application / complaint number → timeline view
// Features: async search via mockAPI, loading + error + not-found states
import { useState } from "react";
import { T, FONTS } from "../../constants/theme";
import { Rule } from "../shared/Rule";
import { Spinner } from "../shared/Spinner";
import { ErrorBanner } from "../shared/ErrorBanner";
import { mockAPI } from "../../utils/mockData";

// ── Mock data (replace with real API call) ────────────────────────────────────
const MOCK_RECORDS = {
    "SUVDH-2026-123456": {
        type: "Bill Payment", service: "Electricity", amount: "₹ 1,248.00",
        date: "18 Feb 2026", statusIdx: 3,
        timeline: [
            { label: "Payment Initiated", date: "18 Feb 2026, 10:32 AM", done: true },
            { label: "Bank Processing", date: "18 Feb 2026, 10:33 AM", done: true },
            { label: "Utility Updated", date: "18 Feb 2026, 10:45 AM", done: true },
            { label: "Receipt Generated", date: "18 Feb 2026, 10:46 AM", done: true },
        ],
    },
    "APP-ELEC-234567": {
        type: "New Connection", service: "Electricity", amount: "—",
        date: "15 Feb 2026", statusIdx: 2,
        timeline: [
            { label: "Application Received", date: "15 Feb 2026, 02:14 PM", done: true },
            { label: "Documents Verified", date: "16 Feb 2026, 11:00 AM", done: true },
            { label: "Field Visit Scheduled", date: "19 Feb 2026, 10:00 AM", done: true },
            { label: "Connection Established", date: "Expected 22 Feb 2026", done: false },
        ],
    },
    "COMP-WATER-987654": {
        type: "Complaint", service: "Water", amount: "—",
        date: "20 Feb 2026", statusIdx: 1,
        timeline: [
            { label: "Complaint Registered", date: "20 Feb 2026, 09:18 AM", done: true },
            { label: "Assigned to Team", date: "20 Feb 2026, 11:00 AM", done: true },
            { label: "Inspection Pending", date: "Expected 21 Feb 2026", done: false },
            { label: "Issue Resolved", date: "Pending", done: false },
        ],
    },
};

const STATUS_COLORS = [T.inkLight, T.gold, T.saffron, T.green];

export function TrackScreen({ t }) {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const search = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setApiError(null);
        setResult(null);
        setNotFound(false);
        try {
            const lookupKey = query.trim().toUpperCase();
            const record = MOCK_RECORDS[lookupKey];
            await mockAPI(record || null, { delay: 800, failRate: 0.1 });
            if (record) {
                setResult(record);
            } else {
                setNotFound(true);
            }
        } catch (e) {
            setApiError(e.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 22px", gap: 12, overflow: "hidden" }}>
            <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink, flexShrink: 0 }}>
                {t.trackTitle}
            </div>
            <Rule color={T.rule} />

            {/* Search bar */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && search()}
                    placeholder={t.trackPlaceholder}
                    aria-label={t.trackPlaceholder}
                    style={{
                        flex: 1, padding: "14px 18px", borderRadius: 4,
                        border: `1.5px solid ${T.rule}`, fontFamily: FONTS.mono,
                        fontSize: 15, color: T.ink, background: T.paper, outline: "none",
                        boxSizing: "border-box",
                    }}
                />
                <button
                    onClick={search}
                    disabled={loading}
                    aria-busy={loading}
                    aria-label="Search status"
                    style={{
                        padding: "14px 28px", borderRadius: 4, border: "none",
                        background: loading ? T.rule : T.ink, color: "#fff",
                        fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                        cursor: loading ? "default" : "pointer",
                        whiteSpace: "nowrap",
                        display: "flex", alignItems: "center", gap: 8,
                    }}
                >
                    {loading ? <Spinner size={18} /> : t.trackBtn}
                </button>
            </div>

            {/* Sample IDs hint */}
            <div style={{
                background: T.saffronPale, border: `1px solid ${T.rule}`,
                borderRadius: 4, padding: "10px 16px",
                fontFamily: FONTS.sans, fontSize: 12, color: T.inkMid, flexShrink: 0,
            }}>
                💡 &nbsp;Try:{" "}
                <span style={{ fontFamily: FONTS.mono, fontSize: 12 }}>SUVDH-2026-123456</span>
                &nbsp;or&nbsp;
                <span style={{ fontFamily: FONTS.mono, fontSize: 12 }}>APP-ELEC-234567</span>
                &nbsp;or&nbsp;
                <span style={{ fontFamily: FONTS.mono, fontSize: 12 }}>COMP-WATER-987654</span>
            </div>

            {/* Loading state */}
            {loading && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "40px 0", gap: 12,
                }} role="status" aria-live="polite">
                    <Spinner size={28} color={T.saffron} />
                    <span style={{ fontFamily: FONTS.sans, fontSize: 14, color: T.inkLight }}>
                        Searching records...
                    </span>
                </div>
            )}

            {/* Error */}
            {apiError && <ErrorBanner message={apiError} onRetry={search} />}

            {/* Not found */}
            {notFound && (
                <div style={{
                    padding: "16px 20px", borderRadius: 4,
                    border: `1.5px solid ${T.red}22`, background: T.redLight,
                    fontFamily: FONTS.sans, fontSize: 14, color: T.red, flexShrink: 0,
                }} role="alert">
                    ⚠️ &nbsp;{t.trackNotFound}
                </div>
            )}

            {/* Result */}
            {result && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }} aria-live="polite">
                    {/* Summary card */}
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                            background: T.ink, padding: "12px 20px",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 15, color: "#fff" }}>{result.type}</span>
                            <span style={{
                                fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 2,
                                color: STATUS_COLORS[result.statusIdx], fontWeight: 700,
                            }}>
                                ● {t.statuses[result.statusIdx].toUpperCase()}
                            </span>
                        </div>
                        {[
                            ["Service", result.service],
                            ["Date Filed", result.date],
                            ["Amount", result.amount],
                            ["Reference", query.toUpperCase()],
                        ].map(([k, v]) => (
                            <div key={k} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "11px 20px", borderBottom: `1px solid ${T.rule}`,
                            }}>
                                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid }}>{k}</span>
                                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink }}>{v}</span>
                            </div>
                        ))}

                        {/* Status progress bar */}
                        <div style={{ padding: "14px 20px", background: T.saffronPale }}>
                            <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                                {t.trackStatus}
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                                {t.statuses.map((s, i) => (
                                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                                        <div style={{
                                            height: 5, width: "100%", borderRadius: 3,
                                            background: i <= result.statusIdx ? STATUS_COLORS[result.statusIdx] : T.rule,
                                            transition: "background 0.3s",
                                        }} />
                                        <span style={{
                                            fontFamily: FONTS.sans, fontSize: 9,
                                            color: i <= result.statusIdx ? T.ink : T.inkLight,
                                            textAlign: "center", letterSpacing: 0.3,
                                        }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ background: T.ink, padding: "10px 20px" }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 14, color: "#fff" }}>{t.trackHistory}</span>
                        </div>
                        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
                            {result.timeline.map((ev, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, position: "relative" }}>
                                    {i < result.timeline.length - 1 && (
                                        <div style={{
                                            position: "absolute", left: 11, top: 26, width: 2, height: "calc(100% - 10px)",
                                            background: ev.done ? T.green : T.rule,
                                        }} />
                                    )}
                                    <div style={{
                                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                                        background: ev.done ? T.green : T.paper,
                                        border: `2px solid ${ev.done ? T.green : T.rule}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 11, color: ev.done ? "#fff" : T.inkLight, zIndex: 1,
                                    }}>
                                        {ev.done ? "✓" : "○"}
                                    </div>
                                    <div style={{ paddingBottom: 20 }}>
                                        <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: ev.done ? 700 : 400, color: ev.done ? T.ink : T.inkLight }}>
                                            {ev.label}
                                        </div>
                                        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: ev.done ? T.green : T.inkLight, marginTop: 2 }}>
                                            {ev.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
