import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ModalController, NavController } from '@ionic/angular';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import {
    ActivityApiService,
    ActivityListModel,
    CategoryApiService, CategoryListModel,
    ProfileApiService,
    SocialApiService,
    SocialUserListModel
} from "../../../services/api-wishalink.service";
import { AppService } from "../../../services/app.service";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    currentUrl: string;
    routerSubscription: Subscription;
    isMe: boolean = false;
    userId: number
    currentUser: SocialUserListModel
    categories: CategoryListModel[]
    activities: ActivityListModel[];
    selectedSegment: string = 'categories';

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        public appService: AppService,
        private profileApiService: ProfileApiService,
        private socialApiService: SocialApiService,
        private activityApiService: ActivityApiService,
        private categoryApiService: CategoryApiService,
        private navController: NavController,
        private modalController: ModalController
    ) {
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id == 'me') {
            this.userId = this.appService.user.id;
        }
        else {
            this.userId = parseInt(id)
        }

        this.isMe = this.userId == this.appService.user.id;

        if (this.isMe && this.appService.userInfo) {
            this.currentUser = this.appService.userInfo;

            if(this.appService.userCategories) {
                this.onUserCategoriesLoad(this.appService.userCategories)
            }
            
            if(this.appService.userActivities) {
                this.onUserActivitiesLoad(this.appService.userActivities)
            }
        }
        else {
            this.getUser();
        }
        
        this.ionViewDidEnter();
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');
        this.appService.setStatusBarBackground('light')
    }

    ionViewDidEnter() {
        this.routerSubscription = this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.zone.run(() => {
                    this.currentUrl = e.url.split('?')[0];
                    this.selectedSegment = e.url.indexOf('activities') > -1 ? 'activities' : 'categories';
                })
            }
        })
    }

    ionViewWillLeave() {
        this.routerSubscription.unsubscribe();
    }

    getUser(showLoader: boolean = true) {
        if (showLoader) {
            this.appService.toggleLoader(true).then(res => {
                this.profileApiService.info(this.userId).subscribe(
                    v => this.onUserInfoLoad(v),
                    e => this.onError(e)
                )
            })
        } else {
            this.profileApiService.info(this.userId).subscribe(
                v => this.onUserInfoLoad(v),
                e => this.onError(e)
            )
        }

        this.getUserCategories();

    }

    toggleUserFollow() {
        const id = this.currentUser.id
        if (this.currentUser.isFollowing) {
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

    onUserInfoLoad(v: SocialUserListModel) {
        this.zone.run(() => {
            this.currentUser = v
            this.appService.toggleLoader(false)
            if (this.isMe) {
                this.appService.userInfo = v;
            }
        })
    }

    onError(e: any) {
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            this.appService.showAlert(e)
        })

    }

    onUnfollow(v: number) {
        this.zone.run(() => {
            this.currentUser.isFollowing = false;
            this.appService.userInfo.followingsCount = v
            this.getUser(false)
        })
    }

    onFollow(v: number) {
        this.zone.run(() => {
            this.currentUser.isFollowing = true;
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
        this.zone.run(() => {
            this.activities = v
            if(this.isMe) {
                this.appService.userActivities = v;
            }
        })
    }

    onUserCategoriesLoad(v: CategoryListModel[]) {
        this.zone.run(() => {
            this.categories = v
            if(this.isMe) {
                this.appService.userCategories = v;
            }
        })

        this.getUserActivities();

    }

    goBack() {
        this.navController.back();
    }

    onSegmentChanged(e) {

    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

    openCommunity(segment: string) {
        this.router.navigate(['app', 'profile', this.currentUser.id, 'community'], {queryParams: { segment : segment}, state: {userData: this.currentUser}});
    }

    openActivityEdit(activity: ActivityListModel) {
        
        if(activity.createdBy.id != this.appService.user.id) return;
        debugger;
        
        this.router.navigate(['/app/activity/create'], {
            queryParams: {
                activityId: activity.id,
                date: moment(activity.startDate).format('DD.MM.YYYY')
            }
        })
    }

    getDate(v: ActivityListModel) {

        if (v != null && v.startDate != null) {
            return moment(v.startDate, 'DD.MM.YYYY HH:mm').format('DD MMM');
        }

        return null;
    }
}
