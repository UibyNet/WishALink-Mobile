import {Component, NgZone, OnInit} from '@angular/core';
import {
    CategoryApiService,
    CategoryListModel,
    Media,
    ProfileApiService,
    SocialApiService,
    SocialUserListModel,
    UserModel
} from "../../../services/api.service";
import {AppService} from "../../../services/app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ActionSheetController, ModalController} from "@ionic/angular";
import {NotificationComponent} from "../../../components/notification/notification.component";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    categories: CategoryListModel[];

    constructor(
        public appService: AppService,
        private zone: NgZone,
        private router: Router,
        private profileApiService: ProfileApiService,
        private categoryApiService: CategoryApiService,
        private actionSheetController: ActionSheetController,
        private modalController: ModalController
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {

    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');

    }

    ionViewDidEnter() {
        this.getUserData();
        this.loadCategories();
    }

    getUserData() {
        this.userData = this.appService.userInfo;

        if (this.userData == null) {
            this.appService.toggleLoader(true).then(res => {
                this.profileApiService.info(this.appService.user.id).subscribe(
                    v => this.userInfo(v),
                    e => this.onError(e)
                )
            })
        } else {
            this.profileApiService.info(this.appService.user.id).subscribe(
                v => this.userInfo(v),
                e => this.onError(e)
            )
        }
    }

    loadCategories() {
        if (this.appService.userCategories != null && this.appService.userCategories.length > 0) {
            this.onCategoriesLoad(this.appService.userCategories);
        } else {
            this.categoryApiService.list(this.appService.user.id)
                .subscribe(
                    v => this.onCategoriesLoad(v),
                    e => this.onError(e)
                )
        }
    }

    onCategoriesLoad(v: CategoryListModel[]): void {
        if (v != null && v.length > 0) {
            this.zone.run(() => {
                this.categories = v;
                this.appService.userCategories = v;
            })
        }
    }

    private userInfo(v: SocialUserListModel) {
        this.zone.run(() => {
            this.userData = v;
            this.appService.userInfo = v;
            this.appService.toggleLoader(false);
        })

        if(!this.appService.isFcmTokenSaved && this.appService.fcmToken != undefined) {
            const model = new UserModel();
            model.fcmToken = this.appService.fcmToken;

            this.profileApiService.update(model)
                .subscribe(
                    v => {
                        this.appService.isFcmTokenSaved = true;
                    },
                    e => console.log(e)
                )
        }

        this.appService.checkNotifications();
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: '',
            mode: 'md',
            cssClass: 'my-custom-class',
            buttons: [
                {
                    text: 'Profil resmini değiştir',
                    cssClass: 'changeProfilePicture',
                    icon: 'image',
                    handler: () => {
                        this.changePicture();
                    }
                },
                {
                    text: 'Profil resmini kaldır',
                    cssClass: 'changeProfilePicture',
                    icon: 'trash',
                    handler: () => {
                        this.profileApiService.removeprofilepicture()
                            .subscribe(
                                v => this.onProfilePictureChanged(null),
                                e => this.onError(e)
                            )
                    }
                },
            ]
        });
        await actionSheet.present();

        const {role} = await actionSheet.onDidDismiss();
    }

    onProfilePictureChanged(v: SocialUserListModel) {
        this.zone.run(() => {
            if (v != null) {
                this.appService.userInfo = v;
                this.userData = v;
            } else {
                this.userData.profilePictureUrl = '';
                this.appService.userInfo.profilePictureUrl = '';
            }
        })
    }


    private onError(error: any) {
        this.appService.toggleLoader(false)
        this.appService.showAlert(error)
    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

    addCategory() {
        this.zone.run(() => {
            this.router.navigateByUrl("/app/home/add-category");
        })
    }

    private changePicture() {

        this.appService.getImage()
            .then(
                (imgData) => {
                    this.userData.profilePictureUrl = `data:image/jpeg;base64,${imgData.photo.base64String}`;
                    this.profileApiService.changeprofilepicture({fileName: 'avatar.jpg', data: imgData.blob})
                        .subscribe(
                            v => this.onProfilePictureChanged(v),
                            e => this.onError(e)
                        )
                }
            );
    }
}
