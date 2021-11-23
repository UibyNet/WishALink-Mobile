import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentResultPageRoutingModule } from './payment-result-routing.module';

import { PaymentResultPage } from './payment-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaymentResultPageRoutingModule
  ],
  declarations: [PaymentResultPage]
})
export class PaymentResultPageModule {}
