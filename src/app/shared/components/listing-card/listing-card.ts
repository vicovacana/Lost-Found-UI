import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORY_LABELS, ListingType } from '../../../core/models/enums';
import { Listing } from '../../../core/models/listing.model';

@Component({
  selector: 'app-listing-card',
  imports: [RouterLink],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.scss',
})
export class ListingCard {
  @Input({ required: true }) listing!: Listing;

  protected readonly ListingType = ListingType;
  protected readonly CATEGORY_LABELS = CATEGORY_LABELS;

  protected relativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'upravo sad';
    if (minutes < 60) return `pre ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `pre ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return days === 1 ? 'juče' : `pre ${days} dana`;
    return new Date(iso).toLocaleDateString('sr-Latn-RS');
  }
}
