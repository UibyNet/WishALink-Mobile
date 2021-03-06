import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CampaignPage } from './campaign.page';

const routes: Routes = [
  {
    path: '',
    component: CampaignPage
  },
  {
    path: 'campaign-detail',
    loadChildren: () => import('./campaign-detail/campaign-detail.module').then( m => m.CampaignDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignPageRoutingModule {}
