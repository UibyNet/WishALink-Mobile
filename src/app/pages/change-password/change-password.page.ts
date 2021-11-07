import {Component, OnInit} from '@angular/core';
import {ProfileApiService, SocialUserListModel} from "../../services/api.service";
import {AppService} from "../../services/app.service";
import {Router} from "@angular/router";
import {StatusBar, Style} from "@capacitor/status-bar";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.page.html',
    styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

    constructor(
        private profileApiService: ProfileApiService,
        private appService: AppService,
        private router: Router,
    ) {
    }

    oldPassword: string
    newPassword: string
    repeatPassword: string
    isLoading: boolean = false;
    userData: SocialUserListModel

    ngOnInit() {
        this.userData = this.appService.userInfo
    }
    ionViewWillEnter() {
        StatusBar.setStyle({style: Style.Dark})

    }
    changePassword() {

        if (this.oldPassword === undefined || this.oldPassword.length < 4) {
            this.appService.showAlert('Lütfen eski şifrenizi doğru girdiğinizden emin olunuz', 'Uyarı!');
            return;
        }

        if (this.newPassword == undefined || this.newPassword.length < 4) {
            this.appService.showAlert('Lütfen geçerli bir şifre girin', 'Uyarı!');
            return;
        }

        if (this.newPassword != this.repeatPassword) {
            this.appService.showAlert('Lütfen şifre eşleşmesini kontrol edin', 'Uyarı!');
            return;
        }
        this.isLoading = true
        this.profileApiService.changepassword(this.oldPassword, this.newPassword)
            .subscribe(
                v => this.onPasswordChange(),
                e => this.onError(e)
            )
    }

    onPasswordChange() {
        this.isLoading = false;
        this.appService.showToast('Şifreniz başarıyla değiştirildi.')
        this.router.navigate(['tabs', 'settings'])
    }

    onError(e: any) {
        this.isLoading = false;
        this.appService.showErrorAlert(e);
    }
}
