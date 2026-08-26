import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-tajna-page',
  imports: [FormsModule],
  templateUrl: './admin-tajna-page.html',
  styleUrl: './admin-tajna-page.scss',
})
export class AdminTajnaPage {
  protected submitting = signal(false);

  protected korisnickoIme = '';
  protected email = '';
  protected lozinka = '';
  protected tajniKod = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    if (!this.korisnickoIme || !this.email || !this.lozinka || !this.tajniKod) return;
    this.submitting.set(true);
    this.auth
      .registerAdmin({
        korisnickoIme: this.korisnickoIme,
        email: this.email,
        lozinka: this.lozinka,
        tajniKod: this.tajniKod,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe((res) => {
        this.auth.setSession(res);
        this.router.navigateByUrl('/');
      });
  }
}
