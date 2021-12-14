import {Component, NgZone, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
    AuthApiService,
    ForgotModel,
    ProfileApiService,
    VerifyModel
} from 'src/app/services/api-wishalink.service';
import {AppService} from 'src/app/services/app.service';
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {debounce} from "rxjs/operators";
import {Subject} from "rxjs";
import {CountrySelectorComponent} from 'src/app/components/country-selector/country-selector.component';

@Component({
    selector: 'app-forgot',
    templateUrl:
        './forgot.page.html',
    styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {

    selectedCountry = {dialCode: '90', isoCode: 'tr', phoneMask: '000 000 00 00'};
    stepper = 1;
    intPhoneNumber: any;
    otp: string;
    isLoading: boolean = false;
    resetPasswordForm: FormGroup;
    oldPassword: string;
    spinLoader: boolean = false
    isVal: boolean = false
    iconColor: string
    iconName: string

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
    //         this.router.navigate(['app']);
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
        if (this.stepper == 2) {
            this.oldPassword = code;
        }
    }

    resetPassword() {
        const model = new ForgotModel();
        model.phoneNumber = this.phoneNumber;
        console.log(model)
        return
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
                v => {
                    if (v != undefined && v.token != undefined) {
                        this.appService.accessToken = v.token;
                        this.onForgot();
                    }
                },
                e => this.onError(e)
            )
    }

    setPassword() {
        this.isLoading = true;

        this.profileService.changepassword(this.oldPassword, this.otp)
            .subscribe(
                v => this.onPasswordChange(),
                e => this.onError(e)
            )
    }

    onPasswordChange(): void {
        this.zone.run(() => {
            this.isLoading = false;
            this.router.navigate(['/app'])
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

    checkNumberStatus(event) {
        this.spinLoader = true
        if (event === '') {
            this.isVal = false
            this.spinLoader = false
        }
        if (event.length === 10) {
            this.authService.check(this.phoneNumber).subscribe(
                v => this.onNumberSuccess(v),
                e => this.onNumberError(e)
            )
        }
    }

    onNumberError(e: any) {
        this.zone.run(() => {
            this.spinLoader = false
            this.isVal = true
            this.iconName = 'close-sharp'
            this.iconColor = 'danger'
        })
    }

    onNumberSuccess(v: void) {
        this.zone.run(() => {
            this.spinLoader = false
            this.isVal = true
            this.iconName = 'checkmark-sharp'
            this.iconColor = 'primary'
        })
    }
}
