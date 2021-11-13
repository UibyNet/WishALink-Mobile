import {Component, NgZone, OnInit} from '@angular/core';
import {PostApiService, PostListModel, SocialUserListModel} from 'src/app/services/api.service';
import {AppService} from "../../../services/app.service";
import {Browser} from '@capacitor/browser';
import {ModalController} from '@ionic/angular';
import {NotificationComponent} from 'src/app/components/notification/notification.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-suggestion',
    templateUrl: './suggestion.page.html',
    styleUrls: ['./suggestion.page.scss'],
})
export class SuggestionPage implements OnInit {

    userData: SocialUserListModel
    suggestions: PostListModel[];

    constructor(
        public appService: AppService,
        private zone: NgZone,
        private router: Router,
        private postApiService: PostApiService,
        private modalController: ModalController
    ) {
    }

    ngOnInit() {
        this.userData = this.appService.userInfo;

        this.loadSuggestions(null)
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');

    }

    loadSuggestions(event) {
        this.postApiService.suggestions()
            .subscribe(
                v => {
                    if (event) event.target.complete();
                    this.onSuggestionsLoad(v);
                },
                e => {
                    if (event) event.target.complete();
                    this.onError(e);
                }
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
        await Browser.open({url: url});
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

    openPostDetail(event: any, postId: number) {
        console.log(event.target.classList)
        const post = this.suggestions.find(x => x.id == postId);
        if (post != null) {
            if (event.target.tagName == 'IMG') {
                console.log(post)
                this.redirectToUrl(post.url)
            } else {
                this.router.navigate(['/tabs/post-detail'], {state: post, queryParams: {isStrangerPost: true}});
            }
        }

        event.preventDefault();
        return false
    }
}
