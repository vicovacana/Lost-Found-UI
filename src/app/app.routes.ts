import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page').then((m) => m.HomePage),
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth-page').then((m) => m.AuthPage),
  },
  {
    path: 'oglasi/novi',
    loadComponent: () =>
      import('./features/listing-form/listing-form-page').then((m) => m.ListingFormPage),
    canActivate: [authGuard],
    data: { standardUserOnly: true },
  },
  {
    path: 'oglasi/:id',
    loadComponent: () =>
      import('./features/listing-detail/listing-detail-page').then((m) => m.ListingDetailPage),
  },
  {
    path: 'oglasi/:id/izmena',
    loadComponent: () =>
      import('./features/listing-form/listing-form-page').then((m) => m.ListingFormPage),
    canActivate: [authGuard],
  },
  {
    path: 'profil',
    loadComponent: () => import('./features/profile/profile-page').then((m) => m.ProfilePage),
    canActivate: [authGuard],
  },
  {
    path: 'razgovori',
    loadComponent: () =>
      import('./features/conversations/conversations-list-page').then(
        (m) => m.ConversationsListPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'razgovori/:id',
    loadComponent: () =>
      import('./features/conversation-detail/conversation-detail-page').then(
        (m) => m.ConversationDetailPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin-registration',
    loadComponent: () =>
      import('./features/admin-registration/admin-registration-page').then(
        (m) => m.AdminRegistrationPage,
      ),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
