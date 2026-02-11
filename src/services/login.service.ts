import { authClient } from "./authClient";

export interface Login {
  username: string;
  password: string;
}

export interface CreateLoginDTO {
  access: string;
  refresh: string;
}

export const loginService = {
  async create(payload: Login): Promise<CreateLoginDTO> {
    const { data } = await authClient.post<CreateLoginDTO>('/accounts/token/', payload);

    return data;
  },
};