import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage,
    children: [
      {
        path: 'profile-settings',
        loadChildren: () => import('../../../pages/auth/profile-settings/profile-settings.module').then(m => m.ProfileSettingsPageModule)
      },
      {
        path: 'change-password',
        loadChildren: () => import('../../../pages/auth/change-password/change-password.module').then(m => m.ChangePasswordPageModule)
      },
      {
        path: 'change-phone-number',
        loadChildren: () => import('../../../pages/auth/change-phone-number/change-phone-number.module').then(m => m.ChangePhoneNumberPageModule)
      },
      {
        path: 'wallet',
        children: [
          {
            path: '',
            loadChildren: () => import('../../../pages/tabs/wallet/wallet.module').then(m => m.WalletPageModule)
          }
        ]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule { }
