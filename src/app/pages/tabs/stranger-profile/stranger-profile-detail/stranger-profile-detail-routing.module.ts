import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StrangerProfileDetailPage } from './stranger-profile-detail.page';

const routes: Routes = [
  {
    path: '',
    component: StrangerProfileDetailPage
  },
  {
    path: 'stranger-suggestion-product',
    loadChildren: () => import('./stranger-suggestion-product/stranger-suggestion-product.module').then( m => m.StrangerSuggestionProductPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrangerProfileDetailPageRoutingModule {}
