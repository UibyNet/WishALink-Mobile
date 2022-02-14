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

    fullName: string = '';
    contactModel: Contact
    userData: UserModel = {
        firstName: '',
        lastName: '',
        email: '',
        init: null,
        toJSON: null
    }
    isLoading: boolean = false;
    message: string

    ngOnInit() {
        if(this.appService.user != null) {
            this.getUserInfo();
        }
    }

    onUserData(v: UserModel) {
        this.zone.run(() => {
            this.userData = v;
            this.fullName = this.userData?.firstName + ' ' + this.userData?.lastName ;
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
        if(
            !(
                this.userData.firstName.length > 1 && 
                this.userData.lastName.length > 1 &&
                this.userData.email.length > 3 && 
                this.message.length > 3
            )
        ) {
            this.zone.run(() => {
                this.appService.showAlert("Bilgileri kontrol edip tekrar deneyiniz.", "Uyarı");
            })
            return;
        }
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
