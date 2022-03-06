import {Component, Inject, NgZone, OnInit, Optional} from '@angular/core';
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
    get hasUnreadNotifications() {
        return this.notifications.filter(x => !x.isRead).length > 0;
    } 

    constructor(
        private router: Router,
        private zone: NgZone,
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

    markAllAsRead() {
        const unreadNotifications = this.notifications?.filter(x => !x.isRead);
        if(unreadNotifications != null && unreadNotifications.length > 0) {
            unreadNotifications.forEach((notification) => {
                this.appService.markNotificationAsRead(notification);
                this.zone.run(()=>{
                    notification.isRead = true;
                })
            })
        }
    }

    translate(v: string): string {
        if(v == undefined || v.length == 0) return '';

        const parts = v.split(',');
        if(parts.length > 1) {
            const name = parts[0];

            parts.shift();
            const message = parts.join(',').trim();

            const firstIndex = message.indexOf('\'');
            const lastIndex = message.lastIndexOf('\'');

            const action = message.substring(lastIndex + 1).trim();
            const title = message.substring(firstIndex, lastIndex+1).trim();

            if(this.appService.currentLanguage == 'en') {
                if(action.indexOf('başlıklı bir gönderi paylaştı') > -1) {
                    v = name + ', shared a post with the title ' + title;
                }
                else if(action.indexOf('başlıklı gönderini beğendi') > -1) {
                    v = name + ', liked your post titled ' + title;
                }
                else if(action.indexOf('seni takip etmeye başladı') > -1) {
                    v = name + ', started following you';
                }
            }

        }
        
        return v;
    }
}
