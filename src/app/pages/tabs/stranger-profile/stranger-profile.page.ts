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

    ngOnInit() {
        const userId = this.route.snapshot.paramMap.get('id');
        this.getUser(parseInt(userId));
    }

    getUser(userId: number) {
        this.appService.toggleLoader(true).then(res => {
            this.profileApiService.info(userId).subscribe(
                v => this.onUserInfo(v),
                e => this.onError(e)
            )
        })

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
        console.log(v)
        this.strangerUser.isFollowing = false;
        this.strangerUser.followersCount = v
    }

    onFollow(v: number) {
        console.log(v)
        this.strangerUser.isFollowing = true;
        this.strangerUser.followersCount = v
    }

}
