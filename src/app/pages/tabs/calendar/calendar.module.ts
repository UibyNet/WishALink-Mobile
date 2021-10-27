import { NgModule,LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
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
    CalendarPageRoutingModule
  ],
  declarations: [CalendarPage]
})
export class CalendarPageModule {}
