import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CATEGORY_LABELS, ListingType } from '../../core/models/enums';
import { Listing } from '../../core/models/listing.model';
import { User } from '../../core/models/user.model';
import { ListingService } from '../../core/services/listing.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-user-profile-page',
  imports: [RouterLink, DatePipe],
  templateUrl: './user-profile-page.html',
  styleUrl: './user-profile-page.scss',
})
export class UserProfilePage implements OnInit {
  protected readonly ListingType = ListingType;
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;

  protected user = signal<User | null>(null);
  protected listings = signal<Listing[]>([]);
  protected loading = signal(true);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly listingService: ListingService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.userService.getById(id).subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
        if (user.role !== 'Admin') {
          this.listingService.getAll({ creatorId: id }).subscribe((listings) => {
            this.listings.set(listings);
          });
        }
      },
      error: () => this.loading.set(false),
    });
  }
}
