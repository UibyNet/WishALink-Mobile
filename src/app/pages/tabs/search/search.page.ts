import {Component, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {SocialApiService, SocialUserListModel} from "../../../services/api.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    constructor(
        private appService: AppService,
        private socialApiService: SocialApiService,
        private router: Router
    ) {
        this.userData = appService.userInfo
    }

    userData: SocialUserListModel
    searchResultPeople: SocialUserListModel[]

    ngOnInit() {
    }

    yourSearchFunction(event) {
        if (event != '') {
            this.appService.toggleLoader(true).then(res => {
                this.socialApiService.searchusers(event).subscribe(
                    v => this.onSearchResult(v),
                    e => this.onError(e)
                )
            })
        }
    }

    onSearchResult(v: SocialUserListModel[]) {
        this.searchResultPeople = v
        this.appService.toggleLoader(false)
    }

    followAction(user) {
        switch (user.isFollowing) {
            case true:
                this.socialApiService.unfollow(user.id).subscribe(
                    v => this.onUnfollow(v, user.id),
                    e => this.onError(e)
                )
                break;
            case false:
                this.socialApiService.follow(user.id).subscribe(
                    v => this.onFollow(v, user.id),
                    e => this.onError(e)
                )
                break;
        }
    }

    onError(e: any) {
        this.appService.toggleLoader(false)
        this.appService.showAlert(e)
    }

    selectedUser(id: number) {
        this.router.navigate(['/tabs/search/stranger-profile', id])
    }

    onUnfollow(v: number, userId: number) {
        this.searchResultPeople.filter(x => x.id === userId)[0].isFollowing = false;
        this.appService.userInfo.followingsCount = v
    }

    onFollow(v: number, userId: number) {
        this.searchResultPeople.filter(x => x.id === userId)[0].isFollowing = true;
        this.appService.userInfo.followingsCount = v
    }
}
