import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Oglas, OglasCreate, OglasFilters, OglasUpdate } from '../models/oglas.model';

@Injectable({ providedIn: 'root' })
export class OglasService {
  private readonly base = `${environment.apiUrl}/oglasi`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: OglasFilters = {}) {
    let params = new HttpParams();
    if (filters.tip !== undefined) params = params.set('tip', filters.tip);
    if (filters.kreatorId !== undefined) params = params.set('kreatorId', filters.kreatorId);
    if (filters.adminId !== undefined) params = params.set('adminId', filters.adminId);
    if (filters.kategorija !== undefined) params = params.set('kategorija', filters.kategorija);
    if (filters.grad) params = params.set('grad', filters.grad);
    if (filters.samoAktivni !== undefined) params = params.set('samoAktivni', filters.samoAktivni);
    return this.http.get<Oglas[]>(this.base, { params });
  }

  getById(id: number) {
    return this.http.get<Oglas>(`${this.base}/${id}`);
  }

  create(dto: OglasCreate) {
    return this.http.post<Oglas>(this.base, dto);
  }

  uploadFotografija(fajl: File) {
    const formData = new FormData();
    formData.append('fajl', fajl);
    return this.http.post<{ url: string }>(`${this.base}/fotografije`, formData);
  }

  update(id: number, dto: OglasUpdate) {
    return this.http.put<Oglas>(`${this.base}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  assignAdmin(id: number, adminId?: number) {
    return this.http.patch<Oglas>(`${this.base}/${id}/admin`, { adminId: adminId ?? null });
  }

  clearAdmin(id: number) {
    return this.http.delete<Oglas>(`${this.base}/${id}/admin`);
  }
}
