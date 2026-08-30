import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { User, UserUpdate } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly base = `${environment.apiUrl}/korisnici`;

  constructor(private readonly http: HttpClient) {}

  getMe() {
    return this.http.get<User>(`${this.base}/me`);
  }

  getById(id: number) {
    return this.http.get<User>(`${this.base}/${id}`);
  }

  updateMe(dto: UserUpdate) {
    return this.http.put<User>(`${this.base}/me`, dto);
  }
}
