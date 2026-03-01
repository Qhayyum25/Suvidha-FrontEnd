// ── [MC03] CIVIC COMPLAINT REGISTRATION ──────────────────────────────────────
// Workflow: Select Category → Provide Details → Submit → Success
// No authentication required per spec
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

const COMPLAINT_CATEGORIES = [
    "Pothole",
    "Street Light Not Working",
    "Garbage Overflow",
    "Road Damage",
    "Illegal Dumping",
];

export function CivicComplaintScreen({ t, onHome, onFinalStep }) {
    const theme = SVC_THEME[3];
    const [done, setDone] = useState(false);
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [landmark, setLandmark] = useState("");
    const [desc, setDesc] = useState("");
    const [mobile, setMobile] = useState("");
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const ref = useRef(generateRefNumber("CIVIC-MUNI"));

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [attempted, setAttempted] = useState(false);

    const handleSubmit = async () => {
        setAttempted(true);
        const errs = {};
        if (!category) errs.category = "Please select a complaint category";
        const locErr = validate("address", location);
        if (locErr) errs.location = locErr;
        const descErr = validate("description", desc);
        if (descErr) errs.desc = descErr;
        if (!mobile.trim() || mobile.length < 10) errs.mobile = "Valid 10-digit mobile number required";
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setApiError(null);
        try {
            await mockAPI({ category, location, landmark, desc, mobile });
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
                icon="📝"
                title="Complaint Registered!"
                msg="Your complaint has been auto-assigned to the relevant department. Geo-tagged for quick resolution. Estimated resolution: 3 days."
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
                    {t.municipalActions?.[2] || "Civic Complaint"}
                </div>
                <Stamp text="MUNI" color={theme.color} />
            </div>
            <Rule color={T.rule} />

            {apiError && <ErrorBanner message={apiError} onRetry={handleSubmit} />}

            {/* Complaint category chips */}
            <div>
                <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: T.inkLight, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
                    Complaint Category
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }} role="radiogroup" aria-label="Complaint category">
                    {COMPLAINT_CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => { setCategory(cat); setErrors((e) => ({ ...e, category: null })); }}
                            role="radio"
                            aria-checked={category === cat}
                            style={{
                                padding: "9px 16px", borderRadius: 4,
                                border: `1.5px solid ${category === cat ? theme.color : T.rule}`,
                                background: category === cat ? theme.bg : T.paper,
                                fontFamily: FONTS.sans, fontSize: 13,
                                fontWeight: category === cat ? 700 : 400,
                                color: category === cat ? theme.color : T.inkMid,
                                cursor: "pointer", transition: "all 0.15s",
                            }}
                        >
                            {category === cat && "✓ "}{cat}
                        </button>
                    ))}
                </div>
                {attempted && errors.category && (
                    <div role="alert" style={{
                        fontFamily: FONTS.sans, fontSize: 12, color: T.red, marginTop: 6,
                        display: "flex", alignItems: "center", gap: 4,
                    }}>
                        <span>⚠</span> {errors.category}
                    </div>
                )}
            </div>

            <Rule color={T.rule} />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
                {/* Left column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Field label="Location" placeholder="Street, Area, Colony"
                        value={location} onChange={(e) => { setLocation(e.target.value); setErrors((p) => ({ ...p, location: null })); }}
                        error={attempted ? errors.location : null} name="location" />
                    <Field label="Landmark (optional)" placeholder="Near school, temple, etc."
                        value={landmark} onChange={(e) => setLandmark(e.target.value)} name="landmark" />
                    <Field label="Mobile Number" placeholder="10-digit mobile"
                        value={mobile} onChange={(e) => { setMobile(e.target.value); setErrors((p) => ({ ...p, mobile: null })); }}
                        error={attempted ? errors.mobile : null} type="tel" name="mobile" />
                </div>

                {/* Right column */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Field label="Describe the Issue" placeholder="Please describe the problem in detail…"
                        value={desc} onChange={(e) => { setDesc(e.target.value); setErrors((p) => ({ ...p, desc: null })); }}
                        multiline error={attempted ? errors.desc : null} name="description" />
                    <UploadTile
                        label="Attach Photo (optional)"
                        note="Tap to upload · JPG/PNG · Max 2MB"
                        uploaded={photoUploaded}
                        onToggle={() => setPhotoUploaded(!photoUploaded)}
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
                    marginTop: "auto",
                }}
            >
                {loading ? <Spinner size={20} /> : "Submit Complaint →"}
            </button>
        </div>
    );
}
