import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { SocialUserListModel } from "../../../services/api.service";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

    constructor(
        private navController: NavController,
        private appService: AppService
    ) { }

    userData: SocialUserListModel

    ngOnInit() {
        this.userData = this.appService.userInfo
    }

    logout() {
        this.appService.logout();
        setTimeout(() => {
            this.navController.navigateRoot('/login');
        }, 200);
    }
}
