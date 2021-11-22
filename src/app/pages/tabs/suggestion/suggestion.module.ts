import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuggestionPageRoutingModule } from './suggestion-routing.module';

import { SuggestionPage } from './suggestion.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    SuggestionPageRoutingModule,
    SharedDirectivesModule,
    SharedComponentsModule
  ],
  declarations: [SuggestionPage]
})
export class SuggestionPageModule {}
