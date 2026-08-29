export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterAdminRequest {
  username: string;
  email: string;
  password: string;
  secretCode: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  username: string;
  email: string;
  role: string;
}
