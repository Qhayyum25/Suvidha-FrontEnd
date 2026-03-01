// ── [WATER01] TANKER WATER REQUEST ───────────────────────────────────────────
// Workflow: Connection + Mobile + Quantity + Date → Submit → Success
import { useState, useRef } from "react";
import { T, FONTS } from "../../constants/theme";
import { SVC_THEME } from "../../constants/serviceThemes";
import { Rule } from "../shared/Rule";
import { Stamp } from "../shared/Stamp";
import { Spinner } from "../shared/Spinner";
import { ErrorBanner } from "../shared/ErrorBanner";
import { Field } from "../ui/Input";
import { SuccessCard } from "../ui/Button";
import { generateRefNumber } from "../../utils/formatters";
import { mockAPI } from "../../utils/mockData";

export function WaterTankerScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[2];
    const [done, setDone] = useState(false);
    const [connNo, setConnNo] = useState("");
    const [mobile, setMobile] = useState("");
    const [quantity, setQuantity] = useState("");
    const [prefDate, setPrefDate] = useState("");
    const [landmark, setLandmark] = useState("");
    const [remarks, setRemarks] = useState("");
    const ref = useRef(generateRefNumber("WATER-TNK"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!connNo.trim()) errs.connNo = "Water connection number is required";
        if (!mobile.trim() || mobile.length < 10) errs.mobile = "Valid 10-digit mobile number required";
        if (!quantity || parseInt(quantity) < 1) errs.quantity = "Enter number of tankers (min 1)";
        if (!prefDate) errs.prefDate = "Preferred delivery date is required";
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ connNo, mobile, quantity, prefDate, landmark, remarks });
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
                icon="💧"
                title="Tanker Request Submitted!"
                msg="Your water tanker request has been submitted. Estimated delivery: 24-48 hours. SMS confirmation sent."
                refLabel="Request ID"
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
                    {t.waterActions?.[0] || "Tanker Water Request"}
                </div>
                <Stamp text="WATER" color={theme.color} />
            </div>
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSubmit} />}

            <div style={{
                background: theme.bg, border: `1px solid ${theme.border}`,
                borderRadius: 4, padding: "10px 16px",
                fontFamily: FONTS.sans, fontSize: 13, color: theme.color,
            }}>
                🚰 &nbsp;Water tanker delivery within 24-48 hours of request confirmation.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                <Field label="Water Connection Number" placeholder="e.g. WTR-2024-12345"
                    value={connNo} onChange={(e) => { setConnNo(e.target.value); setErrors((p) => ({ ...p, connNo: null })); }}
                    error={attempted ? errors.connNo : null} name="connNo" />
                <Field label="Registered Mobile Number" placeholder="10-digit mobile number"
                    value={mobile} onChange={(e) => { setMobile(e.target.value); setErrors((p) => ({ ...p, mobile: null })); }}
                    error={attempted ? errors.mobile : null} type="tel" name="mobile" />
                <Field label="Number of Tankers" placeholder="e.g. 2"
                    value={quantity} onChange={(e) => { setQuantity(e.target.value); setErrors((p) => ({ ...p, quantity: null })); }}
                    error={attempted ? errors.quantity : null} type="number" name="quantity" />
                <Field label="Preferred Delivery Date" placeholder="DD/MM/YYYY"
                    value={prefDate} onChange={(e) => { setPrefDate(e.target.value); setErrors((p) => ({ ...p, prefDate: null })); }}
                    error={attempted ? errors.prefDate : null} name="prefDate" />
                <Field label="Landmark (optional)" placeholder="Near school, temple, etc."
                    value={landmark} onChange={(e) => setLandmark(e.target.value)} name="landmark" />
                <Field label="Additional Remarks (optional)" placeholder="Any special instructions"
                    value={remarks} onChange={(e) => setRemarks(e.target.value)} name="remarks" />
            </div>

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
                {loading ? <Spinner size={20} /> : "Submit Request →"}
            </button>
        </div>
    );
}
