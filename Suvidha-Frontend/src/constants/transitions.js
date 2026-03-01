// ── Transitions ───────────────────────────────────────────────────────────────
// Returns an inline style object for screen-to-screen transitions.
// Used by App.jsx on the content wrapper div.

/**
 * @param {string} from  - previous screen name
 * @param {string} to    - next screen name
 * @param {boolean} exiting - true while the old screen is animating out
 */
export function getTransitionStyle(from, to, exiting) {
    if (exiting) {
        return {
            opacity: 0,
            transform: "translateY(-8px)",
            transition: "opacity 0.2s ease, transform 0.2s ease",
            pointerEvents: "none",
        };
    }
    return {
        opacity: 1,
        transform: "translateY(0)",
        animation: "fadeUp 0.25s ease",
    };
}
