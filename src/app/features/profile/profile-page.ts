import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS, ClaimStatus, ListingType } from '../../core/models/enums';
import { User } from '../../core/models/user.model';
import { Listing } from '../../core/models/listing.model';
import { Claim } from '../../core/models/claim.model';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { ListingService } from '../../core/services/listing.service';
import { ClaimService } from '../../core/services/claim.service';
import { StatusTag } from '../../shared/components/status-tag/status-tag';

type Tab = 'oglasi' | 'potrazivanja';

@Component({
  selector: 'app-profile-page',
  imports: [RouterLink, StatusTag],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss',
})
export class ProfilePage {
  protected readonly ListingType = ListingType;
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;
  protected readonly ClaimStatus = ClaimStatus;

  protected me = signal<User | null>(null);
  protected myListings = signal<Listing[]>([]);
  protected myClaims = signal<Claim[]>([]);
  protected tab = signal<Tab>('oglasi');
  protected loading = signal(true);
  protected withdrawingId = signal<number | null>(null);

  constructor(
    protected readonly auth: AuthService,
    private readonly userService: UserService,
    private readonly listingService: ListingService,
    private readonly claimService: ClaimService,
  ) {
    this.userService.getMe().subscribe((me) => {
      this.me.set(me);
      if (this.auth.isAdmin()) {
        this.loading.set(false);
        return;
      }
      this.listingService.getAll({ creatorId: me.userId }).subscribe((listings) => {
        this.myListings.set(listings);
        this.loading.set(false);
      });
    });
    if (!this.auth.isAdmin()) {
      this.claimService.getMine().subscribe((p) => this.myClaims.set(p));
    }
  }

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  withdrawClaim(listingId: number): void {
    const user = this.auth.currentUser();
    if (!user) return;
    this.withdrawingId.set(listingId);
    this.claimService.withdraw(listingId, user.userId).subscribe({
      next: () => {
        this.withdrawingId.set(null);
        this.myClaims.update((list) => list.filter((c) => c.listingId !== listingId));
      },
      error: () => this.withdrawingId.set(null),
    });
  }
}
