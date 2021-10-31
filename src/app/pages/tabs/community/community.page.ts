import {Component, NgZone, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {SocialApiService, SocialUserListModel} from "../../../services/api.service";

@Component({
    selector: 'app-community',
    templateUrl: './community.page.html',
    styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {

    constructor(
        private zone: NgZone,
        private appService: AppService,
        private socialApiService: SocialApiService
    ) {
    }

    userData: SocialUserListModel
    followingList: SocialUserListModel[]
    followerList: SocialUserListModel[]
    selectedTab: string

    ngOnInit() {
        this.getUserData()
        this.getFollowerList()
    }

    getUserData() {
        this.userData = this.appService.userInfo
        console.log(this.appService.userInfo)
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
        this.zone.run(()=>{
            this.followingList = v
        })
        console.log("following", this.followingList)
    }

    onFollowers(v: SocialUserListModel[]) {
        this.followerList = v
        console.log("follower", v)
    }

    onError(e: any) {
        this.appService.showAlert(e)
    }


}
