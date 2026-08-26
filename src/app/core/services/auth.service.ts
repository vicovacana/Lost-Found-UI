import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegisterAdminRequest,
  RegisterRequest,
} from '../models/auth.model';

const STORAGE_KEY = 'lf_auth';

function readStoredSession(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthResponse) : null;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<AuthResponse | null>(readStoredSession());

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);
  readonly isAdmin = computed(() => this.currentUserSignal()?.uloga === 'Admin');

  constructor(private readonly http: HttpClient) {}

  login(dto: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, dto);
  }

  register(dto: RegisterRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, dto);
  }

  registerAdmin(dto: RegisterAdminRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register-admin`, dto);
  }

  setSession(auth: AuthResponse): void {
    this.currentUserSignal.set(auth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  }

  logout(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  get token(): string | null {
    return this.currentUserSignal()?.token ?? null;
  }
}
