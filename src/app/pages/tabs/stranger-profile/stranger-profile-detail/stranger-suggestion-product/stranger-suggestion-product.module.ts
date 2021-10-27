import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrangerSuggestionProductPageRoutingModule } from './stranger-suggestion-product-routing.module';

import { StrangerSuggestionProductPage } from './stranger-suggestion-product.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrangerSuggestionProductPageRoutingModule
  ],
  declarations: [StrangerSuggestionProductPage]
})
export class StrangerSuggestionProductPageModule {}
