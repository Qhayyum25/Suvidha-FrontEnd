// ── Mock Data & API Simulator ────────────────────────────────────────────────

export const mockBillData = {
  'AP-2024-78543': {
    amount: 1248,
    dueDate: '2026-02-28',
    service: 'Electricity',
  },
};

export const mockApplications = {
  'APP-2026-654321': {
    type: 'New Connection',
    service: 'Gas',
    date: '2026-02-18',
    status: 2,
  },
};

export const mockComplaints = {
  'CMP-2026-789012': {
    type: 'Power Cut',
    service: 'Electricity',
    date: '2026-02-20',
    status: 1,
  },
};

/**
 * Simulate an async API call with configurable delay & failure rate.
 * @param {*} data - data to resolve with on success
 * @param {object} opts
 * @param {number} opts.delay - ms delay before resolving (default 1200)
 * @param {number} opts.failRate - probability of failure 0–1 (default 0.15)
 * @returns {Promise}
 */
export function mockAPI(data, { delay = 1200, failRate = 0.15 } = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const arr = new Uint32Array(1);
      crypto.getRandomValues(arr);
      const rand = arr[0] / 0xFFFFFFFF;
      if (rand < failRate) {
        reject({ error: "Network error. Please try again." });
      } else {
        resolve({ ok: true, data });
      }
    }, delay);
  });
}