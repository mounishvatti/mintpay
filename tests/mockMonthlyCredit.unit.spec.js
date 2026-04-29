import { describe, it, expect, vi, beforeEach } from "vitest";
import { currentSalaryMonthKeyUtc } from "../lib/banking/mockMonthlyCredit";

// ─── currentSalaryMonthKeyUtc ────────────────────────────────────────────────

describe("currentSalaryMonthKeyUtc", () => {
  it("returns a string in YYYY-MM format", () => {
    const key = currentSalaryMonthKeyUtc();
    expect(key).toMatch(/^\d{4}-\d{2}$/);
  });

  it("uses UTC month, not local month", () => {
    // Pin the clock to a known UTC instant: 2026-04-01T00:00:00.000Z
    const fixedDate = new Date("2026-04-01T00:00:00.000Z");
    vi.setSystemTime(fixedDate);
    expect(currentSalaryMonthKeyUtc()).toBe("2026-04");
    vi.useRealTimers();
  });

  it("pads single-digit months with a leading zero", () => {
    // March = 03
    vi.setSystemTime(new Date("2026-03-15T10:00:00.000Z"));
    expect(currentSalaryMonthKeyUtc()).toBe("2026-03");
    vi.useRealTimers();
  });

  it("handles December correctly", () => {
    vi.setSystemTime(new Date("2026-12-31T23:59:59.000Z"));
    expect(currentSalaryMonthKeyUtc()).toBe("2026-12");
    vi.useRealTimers();
  });

  it("handles January correctly", () => {
    vi.setSystemTime(new Date("2027-01-01T00:00:00.000Z"));
    expect(currentSalaryMonthKeyUtc()).toBe("2027-01");
    vi.useRealTimers();
  });

  it("returns a consistent value when called twice in the same tick", () => {
    vi.setSystemTime(new Date("2026-07-10T12:00:00.000Z"));
    expect(currentSalaryMonthKeyUtc()).toBe(currentSalaryMonthKeyUtc());
    vi.useRealTimers();
  });
});
