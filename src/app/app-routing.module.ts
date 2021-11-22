import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './helpers/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'intro',
    pathMatch: 'full'
  },
  {
    path: 'intro',
    loadChildren: () => import('./pages/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/auth/forgot/forgot.module').then( m => m.ForgotPageModule)
  },
  {
    path: 'change-phone-number',
    loadChildren: () => import('./pages/auth/change-phone-number/change-phone-number.module').then( m => m.ChangePhoneNumberPageModule)
  },
  {
    path: 'profile-settings',
    loadChildren: () => import('./pages/auth/profile-settings/profile-settings.module').then( m => m.ProfileSettingsPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/auth/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  },
  {
    path: 'app',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'add-product/:id',
    loadChildren: () => import('./pages/add-product/add-product.module').then( m => m.AddProductPageModule)
  },
  {
    path: 'landing',
    loadChildren: () => import('./pages/landing/landing.module').then( m => m.LandingPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
