import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SKIP_ERROR_TOAST } from '../http-context';
import { ConversationStatus } from '../models/enums';
import { Conversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private readonly api = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  open(listingId: number) {
    return this.http.post<Conversation>(`${this.api}/oglasi/${listingId}/razgovor`, {});
  }

  getForListing(listingId: number) {
    return this.http.get<Conversation>(`${this.api}/oglasi/${listingId}/razgovor`, {
      context: new HttpContext().set(SKIP_ERROR_TOAST, true),
    });
  }

  getById(id: number) {
    return this.http.get<Conversation>(`${this.api}/razgovori/${id}`);
  }

  getMine() {
    return this.http.get<Conversation[]>(`${this.api}/razgovori/mine`);
  }

  updateStatus(id: number, status: ConversationStatus) {
    return this.http.patch<Conversation>(`${this.api}/razgovori/${id}/status`, { status });
  }
}
