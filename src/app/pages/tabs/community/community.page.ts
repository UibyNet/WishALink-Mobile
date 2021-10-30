import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {SocialUserListModel} from "../../../services/api.service";

@Component({
    selector: 'app-community',
    templateUrl: './community.page.html',
    styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {

    constructor(
        private appService: AppService
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {
        this.getUserData()
    }

    getUserData() {
        this.userData = this.appService.userInfo
        console.log(this.appService.userInfo)
    }

}
