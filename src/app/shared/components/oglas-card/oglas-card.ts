import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { KATEGORIJA_LABELS, TipOglasa } from '../../../core/models/enums';
import { Oglas } from '../../../core/models/oglas.model';

@Component({
  selector: 'app-oglas-card',
  imports: [RouterLink],
  templateUrl: './oglas-card.html',
  styleUrl: './oglas-card.scss',
})
export class OglasCard {
  @Input({ required: true }) oglas!: Oglas;

  protected readonly TipOglasa = TipOglasa;
  protected readonly KATEGORIJA_LABELS = KATEGORIJA_LABELS;

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
