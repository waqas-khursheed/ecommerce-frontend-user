// Mirrors publicUser() in backed/src/modules/auth/services/auth.service.js
export interface User {
  id: number;
  first_name: string;
  last_name: string | null;
  username: string | null;
  email: string;
  phone: string;
  type: string | null;
  company_name: string | null;
  is_active: 0 | 1;
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

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  username?: string;
  phone?: string;
  company_name?: string;
}

export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}
