import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from "ionic2-calendar";
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/tr';
import { ActivityApiService, ActivityListModel, SocialUserListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';
import {NotificationComponent} from "../../../components/notification/notification.component";
import {ModalController} from "@ionic/angular";

registerLocaleData(localeZh);


@Component({
    selector: 'app-activity',
    templateUrl: './activity.page.html',
    styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

    @ViewChild(CalendarComponent, { static: false }) calendarComponent: CalendarComponent;

    eventSource = [];
    viewTitle;
    isToday: boolean;
    userData: SocialUserListModel
    calendar = {
        mode: 'month' as CalendarMode,
        step: 30 as Step,
        currentDate: new Date(),
        dateFormatter: {
            formatMonthViewDay(date: Date) {
                return date.getDate().toString();
            },
            formatMonthViewDayHeader(date: Date) {
                return 'MonMH';
            },
            formatMonthViewTitle(date: Date) {
                return 'testMT';
            },
            formatWeekViewDayHeader(date: Date) {
                return 'MonWH';
            },
            formatWeekViewTitle(date: Date) {
                return 'testWT';
            },
            formatWeekViewHourColumn(date: Date) {
                return 'testWH';
            },
            formatDayViewHourColumn(date: Date) {
                return 'testDH';
            },
            formatDayViewTitle(date: Date) {
                return 'testDT';
            }
        }
    };

    constructor(
        private appService: AppService,
        private activityApiService: ActivityApiService,
        private modalController:ModalController
    ) {
    }

    ngOnInit() {
        this.userData = this.appService.userInfo
        this.loadEvents();
    }

    loadEvents() {
        this.activityApiService.list(this.appService.user.id)
            .subscribe(
                v => this.onActivitiesLoad(v),
                e => this.onError(e)
            )
    }

    onActivitiesLoad(v: ActivityListModel[]): void {
        if (v != undefined && v.length > 0) {
            for (const activity of v) {
                this.eventSource.push({
                    title: activity.name,
                    startTime: moment(activity.startDate, 'DD.MM.YYYY HH:mm').toDate(),
                    endTime: moment(activity.endDate, 'DD.MM.YYYY HH:mm').toDate(),
                    allDay: true
                });
            }
            this.calendarComponent.loadEvents();
        }
    }

    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' +
            (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    }

    onCurrentDateChanged(event: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    createRandomEvents() {
        const events = [];
        for (let i = 0; i < 50; i += 1) {
            const date = new Date();
            const eventType = Math.floor(Math.random() * 2);
            const startDay = Math.floor(Math.random() * 90) - 45;
            let endDay = Math.floor(Math.random() * 2) + startDay;
            let startTime;
            let endTime;
            if (eventType === 0) {
                startTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + startDay));
                if (endDay === startDay) {
                    endDay += 1;
                }
                endTime = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + endDay));
                events.push({
                    title: 'All Day - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: true
                });
            } else {
                const startMinute = Math.floor(Math.random() * 24 * 60);
                const endMinute = Math.floor(Math.random() * 180) + startMinute;
                startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + startDay, 0, date.getMinutes() + startMinute);
                endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + endDay, 0, date.getMinutes() + endMinute);
                events.push({
                    title: 'Event - ' + i,
                    startTime: startTime,
                    endTime: endTime,
                    allDay: false
                });
            }
        }
        return events;
    }

    onRangeChanged(ev) {
        console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }
    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

    markDisabled = (date: Date) => {
        const current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };
}
