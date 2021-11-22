import { Component, NgZone, OnInit } from '@angular/core';
import { AppService } from "../../../services/app.service";
import { ProfileApiService, SocialApiService, SocialUserListModel } from "../../../services/api-wishalink.service";
import { ModalController, NavController } from '@ionic/angular';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-community',
    templateUrl: './community.page.html',
    styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
    currentUrl: string;
    userData: SocialUserListModel
    followingList: SocialUserListModel[]
    followerList: SocialUserListModel[]
    selectedSegment: string = 'follower'
    currentUserId: number;
    routerSubscription: Subscription;

    constructor(
        public appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private socialApiService: SocialApiService,
        private profileApiService: ProfileApiService,
        private zone: NgZone,
        private navController: NavController,
        private modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.ionViewDidEnter();
    }


    ionViewDidEnter() {
        this.routerSubscription = this.router.events.subscribe(e => {
            if (e instanceof NavigationEnd) {
                this.zone.run(() => {
                    this.currentUrl = e.url.split('?')[0];
                    this.currentUserId = parseInt(e.url.replace('/app/profile/', '').split('/')[0]);

                    if (isNaN(this.currentUserId)) return;

                    this.selectedSegment = e.url.indexOf('following') > -1 ? 'following' : 'follower';

                    if (this.selectedSegment === 'follower') {
                        this.getFollowerList()
                    }
                    else if (this.selectedSegment === 'following') {
                        this.getFollowingList()
                    }

                    this.getUserData();

                })
            }
        })

    }

    ionViewWillLeave() {
        this.routerSubscription.unsubscribe();
    }

    getUserData() {
        if (this.userData) return;

        const state = this.router.getCurrentNavigation().extras.state;

        if (state != null && state.userData != null) {
            this.userData = state.userData;
        }
        else {
            this.profileApiService.info(this.currentUserId).subscribe(
                v => this.onUserInfoLoad(v),
                e => this.onError(e)
            )
        }
    }

    getFollowingList() {

        this.socialApiService.followings(this.currentUserId).subscribe(
            v => this.onFollowing(v),
            e => this.onError(e)
        )
    }

    getFollowerList() {
        this.socialApiService.followers(this.currentUserId).subscribe(
            v => this.onFollowers(v),
            e => this.onError(e)
        )
    }

    private onUserInfoLoad(v: SocialUserListModel) {
        this.zone.run(() => {
            this.userData = v;
        })
    }

    onFollowing(v: SocialUserListModel[]) {
        this.zone.run(() => {
            this.followingList = v
        })

    }

    onFollowers(v: SocialUserListModel[]) {
        this.zone.run(() => {
            this.followerList = v
        })
    }

    onError(e: any) {
        this.zone.run(() => {
            this.appService.showErrorAlert(e);
        })
    }

    followUser(user: SocialUserListModel) {
        if (user.isBusy) return;
        user.isBusy = true;

        this.socialApiService.follow(user.id).subscribe(
            v => {
                user.isBusy = false;
                this.onFollow(v)
            },
            e => {
                user.isBusy = false;
                this.onError(e);
            }
        )
    }

    unfollowUser(user: SocialUserListModel, type: string) {
        if (user.isBusy) return;
        user.isBusy = true;

        this.socialApiService.unfollow(user.id).subscribe(
            v => {
                user.isBusy = false;
                this.onUnfollow(v, type)
            },
            e => {
                user.isBusy = false;
                this.onError(e);
            }
        )
    }


    onUnfollow(v: number, type: string) {
        this.zone.run(() => {
            if (type === 'reloadFollowing') {
                this.getFollowingList()
            }
            if (type === 'reloadFollower') {
                this.getFollowerList()
            }
            this.userData.followingsCount = v
        })
    }

    onFollow(v: number) {
        this.zone.run(() => {
            this.getFollowerList()
            this.userData.followingsCount = v
        })
    }

    goBack() {
        this.navController.back();
    }

    selectedUser(id: number) {
        this.router.navigate(['/app/profile', id])
    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

}
