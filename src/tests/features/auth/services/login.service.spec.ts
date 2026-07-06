import { describe, it, expect, vi, beforeEach } from "vitest";
import { authClient } from "@/features/auth/services/authClient";
import { loginService } from "@/features/auth/services/login.service";
import { type LoginPayload } from "@/features/auth/types/login";

vi.mock("@/features/auth/services/authClient", () => ({
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
    } as LoginPayload;

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

  it("profile must call /accounts/profile/ with get", async () => {
    const user = {
      id: 1,
      username: "maria2545",
      first_name: "Maria",
      last_name: "Silva",
      email: "maria@email.com"
    };

    (authClient.get as any).mockResolvedValue({
      data: user
    });

    const result = await loginService.profile();

    expect(authClient.get).toHaveBeenCalledWith("/accounts/profile/");
    expect(result).toEqual(user);
  });

  it("updateProfile must call /accounts/profile/ with patch", async () => {
    const payload = {
      first_name: "Maria"
    };

    const user = {
      id: 1,
      username: "maria2545",
      first_name: "Maria",
      last_name: "Silva",
      email: "maria@email.com"
    };

    (authClient.patch as any).mockResolvedValue({
      data: user
    });

    const result = await loginService.updateProfile(payload);

    expect(authClient.patch).toHaveBeenCalledWith(
      "/accounts/profile/",
      payload
    );
    expect(result).toEqual(user);
  });
});

