import { describe, it, expect, beforeAll } from "vitest";
import axios from "axios";

const BASE = "http://localhost:3000";
const RUN_ID = Date.now();

// ─── Two users: sender and receiver ─────────────────────────────────────────

const SENDER = {
  first_name: "Sender",
  last_name: `${RUN_ID}`,
  email: `sender${RUN_ID}@mintpay.dev`,
  password: "Sender@123",
  username: `sender${RUN_ID}`.toLowerCase(),
};

const RECEIVER = {
  first_name: "Receiver",
  last_name: `${RUN_ID}`,
  email: `receiver${RUN_ID}@mintpay.dev`,
  password: "Receiver@123",
  username: `receiver${RUN_ID}`.toLowerCase(),
};

let senderToken = "";
let receiverToken = "";
let senderUpi = `${SENDER.username}hdfc@mintpay`;
let receiverUpi = `${RECEIVER.username}sbi@mintpay`;

beforeAll(async () => {
  // Register both users
  await axios.post(`${BASE}/api/auth/register`, {
    first_name: SENDER.first_name,
    last_name: SENDER.last_name,
    email: SENDER.email,
    password: SENDER.password,
  });
  await axios.post(`${BASE}/api/auth/register`, {
    first_name: RECEIVER.first_name,
    last_name: RECEIVER.last_name,
    email: RECEIVER.email,
    password: RECEIVER.password,
  });

  // Login both
  const sLogin = await axios.post(`${BASE}/api/auth/login`, {
    username: SENDER.username,
    password: SENDER.password,
  });
  senderToken = sLogin.data.token;

  const rLogin = await axios.post(`${BASE}/api/auth/login`, {
    username: RECEIVER.username,
    password: RECEIVER.password,
  });
  receiverToken = rLogin.data.token;

  // Create bank accounts
  await axios.post(
    `${BASE}/api/banking/create-account`,
    { bankName: "hdfc", pin: "1234" },
    { headers: { Authorization: `Bearer ${senderToken}` } }
  );
  await axios.post(
    `${BASE}/api/banking/create-account`,
    { bankName: "sbi", pin: "5678" },
    { headers: { Authorization: `Bearer ${receiverToken}` } }
  );
});

// ─── /api/banking/payments/send-money ───────────────────────────────────────

describe("POST /api/banking/payments/send-money", () => {
  it("transfers money between two accounts and returns 200", async () => {
    const res = await axios.post(
      `${BASE}/api/banking/payments/send-money`,
      { from: senderUpi, to: receiverUpi, amount: 100, pin: "1234" },
      { headers: { Authorization: `Bearer ${senderToken}` } }
    );
    expect(res.status).toBe(201);
  });

  it("returns 401 for incorrect PIN", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/send-money`,
        { from: senderUpi, to: receiverUpi, amount: 10, pin: "0000" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 403 when sending from another user's UPI", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/send-money`,
        // sender token but trying to send FROM receiver's UPI
        { from: receiverUpi, to: senderUpi, amount: 10, pin: "1234" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 403 } });
  });

  it("returns 403 when sending to the same account", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/send-money`,
        { from: senderUpi, to: senderUpi, amount: 10, pin: "1234" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 403 } });
  });

  it("returns 400 for insufficient balance", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/send-money`,
        { from: senderUpi, to: receiverUpi, amount: 9999999, pin: "1234" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 404 for non-existent receiver UPI", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/send-money`,
        { from: senderUpi, to: "ghost@mintpay", amount: 10, pin: "1234" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it("returns 401 without auth token", async () => {
    await expect(
      axios.post(`${BASE}/api/banking/payments/send-money`, {
        from: senderUpi,
        to: receiverUpi,
        amount: 10,
        pin: "1234",
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 400 for zero/negative amount", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/send-money`,
        { from: senderUpi, to: receiverUpi, amount: -50, pin: "1234" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 405 for GET method", async () => {
    await expect(
      axios.get(`${BASE}/api/banking/payments/send-money`, {
        headers: { Authorization: `Bearer ${senderToken}` },
      })
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});

// ─── /api/banking/payments/transaction-history ──────────────────────────────

describe("POST /api/banking/payments/transaction-history", () => {
  it("returns transaction list for a valid UPI", async () => {
    const res = await axios.post(
      `${BASE}/api/banking/payments/transaction-history`,
      { upiid: senderUpi },
      { headers: { Authorization: `Bearer ${senderToken}` } }
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.transactions)).toBe(true);
    // Should have the earlier send-money transaction
    expect(res.data.transactions.length).toBeGreaterThanOrEqual(1);
  });

  it("returns 403 when querying another user's UPI history", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/transaction-history`,
        { upiid: receiverUpi },         // receiver's UPI
        { headers: { Authorization: `Bearer ${senderToken}` } } // sender's token
      )
    ).rejects.toMatchObject({ response: { status: 403 } });
  });

  it("returns 404 for non-existent UPI", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/transaction-history`,
        { upiid: "nobody@mintpay" },
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it("returns 400 when upiid is missing", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/transaction-history`,
        {},
        { headers: { Authorization: `Bearer ${senderToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 401 without token", async () => {
    await expect(
      axios.post(`${BASE}/api/banking/payments/transaction-history`, {
        upiid: senderUpi,
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });
});

// ─── /api/banking/payments/request-money ────────────────────────────────────

describe("POST /api/banking/payments/request-money", () => {
  it("returns 201 for a valid mock request", async () => {
    const res = await axios.post(
      `${BASE}/api/banking/payments/request-money`,
      { from: senderUpi, amount: 50 },
      { headers: { Authorization: `Bearer ${receiverToken}` } }
    );
    expect(res.status).toBe(201);
    expect(res.data.message).toMatch(/mock request recorded/i);
  });

  it("returns 404 for non-existent sender UPI", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/request-money`,
        { from: "ghost@mintpay", amount: 50 },
        { headers: { Authorization: `Bearer ${receiverToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it("returns 400 for negative amount", async () => {
    await expect(
      axios.post(
        `${BASE}/api/banking/payments/request-money`,
        { from: senderUpi, amount: -10 },
        { headers: { Authorization: `Bearer ${receiverToken}` } }
      )
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 401 without token", async () => {
    await expect(
      axios.post(`${BASE}/api/banking/payments/request-money`, {
        from: senderUpi,
        amount: 50,
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 405 for GET method", async () => {
    await expect(
      axios.get(`${BASE}/api/banking/payments/request-money`, {
        headers: { Authorization: `Bearer ${receiverToken}` },
      })
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});
