// ── [MC04] TRADE LICENSE SERVICES ─────────────────────────────────────────────
// Workflow: Select Service Type → Application Details → Submit → Success
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

const LICENSE_TYPES = ["Apply New License", "Renew License", "Track License"];

export function TradeLicenseScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[3];
    const [step, setStep] = useState(0); // 0=type, 1=form, 2=done
    const [licenseType, setLicenseType] = useState("");
    const [form, setForm] = useState({
        businessName: "", ownerName: "", businessCategory: "", businessAddress: "",
    });
    const [idProofUploaded, setIdProofUploaded] = useState(false);
    const ref = useRef(generateRefNumber("TRADE-MUNI"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const set = (k) => (e) => {
        setForm((f) => ({ ...f, [k]: e.target.value }));
        if (errors[k]) setErrors((prev) => ({ ...prev, [k]: null }));
    };

    const handleProceedToForm = () => {
        if (!licenseType) { setErrors({ licenseType: "Please select a service type" }); return; }
        setErrors({});
        setStep(1);
    };

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!form.businessName.trim()) errs.businessName = "Business name is required";
        if (!form.ownerName.trim()) errs.ownerName = "Owner name is required";
        if (!form.businessCategory.trim()) errs.businessCategory = "Category is required";
        const addrErr = validate("address", form.businessAddress);
        if (addrErr) errs.businessAddress = addrErr;
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ form, licenseType });
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
                icon="🪪"
                title="Application Submitted!"
                msg={`Your ${licenseType} request has been submitted. Inspection may be required. SLA: 10 working days.`}
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
                    {t.municipalActions?.[3] || "Trade License Services"}
                </div>
                <Stamp text="MUNI" color={theme.color} />
            </div>
            <StepBar current={step + 1} total={2} t={t} />
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={step === 0 ? handleProceedToForm : handleSubmit} />}

            {/* Step 0: Select service type */}
            {step === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
                    <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, textTransform: "uppercase" }}>
                        Select Service Type
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }} role="radiogroup" aria-label="License service type">
                        {LICENSE_TYPES.map((type) => (
                            <button
                                key={type}
                                onClick={() => { setLicenseType(type); setErrors({}); }}
                                role="radio"
                                aria-checked={licenseType === type}
                                style={{
                                    padding: "16px 20px", borderRadius: 8, textAlign: "left",
                                    border: `2px solid ${licenseType === type ? theme.color : T.rule}`,
                                    background: licenseType === type ? theme.bg : T.paper,
                                    fontFamily: FONTS.sans, fontSize: 15,
                                    fontWeight: licenseType === type ? 700 : 400,
                                    color: licenseType === type ? theme.color : T.inkMid,
                                    cursor: "pointer", transition: "all 0.2s",
                                    display: "flex", alignItems: "center", gap: 12,
                                    boxShadow: licenseType === type ? `0 4px 16px ${theme.color}22` : "none",
                                }}
                            >
                                <span style={{ fontSize: 22 }}>
                                    {type === "Apply New License" ? "📋" : type === "Renew License" ? "🔄" : "🔍"}
                                </span>
                                {licenseType === type && "✓ "}{type}
                            </button>
                        ))}
                    </div>
                    {errors.licenseType && (
                        <div role="alert" style={{ fontFamily: FONTS.sans, fontSize: 12, color: T.red, display: "flex", alignItems: "center", gap: 4 }}>
                            <span>⚠</span> {errors.licenseType}
                        </div>
                    )}
                    <button
                        disabled={!licenseType}
                        onClick={handleProceedToForm}
                        style={{
                            padding: "12px 0", borderRadius: 4, border: "none",
                            background: licenseType ? T.ink : T.rule,
                            color: licenseType ? "#fff" : T.inkLight,
                            fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                            cursor: licenseType ? "pointer" : "default", transition: "all 0.2s",
                        }}
                    >
                        Continue →
                    </button>
                </div>
            )}

            {/* Step 1: Application form */}
            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, minHeight: 0 }}>
                    <div style={{
                        background: theme.bg, border: `1px solid ${theme.border}`,
                        borderRadius: 4, padding: "7px 14px", flexShrink: 0,
                        fontFamily: FONTS.sans, fontSize: 13, color: theme.color,
                    }}>
                        📋 &nbsp;Service: <strong>{licenseType}</strong>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8, flexShrink: 0 }}>
                        <Field label="Business Name" placeholder="Registered business name"
                            value={form.businessName} onChange={set("businessName")}
                            error={attempted ? errors.businessName : null} name="businessName" />
                        <Field label="Owner Name" placeholder="Full name of proprietor"
                            value={form.ownerName} onChange={set("ownerName")}
                            error={attempted ? errors.ownerName : null} name="ownerName" />
                        <Field label="Business Category" placeholder="e.g. Retail, Manufacturing, Food"
                            value={form.businessCategory} onChange={set("businessCategory")}
                            error={attempted ? errors.businessCategory : null} name="businessCategory" />
                        <div style={{ gridColumn: "1 / -1" }}>
                            <Field label="Business Address" placeholder="Shop No., Street, Area, City"
                                value={form.businessAddress} onChange={set("businessAddress")}
                                error={attempted ? errors.businessAddress : null} name="businessAddress" />
                        </div>
                    </div>

                    <UploadTile
                        label="Identity Proof"
                        note="Aadhaar / PAN / Voter ID · JPG/PNG/PDF · Max 2MB"
                        uploaded={idProofUploaded}
                        onToggle={() => setIdProofUploaded(!idProofUploaded)}
                    />

                    {/* Application summary — compact */}
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden", flexShrink: 0 }}>
                        <div style={{ background: T.ink, padding: "7px 16px" }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 13, color: "#fff" }}>Application Summary</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
                            {[
                                ["Service", licenseType],
                                ["Business", form.businessName || "—"],
                                ["Owner", form.ownerName || "—"],
                                ["Category", form.businessCategory || "—"],
                                ["SLA", "10 working days"],
                            ].map(([k, v]) => (
                                <div key={k} style={{
                                    padding: "7px 14px", borderRight: `1px solid ${T.rule}`,
                                    display: "flex", flexDirection: "column", gap: 2,
                                }}>
                                    <span style={{ fontFamily: FONTS.sans, fontSize: 10, color: T.inkLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</span>
                                    <span style={{ fontFamily: FONTS.mono, fontSize: 12, color: T.ink }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

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
                        }}
                    >
                        {loading ? <Spinner size={20} /> : "Submit Application →"}
                    </button>
                </div>
            )}
        </div>
    );
}
