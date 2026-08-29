import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ClaimStatus } from '../models/enums';
import { Claim } from '../models/claim.model';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  create(listingId: number) {
    return this.http.post<Claim>(`${this.api}/oglasi/${listingId}/potrazivanja`, {});
  }

  getForListing(listingId: number) {
    return this.http.get<Claim[]>(`${this.api}/oglasi/${listingId}/potrazivanja`);
  }

  getMine() {
    return this.http.get<Claim[]>(`${this.api}/potrazivanja/mine`);
  }

  updateStatus(listingId: number, userId: number, status: ClaimStatus) {
    return this.http.patch<Claim>(
      `${this.api}/oglasi/${listingId}/potrazivanja/${userId}/status`,
      { status },
    );
  }

  withdraw(listingId: number, userId: number) {
    return this.http.delete<void>(`${this.api}/oglasi/${listingId}/potrazivanja/${userId}`);
  }
}
