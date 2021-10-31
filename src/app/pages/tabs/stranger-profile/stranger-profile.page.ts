import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProfileApiService, SocialApiService, SocialUserListModel} from "../../../services/api.service";
import {AppService} from "../../../services/app.service";

@Component({
    selector: 'app-stranger-profile',
    templateUrl: './stranger-profile.page.html',
    styleUrls: ['./stranger-profile.page.scss'],
})
export class StrangerProfilePage implements OnInit {

    constructor(
        private route: ActivatedRoute,
        private profileApiService: ProfileApiService,
        private appService: AppService,
        private socialApiService: SocialApiService
    ) {
    }

    strangerUser: SocialUserListModel
    userId: number

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        this.userId = parseInt(id)
        this.getUser();
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
        this.strangerUser = v
        console.log(this.strangerUser)
        this.appService.toggleLoader(false)
    }

    onError(e: any) {
        this.appService.toggleLoader(false)
        this.appService.showAlert(e)
    }

    onUnfollow(v: number) {
        this.strangerUser.isFollowing = false;
        this.appService.userInfo.followingsCount = v
        this.getUser(false)

    }

    onFollow(v: number) {
        this.strangerUser.isFollowing = true;
        this.appService.userInfo.followingsCount = v
        this.getUser(false)
    }

}
