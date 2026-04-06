import { type LoginPayload, type LoginAccess} from "@/features/auth/types/login";
import { useAuthStore } from "@/features/auth/stores/auth";
import { useAlertStore } from "@/shared/stores/alert";
import { useLoadingStore } from "@/shared/stores/loading";

export function useLogin() {
  const authStore = useAuthStore();
  const alertStore = useAlertStore();
  const loadingStore = useLoadingStore();

  const login = async (payload: LoginPayload): Promise<LoginAccess | undefined> => {
    try {
      loadingStore.start();

      const response = await authStore.login(payload);

      alertStore.success("Login realizado com sucesso!");

      return response;
    } catch (err) {
      alertStore.error("Erro ao fazer login.", err);
    } finally {
      loadingStore.stop();
    }
  };

  return {
    login
  };
};