import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  AuthApiService,
  LoginModel,
  TokenModel,
  VerifyModel,
} from "src/app/services/api-wishalink.service";
import { AppService } from "src/app/services/app.service";
import { ModalController } from "@ionic/angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountrySelectorComponent } from "src/app/components/country-selector/country-selector.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  selectedCountry = {
    dialCode: "90",
    isoCode: "tr",
    phoneMask: "000 000 00 00",
  };
  stepper = 1;
  intPhoneNumber: any;
  password: string;
  otp: string;
  isLoading: boolean = false;
  loginForm: FormGroup;

  get phoneNumber(): string {
    return (
      this.selectedCountry.dialCode +
      this.loginForm.get("phoneNumberMasked").value.trim()
    )
      .match(/\d/g)
      ?.join("");
  }
  /*
  constructor(
    public appService: AppService,
    private zone: NgZone,
    private router: Router,
    private authService: AuthApiService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      phoneNumberMasked: ["", [Validators.required, Validators.minLength(1)]],
      password: ["", [Validators.required, Validators.minLength(1)]],
    });
  }
  ionViewWillEnter() {
    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");
    if (this.appService.isLoggedIn) {
      this.router.navigate(["app"]);
    }
  }
  onCodeChanged(code: string) {}

  onCodeCompleted(code: string) {
    this.otp = code;
  }

  login() {
    const model = new LoginModel();
    model.phoneNumber = this.phoneNumber;
    model.password = this.loginForm.get("password").value.trim();

    this.isLoading = true;
    this.authService.login(model).subscribe(
      (v) => this.onLogin(v),
      (e) => this.onError(e)
    );
  }

  onLogin(v: TokenModel): void {
    this.zone.run(() => {
      this.isLoading = false;

      if (v.isNeedVerify) {
        this.stepper++;
      } else if (v.token != null && v.token.length > 0) {
        this.appService.accessToken = v.token;
        //this.navbar.canUser();
        this.router.navigate(["app"]).then(() => {
          window.location.reload();
    selectedCountry = {
        dialCode: "90",
        isoCode: "tr",
        phoneMask: "000 000 00 00",
    };
    stepper = 1;
    intPhoneNumber: any;
    password: string;
    otp: string;
    isLoading: boolean = false;
    loginForm: FormGroup;

    get phoneNumber(): string {
        return (
            this.selectedCountry.dialCode +
            this.loginForm.get("phoneNumberMasked").value.trim()
        )
            .match(/\d/g)
            ?.join("");
    }
    */

  constructor(
    public appService: AppService,
    private zone: NgZone,
    private router: Router,
    private authService: AuthApiService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      phoneNumberMasked: ["", [Validators.required, Validators.minLength(1)]],
      password: ["", [Validators.required, Validators.minLength(1)]],
    });
  }

  ionViewWillEnter() {
    if (this.appService.isLoggedIn) {
      this.router.navigate(["app"]);
    }
    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");
  }

  onCodeChanged(code: string) {}

  onCodeCompleted(code: string) {
    this.otp = code;
  }

  login() {
    const model = new LoginModel();
    model.phoneNumber = this.phoneNumber;
    model.password = this.loginForm.get("password").value.trim();

    this.isLoading = true;
    this.authService.login(model).subscribe(
      (v) => this.onLogin(v),
      (e) => this.onError(e)
    );
  }

  onLogin(v: TokenModel): void {
    this.zone.run(() => {
      this.isLoading = false;

      if (v.isNeedVerify) {
        this.stepper++;
      } else if (v.token != null && v.token.length > 0) {
        this.appService.accessToken = v.token;
        //this.navbar.canUser();
        this.router.navigate(["app"]).then(() => {
          window.location.reload();
        });
      }
    });
  }

  onError(e: any): void {
    this.zone.run(() => {
      this.isLoading = false;

      this.appService.showErrorAlert(e);
    });
  }

  verify() {
    this.isLoading = false;

    const model = new VerifyModel();
    model.phoneNumber = this.phoneNumber;
    model.otp = this.otp;

    this.authService.verify(model).subscribe(
      (v) => this.onLogin(v),
      (e) => this.onError(e)
    );
  }

  async showCountrySelector() {
    const modal = await this.modalController.create({
      component: CountrySelectorComponent,
      cssClass: "my-custom-class",
    });

    modal.onDidDismiss().then((v) => {
      if (v != null && v.data != null) {
        this.selectedCountry = v.data;
      }
    });

    return await modal.present();
  }

  goForgot() {
    this.router.navigateByUrl("/forgot");
  }

  goRegister() {
    this.router.navigateByUrl("/register");
  }

  showToolbar = false;

  onScroll($event: CustomEvent<any>) {
    if ($event && $event.detail && $event.detail.scrollTop) {
      const scrollTop = $event.detail.scrollTop;
      this.showToolbar = scrollTop >= 225;
    }
  }
}
