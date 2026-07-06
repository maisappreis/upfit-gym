import { authClient } from "./authClient";
import { type LoginPayload, type CreateLoginDTO, type LoginAccess, type UpdateUserDTO, type User } from "@/features/auth/types/login";

export const loginService = {

  async create(payload: LoginPayload): Promise<LoginAccess> {
    const { data } = await authClient.post<LoginAccess>('/accounts/token/', payload);
    return data;
  },

  async refresh(payload: string): Promise<CreateLoginDTO> {
    const { data } = await authClient.post<CreateLoginDTO>('/accounts/token/refresh/', payload);
    return data;
  },

  async profile(): Promise<User> {
    const { data } = await authClient.get<User>('/accounts/profile/');
    return data;
  },

  async updateProfile(payload: UpdateUserDTO): Promise<User> {
    const { data } = await authClient.patch<User>('/accounts/profile/', payload);
    return data;
  },
};
