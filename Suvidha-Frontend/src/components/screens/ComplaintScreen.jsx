// ── [N] COMPLAINT SCREEN ──────────────────────────────────────────────────────
// Single-step form: category chips, description, location, priority → success
// Features: per-field validation, mockAPI, loading/error states
import { useState, useRef } from "react";
import { T, FONTS } from "../../constants/theme";
import { SVC_THEME } from "../../constants/serviceThemes";
import { Rule } from "../shared/Rule";
import { Stamp } from "../shared/Stamp";
import { Spinner } from "../shared/Spinner";
import { ErrorBanner } from "../shared/ErrorBanner";
import { Field } from "../ui/Input";
import { UploadTile } from "../ui/Card";
import { SuccessCard } from "../ui/Button";
import { validate } from "../../utils/validators";
import { generateRefNumber } from "../../utils/formatters";
import { mockAPI } from "../../utils/mockData";

export function ComplaintScreen({ t, serviceIdx, onHome, onFinalStep }) {
    const theme = SVC_THEME[serviceIdx];
    const [done, setDone] = useState(false);
    const [selected, setSelected] = useState("");
    const [desc, setDesc] = useState("");
    const [location, setLocation] = useState("");
    const [priority, setPriority] = useState("normal");
    const ref = useRef(generateRefNumber("COMP-" + theme.stamp));

    // Validation & async state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!selected) errs.selected = "Please select a complaint type";
        const descErr = validate("description", desc);
        if (descErr) errs.desc = descErr;
        const addrErr = validate("address", location);
        if (addrErr) errs.location = addrErr;

        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ selected, desc, location, priority });
            setDone(true);
            if (onFinalStep) onFinalStep();
        } catch (e) {
            setApiError(e.error);
        } finally {
            setLoading(false);
        }
    };

    if (done) {
        return (
            <SuccessCard
                icon="📋"
                title={t.complaintSuccessTitle}
                msg={t.complaintSuccessMsg}
                refLabel={t.compNo}
                refValue={ref.current}
                onPrint={() => { }}
                onHome={onHome}
                tHome={t.home}
            />
        );
    }

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 22px", gap: 10, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>{t.complaintTitle}</div>
                <Stamp text={theme.stamp} color={theme.color} />
            </div>
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSubmit} />}

            {/* Complaint type chips */}
            <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                    {t.complaintType}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="radiogroup" aria-label={t.complaintType}>
                    {t.complaintTypes.map((ct) => (
                        <button
                            key={ct}
                            onClick={() => { setSelected(ct); setErrors((e) => ({ ...e, selected: null })); }}
                            role="radio"
                            aria-checked={selected === ct}
                            style={{
                                padding: "9px 18px", borderRadius: 2,
                                border: `1.5px solid ${selected === ct ? theme.color : T.rule}`,
                                background: selected === ct ? theme.bg : T.paper,
                                fontFamily: FONTS.sans, fontSize: 13,
                                fontWeight: selected === ct ? 700 : 400,
                                color: selected === ct ? theme.color : T.inkMid,
                                cursor: "pointer", transition: "all 0.15s",
                            }}
                        >
                            {selected === ct && "✓ "}{ct}
                        </button>
                    ))}
                </div>
                {attempted && errors.selected && (
                    <div role="alert" style={{
                        fontFamily: FONTS.sans, fontSize: 12, color: T.red, marginTop: 6,
                        display: "flex", alignItems: "center", gap: 4,
                    }}>
                        <span>⚠</span> {errors.selected}
                    </div>
                )}
            </div>

            <Rule color={T.rule} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Field label={t.descLabel} placeholder={t.descPh} value={desc}
                        onChange={(e) => { setDesc(e.target.value); setErrors((prev) => ({ ...prev, desc: null })); }}
                        multiline error={attempted ? errors.desc : null} name="description" />
                    <Field label={t.locationLabel} placeholder={t.locationPh} value={location}
                        onChange={(e) => { setLocation(e.target.value); setErrors((prev) => ({ ...prev, location: null })); }}
                        error={attempted ? errors.location : null} name="location" />
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Priority selector */}
                    <div>
                        <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                            Priority Level
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }} role="radiogroup" aria-label="Priority level">
                            {[
                                { v: "low", l: "🟢  Low — Can wait a few days", c: T.green },
                                { v: "normal", l: "🟡  Normal — Within 48 hours", c: T.gold },
                                { v: "high", l: "🔴  Urgent — Immediate attention", c: T.red },
                            ].map((p) => (
                                <button
                                    key={p.v}
                                    onClick={() => setPriority(p.v)}
                                    role="radio"
                                    aria-checked={priority === p.v}
                                    style={{
                                        padding: "12px 16px", borderRadius: 4, textAlign: "left",
                                        border: `1.5px solid ${priority === p.v ? p.c : T.rule}`,
                                        background: priority === p.v ? `${p.c}12` : T.paper,
                                        fontFamily: FONTS.sans, fontSize: 13,
                                        color: priority === p.v ? p.c : T.inkMid,
                                        cursor: "pointer", transition: "all 0.15s",
                                    }}
                                >
                                    {p.l}
                                </button>
                            ))}
                        </div>
                    </div>

                    <UploadTile
                        label="Attach Photo (optional)"
                        note="Tap to upload · JPG/PNG · Max 2MB"
                        uploaded={false}
                        onToggle={() => { }}
                    />
                </div>
            </div>

            <button
                disabled={loading}
                onClick={handleSubmit}
                aria-busy={loading}
                style={{
                    padding: "12px 0", borderRadius: 4, border: "none", flexShrink: 0,
                    background: loading ? T.rule : T.saffron,
                    color: loading ? T.inkLight : "#fff",
                    fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    boxShadow: loading ? "none" : `0 6px 20px ${T.saffron}44`,
                    letterSpacing: 0.5, transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
            >
                {loading ? <Spinner size={20} /> : t.submitComplaint}
            </button>
        </div>
    );
}
