import { describe, it, expect, beforeAll } from "vitest";
import axios from "axios";

const BASE = "http://localhost:3000";

// Unique suffix per test run so re-runs don't collide on email/username uniqueness
const RUN_ID = Date.now();
const TEST_USER = {
  first_name: "Test",
  last_name: `User${RUN_ID}`,
  email: `testuser${RUN_ID}@mintpay.dev`,
  password: "Test@12345",
};
const USERNAME = `testuser${RUN_ID}`.toLowerCase();

// ─── /api/auth/register ─────────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  it("creates a new user and returns 201", async () => {
    const res = await axios.post(`${BASE}/api/auth/register`, TEST_USER);
    expect(res.status).toBe(201);
    expect(res.data.message).toMatch(/account created/i);
  });

  it("returns 400 when user already exists", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/register`, TEST_USER)
    ).rejects.toMatchObject({ response: { status: 400 } });
  });

  it("returns 422 for missing required fields", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/register`, { first_name: "Only" })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it("returns 422 for invalid email", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/register`, {
        ...TEST_USER,
        email: "not-an-email",
      })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it("returns 422 for password shorter than 6 chars", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/register`, {
        ...TEST_USER,
        email: `short${RUN_ID}@mintpay.dev`,
        password: "abc",
      })
    ).rejects.toMatchObject({ response: { status: 422 } });
  });

  it("returns 405 for GET method", async () => {
    await expect(
      axios.get(`${BASE}/api/auth/register`)
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});

// ─── /api/auth/login ─────────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  let token;

  it("logs in with correct credentials and returns token", async () => {
    const res = await axios.post(`${BASE}/api/auth/login`, {
      username: USERNAME,
      password: TEST_USER.password,
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("token");
    expect(res.data).toHaveProperty("username", USERNAME);
    token = res.data.token;
  });

  it("returns 401 for wrong password", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/login`, {
        username: USERNAME,
        password: "WrongPassword!",
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 404 for non-existent username", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/login`, {
        username: `ghost${RUN_ID}`,
        password: "anything",
      })
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it("returns 405 for GET method", async () => {
    await expect(
      axios.get(`${BASE}/api/auth/login`)
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});

// ─── /api/auth/change-pwd ────────────────────────────────────────────────────

describe("POST /api/auth/change-pwd", () => {
  const NEW_PASSWORD = "NewPass@999";

  it("changes password with correct current password", async () => {
    const res = await axios.post(`${BASE}/api/auth/change-pwd`, {
      username: USERNAME,
      current_password: TEST_USER.password,
      new_password: NEW_PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.data).toHaveProperty("token");
  });

  it("can login with the new password", async () => {
    const res = await axios.post(`${BASE}/api/auth/login`, {
      username: USERNAME,
      password: NEW_PASSWORD,
    });
    expect(res.status).toBe(200);
  });

  it("returns 401 for wrong current password", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/change-pwd`, {
        username: USERNAME,
        current_password: "WrongOld!",
        new_password: "Anything@1",
      })
    ).rejects.toMatchObject({ response: { status: 401 } });
  });

  it("returns 404 for non-existent user", async () => {
    await expect(
      axios.post(`${BASE}/api/auth/change-pwd`, {
        username: `nobody${RUN_ID}`,
        current_password: "pass",
        new_password: "newpass",
      })
    ).rejects.toMatchObject({ response: { status: 404 } });
  });

  it("returns 405 for GET method", async () => {
    await expect(
      axios.get(`${BASE}/api/auth/change-pwd`)
    ).rejects.toMatchObject({ response: { status: 405 } });
  });
});
