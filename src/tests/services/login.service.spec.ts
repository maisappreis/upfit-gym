import { describe, it, expect, vi, beforeEach } from "vitest";
import { authClient } from "@/services/authClient";
import { loginService, type Login } from "@/services/login.service";

vi.mock("@/services/authClient", () => ({
  authClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}));

describe("loginService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create must call /accounts/token/ with post", async () => {
    const payload = {
      username: "maria2545",
      password: "password"
    } as Login;

    (authClient.post as any).mockResolvedValue({
      data: payload
    });

    const result = await loginService.create(payload);

    expect(authClient.post).toHaveBeenCalledWith(
      "/accounts/token/",
      payload
    );

    expect(result).toEqual(payload);
  });
});

