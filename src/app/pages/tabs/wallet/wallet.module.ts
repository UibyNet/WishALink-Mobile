import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WalletPage } from './wallet.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: WalletPage },
      {
        path: 'cards',
        children: [
          {
            path: '',
            loadChildren: () => import('./card-list/card-list.module').then(m => m.CardListPageModule)
          }
        ]
      },
      {
        path: 'card/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('./card-edit/card-edit.module').then(m => m.CardEditPageModule)
          }
        ]
      },
      {
        path: 'history',
        children: [
          {
            path: '',
            loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
          }
        ]
      },
      {
        path: 'history-detail/:kpayTxnId',
        children: [
          {
            path: '',
            loadChildren: () => import('./history/history.module').then(m => m.HistoryPageModule)
          }
        ]
      },
    ])
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
