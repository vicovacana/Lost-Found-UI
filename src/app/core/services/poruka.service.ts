import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Poruka, PorukaCreate } from '../models/poruka.model';

@Injectable({ providedIn: 'root' })
export class PorukaService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getForRazgovor(razgovorId: number) {
    return this.http.get<Poruka[]>(`${this.api}/razgovori/${razgovorId}/poruke`);
  }

  create(razgovorId: number, dto: PorukaCreate) {
    return this.http.post<Poruka>(`${this.api}/razgovori/${razgovorId}/poruke`, dto);
  }
}
