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
  isLoading: boolean = false;

  get phoneNumber(): string {
    return this.intPhoneNumber?.internationalNumber.match(/\d/g)?.join('');
  }

  constructor(
    private router: Router,
    private appService: AppService,
    private authService: AuthApiService
  ) {
  }

  ionViewWillEnter() {
    if(this.appService.isLoggedIn) {
         this.router.navigate(['tabs']);
    }
  }

  ngOnInit() {
    this.appService.accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiOTA1MzMzMzMzMzMzIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiS3ViaWxheSBCb3N0YW5jxLEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3ZlcnNpb24iOiIwIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiI2Iiwicm9sZXMiOiJ1c2VyIiwiZXhwIjoxOTUxMjE2NDIzLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQ0NDQ1LyIsImF1ZCI6Ildpc2hhTGlua0FwcCJ9.vsWATxrbGKCRvl3LAl8-EFCNSG47mvVw74gTG2Nof7g";
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

    this.isLoading = true;
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
    this.isLoading = false;

    if (v.isNeedVerify) {
      this.stepper++;
    }
    else if(v.token != null && v.token.length > 0) {
      this.appService.accessToken = v.token;
      this.router.navigate(['tabs']);
    }
  }

  onError(e: any): void {
    this.isLoading = false;

    this.appService.showErrorAlert(e);
  }

  verify() {
    this.isLoading = false;

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
