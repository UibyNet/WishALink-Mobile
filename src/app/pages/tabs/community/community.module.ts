import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityPageRoutingModule } from './community-routing.module';

import { CommunityPage } from './community.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CommunityPageRoutingModule,
        SharedDirectivesModule,
        TranslateModule
    ],
  declarations: [CommunityPage]
})
export class CommunityPageModule {}
