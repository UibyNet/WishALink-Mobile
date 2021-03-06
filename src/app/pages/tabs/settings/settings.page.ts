import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalController, NavController } from "@ionic/angular";
import { AppService } from "src/app/services/app.service";
import { SocialUserListModel } from "../../../services/api-wishalink.service";
import { NotificationComponent } from "../../../components/notification/notification.component";
import { Share } from "@capacitor/share";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  currentLang: string;
  profilePictureUrl: string;
  constructor(
    public appService: AppService,
    public translate: TranslateService,
    private navController: NavController,
    private modalController: ModalController
  ) {
    this.currentLang = this.appService.currentLanguage;
  }

  userData: SocialUserListModel;

  ngOnInit() {
    if (this.appService.userInfo) {
      this.userData = this.appService.userInfo;
      this.profilePictureUrl = this.appService.userInfo.profilePictureUrl;
      console.log("user", this.userData);
    }
  }
  ionViewWillEnter() {
    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");

    if (!this.appService.isMobile) {
      this.navController.navigateForward('/app/settings/profile-settings')
    }
  }
  async openNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      cssClass: "notification-custom",
    });

    return await modal.present();
  }

  async shareApp() {
    await Share.share({
      title: "Wish A Link",
      text: this.translate.instant('JoinWishALink'),
      url: "http://wishalink.com/",
    });
  }

  changeLang() {
    this.appService.currentLanguage = this.currentLang;
  }

  logout() {
    this.appService.logout();
    setTimeout(() => {
      this.navController.navigateRoot("/login").then(() => {
        window.location.reload();
      });
    }, 200);
  }
}
