import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  protected confirmingLogout = signal(false);

  constructor(
    protected readonly auth: AuthService,
    private readonly router: Router,
  ) {}

  askLogout(): void {
    this.confirmingLogout.set(true);
  }

  cancelLogout(): void {
    this.confirmingLogout.set(false);
  }

  confirmLogout(): void {
    this.confirmingLogout.set(false);
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
