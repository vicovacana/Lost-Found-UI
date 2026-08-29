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

  protected loginPasswordVisible = signal(false);
  protected signupPasswordVisible = signal(false);

  protected loginUsername = '';
  protected loginPassword = '';

  protected signupUsername = '';
  protected signupEmail = '';
  protected signupPassword = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  toggleLoginPasswordVisible(): void {
    this.loginPasswordVisible.update((v) => !v);
  }

  toggleSignupPasswordVisible(): void {
    this.signupPasswordVisible.update((v) => !v);
  }

  submitLogin(): void {
    if (!this.loginUsername || !this.loginPassword) return;
    this.submitting.set(true);
    this.auth
      .login({ username: this.loginUsername, password: this.loginPassword })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe((res) => {
        this.auth.setSession(res);
        this.redirectAfterAuth();
      });
  }

  submitSignup(): void {
    if (!this.signupUsername || !this.signupEmail || !this.signupPassword) return;
    this.submitting.set(true);
    this.auth
      .register({
        username: this.signupUsername,
        email: this.signupEmail,
        password: this.signupPassword,
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
