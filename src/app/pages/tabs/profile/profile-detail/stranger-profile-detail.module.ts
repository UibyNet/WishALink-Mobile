import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrangerProfileDetailPageRoutingModule } from './stranger-profile-detail-routing.module';

import { StrangerProfileDetailPage } from './stranger-profile-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrangerProfileDetailPageRoutingModule
  ],
  declarations: [StrangerProfileDetailPage]
})
export class StrangerProfileDetailPageModule {}
