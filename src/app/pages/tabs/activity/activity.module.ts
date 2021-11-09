import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPageRoutingModule } from './activity-routing.module';

import { ActivityPage } from './activity.page';
import { NgCalendarModule  } from 'ionic2-calendar';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'tr' }
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    ActivityPageRoutingModule,
    SharedDirectivesModule,
    SharedComponentsModule
  ],
  declarations: [ActivityPage]
})
export class ActivityPageModule {}
