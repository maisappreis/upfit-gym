import { defineStore } from "pinia";
import { ref } from "vue";
import { loginService } from "@/services/login.service";
import { useApiStore } from "@/stores/api";
import { setApiBaseURL } from "@/services/apiClient";
import * as jwt_decode from "jwt-decode";

interface LoginPayload {
  username: string;
  password: string;
}

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string>("");
  const refreshToken = ref<string>("");
  const tokenExpirationTime = ref<number>(0);
  const refreshInterval = ref<ReturnType<typeof setInterval>>();

  const isAuthenticated = ref<boolean>(false);

  const login = async (payload: LoginPayload) => {
    const apiStore = useApiStore();

    const response = await loginService.create(payload);

    if (!response.access || !response.refresh) {
      throw new Error("Invalid login response");
    }

    setTokens(response.access, response.refresh);
    checkAuthentication();

    await apiStore.fetchData();

    return true;
  };

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const decoded = jwt_decode.jwtDecode<{ exp?: number }>(access);

    tokenExpirationTime.value = decoded.exp ? decoded.exp * 1000 : 0;

    const refreshTimeout = ref<ReturnType<typeof setTimeout>>();

    if (refreshTimeout.value) {
        clearTimeout(refreshTimeout.value);
    }

    const delay = tokenExpirationTime.value - Date.now() - 60000;

    if (delay > 0) {
        refreshTimeout.value = setTimeout(refreshTokenFunc, delay);
    }
  };

  const refreshTokenFunc = async () => {
    try {
      const response = await loginService.refresh(refreshToken.value);
      setTokens(response.access, refreshToken.value);
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  };

  const checkAuthentication = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      isAuthenticated.value = true;
      setApiBaseURL(`${import.meta.env.VITE_API_BASE}/upfit`);
    } else {
      isAuthenticated.value = false;
      setApiBaseURL(`${import.meta.env.VITE_API_BASE}/upfit/test`);
    }
  };

  const logout = () => {
    accessToken.value = "";
    refreshToken.value = "";
    tokenExpirationTime.value = 0;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (refreshInterval.value) clearInterval(refreshInterval.value);
    location.reload();
  };

  return {
    login,
    setTokens,
    checkAuthentication,
    isAuthenticated,
    logout
  }
})
