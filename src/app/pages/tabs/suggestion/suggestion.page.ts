import {Component, OnInit} from '@angular/core';
import {SocialUserListModel} from "../../../services/api.service";
import {AppService} from "../../../services/app.service";

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.page.html',
    styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {

    constructor(
        private appService: AppService
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {
        this.userData = this.appService.userInfo
    }

}
