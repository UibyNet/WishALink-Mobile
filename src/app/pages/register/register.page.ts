import { Component, OnInit } from '@angular/core';
import { IonIntlTelInputModel } from 'ion-intl-tel-input';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthApiService, ProfileApiService, TokenModel, UserModel, VerifyModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';

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

  isLoading: boolean = false;
  firstName: string;
  lastName: string;
  email: string;
  otp: string;
  intPhoneNumber: IonIntlTelInputModel;
  oldPassword: string;

  get phoneNumber(): string {
    return this.intPhoneNumber?.internationalNumber.match(/\d/g)?.join('');
  }

  constructor(
    private appService: AppService,
    private authService: AuthApiService,
    private profileService: ProfileApiService
  ) {
  }

  ngOnInit() {
  }

  autoCapitalize(input: string) {
    let currentValue = '';
    if (input == 'firstName') currentValue = this.firstName;
    if (input == 'lastName') currentValue = this.lastName;

    currentValue = currentValue.split(' ').map(x => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase()).join(' ');

    if (input == 'firstName') this.firstName = currentValue;
    if (input == 'lastName') this.lastName = currentValue;
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
    model.firstName = this.firstName.trim();
    model.lastName = this.lastName.trim();
    model.phoneNumber = this.phoneNumber;
    model.email = this.email;

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
    this.profileService.changepassword(this.oldPassword, this.otp)
      .subscribe(
        v => this.onPasswordChange(),
        e => this.onError(e)
      )
  }

  onPasswordChange(): void {
    this.stepper++;
  }

  onRegister(v: TokenModel): void {
    this.isLoading = false;
    if (v.isNeedVerify) {
      this.stepper++;
    }
    else {
      this.appService.accessToken = v.token;
      this.stepper += 2;
    }

  }

  onVerify(v: TokenModel): void {
    this.isLoading = false;
    this.appService.accessToken = v.token;
    this.stepper++;
  }

  onError(e: any): void {
    this.isLoading = false;
    this.appService.showErrorAlert(e);
  }
}
