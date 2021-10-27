import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StrangerProfilePageRoutingModule } from './stranger-profile-routing.module';

import { StrangerProfilePage } from './stranger-profile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StrangerProfilePageRoutingModule
  ],
  declarations: [StrangerProfilePage]
})
export class StrangerProfilePageModule {}
