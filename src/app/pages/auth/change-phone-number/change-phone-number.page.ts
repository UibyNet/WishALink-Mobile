import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService, ForgotModel, LoginModel, PhoneNumberModel, ProfileApiService, TokenModel, VerifyModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { ModalController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountrySelectorComponent } from 'src/app/components/country-selector/country-selector.component';

@Component({
    selector: 'app-change-phone-number',
    templateUrl: './change-phone-number.page.html',
    styleUrls: ['./change-phone-number.page.scss'],
})
export class ChangePhoneNumberPage implements OnInit {

    selectedCountry = { dialCode: '90', isoCode: 'tr', phoneMask: '000 000 00 00' };
    stepper = 1;
    intPhoneNumber: any;
    otp: string;
    isLoading: boolean = false;
    changePhoneNumberForm: FormGroup;
    oldPassword: string;

    get phoneNumber(): string {
        return (this.selectedCountry.dialCode + this.changePhoneNumberForm.get('phoneNumberMasked').value.trim()).match(/\d/g)?.join('');
    }

    constructor(
        private zone: NgZone,
        private router: Router,
        private appService: AppService,
        private authService: AuthApiService,
        private profileService: ProfileApiService,
        private formBuilder: FormBuilder,
        private modalController: ModalController
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');
        this.appService.setStatusBarBackground('primary')
    }

    ngOnInit() {
        this.changePhoneNumberForm = this.formBuilder.group({
            phoneNumberMasked: ['', [Validators.required, Validators.minLength(1)]],
        })
    }

    onCodeChanged(code: string) {
    }

    onCodeCompleted(code: string) {
        this.otp = code;
    }

    changePhoneNumber() {
        const model = new PhoneNumberModel();
        model.oldPhoneNumber = this.appService.user.userName;
        model.newPhoneNumber = this.phoneNumber;

        this.isLoading = true;
        this.authService.changephonenumber(model)
            .subscribe(
                v => this.onChangePhoneNumber(),
                e => this.onError(e)
            )
    }

    onChangePhoneNumber(): void {
        this.zone.run(() => {
            this.isLoading = false;
            this.stepper++;
        })
    }

    onPhoneNumberChanged(v: TokenModel) {
        this.zone.run(() => {
            this.appService.showToast('Telefon numarası güncellendi.');
            this.appService.clearUser();
            this.appService.accessToken = v.token;
            const user = this.appService.user;
            console.log(user);
            this.router.navigate(['app', 'settings']);
        })
    }

    onError(e: any): void {
        this.zone.run(() => {
            this.isLoading = false;

            this.appService.showErrorAlert(e);
        })
    }

    verify() {
        this.isLoading = false;

        const model = new VerifyModel();
        model.phoneNumber = this.appService.user.userName;
        model.otp = this.otp;
        model.isUsernameChange = true;

        this.authService.verify(model)
            .subscribe(
                v => this.onPhoneNumberChanged(v),
                e => this.onError(e)
            )
    }

    async showCountrySelector() {
        const modal = await this.modalController.create({
            component: CountrySelectorComponent,
            cssClass: 'my-custom-class'
        });

        modal.onDidDismiss().then(v => {
            if (v != null && v.data != null) {
                this.selectedCountry = v.data;
            }
        })

        return await modal.present();
    }

    goPreviousStep() {
        this.stepper--;
    }
}
