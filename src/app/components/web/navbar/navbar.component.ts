import { Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import { IonSelect, ModalController } from "@ionic/angular";
import { NotificationComponent } from "src/app/components/notification/notification.component";
import { NavigationExtras, Router } from "@angular/router";
import { ChatService } from "src/app/services/chat.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  input: string;
  currentLang: string;

  @ViewChild("langSelector", { static: false }) langSelect: IonSelect;
  unreadMessageCount: number;
  constructor(
    public zone: NgZone,
    public chatService: ChatService,
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

    this.zone.run(() => {
      this.unreadMessageCount = this.chatService.getUnreadMessageCount();
    })
    this.chatService.onNewMessage.subscribe(v => {
      this.zone.run(() => {
        this.unreadMessageCount = this.chatService.getUnreadMessageCount();
      })
    });

    this.chatService.onConversationsChanged.subscribe(v => {
      this.zone.run(() => {
        this.unreadMessageCount = this.chatService.getUnreadMessageCount();
      })
    });

    this.chatService.onMessagesRead.subscribe(v => {
      this.zone.run(() => {
        this.unreadMessageCount = this.chatService.getUnreadMessageCount();
      })
    });
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
  changeLang() {
    this.appService.currentLanguage = this.currentLang;
  }

  openLangSelector() {
    this.langSelect.open();
  }

  openMessages() {
    this.router.navigate(["app", "chat", 0]);
  }
}
