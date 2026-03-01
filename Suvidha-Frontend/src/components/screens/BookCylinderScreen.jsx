// ── [GAS] BOOK CYLINDER REQUEST ───────────────────────────────────────────
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

export function BookCylinderScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[1];
    const [done, setDone] = useState(false);
    const [consumerNo, setConsumerNo] = useState("");
    const [mobile, setMobile] = useState("");
    const [quantity, setQuantity] = useState("1");
    const ref = useRef(generateRefNumber("GAS-BOOK"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!consumerNo.trim()) errs.consumerNo = "Consumer number is required";
        if (!mobile.trim() || mobile.length < 10) errs.mobile = "Valid 10-digit mobile number required";
        if (!quantity || parseInt(quantity) < 1) errs.quantity = "Enter quantity (min 1)";
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ consumerNo, mobile, quantity });
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
                icon="🛢️"
                title="LPG Cylinder Booked!"
                msg={`Your request for ${quantity} cylinder(s) has been placed. Estimated delivery: 1-2 days. SMS confirmation sent.`}
                refLabel="Booking Ref"
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
                    {t.bookCylinder || "Book LPG Cylinder"}
                </div>
                <Stamp text="GAS" color={theme.color} />
            </div>
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSubmit} />}

            <div style={{
                background: theme.bg, border: `1px solid ${theme.border}`,
                borderRadius: 4, padding: "10px 16px",
                fontFamily: FONTS.sans, fontSize: 13, color: theme.color,
            }}>
                🛢️ &nbsp;Standard LPG delivery takes 24-48 hours from booking confirmation.
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                <Field label="Consumer / LPGI Number" placeholder="e.g. 17-digit LPG ID"
                    value={consumerNo} onChange={(e) => { setConsumerNo(e.target.value); setErrors((p) => ({ ...p, consumerNo: null })); }}
                    error={attempted ? errors.consumerNo : null} name="consumerNo" />
                <Field label="Registered Mobile Number" placeholder="10-digit mobile number"
                    value={mobile} onChange={(e) => { setMobile(e.target.value); setErrors((p) => ({ ...p, mobile: null })); }}
                    error={attempted ? errors.mobile : null} type="tel" name="mobile" />
                <Field label="Quantity" placeholder="1"
                    value={quantity} onChange={(e) => { setQuantity(e.target.value); setErrors((p) => ({ ...p, quantity: null })); }}
                    error={attempted ? errors.quantity : null} type="number" name="quantity" />
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
                {loading ? <Spinner size={20} /> : "Book Now →"}
            </button>
        </div>
    );
}
