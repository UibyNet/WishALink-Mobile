import {Component, NgZone, OnInit} from "@angular/core";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AlertController, NavController} from "@ionic/angular";
import {
    ActivityApiService,
    ActivityListModel,
    CommonApiService,
    MetaInfoModel,
    PostApiService,
    PostEditModel,
    PostListModel,
} from "src/app/services/api-wishalink.service";
import {AppService} from "src/app/services/app.service";

@Component({
    selector: "app-add-product",
    templateUrl: "./add-product.page.html",
    styleUrls: ["./add-product.page.scss"],
})
export class AddProductPage implements OnInit {
    postId: number = 0;
    url: string = "";
    brand: string = "";
    model: string = "";
    color: string = "";
    size: string = "";
    description: string = "";
    date: Date;
    activity: string;
    isOpenCalendar: boolean = false;
    mediaUrl: string;
    mediaId: number;
    activities: ActivityListModel[];
    name: string = '';
    activityId: number = 0;
    categoryId: number;
    isLoading: boolean = false;
    hasActivities: boolean = false;
    postImage: string;
    postImageBlob: Blob;
    urlInitial: string;

    constructor(
        public appService: AppService,
        private route: ActivatedRoute,
        private postApiService: PostApiService,
        private activityApiService: ActivityApiService,
        private commonApiService: CommonApiService,
        private navController: NavController,
        private alertController: AlertController,
        private router: Router,
        private zone: NgZone
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar("dark");
        this.appService.setStatusBarBackground("primary");
    }

    ngOnInit() {
        const categoryId = this.route.snapshot.paramMap.get("categoryId");
        this.categoryId = parseInt(categoryId);

        const postId = this.route.snapshot.paramMap.get("id");
        this.postId = parseInt(postId);

        const post = this.router.getCurrentNavigation().extras
            .state as PostListModel;
        if (post != undefined) {
            this.postId = post.id;
            this.url = post.url;
            this.urlInitial = post.url;
            this.brand = post.brand;
            this.model = post.model;
            this.color = post.color;
            this.size = post.size;
            this.name = post.name;
            // this.activityId = post.activity.id;
            this.mediaUrl = post.mediaUrl;
        }
        
        this.activityApiService.list(this.appService.user.id).subscribe(
            (v) => this.onActivitiesLoad(v),
            (e) => this.onError(e)
        );
    }

    calendarOpen() {
        this.isOpenCalendar = true;
    }

    calendarClose() {
        this.isOpenCalendar = false;
    }

    savePost() {
        this.isLoading = true;
        console.log(this.name);
        if (this.url === undefined) {
            this.isLoading = false;
            this.appService.showAlert("Ürün linki girmeniz gerekmektedir.");
            return;
        }
        if (this.name === undefined) {
            this.isLoading = false;
            this.appService.showAlert("Ürün başlığı girmeniz gerekmektedir.");
            return;
        }

        if (this.mediaId == 0 && this.postImageBlob == null) {
            this.appService.showToast("Lütfen ürün görseli ekleyin.");
            this.isLoading = false;
            return;
        }

        const model = new PostEditModel();
        model.id = this.postId;
        model.name = this.name;
        model.url = this.url;
        model.brand = this.brand;
        model.model = this.model;
        model.size = this.size;
        model.color = this.color;
        model.description = this.description;
        model.activityId = this.activityId;
        model.categoryId = this.categoryId;
        model.mediaId = this.mediaId;
        model.tags = "";

        if (this.postId > 0) {
            this.postApiService.update(model).subscribe(
                (v) => this.onSave(v),
                (e) => this.onError(e)
            );
        } else {
            this.postApiService.create(model).subscribe(
                (v) => this.onSave(v),
                (e) => this.onError(e)
            );
        }
    }

    onSave(v: PostListModel): void {
        console.log('post list model', v)
        this.zone.run(() => {
            let navigationExtras: NavigationExtras = {
                state: {
                    newPost: v
                }
            };
            this.isLoading = false;
            this.appService.showToast("Ürün kaydedildi");
            this.navController.back();
            this.navController.navigateBack("app/category/" + this.categoryId + "/" + this.postId);
            // this.router.navigate(['app/category/' + v.category.id], navigationExtras)
        })
    }

    onLinkChange() {
        if (this.url != undefined && this.url.length > 3 && this.urlInitial != this.url) {
            this.postApiService.fetch(this.url).subscribe(
                (v) => this.onFetch(v),
                (e) => this.onError(e)
            );
        }
    }

    onActivitiesLoad(v: ActivityListModel[]): void {
        console.log("acti", v);

        this.zone.run(() => {
            if (v.length === 0) {
                // this.showAlert()
                this.hasActivities = false;
            } else {
                this.hasActivities = true;
            }
            this.activities = v;
            console.log(this.hasActivities);
        });
    }

    async showAlert() {
        const alert = await this.alertController.create({
            header: "Uyarı !",
            subHeader: "Etkinliğiniz bulunmamaktadır.",
            backdropDismiss: false,
            buttons: [
                {
                    text: "Etkinlik Ekle",
                    handler: () => {
                        this.router.navigate(["/app/activity/create"], {
                            queryParams: {activityId: 0},
                        });
                    },
                },
                {
                    text: "İptal",
                },
            ],
        });

        await alert.present();
    }

    onFetch(v: MetaInfoModel): void {
        if (v.mediaId > 0) {
            this.mediaUrl = v.mediaUrl;
            this.mediaId = v.mediaId;
            this.postImage = null;
            this.postImageBlob = null;
        }
    }

    onError(e: any): void {
        this.zone.run(() => {
            console.log(e);
            this.appService.toggleLoader(false);
            this.isLoading = false;
            this.appService.showErrorAlert(e);
        });
    }

    close() {
        this.navController.back();
    }

    deletePost() {
        this.appService.toggleLoader(true).then((res) => {
            this.postApiService.delete(this.postId).subscribe(
                (v) => this.onDeleted(v),
                (e) => this.onError(e)
            );
        });
    }

    onDeleted(v: void) {
        this.zone.run(() => {
            this.appService.toggleLoader(false);
            this.navController.navigateBack("app/category/" + this.categoryId);
        });
    }

    selectImage() {
        this.appService.getImage().then((imgData) => {
            this.zone.run(() => {
                this.postImageBlob = imgData.blob;
                this.postImage = `data:image/jpeg;base64,${imgData.photo.base64String}`;
                this.mediaId = 0;
                this.mediaUrl = null;
                this.saveImage();
            });
        });

        // if (this.appService.isMobile) {
        //     this.appService.getImage()
        //         .then(
        //             (imgData) => {
        //                 this.zone.run(() => {
        //                     if (imgData != null && imgData.photo != null && imgData.photo.base64String != null && imgData.photo.base64String.length > 0) {
        //                         this.postImageBlob = imgData.blob;
        //                         this.postImage = `data:image/jpeg;base64,${imgData.photo.base64String}`;
        //                         this.mediaId = 0;
        //                         this.mediaUrl = null;
        //                         this.saveImage();
        //                     }
        //                 })
        //             }
        //         );
        // }
        // else {

        // }
    }

    saveImage() {
        this.commonApiService
            .uploadmedia({fileName: "", data: this.postImageBlob})
            .subscribe(
                (v) => {
                    this.mediaId = v.id;
                },
                (e) => this.appService.showErrorAlert(e)
            );
    }
}
