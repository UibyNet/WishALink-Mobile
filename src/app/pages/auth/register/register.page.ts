import {Component, NgZone, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {
    AuthApiService,
    CategoryApiService,
    CategoryListModel,
    ProfileApiService,
    TokenModel,
    UserModel,
    VerifyModel
} from 'src/app/services/api-wishalink.service';
import {AppService} from 'src/app/services/app.service';
import {ModalController} from '@ionic/angular';
import {CountrySelectorComponent} from 'src/app/components/country-selector/country-selector.component';
import {Router} from '@angular/router';
import {PrivacyPolicyComponent} from 'src/app/components/privacy-policy/privacy-policy.component';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
    stepper = 1;
    categories: CategoryListModel[] = [];
    selectedCategories = [];
    checkbox: boolean = false
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
        private categoryApiService: CategoryApiService,
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

    selectCategory(id) {
        const key = this.selectedCategories.indexOf(id);
        if (key > -1) {
            this.selectedCategories.splice(key, 1);
            return;
        }
        this.selectedCategories.push(id);
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
        console.log('password', this.password)
        if (this.password !== this.rePassword) {
            return this.appService.showErrorAlert('Parolalar uyuşmuyor')
        }
        if (this.password == null || this.password == 'undefined') {
            return this.appService.showErrorAlert('Lütfen şifrenizi kontrol edin')
        }
        this.otp = this.password
        this.isLoading = true;


        this.profileService.changepassword(this.oldPassword, this.otp)
            .subscribe(
                v => this.onPasswordChange(),
                e => this.onError('hatasds')
            )
    }

    onPasswordChange(): void {
        this.zone.run(() => {
            this.appService.accessToken = this.appService.tempAccessToken;
            this.isLoading = false;
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
            this.appService.tempAccessToken = v.token;
            // this.appService.accessToken = v.token;
            this.stepper++;
        });

        this.categoryApiService.predefined()
            .subscribe(
                v => this.onCategoriesLoad(v),
                e => this.onError(e)
            )
    }

    onCategoriesLoad(v: CategoryListModel[]): void {
        this.categories = v;
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
        this.isLoading = true;

        if (this.selectedCategories.length > 0) {
            this.profileService.updateinterests(this.selectedCategories)
                .subscribe(
                    v => this.onCategoriesSave(),
                    e => this.onError(e)
                )
        } else {
            this.zone.run(() => {
                this.router.navigate(['/app']);
            });
        }

    }

    onCategoriesSave(): void {
        this.zone.run(() => {
            this.isLoading = false;
            this.router.navigate(['/app']);
        });
    }

    async privacyModal() {
        const modal = await this.modalController.create({
            component: PrivacyPolicyComponent,
            cssClass: 'my-custom-class'
        });

        return await modal.present();
    }
}
