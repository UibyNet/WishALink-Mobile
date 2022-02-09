import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { AppService } from "src/app/services/app.service";
import { SplashScreen } from "@capacitor/splash-screen";
@Component({
  selector: "app-startup",
  templateUrl: "./startup.page.html",
  styleUrls: ["./startup.page.scss"],
})
export class StartupPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router, private appService: AppService) { }

  ngOnInit(): void {
  }

  ionViewWillEnter() {

    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");

    if (this.appService.isMobile) {
      if (this.appService.isLoggedIn) {
        this.router.navigate(["app"]);
      }
      else {
        this.router.navigate(["intro-slider"]);
      }
    } else {
      this.router.navigate(["landing"]);
    }
  }
}
