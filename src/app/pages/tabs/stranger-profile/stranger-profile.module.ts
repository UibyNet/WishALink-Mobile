import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrangerProfilePageRoutingModule } from './stranger-profile-routing.module';

import { StrangerProfilePage } from './stranger-profile.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrangerProfilePageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [StrangerProfilePage]
})
export class StrangerProfilePageModule {}
