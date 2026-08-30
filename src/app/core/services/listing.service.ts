import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Listing, ListingCreate, ListingFilters, ListingUpdate } from '../models/listing.model';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly base = `${environment.apiUrl}/oglasi`;

  constructor(private readonly http: HttpClient) {}

  getAll(filters: ListingFilters = {}) {
    let params = new HttpParams();
    if (filters.type !== undefined) params = params.set('tip', filters.type);
    if (filters.creatorId !== undefined) params = params.set('kreatorId', filters.creatorId);
    if (filters.adminId !== undefined) params = params.set('adminId', filters.adminId);
    if (filters.category !== undefined) params = params.set('kategorija', filters.category);
    if (filters.city) params = params.set('grad', filters.city);
    if (filters.activeOnly !== undefined) params = params.set('samoAktivni', filters.activeOnly);
    return this.http.get<Listing[]>(this.base, { params });
  }

  getById(id: number) {
    return this.http.get<Listing>(`${this.base}/${id}`);
  }

  create(dto: ListingCreate) {
    return this.http.post<Listing>(this.base, dto);
  }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('fajl', file);
    return this.http.post<{ url: string }>(`${this.base}/fotografije`, formData);
  }

  update(id: number, dto: ListingUpdate) {
    return this.http.put<Listing>(`${this.base}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
