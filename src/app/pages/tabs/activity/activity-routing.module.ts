import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityPage } from './activity.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityPage
  },
  {
    path: 'create',
    loadChildren: () => import('./create-activity/create-activity.module').then( m => m.CreateActivityPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityPageRoutingModule {}
