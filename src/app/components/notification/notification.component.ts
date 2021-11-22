import {Component, Inject, OnInit, Optional} from '@angular/core';
import {NotificationApiService, Notification, WISH_API_URL} from "../../services/api-wishalink.service";
import {AppService} from "../../services/app.service";
import {ModalController} from "@ionic/angular";
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    
    notifications: Notification[];
    apiBaseUrl: string;

    constructor(
        private router: Router,
        private appService: AppService,
        private modalController: ModalController,
        @Optional() @Inject(WISH_API_URL) baseUrl?: string,
    ) {
        this.apiBaseUrl = baseUrl;
    }

    ngOnInit() {
        this.notifications = this.appService.userNotifications;
        if(this.notifications.length == 0) {
            this.getNotifications(null)
        }
    }
    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');
    }
    getNotifications(event) {
        this.appService.getNotifications().then(
            v => this.onNotifications(v, event),
            e => this.onError(e, event)
        )
    }

    onNotifications(v: Notification[], event: any) {
        if(event) event.target.complete();
        this.notifications = v;
    }

    onError(e: any, event: any) {
        if(event) event.target.complete();
        this.appService.showAlert(e)

    }

    closeModal() {
        this.modalController.dismiss();
    }

    getTargetUserId(notification: Notification) {
        if(notification != null && notification.data != null && notification.data.length > 0) {
            var data = JSON.parse(notification.data);
            if(data.FollowerId > 0) {
                return data.FollowerId;
            }
            if(data.CreatorId > 0) {
                return data.CreatorId;
            }
        }
        return 0;
    }

    getNotificationTime(notification: Notification) {
        if(notification != null && notification.data != null && notification.data.length > 0) {
            var data = JSON.parse(notification.data);
            if(data.TimeStamp) {
                var ago = moment(data.TimeStamp).fromNow(true);
                return ago;
            }
        }
        return '';
    }

    goTargetProfile(notification: Notification) {
        this.modalController.dismiss();
        this.appService.markNotificationAsRead(notification);
        this.router.navigateByUrl('/app/profile/' + this.getTargetUserId(notification))
    }
}
