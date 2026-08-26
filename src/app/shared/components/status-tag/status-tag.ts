import { Component, Input } from '@angular/core';
import {
  STATUS_POTRAZIVANJA_LABELS,
  STATUS_RAZGOVORA_LABELS,
  StatusPotrazivanja,
  StatusRazgovora,
} from '../../../core/models/enums';

@Component({
  selector: 'app-status-tag',
  template: `<span class="tag" [class]="cssClass">{{ label }}</span>`,
})
export class StatusTag {
  @Input() set potrazivanje(status: StatusPotrazivanja) {
    this.label = STATUS_POTRAZIVANJA_LABELS[status];
    this.cssClass =
      status === StatusPotrazivanja.Prihvaceno
        ? 'tag-accepted'
        : status === StatusPotrazivanja.Odbijeno
          ? 'tag-rejected'
          : 'tag-pending';
  }

  @Input() set razgovor(status: StatusRazgovora) {
    this.label = STATUS_RAZGOVORA_LABELS[status];
    this.cssClass = status === StatusRazgovora.Otvoren ? 'tag-open' : 'tag-closed';
  }

  protected label = '';
  protected cssClass = 'tag-outline';
}
