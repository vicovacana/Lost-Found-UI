import { Component, Input } from '@angular/core';
import {
  CLAIM_STATUS_LABELS,
  CONVERSATION_STATUS_LABELS,
  ClaimStatus,
  ConversationStatus,
} from '../../../core/models/enums';

@Component({
  selector: 'app-status-tag',
  template: `<span class="tag" [class]="cssClass">{{ label }}</span>`,
})
export class StatusTag {
  @Input() set claim(status: ClaimStatus) {
    this.label = CLAIM_STATUS_LABELS[status];
    this.cssClass =
      status === ClaimStatus.Accepted
        ? 'tag-accepted'
        : status === ClaimStatus.Rejected
          ? 'tag-rejected'
          : 'tag-pending';
  }

  @Input() set conversation(status: ConversationStatus) {
    this.label = CONVERSATION_STATUS_LABELS[status];
    this.cssClass = status === ConversationStatus.Open ? 'tag-open' : 'tag-closed';
  }

  protected label = '';
  protected cssClass = 'tag-outline';
}
