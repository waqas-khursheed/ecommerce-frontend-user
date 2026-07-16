export interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string;
  username?: string | null;
  company_name?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}
