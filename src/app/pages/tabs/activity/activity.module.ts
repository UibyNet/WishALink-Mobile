import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPageRoutingModule } from './activity-routing.module';

import { ActivityPage } from './activity.page';
import { NgCalendarModule  } from 'ionic2-calendar';
@NgModule({
  providers: [
    { provide: LOCALE_ID, useValue: 'tr' }
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    ActivityPageRoutingModule
  ],
  declarations: [ActivityPage]
})
export class ActivityPageModule {}
