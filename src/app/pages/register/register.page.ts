import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthApiService, ProfileApiService, TokenModel, UserModel, VerifyModel} from 'src/app/services/api.service';
import {AppService} from 'src/app/services/app.service';
import {ModalController} from '@ionic/angular';
import {CountrySelectorComponent} from 'src/app/components/country-selector/country-selector.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    stepper = 1;
    categories = [
        {
            id: 1,
            text: 'Çiçek'
        },
        {
            id: 2,
            text: 'Teknoloji'
        },
        {
            id: 3,
            text: 'Ev Eşyası'
        },
        {
            id: 4,
            text: 'Saç Bakım'
        },
        {
            id: 5,
            text: 'Araba Aksesuarı'
        }, {
            id: 6,
            text: 'Bahçe Ürünleri'
        },
        {
            id: 7,
            text: 'Kozmetik'
        },
        {
            id: 8,
            text: 'Tekstil'
        },
        {
            id: 9,
            text: 'Spor Ürünleri'
        },
        {
            id: 10,
            text: 'Mutfak Ürünleri'
        },
        {
            id: 11,
            text: 'Mobilya'
        },
        {
            id: 12,
            text: 'Çiçek'
        }
    ];
    selectedProducts = [];

    selectedCountry = {dialCode: '90', isoCode: 'tr', phoneMask: '000 000 00 00'};

    isLoading: boolean = false;
    otp: string;
    oldPassword: string;
    registerForm: FormGroup
    password: string
    rePassword: string

    get phoneNumber(): string {
        return (this.selectedCountry.dialCode + this.registerForm.get('phoneNumberMasked').value.trim()).match(/\d/g)?.join('');
    }

    constructor(
        private appService: AppService,
        private authService: AuthApiService,
        private profileService: ProfileApiService,
        private formBuilder: FormBuilder,
        private modalController: ModalController,
        private router: Router,
        private zone: NgZone
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');
        this.appService.setStatusBarBackground('primary')

    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', [Validators.required, Validators.minLength(1)]],
            lastName: ['', [Validators.required, Validators.minLength(1)]],
            phoneNumberMasked: ['', [Validators.required, Validators.minLength(1)]],
            email: ['', [Validators.required, Validators.minLength(1), Validators.email]],
        })
    }

    autoCapitalize(input: string) {
        let currentValue = this.registerForm.get(input).value;
        currentValue = currentValue.split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()).join(' ');
        this.registerForm.get(input).setValue(currentValue);
    }

    selectProduct(id) {
        const key = this.selectedProducts.indexOf(id);
        if (key > -1) {
            this.selectedProducts.splice(key, 1);
            return;
        }
        this.selectedProducts.push(id);
    }

    onCodeChanged(code: string) {
    }

    onCodeCompleted(code: string) {
        this.otp = code;
    }

    register() {
        const model = new UserModel();
        model.firstName = this.registerForm.get('firstName').value.trim();
        model.lastName = this.registerForm.get('lastName').value.trim();
        model.email = this.registerForm.get('email').value.trim();
        model.phoneNumber = this.phoneNumber;

        this.isLoading = true;
        this.authService.register(model)
            .subscribe(
                v => this.onRegister(v),
                e => this.onError(e)
            )
    }

    verify() {
        this.isLoading = false;

        const model = new VerifyModel();
        model.phoneNumber = this.phoneNumber;
        model.otp = this.otp;

        this.oldPassword = this.otp + '';


        this.authService.verify(model)
            .subscribe(
                v => this.onVerify(v),
                e => this.onError(e)
            )
    }

    setPassword() {
        console.log('password',this.password)
        if (this.password !== this.rePassword) {
            return this.appService.showErrorAlert('Parolalar uyuşmuyor')
        }
        if (this.password == null || this.password == 'undefined') {
            return this.appService.showErrorAlert('Lütfen şifrenizi kontrol edin')
        }
        this.otp = this.password

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

    onRegister(v: TokenModel): void {
        this.zone.run(() => {
            this.isLoading = false;
            if (v.isNeedVerify) {
                this.stepper++;
            } else {
                this.appService.accessToken = v.token;
                this.stepper += 2;
            }
        });
    }

    onVerify(v: TokenModel): void {
        this.zone.run(() => {
            this.isLoading = false;
            this.appService.accessToken = v.token;
            this.stepper++;
        });
    }

    onError(e: any): void {
        this.isLoading = false;
        this.appService.showErrorAlert(e);
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

    saveCategories() {
        this.zone.run(() => {
            this.router.navigate(['/app']);
        });
    }
}
