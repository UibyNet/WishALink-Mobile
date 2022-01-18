import {Component, NgZone, OnInit} from '@angular/core';
import {AppService} from "../../services/app.service";
import {ProfileApiService, UserModel} from "../../services/api-wishalink.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.page.html',
    styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

    constructor(
        public appService: AppService,
        private profileApiService: ProfileApiService,
        private zone: NgZone,
    ) {
    }

    userData: UserModel
    isLoading: boolean = false;
    message: string

    ngOnInit() {
        this.getUserInfo()
    }

    onUserData(v: UserModel) {
        this.zone.run(() => {
            this.userData = v
            console.log(this.userData)
        })
    }

    getUserInfo() {
        this.profileApiService.detail().subscribe(
            v => this.onUserData(v),
            e => this.onError(e)
        )
    }

    onError(e: any) {
        this.isLoading = false
        this.zone.run(() => {
            this.appService.showAlert(e)
        })
    }

    sendMessage() {

    }
}
