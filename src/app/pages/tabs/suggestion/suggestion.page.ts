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
        this.appService.setStatusBarBackground('light')

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
            console.log(v)
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

    openPostDetail(event: any, postId: number, redirect: boolean = false) {
        console.log(postId)
        const post = this.suggestions.find(x => x.id == postId);
        if (post != null) {
            if (redirect === true) {
                this.redirectToUrl(post.url)
                event.stopPropagation();
            } else {
                this.router.navigate(['/app/post-detail'], {state: post, queryParams: {isStrangerPost: true}});
            }
        }

        return false
    }

    openCreator(event: any, postId: number) {
        const post = this.suggestions.find(x => x.id == postId);
        this.router.navigate(['app', 'post-detail', post.createdBy.id ]);

        event.stopPropagation();
        return false;
    }
}
