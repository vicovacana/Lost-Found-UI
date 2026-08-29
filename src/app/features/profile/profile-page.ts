import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS, ListingType } from '../../core/models/enums';
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

  protected me = signal<User | null>(null);
  protected myListings = signal<Listing[]>([]);
  protected myClaims = signal<Claim[]>([]);
  protected tab = signal<Tab>('oglasi');
  protected loading = signal(true);

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
}
