import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { CATEGORY_LABELS, ClaimStatus, ListingType } from '../../core/models/enums';
import { Listing } from '../../core/models/listing.model';
import { Claim } from '../../core/models/claim.model';
import { Conversation } from '../../core/models/conversation.model';
import { AuthService } from '../../core/services/auth.service';
import { ListingService } from '../../core/services/listing.service';
import { ClaimService } from '../../core/services/claim.service';
import { ConversationService } from '../../core/services/conversation.service';
import { ToastService } from '../../core/services/toast.service';
import { MapView } from '../../shared/components/map-view/map-view';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

@Component({
  selector: 'app-listing-detail-page',
  imports: [RouterLink, MapView, StatusTag, DatePipe],
  templateUrl: './listing-detail-page.html',
  styleUrl: './listing-detail-page.scss',
})
export class ListingDetailPage implements OnInit {
  protected readonly ListingType = ListingType;
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;
  protected readonly ClaimStatus = ClaimStatus;

  protected listing = signal<Listing | null>(null);
  protected loading = signal(true);
  protected myClaim = signal<Claim | null>(null);
  protected conversation = signal<Conversation | null>(null);
  protected claims = signal<Claim[]>([]);
  protected claiming = signal(false);
  protected openingConversation = signal(false);

  protected readonly auth: AuthService;

  private listingId!: number;

  constructor(
    auth: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly listingService: ListingService,
    private readonly claimService: ClaimService,
    private readonly conversationService: ConversationService,
    private readonly toast: ToastService,
  ) {
    this.auth = auth;
  }

  ngOnInit(): void {
    this.listingId = Number(this.route.snapshot.paramMap.get('id'));
    this.load();
  }

  get isOwner(): boolean {
    const user = this.auth.currentUser();
    const listing = this.listing();
    return !!user && !!listing && user.userId === listing.creatorId;
  }

  get isAssignedAdmin(): boolean {
    const user = this.auth.currentUser();
    const listing = this.listing();
    return !!user && !!listing && listing.adminId === user.userId;
  }

  get isAssignedToOtherAdmin(): boolean {
    const listing = this.listing();
    return !!listing && listing.adminId !== null && !this.isAssignedAdmin;
  }

  claim(): void {
    this.claiming.set(true);
    this.claimService.create(this.listingId).subscribe({
      next: (p) => {
        this.myClaim.set(p);
        this.claiming.set(false);
        this.toast.success('Zahtev je poslat.');
        this.loadConversation();
      },
      error: () => this.claiming.set(false),
    });
  }

  startConversation(): void {
    this.openingConversation.set(true);
    this.conversationService.open(this.listingId).subscribe({
      next: (r) => this.router.navigate(['/razgovori', r.conversationId]),
      error: () => this.openingConversation.set(false),
    });
  }

  private load(): void {
    this.loading.set(true);
    this.listingService.getById(this.listingId).subscribe({
      next: (listing) => {
        this.listing.set(listing);
        this.loading.set(false);
        this.loadRelated();
      },
      error: () => this.loading.set(false),
    });
  }

  private loadRelated(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    if (!this.isOwner) {
      this.claimService.getMine().subscribe((claims) => {
        const mine = claims.find((c) => c.listingId === this.listingId);
        if (mine) this.myClaim.set(mine);
      });
    }

    this.loadConversation();

    if (this.auth.isAdmin()) {
      this.claimService.getForListing(this.listingId).subscribe((claims) => {
        this.claims.set(claims);
      });
    }
  }

  private loadConversation(): void {
    this.conversationService
      .getForListing(this.listingId)
      .pipe(catchError(() => of(null)))
      .subscribe((r) => this.conversation.set(r));
  }
}
