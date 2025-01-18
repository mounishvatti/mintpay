import { describe, expect, test, it } from "vitest";
import axios from "axios";

const backendUrl = "http://localhost:3000";

describe("User login", () => {
  it("should login a user", async () => {
    const response = await axios.post(`${backendUrl}/api/auth/login`, {
      username: "jaswanthvatti",
      password: "test@12345",
    });
    expect(response.status).toBe(200);
  });
});

describe("User signup", () => {
  it("should signup a user", async () => {
    const response = await axios.post(`${backendUrl}/api/auth/register`, {
      first_name: "ravi",
      last_name: "shankar",
      password: "test@23456",
    });
    expect(response.status).toBe(200);
  });
});

describe("Create a bank account", () => {
  it("should create a bank account", async () => {
    const response = await axios.post(
      `${backendUrl}/api/banking/create-account`,
      {
        userId: "ded9c4eb-4568-4959-95e7-5c36f27e6d09",
        bankName: "sbi",
        upiid: "mounishvattiicici@rupay",
        pin: 1123,
      }
    );
    expect(response.status).toBe(200);
  });
});
