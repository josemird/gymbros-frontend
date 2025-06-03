import { Routes } from '@angular/router';
import { authGuard } from './services/auth/auth.guard';
import { guestGuard } from './services/auth/guest.guard';

const REGISTER_PATH = 'register';
const LOGIN_PATH = 'login';
const HOME_PATH = 'home';
const PROFILE_PATH = 'profile';
const MESSAGES_PATH = 'messages';
const LIKES_PATH = 'likes';
const RESET_PASSWORD_PATH = 'reset-password';
const VERIFY_CODE_PATH = 'verify-code';

export const appRoutes: Routes = [
  { path: '', redirectTo: HOME_PATH, pathMatch: 'full' },

  { path: LOGIN_PATH, loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent), canActivate: [guestGuard] },
  { path: REGISTER_PATH, loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent), canActivate: [guestGuard] },
  { path: RESET_PASSWORD_PATH, loadComponent: () => import('./pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent), canActivate: [guestGuard] },
  { path: VERIFY_CODE_PATH, loadComponent: () => import('./pages/verify-code/verify-code.component').then(m => m.ResetVerifyCodeComponent), canActivate: [guestGuard] },

  { path: HOME_PATH, loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), canActivate: [authGuard] },
  { path: LIKES_PATH, loadComponent: () => import('./pages/likes/likes.component').then(m => m.LikesComponent), canActivate: [authGuard] },
  { path: MESSAGES_PATH, loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent), canActivate: [authGuard] },
  { path: `${MESSAGES_PATH}/:id`, loadComponent: () => import('./pages/messages/chat/chat.component').then(m => m.ChatComponent), canActivate: [authGuard] },
  { path: PROFILE_PATH, loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [authGuard] },

];
