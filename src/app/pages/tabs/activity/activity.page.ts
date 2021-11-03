import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CalendarComponent } from "ionic2-calendar";
import { CalendarMode, Step } from 'ionic2-calendar/calendar';
import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/tr';
import { ActivityApiService, ActivityListModel, SocialUserListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';
import { NotificationComponent } from "../../../components/notification/notification.component";
import { ModalController } from "@ionic/angular";
import { Router } from '@angular/router';

registerLocaleData(localeZh);


@Component({
    selector: 'app-activity',
    templateUrl: './activity.page.html',
    styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

    @ViewChild(CalendarComponent, { static: false }) calendarComponent: CalendarComponent;

    eventSource = [];
    upcomingEvents: any[];
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
    selectedDate: Date = new Date();

    constructor(
        private zone: NgZone,
        private router: Router,
        private appService: AppService,
        private activityApiService: ActivityApiService,
        private modalController: ModalController
    ) {
    }

    ngOnInit() { }

    ionViewDidEnter() {
        this.userData = this.appService.userInfo;
        if (this.appService.userActivities.length > 0) {
            this.onActivitiesLoad(this.appService.userActivities);
        }
        else {
            this.loadEvents();
        }
    }

    loadEvents() {
        this.activityApiService.list(this.appService.user.id)
            .subscribe(
                v => this.onActivitiesLoad(v),
                e => this.onError(e)
            )
    }

    onActivitiesLoad(v: ActivityListModel[]): void {
        this.zone.run(() => {

            if (v != undefined && v.length > 0) {
                this.appService.userActivities = v;
                this.eventSource = [];

                for (const activity of v) {
                    this.eventSource.push({
                        id: activity.id,
                        title: activity.name,
                        startTime: moment(activity.startDate, 'DD.MM.YYYY HH:mm').toDate(),
                        endTime: moment(activity.endDate, 'DD.MM.YYYY HH:mm').toDate(),
                        allDay: false
                    });
                }

                this.upcomingEvents = this.eventSource.sort((a, b) => a.startTime.getTime() - b.startTime.getTime()).slice(0, 10);

                this.calendarComponent.loadEvents();
            }
        })
    }

    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

    onViewTitleChanged(title) {
        this.viewTitle = title;
    }

    onEventSelected(event) {
        // console.log('Event selected:' + event.startTime + '-' + event.endTime + ',' + event.title);
    }

    today() {
        this.calendar.currentDate = new Date();
    }

    onTimeSelected(ev) {
        this.selectedDate = ev.selectedTime;
        //console.log('Selected time: ' + ev.selectedTime + ', hasEvents: ' + (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);
    }

    onRangeChanged(ev) {
        // console.log('range changed: startTime: ' + ev.startTime + ', endTime: ' + ev.endTime);
    }

    onCurrentDateChanged(event: Date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        event.setHours(0, 0, 0, 0);
        this.isToday = today.getTime() === event.getTime();
    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        modal.onDidDismiss().then(v => {
            console.log(v.data);
        })

        return await modal.present();
    }

    markDisabled = (date: Date) => {
        const current = new Date();
        current.setHours(0, 0, 0);
        return date < current;
    };

    openCreate() {
        this.router.navigate(['/tabs/activity/create'], { queryParams: { activityId: 0, date: moment(this.selectedDate).format('DD.MM.YYYY') } })
    }

    openEdit(activity) {
        console.log(activity)
        this.router.navigate(['/tabs/activity/create'], { queryParams: { activityId: activity.id, date: moment(this.selectedDate).format('DD.MM.YYYY') } })
    }
}
