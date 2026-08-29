import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, computed, signal } from '@angular/core';
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
import { ListingService } from '../../core/services/listing.service';
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
  protected allClaims = signal<Claim[]>([]);
  protected myClaim = signal<Claim | null>(null);
  protected isOwner = signal(false);
  protected loading = signal(true);
  protected sending = signal(false);
  protected newMessage = '';

  protected pending = computed(() => this.allClaims().filter((c) => c.status === ClaimStatus.Pending));
  protected acceptedClaim = computed(() => this.allClaims().find((c) => c.status === ClaimStatus.Accepted) ?? null);
  protected allRejected = computed(
    () => this.allClaims().length > 0 && this.allClaims().every((c) => c.status === ClaimStatus.Rejected),
  );

  @ViewChild('scrollAnchor') private scrollAnchor?: ElementRef<HTMLDivElement>;

  private conversationId!: number;
  private pollSub?: Subscription;

  constructor(
    protected readonly auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly conversationService: ConversationService,
    private readonly messageService: MessageService,
    private readonly claimService: ClaimService,
    private readonly listingService: ListingService,
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
        if (this.auth.isAdmin()) {
          this.loadClaims(r.listingId);
        } else {
          this.checkOwnerAndLoadClaims(r.listingId);
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
        this.allClaims.update((list) =>
          list.map((c) =>
            c.userId === p.userId
              ? { ...c, status: ClaimStatus.Accepted }
              : c.status === ClaimStatus.Pending
                ? { ...c, status: ClaimStatus.Rejected }
                : c,
          ),
        );
        this.conversation.update((r) => (r ? { ...r, status: ConversationStatus.Closed } : r));
        this.toast.success('Potraživanje prihvaćeno. Razgovor je automatski zatvoren.');
      } else {
        this.allClaims.update((list) =>
          list.map((c) => (c.userId === p.userId ? { ...c, status: ClaimStatus.Rejected } : c)),
        );
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
      this.allClaims.update((list) =>
        list.map((c) => (c.status === ClaimStatus.Pending ? { ...c, status: ClaimStatus.Rejected } : c)),
      );
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

  private loadClaims(listingId: number): void {
    this.claimService.getForListing(listingId).subscribe((claims) => {
      this.allClaims.set(claims);
    });
  }

  private checkOwnerAndLoadClaims(listingId: number): void {
    this.listingService.getById(listingId).subscribe((listing) => {
      const owner = listing.creatorId === this.currentUserId;
      this.isOwner.set(owner);
      if (owner) this.loadClaims(listingId);
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => this.scrollAnchor?.nativeElement.scrollIntoView({ behavior: 'smooth' }));
  }
}
