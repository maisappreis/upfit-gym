export interface LoginPayload {
  username: string;
  password: string;
};

export interface CreateLoginDTO {
  access: string;
  refresh: string;
};

export interface LoginAccess {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
};

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
};