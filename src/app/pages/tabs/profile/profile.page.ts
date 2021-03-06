import { Component, OnInit, NgZone, ViewChild } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import {
  ActionSheetController,
  IonContent,
  ModalController,
  NavController,
} from "@ionic/angular";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { NotificationComponent } from "src/app/components/notification/notification.component";
import { ChatService } from "src/app/services/chat.service";
import {
  ActivityApiService,
  ActivityListModel,
  CategoryApiService,
  CategoryListModel,
  ChatApiService,
  ProfileApiService,
  SocialApiService,
  SocialUserListModel,
  UserModel,
} from "../../../services/api-wishalink.service";
import { AppService } from "../../../services/app.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
  host: {
    "(window:resize)": "onWindowResize($event)",
  },
})
export class ProfilePage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  currentUrl: string;
  routerSubscription: Subscription;
  isMe: boolean = false;
  userId: number;
  currentUser: SocialUserListModel;
  categories: CategoryListModel[] = [];
  activities: ActivityListModel[] = [];
  selectedSegment: string = "categories";
  profilePictureUrl: string;
  categoryColSize: number = 4;
  unreadMessageCount: number = 0;

  constructor(
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    public appService: AppService,
    private chatService: ChatService,
    private chatApiService: ChatApiService,
    private profileApiService: ProfileApiService,
    private socialApiService: SocialApiService,
    private activityApiService: ActivityApiService,
    private categoryApiService: CategoryApiService,
    private navController: NavController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id == "me") {
      this.userId = this.appService.user.id;

      if (!this.appService.isFcmTokenSaved && this.appService.fcmToken != undefined) {
        this.appService.isFcmTokenSaved = true;
        const userModel = new UserModel();
        userModel.fcmToken = this.appService.fcmToken;
        this.profileApiService.update(userModel).subscribe(v => { })
      }
    } else {
      this.userId = parseInt(id);
    }

    this.isMe = this.userId == this.appService.user.id;

    this.appService.checkNotifications();

    if (this.isMe && this.appService.userInfo) {
      this.profilePictureUrl = this.appService.userInfo.profilePictureUrl;

      this.currentUser = this.appService.userInfo;

      if (this.appService.userCategories) {
        this.onUserCategoriesLoad(this.appService.userCategories);
      }

      if (this.appService.userActivities) {
        this.onUserActivitiesLoad(this.appService.userActivities);
      }
    }
    this.ionViewDidEnter();
    this.onWindowResize(null);
  }

  onWindowResize(e) {
    this.zone.run(() => {
      if (window.innerWidth > 1200) {
        this.categoryColSize = 2;
      } else if (window.innerWidth > 900) {
        this.categoryColSize = 3;
      } else if (window.innerWidth > 768) {
        this.categoryColSize = 4;
      }
    });
  }

  ionViewWillEnter() {
    this.appService.toggleStatusBar("light");
    this.appService.setStatusBarBackground("light");
  }

  ionViewDidEnter() {
    this.routerSubscription = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.zone.run(() => {
          this.currentUrl = e.url.split("?")[0];
          this.selectedSegment =
            e.url.indexOf("activities") > -1 ? "activities" : "categories";
        });
      }
    });


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

    this.getUser(false);
  }

  ionViewWillLeave() {
    this.routerSubscription.unsubscribe();
  }

  getUser(showLoader: boolean = true) {
    if (showLoader) {
      this.appService.toggleLoader(true).then((res) => {
        this.profileApiService.info(this.userId).subscribe(
          (v) => this.onUserInfoLoad(v),
          (e) => this.onError(e)
        );
      });
    } else {
      this.profileApiService.info(this.userId).subscribe(
        (v) => this.onUserInfoLoad(v),
        (e) => this.onError(e)
      );
    }

    this.getUserCategories();
  }

  toggleUserFollow() {
    const id = this.currentUser.id;
    if (this.currentUser.isFollowing) {
      this.socialApiService.unfollow(id).subscribe(
        (v) => this.onUnfollow(v),
        (e) => this.onError(e)
      );
    } else {
      this.socialApiService.follow(id).subscribe(
        (v) => this.onFollow(v),
        (e) => this.onError(e)
      );
    }
  }

  goMessage() {
    this.router.navigate(["app", "chat", 0]);
  }

  sendMessage() {
    this.appService.toggleLoader(true)
      .then(
        v => {
          this.chatApiService
            .getconversation(this.userId)
            .subscribe((v) => {
              this.zone.run(() => {
                this.appService.toggleLoader(false);
                if (this.chatService.conversations.find((x) => x.id == v.id) == null) {
                  this.chatService.conversations.push(v);
                }
                this.router.navigate(["app", "chat", v.id]);
              });
            });
        })

  }

  onUserInfoLoad(v: SocialUserListModel) {
    this.zone.run(() => {
      this.currentUser = v;
      this.profilePictureUrl = v.profilePictureUrl;
      this.appService.toggleLoader(false);
      if (this.isMe) {
        this.appService.userInfo = v;
      }
    });
  }

  onError(e: any) {
    this.zone.run(() => {
      this.appService.toggleLoader(false);
      this.appService.showAlert(e);
    });
  }

  onUnfollow(v: number) {
    this.zone.run(() => {
      this.currentUser.isFollowing = false;
      this.appService.userInfo.followingsCount = v;
      this.getUser(false);
    });
  }

  onFollow(v: number) {
    this.zone.run(() => {
      this.currentUser.isFollowing = true;
      this.appService.userInfo.followingsCount = v;
      this.getUser(false);
    });
  }

  getUserCategories() {
    this.categoryApiService.list(this.userId).subscribe(
      (v) => this.onUserCategoriesLoad(v),
      (e) => this.onError(e)
    );
  }

  getUserActivities() {
    this.activityApiService.list(this.userId).subscribe(
      (v) => this.onUserActivitiesLoad(v),
      (e) => this.onError(e)
    );
  }

  onUserActivitiesLoad(v: ActivityListModel[]): void {
    this.zone.run(() => {
      this.activities = v;
      if (this.isMe) {
        this.appService.userActivities = v;
      }
    });
  }

  onUserCategoriesLoad(v: CategoryListModel[]) {
    this.zone.run(() => {
      this.categories = v;
      if (this.isMe) {
        this.appService.userCategories = v;
      }
    });

    this.getUserActivities();
  }

  goBack() {
    this.navController.back();
  }

  onSegmentChanged(e) {
    this.zone.run(() => {
      this.content.scrollToTop();
    });
  }

  async openNotification() {
    const modal = await this.modalController.create({
      component: NotificationComponent,
      cssClass: "notification-custom",
    });

    return await modal.present();
  }

  openCommunity(segment: string) {
    this.router.navigate(["app", "profile", this.currentUser.id, "community"], {
      queryParams: { segment: segment },
      state: { userData: this.currentUser },
    });
  }

  openActivityEdit(activity: ActivityListModel) {
    if (activity.createdBy.id != this.appService.user.id) return;

    this.router.navigate(["/app/activity/create"], {
      queryParams: {
        activityId: activity.id,
        date: moment(activity.startDate).format("DD.MM.YYYY"),
      },
    });
  }

  getDate(v: ActivityListModel) {
    if (v != null && v.startDate != null) {
      return moment(v.startDate, "DD.MM.YYYY HH:mm").format("DD MMM");
    }

    return null;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "",
      mode: "md",
      cssClass: "my-custom-class",
      buttons: [
        {
          text: this.appService.translateWithParam("ChangeProfilePicture")
            .translatedData,
          cssClass: "changeProfilePicture",
          icon: "image",
          handler: () => {
            this.changePicture();
          },
        },
        {
          text: this.appService.translateWithParam("RemoveProfilePicture")
            .translatedData,
          cssClass: "changeProfilePicture",
          icon: "trash",
          handler: () => {
            this.profileApiService.removeprofilepicture().subscribe(
              (v) => this.onProfilePictureChanged(null),
              (e) => this.onError(e)
            );
          },
        },
      ],
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
  }

  onProfilePictureChanged(v: SocialUserListModel) {
    this.zone.run(() => {
      if (v != null) {
        this.appService.userInfo = v;
        this.profilePictureUrl = v.profilePictureUrl;
      } else {
        this.profilePictureUrl = "";
        this.appService.userInfo.profilePictureUrl = "";
      }
    });
  }

  private changePicture() {
    this.appService.getImage().then((imgData) => {
      this.profilePictureUrl = `data:image/jpeg;base64,${imgData.photo.base64String}`;
      this.profileApiService
        .changeprofilepicture({ fileName: "avatar.jpg", data: imgData.blob })
        .subscribe(
          (v) => this.onProfilePictureChanged(v),
          (e) => this.onError(e)
        );
    });
  }
}
