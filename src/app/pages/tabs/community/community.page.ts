import { Component, NgZone, OnInit } from '@angular/core';
import { AppService } from "../../../services/app.service";
import { SocialApiService, SocialUserListModel } from "../../../services/api.service";
import { ModalController, NavController } from '@ionic/angular';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-community',
    templateUrl: './community.page.html',
    styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {

    constructor(
        public appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private socialApiService: SocialApiService,
        private zone: NgZone,
        private navController: NavController,
        private modalController: ModalController
    ) {
    }

    userData: SocialUserListModel
    followingList: SocialUserListModel[]
    followerList: SocialUserListModel[]
    selectedTab: string = 'follower'

    ngOnInit() {
        this.getUserData()
        this.getFollowerList()
    }

    getUserData() {
        const state = this.router.getCurrentNavigation().extras.state;

        if (state != null && state.userData != null) {
            this.userData = state.userData;
        }
        else {
            this.userData = this.appService.userInfo;
        }
    }

    getFollowingList() {
        this.selectedTab = 'following'
        this.socialApiService.followings(this.userData.id).subscribe(
            v => this.onFollowing(v),
            e => this.onError(e)
        )
    }

    getFollowerList() {
        this.selectedTab = 'follower'
        this.socialApiService.followers(this.userData.id).subscribe(
            v => this.onFollowers(v),
            e => this.onError(e)
        )
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
        if(user.isBusy) return;
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
        if(user.isBusy) return;
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
        this.router.navigate(['/app/search/stranger-profile', id])
    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

}
