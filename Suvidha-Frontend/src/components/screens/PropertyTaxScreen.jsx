// ── [MC01] PROPERTY TAX PAYMENT ──────────────────────────────────────────────
// Workflow: Enter Property ID + Mobile → View Tax Details → Payment → Success
import { useState, useRef } from "react";
import { T, FONTS } from "../../constants/theme";
import { SVC_THEME } from "../../constants/serviceThemes";
import { StepBar } from "../shared/StepBar";
import { Rule } from "../shared/Rule";
import { Stamp } from "../shared/Stamp";
import { Spinner } from "../shared/Spinner";
import { ErrorBanner } from "../shared/ErrorBanner";
import { Field } from "../ui/Input";
import { SuccessCard } from "../ui/Button";
import { generateRefNumber } from "../../utils/formatters";
import { mockAPI } from "../../utils/mockData";

export function PropertyTaxScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[3];
    const [step, setStep] = useState(0); // 0=form, 1=details, 2=payment, 3=done
    const [propertyId, setPropertyId] = useState("");
    const [mobile, setMobile] = useState("");
    const ref = useRef(generateRefNumber("PTAX-MUNI"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    const taxDetails = {
        ownerName: "Ramesh Kumar",
        propertyAddress: "H.No 12-3-456, Kukatpally, Hyderabad",
        financialYear: "2025-26",
        taxAmount: "₹ 8,500.00",
        arrears: "₹ 1,200.00",
        penalty: "₹ 0.00",
        totalPayable: "₹ 9,700.00",
    };

    const handleFetch = async () => {
        const errs = {};
        if (!propertyId.trim()) errs.propertyId = "Property ID is required";
        if (!mobile.trim() || mobile.length < 10) errs.mobile = "Valid mobile number required";
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ propertyId, mobile });
            setStep(1);
        } catch (e) {
            setApiError(e.error);
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async () => {
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ payment: true });
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
                icon="🏠"
                title={t.successTitle || "Payment Successful"}
                msg="Property tax payment has been recorded in municipal ledger"
                refLabel={t.refNo || "Reference Number"}
                refValue={ref.current}
                onPrint={() => { }}
                onHome={onHome}
                tHome={t.home}
            />
        );
    }

    return (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "14px 22px", gap: 10, overflow: "hidden", minHeight: 0 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
                <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>
                    {t.municipalActions?.[0] || "Property Tax Payment"}
                </div>
                <Stamp text="MUNI" color={theme.color} />
            </div>
            <StepBar current={step + 1} total={2} t={t} />
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={step === 0 ? handleFetch : handlePay} />}

            {/* Step 0: Enter Property ID */}
            {step === 0 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, minHeight: 0 }}>
                    <Field
                        label="Property ID"
                        placeholder="e.g. PROP-HYD-12345"
                        value={propertyId}
                        onChange={(e) => { setPropertyId(e.target.value); setErrors({}); }}
                        error={errors.propertyId}
                        name="propertyId"
                    />
                    <Field
                        label="Registered Mobile Number"
                        placeholder="10-digit mobile number"
                        value={mobile}
                        onChange={(e) => { setMobile(e.target.value); setErrors({}); }}
                        error={errors.mobile}
                        type="tel"
                        name="mobile"
                    />
                    <div style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontFamily: FONTS.mono, fontSize: 10, color: T.green, letterSpacing: 0.5,
                    }}>
                        <span>🔒</span> Secured with 256-bit TLS encryption
                    </div>
                    <button
                        disabled={!propertyId || !mobile || loading}
                        onClick={handleFetch}
                        aria-busy={loading}
                        style={{
                            padding: "12px 0", borderRadius: 4, border: "none",
                            background: propertyId && mobile && !loading ? T.ink : T.rule,
                            color: propertyId && mobile && !loading ? "#fff" : T.inkLight,
                            fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                            cursor: propertyId && mobile && !loading ? "pointer" : "default",
                            letterSpacing: 1, transition: "all 0.2s",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        }}
                    >
                        {loading ? <Spinner size={20} /> : "Fetch Tax Details →"}
                    </button>
                </div>
            )}

            {/* Step 1: Tax Details + Payment */}
            {step === 1 && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
                    <div style={{ fontFamily: FONTS.serif, fontSize: 18, color: T.ink, flexShrink: 0 }}>Tax Details</div>
                    <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                        <div style={{
                            background: T.ink, padding: "9px 18px", flexShrink: 0,
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                        }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 13, color: "#fff" }}>
                                Property: {propertyId}
                            </span>
                            <Stamp text="VERIFIED" color={T.goldLight} />
                        </div>
                        {[
                            ["Owner Name", taxDetails.ownerName],
                            ["Property Address", taxDetails.propertyAddress],
                            ["Financial Year", taxDetails.financialYear],
                            ["Tax Amount", taxDetails.taxAmount],
                            ["Arrears", taxDetails.arrears],
                            ["Penalty", taxDetails.penalty],
                        ].map(([k, v]) => (
                            <div key={k} style={{
                                display: "flex", justifyContent: "space-between",
                                padding: "8px 18px", borderBottom: `1px solid ${T.rule}`, flexShrink: 0,
                            }}>
                                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid }}>{k}</span>
                                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink }}>{v}</span>
                            </div>
                        ))}
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "11px 18px", background: T.saffronPale,
                            borderTop: `2px solid ${T.saffron}`, marginTop: "auto", flexShrink: 0,
                        }}>
                            <span style={{ fontFamily: FONTS.serif, fontSize: 16, color: T.ink, fontWeight: 700 }}>Total Payable</span>
                            <span style={{ fontFamily: FONTS.mono, fontSize: 19, color: T.saffron, fontWeight: 700 }}>{taxDetails.totalPayable}</span>
                        </div>
                    </div>

                    {/* Payment mode selector */}
                    <div>
                        <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 8, textTransform: "uppercase" }}>
                            Payment Mode
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {["UPI", "Debit Card", "Credit Card", "Net Banking"].map((mode) => (
                                <div key={mode} style={{
                                    padding: "8px 16px", borderRadius: 4,
                                    border: `1px solid ${T.rule}`, background: T.paper,
                                    fontFamily: FONTS.sans, fontSize: 12, color: T.inkMid,
                                }}>
                                    {mode}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        onClick={handlePay}
                        aria-busy={loading}
                        style={{
                            padding: "11px 0", borderRadius: 4, border: "none", flexShrink: 0,
                            background: loading ? T.rule : T.saffron, color: "#fff",
                            fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
                            cursor: loading ? "default" : "pointer",
                            boxShadow: `0 6px 20px ${T.saffron}44`, letterSpacing: 0.5,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        }}
                    >
                        {loading ? <Spinner size={20} /> : `Confirm & Pay ${taxDetails.totalPayable}`}
                    </button>
                </div>
            )}
        </div>
    );
}
