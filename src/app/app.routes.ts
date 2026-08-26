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
      import('./features/oglas-form/oglas-form-page').then((m) => m.OglasFormPage),
    canActivate: [authGuard],
  },
  {
    path: 'oglasi/:id',
    loadComponent: () =>
      import('./features/oglas-detail/oglas-detail-page').then((m) => m.OglasDetailPage),
  },
  {
    path: 'oglasi/:id/izmena',
    loadComponent: () =>
      import('./features/oglas-form/oglas-form-page').then((m) => m.OglasFormPage),
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
      import('./features/razgovori/razgovori-list-page').then((m) => m.RazgovoriListPage),
    canActivate: [authGuard],
  },
  {
    path: 'razgovori/:id',
    loadComponent: () =>
      import('./features/razgovor-detail/razgovor-detail-page').then(
        (m) => m.RazgovorDetailPage,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'tajna-admin-registracija',
    loadComponent: () =>
      import('./features/admin-tajna/admin-tajna-page').then((m) => m.AdminTajnaPage),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
