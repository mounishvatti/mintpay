import { describe, it, expect, beforeAll } from "vitest";
import axios from "axios";

const BASE = "http://localhost:3000";
const RUN_ID = Date.now();

// Shared state — populated in beforeAll so later suites can use the token/upiid
let token = "";
let accountUpiId = "";

const TEST_USER = {
  first_name: "Bank",
  last_name: `Tester${RUN_ID}`,
  email: `banktest${RUN_ID}@mintpay.dev`,
  password: "Bank@12345",
};
const USERNAME = `banktester${RUN_ID}`.toLowerCase();
const BANK_NAME = "hdfc";

beforeAll(async () => {
  // Register
  await axios.post(`${BASE}/api/auth/register`, TEST_USER);

  // Login and grab token
  const login = await axios.post(`${BASE}/api/auth/login`, {
    username: USERNAME,
    password: TEST_USER.password,
  });
  token = login.data.token;
  accountUpiId = `${USERNAME}${BANK_NAME}@mintpay`;
});

// ─── /api/banking/create-account ────────────────────────────────────────────

describe("POST /api/banking/create-account", () => {
  it("creates a bank account and returns 201", async () => {
    const res = await axios.post(
      `${BASE}/api/banking/create-account`,
      { bankName: BANK_NAME, pin: "1234" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(res.status).toBe(201);
    expect(res.data.bankAccount).toHaveProperty("upiid");
    expect(res.data.bankAccount).not.toHaveProperty("pin");
  });

  it("returns 400 when UPI ID already exists (duplicate bank)", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/create-account`,
        { bankName: BANK_NAME, pin: "1234" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 401 when no token provided", async () => {
    await expect(
      axios.post(`${BASE}/api/banking/create-account`, {
        bankName: BANK_NAME,
        pin: "1234",
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 400 for pin out of range", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/create-account`,
        { bankName: "sbi", pin: "99" },       // too short
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 405 for GET method", async () => {
    await expect(
      axios.get(`${BASE}/api/banking/create-account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});

// ─── /api/banking/account ───────────────────────────────────────────────────

describe("GET /api/banking/account", () => {
  it("returns user and bankdetails without pin", async () => {
    const res = await axios.get(`${BASE}/api/banking/account`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("user");
    expect(res.data).toHaveProperty("bankdetails");
    expect(Array.isArray(res.data.bankdetails)).toBe(true);
    res.data.bankdetails.forEach((account) => {
      expect(account).not.toHaveProperty("pin");
      expect(account).toHaveProperty("balance");
      expect(account).toHaveProperty("upiid");
    });
  });

  it("returns 401 without token", async () => {
    await expect(
      axios.get(`${BASE}/api/banking/account`)
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 405 for POST method", async () => {
    await expect(
      axios.post(`${BASE}/api/banking/account`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});

// ─── /api/banking/upi-id ────────────────────────────────────────────────────

describe("PATCH /api/banking/upi-id", () => {
  const newUpi = `banktester${RUN_ID}updated@mintpay`;

  it("updates UPI ID and returns 200", async () => {
    const res = await axios.patch(
      `${BASE}/api/banking/upi-id`,
      { upiid: newUpi },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(res.status).toBe(200);
    expect(res.data.bankAccount.upiid).toBe(newUpi);
    expect(res.data.bankAccount).not.toHaveProperty("pin");
    accountUpiId = newUpi; // keep in sync for payment tests
  });

  it("returns 200 with 'unchanged' when UPI ID is the same", async () => {
    const res = await axios.patch(
      `${BASE}/api/banking/upi-id`,
      { upiid: newUpi },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(res.status).toBe(200);
    expect(res.data.message).toMatch(/unchanged/i);
  });

  it("returns 400 for invalid UPI format (no @ symbol)", async () => {
    await expect(
      axios.patch(
        `${BASE}/api/banking/upi-id`,
        { upiid: "invalidformat" },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 401 without token", async () => {
    await expect(
      axios.patch(`${BASE}/api/banking/upi-id`, { upiid: newUpi })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 405 for POST method", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/upi-id`,
        { upiid: newUpi },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});
