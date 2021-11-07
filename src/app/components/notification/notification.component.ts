import {Component, OnInit} from '@angular/core';
import {NotificationApiService, Notification} from "../../services/api.service";
import {AppService} from "../../services/app.service";
import {ModalController} from "@ionic/angular";
import {StatusBar, Style} from "@capacitor/status-bar";

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
    
    notifications: Notification[];

    constructor(
        private notificationApiService: NotificationApiService,
        private appService: AppService,
        private modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.getNotifications()
    }
    ionViewWillEnter() {
        StatusBar.setStyle({style: Style.Light})

    }
    getNotifications() {
        this.notificationApiService.list().subscribe(
            v => this.onNotifications(v),
            e => this.onError(e)
        )
    }

    onNotifications(v: Notification[]) {
        this.notifications = v
    }

    onError(e: any) {
        this.appService.showAlert(e)

    }

    closeModal() {
        this.modalController.dismiss();
    }
}
