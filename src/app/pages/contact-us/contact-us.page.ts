import {Component, NgZone, OnInit} from '@angular/core';
import {AppService} from "../../services/app.service";
import {CommonApiService, Contact, ProfileApiService, UserModel} from "../../services/api-wishalink.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.page.html',
    styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
    constructor(
        public commonService: CommonApiService,
        public appService: AppService,
        private profileApiService: ProfileApiService,
        private zone: NgZone,
        private router: Router
    ) {
    }

    contactModel: Contact
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
        const model = new Contact()
        model.firstName = this.userData.firstName
        model.lastName = this.userData.lastName
        model.message = this.message
        this.isLoading = true
        this.commonService.contact(model).subscribe(
            (v) => this.onSendMessage(v),
            (e) => this.onError(e)
        )
    }

    onSendMessage(v: void) {
        this.zone.run(() => {
            this.message = null
            this.isLoading = false
            const message = this.appService.translateWithParam('MessageSendSuccess').translatedData
            this.appService.showToast(message)
            this.router.navigate(['app', 'settings'])
        })
    }
}
