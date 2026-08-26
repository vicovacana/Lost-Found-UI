import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

type Tab = 'login' | 'signup';

@Component({
  selector: 'app-auth-page',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.scss',
})
export class AuthPage {
  protected tab = signal<Tab>('login');
  protected submitting = signal(false);

  protected loginKorisnickoIme = '';
  protected loginLozinka = '';

  protected signupKorisnickoIme = '';
  protected signupEmail = '';
  protected signupLozinka = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  submitLogin(): void {
    if (!this.loginKorisnickoIme || !this.loginLozinka) return;
    this.submitting.set(true);
    this.auth
      .login({ korisnickoIme: this.loginKorisnickoIme, lozinka: this.loginLozinka })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe((res) => {
        this.auth.setSession(res);
        this.redirectAfterAuth();
      });
  }

  submitSignup(): void {
    if (!this.signupKorisnickoIme || !this.signupEmail || !this.signupLozinka) return;
    this.submitting.set(true);
    this.auth
      .register({
        korisnickoIme: this.signupKorisnickoIme,
        email: this.signupEmail,
        lozinka: this.signupLozinka,
      })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe((res) => {
        this.auth.setSession(res);
        this.redirectAfterAuth();
      });
  }

  private redirectAfterAuth(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.router.navigateByUrl(returnUrl || '/');
  }
}
