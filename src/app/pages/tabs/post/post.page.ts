import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {PostApiService, PostLikeModel, PostListModel} from 'src/app/services/api-wishalink.service';
import {AppService} from 'src/app/services/app.service';
import {Browser} from '@capacitor/browser';
import {Share} from '@capacitor/share';

@Component({
    selector: 'app-post',
    templateUrl: './post.page.html',
    styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
    post: PostListModel;
    isStrangerPost: boolean = false;
    postId: number;
    isLoading: boolean = false;
    disabled: boolean = false
    canPurchase: boolean;
    currentUserId: number;
    isSaleable: boolean;

    constructor(
        public appService: AppService,
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private postApiService: PostApiService,
        private navController: NavController
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');
        this.appService.setStatusBarBackground('primary')

    }

    ngOnInit() {
        this.currentUserId = this.appService.user.id;
        this.postId = parseInt(this.route.snapshot.params.id);
        const post = this.router.getCurrentNavigation().extras.state as PostListModel;
        
        if(post != null) {
            this.onPostLoad(post);
        }

        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.loadPost();
            }
        })
    }

    markAsPurchased() {
        this.postApiService.markaspurchased(this.postId).subscribe(
            v => this.onCheckPurchased(v),
            e => this.onErrorPurchased(e)
        )
    }

    markAsSaleable() {

        console.log(this.post.isSaleable, this.isSaleable)
        if(this.post.isSaleable == this.isSaleable) return;

        this.postApiService.markassaleable(this.postId).subscribe(
            v => this.onCheckSaleable(v),
            e => this.onErrorPurchased(e)
        )
    }

    loadPost() {
        this.postApiService.item(this.postId)
            .subscribe(
                v => this.onPostLoad(v),
                e => this.onError(e)
            )
    }

    onPostLoad(v: PostListModel) {
        this.zone.run(() => {
            this.post = v;
            this.isSaleable = v.isSaleable;
            this.isStrangerPost = v.createdBy?.id != this.currentUserId;
            this.canPurchase = !v.isPurchased || (v.isPurchased && v.purchasedBy.id == this.currentUserId);
        })
    }

    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

    async redirectToUrl(url: string) {
        await Browser.open({url: url});
    }

    close() {
        this.navController.back();
    }

    openEditProduct() {
        console.log(this.post)
        this.router.navigate(['add-product', this.post.category.id, this.post.id], {state: this.post})
    }


    togglePostLike(event) {
        this.isLoading = true;

        this.postApiService.like(this.post.id)
            .subscribe(
                v => this.onPostLike(v),
                e => this.onError(e)
            )

        event.stopPropagation();
        return false;
    }

    onPostLike(v: PostLikeModel): void {
        this.zone.run(() => {
            this.isLoading = false;
            this.post.isUserLike = v.isUserLike;
            this.post.likeCount = v.likeCount;
        })
    }

    async sharePost() {
        await Share.share({
            title: this.post.name,
            text: this.post.description,
            url: this.appService.getShareLink(window.location.href),
        });
    }

    onErrorPurchased(e: any) {
        this.zone.run(() => {
            this.appService.showErrorAlert(e);
        })
    }

    onCheckPurchased(v: PostListModel) {
        this.zone.run(() => {
            this.post.isPurchased = v.isPurchased;
        })
    }

    onCheckSaleable(v: PostListModel) {
        this.zone.run(() => {
            this.post.isSaleable = v.isSaleable;
        })
    }
}
