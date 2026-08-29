import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-registration-page',
  imports: [FormsModule],
  templateUrl: './admin-registration-page.html',
  styleUrl: './admin-registration-page.scss',
})
export class AdminRegistrationPage {
  protected submitting = signal(false);

  protected username = '';
  protected email = '';
  protected password = '';
  protected secretCode = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  submit(): void {
    if (!this.username || !this.email || !this.password || !this.secretCode) return;
    this.submitting.set(true);
    this.auth
      .registerAdmin({
        username: this.username,
        email: this.email,
        password: this.password,
        secretCode: this.secretCode,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe((res) => {
        this.auth.setSession(res);
        this.router.navigateByUrl('/');
      });
  }
}
