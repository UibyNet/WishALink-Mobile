import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertController, NavController} from '@ionic/angular';
import {
    ActivityApiService,
    ActivityListModel,
    MetaInfoModel,
    PostApiService,
    PostEditModel,
    PostListModel
} from 'src/app/services/api.service';
import {AppService} from 'src/app/services/app.service';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.page.html',
    styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit {

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

    constructor(
        private route: ActivatedRoute,
        private appService: AppService,
        private postApiService: PostApiService,
        private activityApiService: ActivityApiService,
        private navController: NavController,
        private alertController: AlertController,
        private router: Router
    ) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.categoryId = parseInt(id)
        console.log(this.categoryId)
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

        this.postApiService.create(model)
            .subscribe(
                v => this.onSave(v),
                e => this.onError(e)
            )
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
            this.showAlert()
        }
        this.activities = v;
    }

    async showAlert() {
        const alert = await this.alertController.create({
            header: 'Uyarı !',
            subHeader: 'Ürün eklemek için en az bir etkinlik oluşturmalısınız.',
            backdropDismiss: false,
            buttons: [{
                text: 'Etkinlik Ekle',
                handler: () => {
                    this.router.navigate(['/app/activity']);
                }
            }]
        });

        await alert.present();
    }

    onFetch(v: MetaInfoModel): void {
        this.mediaUrl = v.mediaUrl;
        this.mediaId = v.mediaId;
    }

    onError(e: any): void {
        this.isLoading = false
        this.appService.showErrorAlert(e);
    }

    close() {
        this.navController.back();
    }
}
