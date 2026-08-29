import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SERBIAN_CITIES } from '../../core/models/serbian-cities';
import { CATEGORY_LABELS, CATEGORIES, Category, ListingType } from '../../core/models/enums';
import { Listing } from '../../core/models/listing.model';
import { AuthService } from '../../core/services/auth.service';
import { ListingService } from '../../core/services/listing.service';
import { ListingCard } from '../../shared/components/listing-card/listing-card';

type TypeFilter = 'svi' | ListingType;
type StatusFilter = 'svi' | 'aktivni' | 'neaktivni';

@Component({
  selector: 'app-home-page',
  imports: [FormsModule, ListingCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  protected readonly SERBIAN_CITIES = SERBIAN_CITIES;
  protected readonly CATEGORIES = CATEGORIES;
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;
  protected readonly ListingType = ListingType;

  protected city = signal<string>('');
  protected search = signal<string>('');
  protected type = signal<TypeFilter>('svi');
  protected category = signal<Category | null>(null);
  protected statusFilter = signal<StatusFilter>('aktivni');

  protected listings = signal<Listing[]>([]);
  protected loading = signal(false);

  protected filtered = computed(() => {
    const q = this.search().trim().toLowerCase();
    if (!q) return this.listings();
    return this.listings().filter(
      (o) => o.title.toLowerCase().includes(q) || o.description.toLowerCase().includes(q),
    );
  });

  constructor(
    protected readonly auth: AuthService,
    private readonly listingService: ListingService,
  ) {
    this.reload();
  }

  setType(type: TypeFilter): void {
    this.type.set(type);
    this.reload();
  }

  setStatusFilter(status: StatusFilter): void {
    this.statusFilter.set(status);
    this.reload();
  }

  toggleCategory(k: Category): void {
    this.category.set(this.category() === k ? null : k);
    this.reload();
  }

  onCityChange(): void {
    this.reload();
  }

  private reload(): void {
    this.loading.set(true);
    const typeValue = this.type();
    const statusValue = this.auth.isAdmin() ? this.statusFilter() : 'aktivni';
    this.listingService
      .getAll({
        type: typeValue === 'svi' ? undefined : typeValue,
        city: this.city() || undefined,
        category: this.category() ?? undefined,
        activeOnly: statusValue === 'svi' ? undefined : statusValue === 'aktivni',
      })
      .subscribe({
        next: (data) => {
          this.listings.set(data);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
