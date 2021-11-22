import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ModalController, NavController} from '@ionic/angular';
import {AppService} from 'src/app/services/app.service';
import {SocialUserListModel} from "../../../services/api-wishalink.service";
import {NotificationComponent} from "../../../components/notification/notification.component";
import {Share} from '@capacitor/share';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(
        public appService: AppService,
        private navController: NavController,
        private modalController: ModalController,
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {
        this.userData = this.appService.userInfo
    }
    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');
        this.appService.setStatusBarBackground('primary')

    }
    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

    async shareApp() {
        await Share.share({
            title: 'Wish A Link',
            text: 'Wish a link i paylas',
            url: 'http://wishalink.com/',
        })
    }

    logout() {
        this.appService.logout();
        setTimeout(() => {
            this.navController.navigateRoot('/login');
        }, 200);
    }
}
