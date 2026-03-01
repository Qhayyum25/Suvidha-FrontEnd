// ── [M] NEW CONNECTION SCREEN ─────────────────────────────────────────────────
// 3-step wizard: Personal Details → Documents → Submit
// Features: per-field validation, stateful connection type, mockAPI, loading/error
import { useState, useRef, useEffect } from "react";
import { T, FONTS } from "../../constants/theme";
import { SVC_THEME } from "../../constants/serviceThemes";
import { StepBar } from "../shared/StepBar";
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

export function ConnectionScreen({ t, serviceIdx, onHome, onFinalStep }) {
    const theme = SVC_THEME[serviceIdx];
    const [step, setStep] = useState(0); // 0 = details, 1 = docs, 2 = done
    const [form, setForm] = useState({ name: "", mobile: "", address: "", pin: "" });
    const [uploads, setUploads] = useState({ aadhaar: false, address: false, photo: false });
    const [connType, setConnType] = useState("");
    const ref = useRef(generateRefNumber("APP-" + theme.stamp));

    // Validation & async state
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
    };

    // Prevent page scroll when validation errors are displayed
    useEffect(() => {
        const prev = document.body.style.overflow;
        const hide = step === 2 || (attempted && Object.keys(errors).length > 0);
        if (hide) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = prev;
        }
        return () => { document.body.style.overflow = prev; };
    }, [attempted, errors, step]);

    const validateAll = () => {
        const errs = {};
        errs.name = validate("name", form.name);
        errs.mobile = validate("mobile", form.mobile);
        errs.address = validate("address", form.address);
        errs.pin = validate("pin", form.pin);
        if (!connType) errs.connType = "Please select a connection type";
        // Filter out nulls
        const filtered = {};
        Object.entries(errs).forEach(([k, v]) => { if (v) filtered[k] = v; });
        return filtered;
    };

    const handleProceedToDocs = async () => {
        setAttempted(true);
        const errs = validateAll();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ form, connType });
            setStep(1);
        } catch (e) {
            setApiError(e.error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ form, uploads, connType });
            setStep(2);
            if (onFinalStep) onFinalStep();
        } catch (e) {
            setApiError(e.error);
        } finally {
            setLoading(false);
        }
    };

    if (step === 2) {
        return (
            <SuccessCard
                icon="🔌"
                title={t.connSuccessTitle}
                msg={t.connSuccessMsg}
                refLabel={t.appNo}
                refValue={ref.current}
                onPrint={() => { }}
                onHome={onHome}
                tHome={t.home}
            />
        );
    }

    const CONN_TYPES = ["Residential", "Commercial", "Industrial"];

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 22px", gap: 10, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>{t.connTitle}</div>
                <Stamp text={theme.stamp} color={theme.color} />
            </div>

            <StepBar current={step + 1} total={2} t={t} />
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={() => {
                if (step === 0) handleProceedToDocs();
                else handleSubmit();
            }} />}

            {/* ── Step 0 : Personal Details ── */}
            {step === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
                        <Field label={t.fullName} placeholder={t.fullNamePh} value={form.name} onChange={set("name")}
                            error={attempted ? errors.name : null} name="name" />
                        <Field label={t.mobile} placeholder={t.mobilePh} value={form.mobile} onChange={set("mobile")}
                            type="tel" error={attempted ? errors.mobile : null} name="mobile" />
                        <div style={{ gridColumn: "1 / -1" }}>
                            <Field label={t.address} placeholder={t.addressPh} value={form.address} onChange={set("address")}
                                error={attempted ? errors.address : null} name="address" />
                        </div>
                        <Field label={t.pinCode} placeholder={t.pinCodePh} value={form.pin} onChange={set("pin")}
                            type="tel" error={attempted ? errors.pin : null} name="pin" />
                    </div>

                    {/* Connection type chips — stateful */}
                    <div>
                        <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                            Connection Type
                        </div>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} role="radiogroup" aria-label="Connection type">
                            {CONN_TYPES.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => { setConnType(type); setErrors((e) => ({ ...e, connType: null })); }}
                                    role="radio"
                                    aria-checked={connType === type}
                                    aria-pressed={connType === type}
                                    style={{
                                        padding: "8px 18px", borderRadius: 2,
                                        border: `1.5px solid ${connType === type ? theme.color : T.rule}`,
                                        background: connType === type ? theme.bg : T.paper,
                                        fontFamily: FONTS.sans, fontSize: 13,
                                        fontWeight: connType === type ? 700 : 400,
                                        color: connType === type ? theme.color : T.inkMid,
                                        cursor: "pointer", transition: "all 0.15s",
                                    }}
                                >
                                    {connType === type && "✓ "}{type}
                                </button>
                            ))}
                        </div>
                        {attempted && errors.connType && (
                            <div role="alert" style={{
                                fontFamily: FONTS.sans, fontSize: 12, color: T.red, marginTop: 6,
                                display: "flex", alignItems: "center", gap: 4,
                            }}>
                                <span>⚠</span> {errors.connType}
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: "auto" }}>
                        <button
                            disabled={loading}
                            onClick={handleProceedToDocs}
                            aria-busy={loading}
                            style={{
                                width: "100%", padding: "12px 0", borderRadius: 4, border: "none",
                                background: loading ? T.rule : T.ink,
                                color: loading ? T.inkLight : "#fff",
                                fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                                cursor: loading ? "default" : "pointer", transition: "all 0.2s",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            }}
                        >
                            {loading ? <Spinner size={20} /> : t.proceed}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Step 1 : Documents ── */}
            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{
                        background: T.saffronPale, border: `1px solid ${T.rule}`,
                        borderRadius: 4, padding: "12px 16px",
                        fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid, lineHeight: 1.5,
                    }}>
                        📋 &nbsp;Please keep digital copies of your documents ready.
                        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: T.green, marginLeft: 8 }}>
                            🔒 All documents are AES-256 encrypted
                        </span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                        <UploadTile label={t.uploadAadhaar} note={t.uploadNote} uploaded={uploads.aadhaar}
                            onToggle={() => setUploads((u) => ({ ...u, aadhaar: !u.aadhaar }))} />
                        <UploadTile label={t.uploadAddress} note={t.uploadNote} uploaded={uploads.address}
                            onToggle={() => setUploads((u) => ({ ...u, address: !u.address }))} />
                        <UploadTile label={t.uploadPhoto} note={t.uploadNote} uploaded={uploads.photo}
                            onToggle={() => setUploads((u) => ({ ...u, photo: !u.photo }))} />
                    </div>

                    {/* Application summary — includes connection type */}
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ background: T.ink, padding: "10px 18px" }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 14, color: "#fff" }}>Application Summary</span>
                        </div>
                        {[
                            ["Name", form.name],
                            ["Mobile", form.mobile],
                            ["PIN", form.pin],
                            ["Connection Type", connType || "—"],
                            ["Service", t.services[serviceIdx]],
                        ].map(([k, v]) => (
                            <div key={k} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "10px 18px", borderBottom: `1px solid ${T.rule}`,
                            }}>
                                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid }}>{k}</span>
                                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        aria-busy={loading}
                        style={{
                            padding: "12px 0", borderRadius: 4, border: "none",
                            background: loading ? T.rule : T.saffron, color: "#fff",
                            fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                            cursor: loading ? "default" : "pointer",
                            boxShadow: `0 6px 20px ${T.saffron}44`, letterSpacing: 0.5,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        }}
                    >
                        {loading ? <Spinner size={20} /> : t.submitConn}
                    </button>
                </div>
            )}
        </div>
    );
}
