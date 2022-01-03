import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

import { SuggestionPageRoutingModule } from './suggestion-routing.module';

import { SuggestionPage } from './suggestion.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        VirtualScrollerModule,
        SuggestionPageRoutingModule,
        SharedDirectivesModule,
        SharedComponentsModule,
        TranslateModule
    ],
  declarations: [SuggestionPage]
})
export class SuggestionPageModule {}
