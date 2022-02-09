import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage as ProfilePage } from './profile.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedDirectivesModule,
    SharedComponentsModule,
    TranslateModule
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule {}
