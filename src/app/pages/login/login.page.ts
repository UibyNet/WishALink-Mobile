import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService, LoginModel, TokenModel, VerifyModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  stepper = 1;
  intPhoneNumber: any;
  password: string;
  otp: string;

  get phoneNumber(): string {
    return this.intPhoneNumber?.internationalNumber.match(/\d/g)?.join('');
  }

  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthApiService
  ) {
  }

  ngOnInit() {
  }

  onCodeChanged(code: string) {
  }

  onCodeCompleted(code: string) {
    this.otp = code;
  }

  login() {
    if(this.phoneNumber == undefined || this.phoneNumber.length < 10) {
      this.appService.showAlert('Lütfen geçerli bir telefon numarası girin', 'Uyarı!');
      return;
    }

    if(this.password == undefined || this.password.length < 4) {
      this.appService.showAlert('Lütfen geçerli bir şifre girin', 'Uyarı!');
      return;
    }

    const model = new LoginModel();
    model.phoneNumber = this.phoneNumber;
    model.password = this.password;

    this.authService.login(model)
      .subscribe(
        v => this.onLogin(v),
        e => this.onError(e)
      )
  }

  onLogin(v: TokenModel): void {
    if (v.isNeedVerify) {
      this.stepper++;
    }
    else if(v.token != null && v.token.length > 0) {
      this.appService.accessToken = v.token;
      this.router.navigate(['tabs']);
    }
  }

  onError(e: any): void {
    this.appService.showErrorAlert(e);
  }

  verify() {
    const model = new VerifyModel();
    model.phoneNumber = this.phoneNumber;
    model.otp = this.otp;

    this.authService.verify(model)
      .subscribe(
        v => this.onLogin(v),
        e => this.onError(e)
      )
  }

}
