import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import * as moment from 'moment';
import {ActivityApiService, ActivityEditModel, ActivityListModel} from 'src/app/services/api-wishalink.service';
import {AppService} from 'src/app/services/app.service';

@Component({
    selector: 'app-create-activity',
    templateUrl: './create-activity.page.html',
    styleUrls: ['./create-activity.page.scss'],
})
export class CreateActivityPage implements OnInit {

    name: string;
    categoryId: number;
    isHidden: boolean;
    startDate: string;
    endDate: string;
    description: string;
    activityId: number = 0;
    minDate = new Date().toISOString();
    maxDate: string
    isLoading: boolean = false

    constructor(
        private zone: NgZone,
        private route: ActivatedRoute,
        private appService: AppService,
        private activityApiService: ActivityApiService,
        private navController: NavController
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');


    }

// start date on change de, end date start
// date den kucukse end date start date e esit olmali
    ngOnInit() {
        this.maxDate = moment().add('y', 10).format()
        this.route.queryParams.subscribe(v => {
            this.startDate = this.endDate = moment().format('YYYY-MM-DD');
            if(v.date != undefined) {
                this.startDate = this.endDate = moment(v.date, 'DD.MM.YYYY').format('YYYY-MM-DD');
            }
            this.activityId = parseInt(v.activityId);
            const activity = this.appService.userActivities.find(x => x.id == this.activityId);
            if (activity != null) {
                this.name = activity.name;
                //this.categoryId = activity.categoryId;
                this.isHidden = activity.isHidden;
                this.description = activity.description;
                this.startDate = moment(activity.startDate, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
                this.endDate = moment(activity.endDate, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm');
            }
        });
    }

    endDateFormatter(event) {
        console.log(event.target.value)
        this.endDate = this.startDate;
    }

    saveActivity() {
        this.isLoading = true
        if (this.name === undefined || this.name.length === 0) {
            this.appService.showAlert('Lütfen başlık ekleyin')
            this.isLoading = false
            return
        }
        const model = new ActivityEditModel();
        model.name = this.name;
        model.startDate = moment(this.startDate).format('DD.MM.YYYY HH:mm');
        model.endDate = moment(this.endDate).format('DD.MM.YYYY HH:mm');
        model.isHidden = this.isHidden;
        model.description = this.description;
        if (this.activityId > 0) {
            model.id = this.activityId;
            this.activityApiService.update(model)
                .subscribe(
                    v => this.onUpdate(v),
                    e => this.onError(e)
                )
        } else {
            this.activityApiService.create(model)
                .subscribe(
                    v => this.onSave(v),
                    e => this.onError(e)
                )
        }
    }

    deleteActivity() {
        this.activityApiService.delete(this.activityId)
            .subscribe(
                v => this.onDelete(),
                e => this.onError(e)
            )
    }

    onSave(v: ActivityListModel): void {
        this.zone.run(() => {
            this.isLoading = false
            this.appService.userActivities.push(v);
            this.appService.showToast('Etkinlik kaydedildi.');
            this.navController.back();
        })
    }

    onUpdate(v: ActivityListModel): void {
        this.zone.run(() => {
            this.isLoading = false
            const index = this.appService.userActivities.findIndex(x => x.id === this.activityId)
            this.appService.userActivities[index] = v;
            this.appService.showToast('Etkinlik güncellendi.');
            this.navController.back();
        })
    }

    onDelete(): void {
        this.zone.run(() => {
            this.appService.userActivities = this.appService.userActivities.filter(x => x.id !== this.activityId)
            this.appService.showToast('Etkinlik silindi.');
            this.navController.back();
        })
    }

    onError(e: any): void {
        this.isLoading = false
        this.appService.showErrorAlert(e);
    }

    close() {
        this.navController.back();
    }

}
