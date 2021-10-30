import {Component, OnInit} from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivityApiService, ActivityListModel, MetaInfoModel, PostApiService, PostEditModel, PostListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';

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

    constructor(
        private appService: AppService,
        private postApiService: PostApiService,
        private activityApiService: ActivityApiService,
        private navController: NavController
    ) {
    }

    ngOnInit() {
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
        const model = new PostEditModel();
        model.name = this.name;
        model.brand = this.brand;
        model.model = this.model;
        model.size = this.size;
        model.color = this.color;
        model.description = this.description;
        model.activityId = this.activityId;
        model.mediaId = this.mediaId

        this.postApiService.create(model)
            .subscribe(
                v => this.onSave(v),
                e => this.onError(e)
            )
    }

    onSave(v: PostListModel): void {
        this.appService.showToast('Ürün kaydedildi');
        this.navController.back();
    }

    onLinkChange() {
        if(this.url != undefined && this.url.length > 3)  {
            this.postApiService.fetch(this.url)
                .subscribe(
                    v => this.onFetch(v),
                    e => this.onError(e)
                )
        }
    }

    onActivitiesLoad(v: ActivityListModel[]): void {
        this.activities = v;
    }

    onFetch(v: MetaInfoModel): void {
        this.mediaUrl = v.mediaUrl;
        this.mediaId = v.mediaId;
    }

    onError(e: any): void {
        throw new Error('Method not implemented.');
    }
}
