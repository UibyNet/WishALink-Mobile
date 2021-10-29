import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CalendarModule} from 'primeng/calendar';
import { IonicModule } from '@ionic/angular';
import {InputTextModule} from 'primeng/inputtext';

import { AddProductPageRoutingModule } from './add-product-routing.module';

import { AddProductPage } from './add-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarModule,
    InputTextModule,
    AddProductPageRoutingModule
  ],
  declarations: [AddProductPage]
})
export class AddProductPageModule {}
