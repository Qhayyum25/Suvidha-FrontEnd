// ── [MC02] BIRTH / DEATH CERTIFICATE APPLICATION ─────────────────────────────
// Workflow: Select Certificate Type → Fill Form → Submit → Success
import { useState, useRef } from "react";
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

export function CertificateScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[3];
    const [step, setStep] = useState(0); // 0=type, 1=form, 2=done
    const [certType, setCertType] = useState("");
    const [form, setForm] = useState({
        applicantName: "", dateOfEvent: "", placeOfEvent: "",
        parentDetails: "", address: "",
    });
    const [docUploaded, setDocUploaded] = useState(false);
    const ref = useRef(generateRefNumber("CERT-MUNI"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
    };

    const handleProceedToForm = () => {
        if (!certType) { setErrors({ certType: "Please select a certificate type" }); return; }
        setErrors({});
        setStep(1);
    };

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!form.applicantName.trim()) errs.applicantName = "Applicant name is required";
        if (!form.dateOfEvent) errs.dateOfEvent = "Date is required";
        if (!form.placeOfEvent.trim()) errs.placeOfEvent = "Place is required";
        if (!form.address.trim()) errs.address = "Address is required";
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ form, certType });
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
                icon="📜"
                title="Application Submitted!"
                msg={`Your ${certType} application has been sent to the municipal officer. SLA: 7 working days.`}
                refLabel="Application ID"
                refValue={ref.current}
                onPrint={() => { }}
                onHome={onHome}
                tHome={t.home}
            />
        );
    }

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 22px", gap: 10, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>
                    {t.municipalActions?.[1] || "Certificate Application"}
                </div>
                <Stamp text="MUNI" color={theme.color} />
            </div>
            <StepBar current={step + 1} total={2} t={t} />
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSubmit} />}

            {/* Step 0: Select certificate type */}
            {step === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, textTransform: "uppercase" }}>
                        Select Certificate Type
                    </div>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }} role="radiogroup" aria-label="Certificate type">
                        {["Birth Certificate", "Death Certificate"].map((type) => (
                            <button
                                key={type}
                                onClick={() => { setCertType(type); setErrors({}); }}
                                role="radio"
                                aria-checked={certType === type}
                                style={{
                                    flex: 1, minWidth: 140, padding: "20px 20px", borderRadius: 12, textAlign: "center",
                                    border: `2px solid ${certType === type ? theme.color : T.rule}`,
                                    background: certType === type ? theme.bg : T.paper,
                                    fontFamily: FONTS.sans, fontSize: 15, fontWeight: certType === type ? 700 : 400,
                                    color: certType === type ? theme.color : T.inkMid,
                                    cursor: "pointer", transition: "all 0.2s",
                                    boxShadow: certType === type ? `0 4px 16px ${theme.color}22` : "none",
                                }}
                            >
                                <div style={{ fontSize: 28, marginBottom: 8 }}>{type === "Birth Certificate" ? "👶" : "🕯️"}</div>
                                {certType === type && "✓ "}{type}
                            </button>
                        ))}
                    </div>
                    {errors.certType && (
                        <div role="alert" style={{ fontFamily: FONTS.sans, fontSize: 12, color: T.red, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>⚠</span> {errors.certType}
                        </div>
                    )}
                    <button
                        disabled={!certType}
                        onClick={handleProceedToForm}
                        style={{
                            padding: "12px 0", borderRadius: 4, border: "none",
                            background: certType ? T.ink : T.rule,
                            color: certType ? "#fff" : T.inkLight,
                            fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                            cursor: certType ? "pointer" : "default", transition: "all 0.2s",
                        }}
                    >
                        Continue →
                    </button>
                </div>
            )}

            {/* Step 1: Application form */}
            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{
                        background: theme.bg, border: `1px solid ${theme.border}`,
                        borderRadius: 4, padding: "10px 16px",
                        fontFamily: FONTS.sans, fontSize: 13, color: theme.color,
                    }}>
                        📋 &nbsp;Applying for: <strong>{certType}</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                        <Field label="Applicant Name" placeholder="Full name as per records" value={form.applicantName}
                            onChange={set("applicantName")} error={attempted ? errors.applicantName : null} name="applicantName" />
                        <Field label={certType === "Birth Certificate" ? "Date of Birth" : "Date of Death"}
                            placeholder="DD/MM/YYYY" value={form.dateOfEvent}
                            onChange={set("dateOfEvent")} error={attempted ? errors.dateOfEvent : null} name="dateOfEvent" />
                        <Field label="Place of Event" placeholder="Hospital / Location"
                            value={form.placeOfEvent} onChange={set("placeOfEvent")}
                            error={attempted ? errors.placeOfEvent : null} name="placeOfEvent" />
                        <Field label="Parent / Spouse Details (optional)" placeholder="Father / Mother / Spouse name"
                            value={form.parentDetails} onChange={set("parentDetails")} name="parentDetails" />
                        <div style={{ gridColumn: "1 / -1" }}>
                            <Field label="Address" placeholder="House No., Street, Area, City"
                                value={form.address} onChange={set("address")}
                                error={attempted ? errors.address : null} name="address" />
                        </div>
                    </div>

                    <UploadTile
                        label="Supporting Document"
                        note="Tap to upload · JPG/PNG/PDF · Max 2MB"
                        uploaded={docUploaded}
                        onToggle={() => setDocUploaded(!docUploaded)}
                    />

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        aria-busy={loading}
                        style={{
                            padding: "12px 0", borderRadius: 4, border: "none", flexShrink: 0,
                            background: loading ? T.rule : T.saffron, color: "#fff",
                            fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                            cursor: loading ? "default" : "pointer",
                            boxShadow: `0 6px 20px ${T.saffron}44`, letterSpacing: 0.5,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                            marginTop: "auto",
                        }}
                    >
                        {loading ? <Spinner size={20} /> : "Submit Application →"}
                    </button>
                </div>
            )}
        </div>
    );
}
