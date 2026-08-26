export interface RegisterRequest {
  korisnickoIme: string;
  email: string;
  lozinka: string;
}

export interface LoginRequest {
  korisnickoIme: string;
  lozinka: string;
}

export interface RegisterAdminRequest {
  korisnickoIme: string;
  email: string;
  lozinka: string;
  tajniKod: string;
}

export interface AuthResponse {
  token: string;
  korisnikId: number;
  korisnickoIme: string;
  email: string;
  uloga: string;
}
