import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "@/stores/auth";
// import axios from "axios";
// import * as jwt_decode from "jwt-decode";

vi.mock("axios");

describe("Auth Store", () => {
  let authStore: ReturnType<typeof useAuthStore>; 

  beforeEach(() => {
    setActivePinia(createPinia());
    authStore = useAuthStore();

    localStorage.clear();
  });

  // it("should set tokens and update localStorage", () => {
  //   const accessToken = "mockAccessToken";
  //   const refreshToken = "mockRefreshToken";

  //   authStore.setTokens(accessToken, refreshToken);

  //   expect(authStore.accessToken).toBe(accessToken);
  //   expect(authStore.refreshToken).toBe(refreshToken);
  //   expect(localStorage.getItem("accessToken")).toBe(accessToken);
  //   expect(localStorage.getItem("refreshToken")).toBe(refreshToken);
  // });

  // it("should decode access token and set expiration time", () => {
  //   const accessToken = "mockAccessTokenWithExpiration";
  //   const refreshToken = "mockRefreshToken";

  //   vi.spyOn(jwt_decode, "jwtDecode").mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 });

  //   authStore.setTokens(accessToken, refreshToken);

  //   expect(authStore.tokenExpirationTime).toBeGreaterThan(Date.now());
  // });

  // it("should logout and clear tokens", () => {
  //   authStore.setTokens("mockAccessToken", "mockRefreshToken");
  //   authStore.logout();

  //   expect(authStore.accessToken).toBe("");
  //   expect(authStore.refreshToken).toBe("");
  //   expect(localStorage.getItem("accessToken")).toBeNull();
  //   expect(localStorage.getItem("refreshToken")).toBeNull();
  // });

  it("should check authentication based on localStorage", async () => {
    localStorage.setItem("accessToken", "mockAccessToken");
    await authStore.checkAuthentication();

    expect(authStore.isAuthenticated).toBe(true);

    localStorage.removeItem("accessToken");
    await authStore.checkAuthentication();

    expect(authStore.isAuthenticated).toBe(false);
  });

  // it("should refresh token successfully", async () => {
  //   const mockAccessToken = "mockAccessToken";
  //   const mockRefreshToken = "mockRefreshToken";
  //   const newAccessToken = "newMockAccessToken";

  //   authStore.setTokens(mockAccessToken, mockRefreshToken);

  //   axios.post.mockResolvedValueOnce({ data: { access: newAccessToken } });

  //   await authStore.refreshTokenFunc();

  //   expect(authStore.accessToken).toBe(newAccessToken);
  //   expect(authStore.refreshToken).toBe(mockRefreshToken);
  // });

  // it("should logout if refresh token fails", async () => {
  //   const mockAccessToken = "mockAccessToken";
  //   const mockRefreshToken = "mockRefreshToken";

  //   authStore.setTokens(mockAccessToken, mockRefreshToken);

  //   axios.post.mockRejectedValueOnce(new Error("Token refresh error"));

  //   const logoutSpy = vi.spyOn(authStore, "logout");
    
  //   await authStore.refreshTokenFunc();

  //   expect(logoutSpy).toHaveBeenCalled();
  // });
});
