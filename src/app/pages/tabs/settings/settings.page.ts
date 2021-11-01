import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { SocialUserListModel } from "../../../services/api.service";
import {NotificationComponent} from "../../../components/notification/notification.component";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(
        private navController: NavController,
        private appService: AppService,
        private modalController:ModalController
    ) { }

    userData: SocialUserListModel

    ngOnInit() {
        this.userData = this.appService.userInfo
    }
    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

    logout() {
        this.appService.logout();
        setTimeout(() => {
            this.navController.navigateRoot('/login');
        }, 200);
    }
}
