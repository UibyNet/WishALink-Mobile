import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaymentResultPage } from './payment-result.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentResultPageRoutingModule {}
