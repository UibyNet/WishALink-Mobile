import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionPageRoutingModule } from './suggestion-routing.module';

import { SuggestionPage } from './suggestion.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuggestionPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [SuggestionPage]
})
export class SuggestionPageModule {}
