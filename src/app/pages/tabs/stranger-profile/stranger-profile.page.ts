import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import {
    ActivityApiService,
    ActivityListModel,
    CategoryApiService, CategoryListModel,
    ProfileApiService,
    SocialApiService,
    SocialUserListModel
} from "../../../services/api.service";
import {AppService} from "../../../services/app.service";

@Component({
    selector: 'app-stranger-profile',
    templateUrl: './stranger-profile.page.html',
    styleUrls: ['./stranger-profile.page.scss'],
})
export class StrangerProfilePage implements OnInit {

    constructor(
        private ngZone: NgZone,
        private route: ActivatedRoute,
        private appService: AppService,
        private profileApiService: ProfileApiService,
        private socialApiService: SocialApiService,
        private activityApiService: ActivityApiService,
        private categoryApiService: CategoryApiService,
        private navController: NavController
    ) {
    }

    strangerUser: SocialUserListModel
    userId: number
    categories: CategoryListModel[]
    activities: ActivityListModel[];
    selectedSegment: string = 'segment-category';

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.userId = parseInt(id)
        this.getUser();
    }
    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');

    }
    getUser(showLoader: boolean = true) {
        if (showLoader) {
            this.appService.toggleLoader(true).then(res => {
                this.profileApiService.info(this.userId).subscribe(
                    v => this.onUserInfo(v),
                    e => this.onError(e)
                )
            })
        } else {
            this.profileApiService.info(this.userId).subscribe(
                v => this.onUserInfo(v),
                e => this.onError(e)
            )
        }

        this.getUserCategories();

    }

    selectedUser() {
        const id = this.strangerUser.id
        if (this.strangerUser.isFollowing) {
            this.socialApiService.unfollow(id).subscribe(
                v => this.onUnfollow(v),
                e => this.onError(e)
            )
        } else {
            this.socialApiService.follow(id).subscribe(
                v => this.onFollow(v),
                e => this.onError(e)
            )
        }

    }

    onUserInfo(v: SocialUserListModel) {
        this.ngZone.run(() => {
            this.strangerUser = v
            console.log(this.strangerUser)
            this.appService.toggleLoader(false)
        })
    }

    onError(e: any) {
        this.ngZone.run(() => {
            this.appService.toggleLoader(false)
            this.appService.showAlert(e)
        })

    }

    onUnfollow(v: number) {
        this.ngZone.run(() => {
            this.strangerUser.isFollowing = false;
            this.appService.userInfo.followingsCount = v
            this.getUser(false)
        })
    }

    onFollow(v: number) {
        this.ngZone.run(() => {
            this.strangerUser.isFollowing = true;
            this.appService.userInfo.followingsCount = v
            this.getUser(false)
        })
    }

    getUserCategories() {
        this.categoryApiService.list(this.userId).subscribe(
            v => this.onUserCategoriesLoad(v),
            e => this.onError(e)
        )
    }

    getUserActivities() {
        this.activityApiService.list(this.userId).subscribe(
            v => this.onUserActivitiesLoad(v),
            e => this.onError(e)
        )
    }

    onUserActivitiesLoad(v: ActivityListModel[]): void {
        this.ngZone.run(() => {
            this.activities = v
            console.log(this.activities)
        })
    }

    onUserCategoriesLoad(v: CategoryListModel[]) {
        this.ngZone.run(() => {
            this.categories = v
            console.log(this.categories)
        })

        this.getUserActivities();

    }

    goBack() {
        this.navController.back();
    }

    onSegmentChanged(e) {

    }

    getDate(v: ActivityListModel) {

        if(v != null && v.startDate != null) {
            return moment(v.startDate, 'DD.MM.YYYY HH:mm').format('DD MMM');
        }

        return null;
    }
}
