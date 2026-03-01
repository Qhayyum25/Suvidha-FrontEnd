// ── [UI] Field — generic labelled input/textarea with validation ─────────────
import { T, FONTS } from "../../constants/theme";
import { sanitize } from "../../utils/validators";

export function Field({
    label,
    placeholder,
    value,
    onChange,
    type = "text",
    multiline = false,
    error = null,
    id,
    name,
    ariaLabel,
}) {
    const fieldId = id || name || label?.toLowerCase().replace(/\s+/g, "-");
    const errorId = `${fieldId}-error`;

    const handleChange = (e) => {
        const sanitized = sanitize(e.target.value);
        onChange({ ...e, target: { ...e.target, value: sanitized } });
    };

    const base = {
        width: "100%",
        padding: "9px 12px",
        border: `1.5px solid ${error ? T.red : value ? T.saffron : T.rule}`,
        borderRadius: 4,
        background: error ? T.redLight : value ? T.saffronPale : T.paper,
        fontFamily: FONTS.sans,
        fontSize: 13,
        color: T.ink,
        outline: "none",
        transition: "all 0.2s",
        resize: "vertical",
        boxSizing: "border-box",
    };

    const ariaProps = {
        id: fieldId,
        "aria-label": ariaLabel || label,
        ...(error ? { "aria-invalid": "true", "aria-describedby": errorId } : {}),
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
                htmlFor={fieldId}
                style={{
                    fontFamily: FONTS.sans,
                    fontSize: 11,
                    color: T.inkLight,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                }}
            >
                {label}
            </label>
            {multiline ? (
                <textarea
                    rows={3}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    style={base}
                    name={name}
                    {...ariaProps}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    style={base}
                    name={name}
                    {...ariaProps}
                />
            )}
            {error && (
                <div
                    id={errorId}
                    role="alert"
                    style={{
                        fontFamily: FONTS.sans,
                        fontSize: 12,
                        color: T.red,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        animation: "fadeUp 0.2s ease",
                    }}
                >
                    <span style={{ fontSize: 13 }}>⚠</span> {error}
                </div>
            )}
        </div>
    );
}