import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {AppService} from "../../../services/app.service";
import {SocialApiService, SocialUserListModel} from "../../../services/api-wishalink.service";
import {Router} from "@angular/router";
import {NotificationComponent} from "../../../components/notification/notification.component";
import {ModalController, Platform} from "@ionic/angular";
import {Contact, Contacts} from '@capacitor-community/contacts'
import { Share } from '@capacitor/share';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    @ViewChild('profileHeader', {static: false}) profileHeaderEl: ElementRef;

    isSearchFocused: boolean;
    isSearching: boolean;

    userData: SocialUserListModel
    searchResultPeople: SocialUserListModel[]
    contacts: Contact[] = []

    constructor(
        public appService: AppService,
        private socialApiService: SocialApiService,
        private router: Router,
        private modalController: ModalController,
        private zone: NgZone,
        private platform: Platform
    ) {
    }

    ngOnInit() {
        this.userData = this.appService.userInfo
        this.searchResultPeople = []
        this.getContacts()
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light')
        this.appService.setStatusBarBackground('light')

    }

    getContacts() {
        if(this.platform.is('capacitor')) {
            Contacts.getContacts().then(result => {
                for (const contact of result.contacts) {
                    this.contacts.push(contact)
                }
            });
        }
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
        if (user.isBusy) return;

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
        this.router.navigate(['/app/profile', id])
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

    async share(contact: Contact) {
        await Share.share({
            title: 'Wish a Link',
            text: 'Wish a Link uygulamasını indirerek heyecana ortak ol!',
            url: 'http://wishalink.com/',
            dialogTitle: contact.displayName + ' Davet Et',
        });
    }
}
