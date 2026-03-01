// ── [GAS01] GAS COMPLAINT SCREEN ─────────────────────────────────────────────
// Workflow: Consumer Number + Mobile → Select Complaint Type → Description → Submit
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

const GAS_COMPLAINT_TYPES = [
    "Gas Leakage", "Delay in Delivery", "Incorrect Billing",
    "Subsidy Not Credited", "Damaged Cylinder", "Regulator Issue",
];

export function GasComplaintScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[1];
    const [done, setDone] = useState(false);
    const [consumerNo, setConsumerNo] = useState("");
    const [mobile, setMobile] = useState("");
    const [complaintType, setComplaintType] = useState("");
    const [desc, setDesc] = useState("");
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const ref = useRef(generateRefNumber("GAS-COMP"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!consumerNo.trim()) errs.consumerNo = "Consumer number is required";
        if (!mobile.trim() || mobile.length < 10) errs.mobile = "Valid 10-digit mobile number required";
        if (!complaintType) errs.complaintType = "Please select a complaint type";
        const descErr = validate("description", desc);
        if (descErr) errs.desc = descErr;
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ consumerNo, mobile, complaintType, desc });
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
                icon="🔥"
                title="Complaint Registered!"
                msg="Your gas complaint has been registered. Estimated resolution: 2 days. SMS confirmation sent."
                refLabel="Complaint ID"
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
                    {t.gasActions?.[0] || "File Gas Complaint"}
                </div>
                <Stamp text="GAS" color={theme.color} />
            </div>
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSubmit} />}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                <Field label="Consumer Number" placeholder="e.g. GAS-2024-56789"
                    value={consumerNo} onChange={(e) => { setConsumerNo(e.target.value); setErrors((p) => ({ ...p, consumerNo: null })); }}
                    error={attempted ? errors.consumerNo : null} name="consumerNo" />
                <Field label="Registered Mobile Number" placeholder="10-digit mobile number"
                    value={mobile} onChange={(e) => { setMobile(e.target.value); setErrors((p) => ({ ...p, mobile: null })); }}
                    error={attempted ? errors.mobile : null} type="tel" name="mobile" />
            </div>

            {/* Complaint type chips */}
            <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                    Complaint Type
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="radiogroup" aria-label="Complaint type">
                    {GAS_COMPLAINT_TYPES.map((ct) => (
                        <button key={ct}
                            onClick={() => { setComplaintType(ct); setErrors((e) => ({ ...e, complaintType: null })); }}
                            role="radio" aria-checked={complaintType === ct}
                            style={{
                                padding: "9px 16px", borderRadius: 4,
                                border: `1.5px solid ${complaintType === ct ? theme.color : T.rule}`,
                                background: complaintType === ct ? theme.bg : T.paper,
                                fontFamily: FONTS.sans, fontSize: 13,
                                fontWeight: complaintType === ct ? 700 : 400,
                                color: complaintType === ct ? theme.color : T.inkMid,
                                cursor: "pointer", transition: "all 0.15s",
                            }}
                        >
                            {complaintType === ct && "✓ "}{ct}
                        </button>
                    ))}
                </div>
                {attempted && errors.complaintType && (
                    <div role="alert" style={{ fontFamily: FONTS.sans, fontSize: 12, color: T.red, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                        <span>⚠</span> {errors.complaintType}
                    </div>
                )}
            </div>

            <Field label="Description" placeholder="Describe the issue in detail…"
                value={desc} onChange={(e) => { setDesc(e.target.value); setErrors((p) => ({ ...p, desc: null })); }}
                multiline error={attempted ? errors.desc : null} name="description" />

            <UploadTile label="Upload Photo (Optional)" note="Tap to upload · JPG/PNG · Max 2MB"
                uploaded={photoUploaded} onToggle={() => setPhotoUploaded(!photoUploaded)} />

            <button disabled={loading} onClick={handleSubmit} aria-busy={loading}
                style={{
                    padding: "12px 0", borderRadius: 4, border: "none", flexShrink: 0,
                    background: loading ? T.rule : T.saffron, color: loading ? T.inkLight : "#fff",
                    fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    boxShadow: loading ? "none" : `0 6px 20px ${T.saffron}44`,
                    letterSpacing: 0.5, transition: "all 0.2s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: "auto",
                }}
            >
                {loading ? <Spinner size={20} /> : "Submit Complaint →"}
            </button>
        </div>
    );
}
