import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CampaignDetailPageRoutingModule } from './campaign-detail-routing.module';

import { CampaignDetailPage } from './campaign-detail.page';
import {AppPipesModule} from "../../../../pipes/pipes.module";
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CampaignDetailPageRoutingModule,
        AppPipesModule,
        SharedDirectivesModule
    ],
  declarations: [CampaignDetailPage]
})
export class CampaignDetailPageModule {}
