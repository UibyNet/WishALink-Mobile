import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, NavController} from '@ionic/angular';
import {
    ActivityApiService,
    ActivityListModel,
    MetaInfoModel,
    PostApiService,
    PostEditModel,
    PostListModel
} from 'src/app/services/api-wishalink.service';
import {AppService} from 'src/app/services/app.service';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.page.html',
    styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

    postId: number = 0;
    url: string;
    brand: string;
    model: string;
    color: string;
    size: string;
    date: Date;
    activity: string;
    description: string;
    isOpenCalendar: boolean = false;
    mediaUrl: string;
    mediaId: number;
    activities: ActivityListModel[];
    name: string;
    activityId: number;
    categoryId: number;
    isLoading: boolean = false
    hasActivities: boolean = false

    constructor(
        private route: ActivatedRoute,
        private appService: AppService,
        private postApiService: PostApiService,
        private activityApiService: ActivityApiService,
        private navController: NavController,
        private alertController: AlertController,
        private router: Router,
        private zone: NgZone
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');
        this.appService.setStatusBarBackground('primary')

    }

    ngOnInit() {
        const categoryId = this.route.snapshot.paramMap.get('categoryId');
        this.categoryId = parseInt(categoryId)

        const postId = this.route.snapshot.paramMap.get('id');
        this.postId = parseInt(postId)

        const post = this.router.getCurrentNavigation().extras.state as PostListModel;
        if (post != undefined) {
            this.postId = post.id;
            this.url = post.url;
            this.brand = post.brand;
            this.model = post.model;
            this.color = post.color;
            this.size = post.size;
            this.name = post.name;
            // this.activityId = post.activity.id;
        }
        this.activityApiService.list(this.appService.user.id)
            .subscribe(
                v => this.onActivitiesLoad(v),
                e => this.onError(e)
            )
    }

    calendarOpen() {
        this.isOpenCalendar = true

    }

    calendarClose() {
        this.isOpenCalendar = false
    }

    savePost() {
        this.isLoading = true
        console.log(this.name)
        if (this.url === undefined) {
            this.isLoading = false
            this.appService.showAlert('Ürün linki girmeniz gerekmektedir.')
            return
        }
        if (this.name === undefined) {
            this.isLoading = false
            this.appService.showAlert('Ürün başlığı girmeniz gerekmektedir.')
            return
        }
        const model = new PostEditModel();
        model.name = this.name;
        model.url = this.url;
        model.brand = this.brand;
        model.model = this.model;
        model.size = this.size;
        model.color = this.color;
        model.description = this.description;
        model.activityId = this.activityId;
        model.categoryId = this.categoryId;
        model.mediaId = this.mediaId

        if (this.postId > 0) {
            model.id = this.postId;
            this.postApiService.update(model)
                .subscribe(
                    v => this.onSave(v),
                    e => this.onError(e)
                )
        } else {

            this.postApiService.create(model)
                .subscribe(
                    v => this.onSave(v),
                    e => this.onError(e)
                )
        }
    }

    onSave(v: PostListModel): void {
        this.isLoading = false
        this.appService.showToast('Ürün kaydedildi');
        this.navController.back();
    }

    onLinkChange() {
        if (this.url != undefined && this.url.length > 3) {
            this.postApiService.fetch(this.url)
                .subscribe(
                    v => this.onFetch(v),
                    e => this.onError(e)
                )
        }
    }

    onActivitiesLoad(v: ActivityListModel[]): void {
        if (v.length === 0) {
            // this.showAlert()
        }
        this.zone.run(() => {
            this.hasActivities = true
            this.activities = v;
            console.log(
                this.activities
            )
        })
    }

    async showAlert() {
        const alert = await this.alertController.create({
            header: 'Uyarı !',
            subHeader: 'Etkinliğiniz bulunmamaktadır.',
            backdropDismiss: false,
            buttons: [
                {
                    text: 'Etkinlik Ekle',
                    handler: () => {
                        this.router.navigate(['/app/activity/create'], {queryParams: {activityId: 0}});
                    }
                },
                {
                    text: 'İptal',
                }]
        });

        await alert.present();
    }

    onFetch(v: MetaInfoModel): void {
        this.mediaUrl = v.mediaUrl;
        this.mediaId = v.mediaId;
    }

    onError(e: any): void {
        console.log(e)
        this.appService.toggleLoader(false)
        this.isLoading = false
        this.appService.showErrorAlert(e);
    }

    close() {
        this.navController.back();
    }

    deletePost() {
        this.appService.toggleLoader(true).then(res => {
            this.postApiService.delete(this.postId).subscribe(
                v => this.onDeleted(v),
                e => this.onError(e)
            )
        })
    }

    onDeleted(v: void) {
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            this.router.navigate(['app/category/' + this.categoryId])
        })

    }
}
