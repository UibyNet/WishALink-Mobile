import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PostApiService, PostLikeModel, PostListModel } from 'src/app/services/api-wishalink.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';

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

    constructor(
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private appService: AppService,
        private postApiService: PostApiService,
        private navController: NavController
    ) {
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('dark');
        this.appService.setStatusBarBackground('primary')

    }

    ngOnInit() {
        this.postId = parseInt(this.route.snapshot.params.id);
        const post = this.router.getCurrentNavigation().extras.state as PostListModel;

        if (post == null) {
            this.loadPost();
        }
        else {
            this.onPostLoad(post);
        }
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
            this.isStrangerPost = v.createdBy?.id != this.appService.user.id;
        })
    }

    onError(e: any): void {
        this.appService.showErrorAlert(e);
    }

    async redirectToUrl(url: string) {
        await Browser.open({ url: url });
    }

    close() {
        this.navController.back();
    }

    openEditProduct() {
        console.log(this.post)
        this.router.navigate(['add-product', this.post.category.id, this.post.id], { state: this.post })
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
}
