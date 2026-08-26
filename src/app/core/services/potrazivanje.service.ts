import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { StatusPotrazivanja } from '../models/enums';
import { Potrazivanje } from '../models/potrazivanje.model';

@Injectable({ providedIn: 'root' })
export class PotrazivanjeService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  create(oglasId: number) {
    return this.http.post<Potrazivanje>(`${this.api}/oglasi/${oglasId}/potrazivanja`, {});
  }

  getForOglas(oglasId: number) {
    return this.http.get<Potrazivanje[]>(`${this.api}/oglasi/${oglasId}/potrazivanja`);
  }

  getMine() {
    return this.http.get<Potrazivanje[]>(`${this.api}/potrazivanja/mine`);
  }

  updateStatus(oglasId: number, korisnikId: number, status: StatusPotrazivanja) {
    return this.http.patch<Potrazivanje>(
      `${this.api}/oglasi/${oglasId}/potrazivanja/${korisnikId}/status`,
      { status },
    );
  }

  withdraw(oglasId: number, korisnikId: number) {
    return this.http.delete<void>(`${this.api}/oglasi/${oglasId}/potrazivanja/${korisnikId}`);
  }
}
