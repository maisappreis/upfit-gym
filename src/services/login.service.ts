import { authClient } from "./authClient";
import { type LoginPayload, type CreateLoginDTO, type LoginAccess} from "@/types/login";

export const loginService = {

  async create(payload: LoginPayload): Promise<LoginAccess> {
    const { data } = await authClient.post<LoginAccess>('/accounts/token/', payload);
    return data;
  },

  async refresh(payload: string): Promise<CreateLoginDTO> {
    const { data } = await authClient.post<CreateLoginDTO>('/accounts/token/refresh/', payload);
    return data;
  },

   async profile(): Promise<LoginAccess> {
    const { data } = await authClient.post<LoginAccess>('/accounts/profile/');
    return data;
  },
};