import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Korisnik, KorisnikUpdate } from '../models/korisnik.model';

@Injectable({ providedIn: 'root' })
export class KorisnikService {
  private readonly base = `${environment.apiUrl}/korisnici`;

  constructor(private readonly http: HttpClient) {}

  getMe() {
    return this.http.get<Korisnik>(`${this.base}/me`);
  }

  updateMe(dto: KorisnikUpdate) {
    return this.http.put<Korisnik>(`${this.base}/me`, dto);
  }
}
