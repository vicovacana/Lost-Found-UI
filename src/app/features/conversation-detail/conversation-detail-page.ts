import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription, finalize, forkJoin, interval } from 'rxjs';
import { ClaimStatus, ConversationStatus } from '../../core/models/enums';
import { Message } from '../../core/models/message.model';
import { Claim } from '../../core/models/claim.model';
import { Conversation } from '../../core/models/conversation.model';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';
import { ClaimService } from '../../core/services/claim.service';
import { ConversationService } from '../../core/services/conversation.service';
import { ToastService } from '../../core/services/toast.service';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

const POLL_INTERVAL_MS = 5_000;

@Component({
  selector: 'app-conversation-detail-page',
  imports: [FormsModule, StatusTag, DatePipe],
  templateUrl: './conversation-detail-page.html',
  styleUrl: './conversation-detail-page.scss',
})
export class ConversationDetailPage implements OnInit, OnDestroy {
  protected readonly ConversationStatus = ConversationStatus;
  protected readonly ClaimStatus = ClaimStatus;

  protected conversation = signal<Conversation | null>(null);
  protected messages = signal<Message[]>([]);
  protected pending = signal<Claim[]>([]);
  protected myClaim = signal<Claim | null>(null);
  protected loading = signal(true);
  protected sending = signal(false);
  protected newMessage = '';

  @ViewChild('scrollAnchor') private scrollAnchor?: ElementRef<HTMLDivElement>;

  private conversationId!: number;
  private pollSub?: Subscription;

  constructor(
    protected readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly claimService: ClaimService,
    private readonly toast: ToastService,
  ) {}

  ngOnInit(): void {
    this.conversationId = Number(this.route.snapshot.paramMap.get('id'));
    this.conversationService.getById(this.conversationId).subscribe({
      next: (r) => {
        this.conversation.set(r);
        this.loading.set(false);
        this.loadMessages();
        this.loadMyClaim(r.listingId);
        if (this.auth.isAdmin() && r.status === ConversationStatus.Open) {
          this.loadPending(r.listingId);
        }
        this.pollSub = interval(POLL_INTERVAL_MS).subscribe(() => {
          this.loadMessages();
          this.refreshConversation();
        });
      },
      error: () => this.loading.set(false),
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  get currentUserId(): number | null {
    return this.auth.currentUser()?.userId ?? null;
  }

  sendMessage(): void {
    const content = this.newMessage.trim();
    if (!content) return;
    this.sending.set(true);
    this.messageService
      .create(this.conversationId, { content })
      .pipe(finalize(() => this.sending.set(false)))
      .subscribe((message) => {
        this.messages.update((list) => [...list, message]);
        this.newMessage = '';
        this.scrollToBottom();
      });
  }

  decideClaim(p: Claim, status: ClaimStatus): void {
    const listingId = this.conversation()?.listingId;
    if (!listingId) return;
    this.claimService.updateStatus(listingId, p.userId, status).subscribe(() => {
      if (status === ClaimStatus.Accepted) {
        this.pending.set([]);
        this.conversation.update((r) => (r ? { ...r, status: ConversationStatus.Closed } : r));
        this.toast.success('Potraživanje prihvaćeno. Razgovor je automatski zatvoren.');
      } else {
        this.pending.update((list) => list.filter((x) => x.userId !== p.userId));
        this.toast.success('Potraživanje odbijeno.');
      }
    });
  }

  rejectAll(): void {
    const listingId = this.conversation()?.listingId;
    const all = this.pending();
    if (!listingId || all.length === 0) return;

    forkJoin(
      all.map((p) => this.claimService.updateStatus(listingId, p.userId, ClaimStatus.Rejected)),
    ).subscribe(() => {
      this.pending.set([]);
      this.conversationService.updateStatus(this.conversationId, ConversationStatus.Closed).subscribe((r) => {
        this.conversation.set(r);
      });
      this.toast.success('Sva potraživanja su odbijena. Razgovor je zatvoren.');
    });
  }

  private refreshConversation(): void {
    this.conversationService.getById(this.conversationId).subscribe((r) => {
      this.conversation.set(r);
      this.loadMyClaim(r.listingId);
    });
  }

  private loadMyClaim(listingId: number): void {
    if (this.auth.isAdmin()) return;
    this.claimService.getMine().subscribe((claims) => {
      this.myClaim.set(claims.find((c) => c.listingId === listingId) ?? null);
    });
  }

  private loadMessages(): void {
    this.messageService.getForConversation(this.conversationId).subscribe((messages) => {
      const hasNew = messages.length > this.messages().length;
      this.messages.set(messages);
      if (hasNew) this.scrollToBottom();
    });
  }

  private loadPending(listingId: number): void {
    this.claimService.getForListing(listingId).subscribe((claims) => {
      this.pending.set(claims.filter((c) => c.status === ClaimStatus.Pending));
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }
}
