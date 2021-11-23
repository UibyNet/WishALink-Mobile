import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { KpaygoPage } from './kpaygo.page';

const routes: Routes = [
  {
    path: '',
    component: KpaygoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KpaygoPageRoutingModule {}
