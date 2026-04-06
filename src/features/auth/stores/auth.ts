import { defineStore } from "pinia";
import { ref } from "vue";
import { loginService } from "@/features/auth/services/login.service";
import { useAppData } from "@/shared/composables/useAppData";
import * as jwt_decode from "jwt-decode";
import { type LoginPayload, type User } from "@/features/auth/types/login";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string>("");
  const refreshToken = ref<string>("");
  const tokenExpirationTime = ref<number>(0);
  const refreshTimeout = ref<ReturnType<typeof setTimeout>>();
  const isAuthenticated = ref<boolean>(false);  

  const login = async (payload: LoginPayload) => {
    const { fetchData } = useAppData();

    const response = await loginService.create(payload);

    setTokens(response.access, response.refresh);

    isAuthenticated.value = true;
    user.value = response.user;

    await fetchData();

    router.push("/");
  };

  const setTokens = (access: string, refresh: string) => {
    accessToken.value = access;
    refreshToken.value = refresh;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const decoded = jwt_decode.jwtDecode<{ exp?: number }>(access);

    tokenExpirationTime.value = decoded.exp ? decoded.exp * 1000 : 0;

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

    if (!token) {
      isAuthenticated.value = false;
      user.value = null;
      return;
    }

    accessToken.value = token;
    refreshToken.value = localStorage.getItem("refreshToken") || "";

    try {
      await getProfile();
      isAuthenticated.value = true;
    } catch {
      logout();
    }
  };

  const getProfile = async () => {
    try {
      const response = await loginService.profile();
      user.value = response.user;
    } catch (error) {
      console.error("Erro ao carregar perfil do usuário.", error);
      user.value = null;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    user.value = null;
    accessToken.value = "";
    refreshToken.value = "";
    tokenExpirationTime.value = 0;

    isAuthenticated.value = false;

    router.replace("/login");
  };

  return {
    user,
    login,
    setTokens,
    checkAuthentication,
    isAuthenticated,
    logout
  };
});