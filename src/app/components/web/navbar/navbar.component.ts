import { Component, OnInit } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { ModalController } from "@ionic/angular";
import { NotificationComponent } from "src/app/components/notification/notification.component";
import { NavigationExtras, Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  input: string;
  constructor(
    public appService: AppService,
    private modalController: ModalController,
    private router: Router
  ) {
    this.canUser();
  }
  boolUser: boolean = false;

  ionViewWillEnter() {
    this.canUser();
  }
  ngOnInit() {
    this.canUser();
    console.log("user " + this.boolUser);
  }
  public canUser() {
    const currentUser = this.appService.user;
    console.log(currentUser);

    if (currentUser != null && currentUser.id > 0) {
      this.boolUser = true;
    } else {
      this.boolUser = false;
    }
  }
  async openNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      cssClass: "notification-custom",
    });

    modal.onDidDismiss().then((v) => {
      console.log(v.data);
    });

    return await modal.present();
  }
  searchFunc(e) {
    const text = e.target.value;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        text: text,
      },
    };
    this.router.navigate(["app/search"], navigationExtras);
  }
}
