import { Component } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  template: `
    <div class="toast-host">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class.toast-error]="toast.kind === 'error'" [class.toast-success]="toast.kind === 'success'">
          {{ toast.message }}
        </div>
      }
    </div>
  `,
})
export class ToastHost {
  constructor(protected readonly toastService: ToastService) {}
}
