import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService, ForgotModel, LoginModel, ProfileApiService, TokenModel, VerifyModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { CountrySelectorComponent } from "../../components/country-selector/country-selector.component";
import { ModalController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'app-forgot',
    templateUrl:
        './forgot.page.html',
    styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

    selectedCountry = { dialCode: '90', isoCode: 'tr', phoneMask: '000 000 00 00' };
    stepper = 1;
    intPhoneNumber: any;
    otp: string;
    isLoading: boolean = false;
    resetPasswordForm: FormGroup;
    oldPassword: string;

    get phoneNumber(): string {
        return (this.selectedCountry.dialCode + this.resetPasswordForm.get('phoneNumberMasked').value.trim()).match(/\d/g)?.join('');
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

    // ionViewWillEnter() {
    //     if (this.appService.isLoggedIn) {
    //         this.router.navigate(['tabs']);
    //     }
    // }

    ngOnInit() {
        this.resetPasswordForm = this.formBuilder.group({
            phoneNumberMasked: ['', [Validators.required, Validators.minLength(1)]],
        })
    }

    onCodeChanged(code: string) {
    }

    onCodeCompleted(code: string) {
        this.otp = code;
    }

    resetPassword () {
        const model = new ForgotModel();
        model.phoneNumber = this.phoneNumber;

        this.isLoading = true;
        this.authService.forgot(model)
            .subscribe(
                v => this.onForgot(),
                e => this.onError(e)
            )
    }

    onForgot(): void {
        this.zone.run(() => {
            this.isLoading = false;
            this.stepper++;
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
        model.phoneNumber = this.phoneNumber;
        model.otp = this.otp;

        this.authService.verify(model)
            .subscribe(
                v => this.onForgot(),
                e => this.onError(e)
            )
    }

    setPassword() {
        this.profileService.changepassword(this.oldPassword, this.otp)
            .subscribe(
                v => this.onPasswordChange(),
                e => this.onError(e)
            )
    }

    onPasswordChange(): void {
        this.zone.run(() => {
          this.stepper++;
        });
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

}
