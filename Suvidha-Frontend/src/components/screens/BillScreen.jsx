// ── [L] BILL PAYMENT ─────────────────────────────────────────────────────────
// 3-step flow: Consumer ID → Payment Summary → Success (OTP removed)
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
import { validate } from "../../utils/validators";
import { generateRefNumber } from "../../utils/formatters";
import { mockAPI } from "../../utils/mockData";

export function BillScreen({ t, serviceIdx, step, setStep, connId, setConnId, onHome }) {
  const theme = SVC_THEME[serviceIdx];
  const STEPS = ["form", "pay", "done"];
  const stepNum = STEPS.indexOf(step) + 1;
  const ref = useRef(generateRefNumber("SUVDH-2026"));

  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleProceedToPay = async () => {
    const err = validate("consumerId", connId);
    if (err) { setErrors({ connId: err }); return; }
    setErrors({});
    setLoading(true);
    setApiError(null);
    try {
      await mockAPI({ connId });
      setStep("pay");
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
      setStep("done");
    } catch (e) {
      setApiError(e.error);
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <SuccessCard
        icon="✓"
        title={t.successTitle}
        msg={t.successMsg}
        refLabel={t.refNo}
        refValue={ref.current}
        onPrint={() => {}}
        onHome={onHome}
        tHome={t.home}
      />
    );
  }

  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      padding: "14px 22px", gap: 12,
      overflow: "hidden",   // no scrollbar
      minHeight: 0,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: T.ink }}>{t.billTitle}</div>
        <Stamp text={theme.stamp} color={theme.color} />
      </div>
      <StepBar current={stepNum} total={2} t={t} />
      <Rule color={T.rule} />

      {apiError && (
        <ErrorBanner message={apiError} onRetry={() => {
          if (step === "form") handleProceedToPay();
          else if (step === "pay") handlePay();
        }} />
      )}

      {/* ── Step 1 : Consumer ID ── */}
      {step === "form" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, minHeight: 0 }}>
          <Field
            label={t.connLabel}
            placeholder={t.connPlaceholder}
            value={connId}
            onChange={(e) => { setConnId(e.target.value); setErrors({}); }}
            error={errors.connId}
            name="consumerId"
          />
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: FONTS.mono, fontSize: 10, color: T.green, letterSpacing: 0.5,
          }}>
            <span>🔒</span> Secured with 256-bit TLS encryption
          </div>
          <button
            disabled={!connId || loading}
            onClick={handleProceedToPay}
            aria-busy={loading}
            style={{
              padding: "12px 0", borderRadius: 4, border: "none",
              background: connId && !loading ? T.ink : T.rule,
              color: connId && !loading ? "#fff" : T.inkLight,
              fontFamily: FONTS.sans, fontSize: 15, fontWeight: 700,
              cursor: connId && !loading ? "pointer" : "default",
              letterSpacing: 1, transition: "all 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
          >
            {loading ? <Spinner size={20} /> : t.proceed}
          </button>
        </div>
      )}

      {/* ── Step 2 : Payment Summary ── */}
      {step === "pay" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minHeight: 0 }}>
          <div style={{ fontFamily: FONTS.serif, fontSize: 18, color: T.ink, flexShrink: 0 }}>{t.summaryTitle}</div>
          <div style={{ border: `1px solid ${T.rule}`, borderRadius: 4, overflow: "hidden", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
            {/* Header row */}
            <div style={{
              background: T.ink, padding: "9px 18px", flexShrink: 0,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontFamily: FONTS.serif, fontSize: 13, color: "#fff" }}>
                Consumer ID: {connId}
              </span>
              <Stamp text="VALID" color={T.goldLight} />
            </div>
            {/* Bill rows — compact padding */}
            {[
              ["Billing Period",  "January 2026"],
              ["Units Consumed",  "342 kWh"],
              ["Fixed Charges",   "₹  120.00"],
              ["Energy Charges",  "₹ 1,085.00"],
              ["Taxes (GST)",     "₹   43.00"],
              ["Late Fee",        "₹    0.00"],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 18px", borderBottom: `1px solid ${T.rule}`,
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: T.inkMid }}>{k}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 13, color: T.ink }}>{v}</span>
              </div>
            ))}
            {/* Total row */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              padding: "11px 18px", background: T.saffronPale,
              borderTop: `2px solid ${T.saffron}`, marginTop: "auto", flexShrink: 0,
            }}>
              <span style={{ fontFamily: FONTS.serif, fontSize: 16, color: T.ink, fontWeight: 700 }}>Total Payable</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 19, color: T.saffron, fontWeight: 700 }}>₹ 1,248.00</span>
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
            {loading ? <Spinner size={20} /> : t.payNow}
          </button>
        </div>
      )}
    </div>
  );
}
