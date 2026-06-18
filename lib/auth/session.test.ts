import { beforeAll, describe, expect, it } from "vitest";
import { createSession, verifySession } from "./session";

beforeAll(() => {
  process.env.AUTH_SECRET = "test-secret-value-for-unit-tests-only";
});

describe("session", () => {
  it("verifies a token it created", async () => {
    const token = await createSession();
    const payload = await verifySession(token);
    expect(payload?.role).toBe("admin");
  });

  it("returns null for a tampered token", async () => {
    const token = await createSession();
    const payload = await verifySession(token + "garbage");
    expect(payload).toBeNull();
  });

  it("returns null for an empty token", async () => {
    expect(await verifySession("")).toBeNull();
  });
});
