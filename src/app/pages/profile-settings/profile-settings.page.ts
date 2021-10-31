import {Component, OnInit} from '@angular/core';
import {AppService} from "../../services/app.service";
import {SocialUserListModel} from "../../services/api.service";

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.page.html',
    styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {

    constructor(
        private appService: AppService
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {
        this.userData = this.appService.userInfo
    }

}
