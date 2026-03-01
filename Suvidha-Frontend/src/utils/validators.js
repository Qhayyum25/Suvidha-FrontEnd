// ── Input Sanitization & Validation ──────────────────────────────────────────

/**
 * Strip dangerous characters from user input.
 * Removes: < > " ' \ ; ` $ { }
 */
export function sanitize(str) {
    if (typeof str !== "string") return "";
    return str.replace(/[<>"'\\;`${}]/g, "");
}

/**
 * Per-field validation rules.
 * Each entry: { regex?, minLen?, maxLen?, required?, label }
 */
export const VALIDATORS = {
    name: {
        regex: /^[A-Za-z\s.'-]{2,60}$/,
        maxLen: 60,
        required: true,
        label: "Name",
        errorMsg: "Enter a valid name (2–60 letters, spaces, dots, hyphens)",
    },
    mobile: {
        regex: /^[6-9]\d{9}$/,
        maxLen: 10,
        required: true,
        label: "Mobile",
        errorMsg: "Enter a valid 10-digit Indian mobile number",
    },
    pin: {
        regex: /^\d{6}$/,
        maxLen: 6,
        required: true,
        label: "PIN Code",
        errorMsg: "Enter a valid 6-digit PIN code",
    },
    consumerId: {
        regex: /^[A-Za-z]{2,4}-\d{4}-\d{4,6}$/,
        maxLen: 20,
        required: true,
        label: "Consumer ID",
        errorMsg: "Format: XX-0000-000000 (e.g. AP-2024-78543)",
    },
    address: {
        minLen: 5,
        maxLen: 200,
        required: true,
        label: "Address",
        errorMsg: "Enter at least 5 characters for the address",
    },
    description: {
        minLen: 10,
        maxLen: 500,
        required: true,
        label: "Description",
        errorMsg: "Describe the issue in at least 10 characters",
    },
};

/**
 * Validate a single field value.
 * @param {string} fieldName - key in VALIDATORS
 * @param {string} value - user input (already sanitized)
 * @returns {string|null} error message or null if valid
 */
export function validate(fieldName, value) {
    const rule = VALIDATORS[fieldName];
    if (!rule) return null;

    const trimmed = (value || "").trim();

    if (rule.required && !trimmed) {
        return `${rule.label} is required`;
    }

    if (!trimmed) return null; // optional + empty = ok

    if (rule.minLen && trimmed.length < rule.minLen) {
        return rule.errorMsg;
    }

    if (rule.maxLen && trimmed.length > rule.maxLen) {
        return `${rule.label} must be at most ${rule.maxLen} characters`;
    }

    if (rule.regex && !rule.regex.test(trimmed)) {
        return rule.errorMsg;
    }

    return null;
}
