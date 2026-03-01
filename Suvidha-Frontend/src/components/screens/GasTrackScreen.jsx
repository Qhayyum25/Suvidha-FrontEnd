// ── [GAS02] GAS TRACK / SUBSIDY SCREEN ───────────────────────────────────────
// Workflow: Select option → Enter Consumer + Mobile → View Results
import { useState } from "react";
import { T, FONTS } from "../../constants/theme";
import { SVC_THEME } from "../../constants/serviceThemes";
import { Rule } from "../shared/Rule";
import { Stamp } from "../shared/Stamp";
import { Spinner } from "../shared/Spinner";
import { ErrorBanner } from "../shared/ErrorBanner";
import { Field } from "../ui/Input";
import { mockAPI } from "../../utils/mockData";

const TRACK_OPTIONS = ["Track Complaint Status", "Check Subsidy Status"];

const MOCK_COMPLAINT = {
    complaintId: "GAS-COMP-789012",
    status: "Under Review",
    lastUpdated: "28 Feb 2026, 02:15 PM",
    type: "Delay in Delivery",
    estimatedResolution: "1 Mar 2026",
};

const MOCK_SUBSIDY = {
    subsidyLastCredited: "15 Feb 2026",
    subsidyAmount: "₹ 214.00",
    bankStatus: "Credited to A/C ****5678",
    scheme: "DBTL — PAHAL",
    totalCredits2026: "₹ 1,284.00",
};

export function GasTrackScreen({ t, onHome }) {
    const theme = SVC_THEME[1];
    const [option, setOption] = useState("");
    const [consumerNo, setConsumerNo] = useState("");
    const [mobile, setMobile] = useState("");
    const [result, setResult] = useState(null);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const handleSearch = async () => {
        const errs = {};
        if (!consumerNo.trim()) errs.consumerNo = "Consumer number is required";
        if (!mobile.trim() || mobile.length < 10) errs.mobile = "Valid mobile number required";
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ consumerNo, mobile, option }, { delay: 800 });
            setResult(option === TRACK_OPTIONS[0] ? MOCK_COMPLAINT : MOCK_SUBSIDY);
        } catch (e) {
            setApiError(e.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 22px", gap: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>
                    {t.gasActions?.[1] || "Track Status / Check Subsidy"}
                </div>
                <Stamp text="GAS" color={theme.color} />
            </div>
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSearch} />}

            {/* Option selector */}
            {!result && (
                <>
                    <div>
                        <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                            Select Service
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="radiogroup" aria-label="Service type">
                            {TRACK_OPTIONS.map((opt) => (
                                <button key={opt} onClick={() => setOption(opt)} role="radio" aria-checked={option === opt}
                                    style={{
                                        flex: 1, minWidth: 160, padding: "14px 18px", borderRadius: 8, textAlign: "center",
                                        border: `2px solid ${option === opt ? theme.color : T.rule}`,
                                        background: option === opt ? theme.bg : T.paper,
                                        fontFamily: FONTS.sans, fontSize: 14, fontWeight: option === opt ? 700 : 400,
                                        color: option === opt ? theme.color : T.inkMid,
                                        cursor: "pointer", transition: "all 0.2s",
                                        boxShadow: option === opt ? `0 4px 16px ${theme.color}22` : "none",
                                    }}
                                >
                                    <div style={{ fontSize: 22, marginBottom: 6 }}>{opt === TRACK_OPTIONS[0] ? "🔍" : "💰"}</div>
                                    {option === opt && "✓ "}{opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {option && (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                                <Field label="Consumer Number" placeholder="e.g. GAS-2024-56789"
                                    value={consumerNo} onChange={(e) => { setConsumerNo(e.target.value); setErrors({}); }}
                                    error={errors.consumerNo} name="consumerNo" />
                                <Field label="Registered Mobile Number" placeholder="10-digit mobile"
                                    value={mobile} onChange={(e) => { setMobile(e.target.value); setErrors({}); }}
                                    error={errors.mobile} type="tel" name="mobile" />
                            </div>
                            <button disabled={!consumerNo || !mobile || loading} onClick={handleSearch} aria-busy={loading}
                                style={{
                                    padding: "12px 0", borderRadius: 4, border: "none",
                                    background: consumerNo && mobile && !loading ? T.ink : T.rule,
                                    color: consumerNo && mobile && !loading ? "#fff" : T.inkLight,
                                    fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                                    cursor: consumerNo && mobile && !loading ? "pointer" : "default",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                }}
                            >
                                {loading ? <Spinner size={20} /> : "Search →"}
                            </button>
                        </>
                    )}
                </>
            )}

            {/* Results */}
            {result && option === TRACK_OPTIONS[0] && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{
                            background: T.ink, padding: "12px 20px",
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 15, color: "#fff" }}>Complaint Status</span>
                            <span style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 2, color: T.gold, fontWeight: 700 }}>
                                ● {result.status.toUpperCase()}
                            </span>
                        </div>
                        {[
                            ["Complaint ID", result.complaintId],
                            ["Type", result.type],
                            ["Status", result.status],
                            ["Last Updated", result.lastUpdated],
                            ["Est. Resolution", result.estimatedResolution],
                        ].map(([k, v]) => (
                            <div key={k} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "10px 20px", borderBottom: `1px solid ${T.rule}`,
                            }}>
                                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid }}>{k}</span>
                                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink }}>{v}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => { setResult(null); setOption(""); }}
                        style={{
                            padding: "11px 0", borderRadius: 4, border: `1px solid ${T.rule}`,
                            background: T.paper, fontFamily: FONTS.sans, fontSize: 15, fontWeight: 600,
                            color: T.inkMid, cursor: "pointer",
                        }}
                    >
                        ← Search Again
                    </button>
                </div>
            )}

            {result && option === TRACK_OPTIONS[1] && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ background: T.ink, padding: "12px 20px" }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 15, color: "#fff" }}>Subsidy Details</span>
                        </div>
                        {[
                            ["Scheme", result.scheme],
                            ["Last Credited", result.subsidyLastCredited],
                            ["Subsidy Amount", result.subsidyAmount],
                            ["Bank Status", result.bankStatus],
                            ["Total Credits (2026)", result.totalCredits2026],
                        ].map(([k, v]) => (
                            <div key={k} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "10px 20px", borderBottom: `1px solid ${T.rule}`,
                            }}>
                                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid }}>{k}</span>
                                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink, fontWeight: k.includes("Amount") || k.includes("Total") ? 700 : 400 }}>{v}</span>
                            </div>
                        ))}
                        <div style={{
                            padding: "12px 20px", background: T.greenLight,
                            borderTop: `2px solid ${T.green}`,
                            display: "flex", alignItems: "center", gap: 8,
                            fontFamily: FONTS.sans, fontSize: 13, color: T.green,
                        }}>
                            <span>✓</span> Subsidy active — last deposit verified
                        </div>
                    </div>
                    <button onClick={() => { setResult(null); setOption(""); }}
                        style={{
                            padding: "11px 0", borderRadius: 4, border: `1px solid ${T.rule}`,
                            background: T.paper, fontFamily: FONTS.sans, fontSize: 15, fontWeight: 600,
                            color: T.inkMid, cursor: "pointer",
                        }}
                    >
                        ← Search Again
                    </button>
                </div>
            )}
        </div>
    );
}
