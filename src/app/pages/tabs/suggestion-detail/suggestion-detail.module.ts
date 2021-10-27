import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionDetailPageRoutingModule } from './suggestion-detail-routing.module';

import { SuggestionDetailPage } from './suggestion-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestionDetailPageRoutingModule
  ],
  declarations: [SuggestionDetailPage]
})
export class SuggestionDetailPageModule {}
