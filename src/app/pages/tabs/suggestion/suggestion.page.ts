import { Component, NgZone, OnInit } from '@angular/core';
import { PostApiService, PostListModel, SocialUserListModel } from 'src/app/services/api.service';
import { AppService } from "../../../services/app.service";
import { Browser } from '@capacitor/browser';
import { ModalController } from '@ionic/angular';
import { NotificationComponent } from 'src/app/components/notification/notification.component';

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.page.html',
    styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {

    userData: SocialUserListModel
    suggestions: PostListModel[];

    constructor(
        private zone: NgZone,
        private appService: AppService,
        private postApiService: PostApiService,
        private modalController: ModalController
    ) {
    }
    ngOnInit() {
        this.userData = this.appService.userInfo;

        this.loadSuggestions()
    }
    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');

    }

    loadSuggestions() {
        this.postApiService.suggestions()
            .subscribe(
                v => this.onSuggestionsLoad(v),
                e => this.onError(e)
            )
    }
    onSuggestionsLoad(v: PostListModel[]): void {
        this.zone.run(() => {
            if (this.suggestions == null) this.suggestions = [];
            this.suggestions = this.suggestions.concat(v);
        })
    }
    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

    async redirectToUrl(url: string) {
        await Browser.open({ url: url });
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
