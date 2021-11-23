import { Component, NgZone, OnInit } from '@angular/core';
import { PostApiService, PostListModel, SocialUserListModel } from 'src/app/services/api-wishalink.service';
import { AppService } from "../../../services/app.service";
import { ModalController } from '@ionic/angular';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { Router } from '@angular/router';
import { IPageInfo } from 'ngx-virtual-scroller';

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.page.html',
    styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {

    userData: SocialUserListModel
    suggestions: PostListModel[] = [];
    isLoading: boolean = false;

    constructor(
        public appService: AppService,
        private zone: NgZone,
        private postApiService: PostApiService,
        private modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.userData = this.appService.userInfo;

        //this.loadSuggestions(null)
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');
        this.appService.setStatusBarBackground('light')

    }

    loadMoreSuggestions(event: IPageInfo) {
        if (event.endIndex !== this.suggestions.length - 1) return;
        this.isLoading = true;
        this.loadSuggestions(null);
    }

    loadSuggestions(event) {
        this.postApiService.suggestions()
            .subscribe(
                v => {
                    this.zone.run(() => {
                        this.isLoading = false;
                    })
                    this.onSuggestionsLoad(v);
                },
                e => {
                    this.zone.run(() => {
                        this.isLoading = false;
                    })
                    this.onError(e);
                }
            )
    }

    onSuggestionsLoad(v: PostListModel[]): void {
        this.zone.run(() => {
            console.log(v)
            if (this.suggestions == null) this.suggestions = [];
            this.suggestions = this.suggestions.concat(v);
        })
    }

    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

    async openNotification() {
        const modal = await this.modalController.create({
            component: NotificationComponent,
            cssClass: 'notification-custom'
        })

        modal.onDidDismiss().then(v => {
            console.log(v.data);
        })

        return await modal.present();
    }
}
