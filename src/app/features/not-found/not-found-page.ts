import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <div class="page">
      <div class="empty-state">
        <h2>Stranica ne postoji</h2>
        <p class="text-muted">Proveri link ili se vrati na početnu.</p>
        <a class="btn btn-primary" routerLink="/">Nazad na početnu</a>
      </div>
    </div>
  `,
})
export class NotFoundPage {}
