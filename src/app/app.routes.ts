import { Routes } from '@angular/router';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Registration } from './features/auth/registration/registration';
import { islogedinGuard } from './core/auth/guards/islogedin-guard';
import { islogedoutGuard } from './core/auth/guards/islogedout-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'registration', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayout,
    title: 'LogIn | Registration',
    canActivate: [islogedoutGuard],
    children: [
      { path: 'registration', component: Registration },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then((c) => c.Login),
      },
    ],
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((c) => c.MainLayout),
    title: 'Social Hub',
    canActivate: [islogedinGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./features/home/feed/feed').then((c) => c.Feed),
        title: 'Feed',
        children: [],
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/home/profile/profile').then((c) => c.Profile),
        title: 'Profile',
      },
      {
        path: 'suggests-frends',
        loadComponent: () => import('./features/home/suggests-frends-page/suggests-frends-page.component').then((c) => c.SuggestsFrendsPageComponent),
        title: 'suggests frends',
      },
      {
        path: 'user-details/:id',
        loadComponent: () =>
          import('./features/home/user-details/user-details.component').then(
            (c) => c.UserDetailsComponent,
          ),
        title: 'User Detail',
      },
      {
        path: 'Post-Details/:id',
        loadComponent: () =>
          import('./features/home/post-details/post-details.component').then(
            (c) => c.PostDetailsComponent,
          ),
        title: 'Post Details',
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/home/sittings/sittings.component').then((c) => c.SittingsComponent),
        title: 'Post Details',
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/home/notification/notification').then((c) => c.Notification),
        title: 'Notifications',
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./features/error/notfound/notfound').then((c) => c.Notfound),
    title: "Page is't Found",
  },
];
