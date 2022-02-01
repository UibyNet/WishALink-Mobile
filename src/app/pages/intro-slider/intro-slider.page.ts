import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { AppService } from "src/app/services/app.service";
import { SplashScreen } from "@capacitor/splash-screen";
@Component({
  selector: "app-intro-slider",
  templateUrl: "./intro-slider.page.html",
  styleUrls: ["./intro-slider.page.scss"],
})
export class IntroSliderPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(private router: Router, private appService: AppService) {}
  ionViewWillEnter() {
    this.hideSplashScreen();
    this.appService.toggleStatusBar("dark");
    this.appService.setStatusBarBackground("primary");
    if (this.appService.isMobile) {
      if (this.appService.isLoggedIn) {
        this.router.navigate(["app"]);
      }
    } else {
      this.router.navigate(["landing"]);
    }
  }
  async hideSplashScreen() {
    await SplashScreen.hide();
  }
  ngOnInit() {}
  login() {
    this.router.navigate(["intro"]);
  }
  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }
}
