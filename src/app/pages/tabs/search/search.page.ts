import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AppService } from "../../../services/app.service";
import { SocialApiService, SocialUserListModel } from "../../../services/api.service";
import { Router } from "@angular/router";
import { NotificationComponent } from "../../../components/notification/notification.component";
import { ModalController } from "@ionic/angular";

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    @ViewChild('profileHeader', { static: false }) profileHeaderEl: ElementRef;

    isSearchFocused: boolean;
    isSearching: boolean;

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

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');

    }

    searchUser(event: any) {
        const value = event.target.value;
        if (value != '') {
            this.isSearching = true;
            this.socialApiService.searchusers(value).subscribe(
                v => this.onSearchResult(v),
                e => this.onError(e)
            )
        } else {
            this.searchResultPeople = []
        }
    }

    onSearchResult(v: SocialUserListModel[]) {
        this.zone.run(() => {
            this.isSearching = false;
            this.searchResultPeople = v
            this.appService.toggleLoader(false)
        })

    }

    followAction(user) {
        if(user.isBusy) return;

        user.isBusy = true;
        switch (user.isFollowing) {
            case true:
                this.socialApiService.unfollow(user.id).subscribe(
                    v => {
                        user.isBusy = false;
                        this.onUnfollow(v, user.id)
                    },
                    e => {
                        user.isBusy = false;
                        this.onError(e);
                    }
                )
                break;
            case false:
                this.socialApiService.follow(user.id).subscribe(
                    v => {
                        user.isBusy = false;
                        this.onFollow(v, user.id)
                    },
                    e => {
                        user.isBusy = false;
                        this.onError(e);
                    }
                )
                break;
        }
    }

    onError(e: any) {
        this.zone.run(() => {
            this.isSearching = false;
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

    onSearchFocus() {
        this.isSearchFocused = true;
    }

    onSearchBlur() {
        this.isSearchFocused = false;
    }
}
