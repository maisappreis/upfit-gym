import { defineStore } from "pinia";
import { ref } from "vue";
import { setApiBaseURL } from "@/services/apiClient";
import axios from "axios";
import * as jwt_decode from "jwt-decode";

export const useAuthStore = defineStore("auth", () => {
  const accessToken = ref<string>("");
  const refreshToken = ref<string>("");
  const tokenExpirationTime = ref<number>(0);
  const refreshInterval = ref<ReturnType<typeof setInterval>>();

  const isAuthenticated = ref<boolean>(false);

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
  }

  const refreshTokenFunc = async () => {
    try {
      const response = await axios.post("/api/token/refresh/", {
        refresh: refreshToken.value
      });
      setTokens(response.data.access, refreshToken.value);
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
    }
  }

  const checkAuthentication = async () => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      isAuthenticated.value = true;
      setApiBaseURL(`${import.meta.env.VITE_API_BASE}/upfit`);
    } else {
      isAuthenticated.value = false;
      setApiBaseURL(`${import.meta.env.VITE_API_BASE}/upfit/test`);
    }
  }

  const logout = () => {
    accessToken.value = "";
    refreshToken.value = "";
    tokenExpirationTime.value = 0;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    if (refreshInterval.value) clearInterval(refreshInterval.value);
    location.reload();
  }

  return {
    setTokens,
    checkAuthentication,
    isAuthenticated,
    logout
  }
})
