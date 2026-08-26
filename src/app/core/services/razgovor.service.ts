import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_TOAST } from '../http-context';
import { StatusRazgovora } from '../models/enums';
import { Razgovor } from '../models/razgovor.model';

@Injectable({ providedIn: 'root' })
export class RazgovorService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  open(oglasId: number) {
    return this.http.post<Razgovor>(`${this.api}/oglasi/${oglasId}/razgovor`, {});
  }

  getForOglas(oglasId: number) {
    return this.http.get<Razgovor>(`${this.api}/oglasi/${oglasId}/razgovor`, {
      context: new HttpContext().set(SKIP_ERROR_TOAST, true),
    });
  }

  getById(id: number) {
    return this.http.get<Razgovor>(`${this.api}/razgovori/${id}`);
  }

  getMine() {
    return this.http.get<Razgovor[]>(`${this.api}/razgovori/mine`);
  }

  updateStatus(id: number, statusRazgovora: StatusRazgovora) {
    return this.http.patch<Razgovor>(`${this.api}/razgovori/${id}/status`, { statusRazgovora });
  }
}
