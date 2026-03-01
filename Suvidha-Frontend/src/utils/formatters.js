// ── Formatters & Secure Random ───────────────────────────────────────────────

/**
 * Generate a cryptographically-secure reference number.
 * Uses crypto.getRandomValues() instead of Math.random().
 * @param {string} prefix - e.g. "SUVDH-2026", "APP-ELEC", "COMP-WATER"
 * @returns {string} e.g. "SUVDH-2026-847291"
 */
export function generateRefNumber(prefix) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    const num = (arr[0] % 900000) + 100000; // 6-digit number
    return `${prefix}-${num}`;
}
