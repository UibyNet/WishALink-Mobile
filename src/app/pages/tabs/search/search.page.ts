import {Component, NgZone, OnInit} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {SocialApiService, SocialUserListModel} from "../../../services/api.service";
import {Router} from "@angular/router";
import {NotificationComponent} from "../../../components/notification/notification.component";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

    constructor(
        private appService: AppService,
        private socialApiService: SocialApiService,
        private router: Router,
        private modalController: ModalController,
        private zone: NgZone,
    ) {
    }

    userData: SocialUserListModel
    searchResultPeople: SocialUserListModel[]

    ngOnInit() {
        this.userData = this.appService.userInfo
        this.searchResultPeople = []
    }

    searchUser(event: any) {
        const value = event.target.value;
        if (value != '') {
            this.appService.toggleLoader(true).then(res => {
                this.socialApiService.searchusers(value).subscribe(
                    v => this.onSearchResult(v),
                    e => this.onError(e)
                )
            })
        } else {
            this.searchResultPeople = []
        }
    }

    onSearchResult(v: SocialUserListModel[]) {
        this.zone.run(() => {
            this.searchResultPeople = v
            this.appService.toggleLoader(false)
        })

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
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            this.appService.showAlert(e)
        })

    }

    selectedUser(id: number) {
        this.router.navigate(['/tabs/search/stranger-profile', id])
    }

    onUnfollow(v: number, userId: number) {
        this.zone.run(() => {
            this.searchResultPeople.filter(x => x.id === userId)[0].isFollowing = false;
            this.appService.userInfo.followingsCount = v
        })

    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        return await modal.present();
    }

    onFollow(v: number, userId: number) {
        this.zone.run(() => {
            this.searchResultPeople.filter(x => x.id === userId)[0].isFollowing = true;
            this.appService.userInfo.followingsCount = v
        })

    }
}
