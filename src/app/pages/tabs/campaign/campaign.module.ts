import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignPageRoutingModule } from './campaign-routing.module';

import { CampaignPage } from './campaign.page';
import {AppPipesModule} from "../../../pipes/pipes.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CampaignPageRoutingModule,
        AppPipesModule,
        TranslateModule
    ],
  declarations: [CampaignPage]
})
export class CampaignPageModule {}
