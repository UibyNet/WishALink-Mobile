import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
    CategoryApiService,
    CategoryListModel,
    PostApiService,
    PostListModel
} from 'src/app/services/api-wishalink.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { Share } from '@capacitor/share';

@Component({
    selector: 'app-category',
    templateUrl: './category.page.html',
    styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

    posts: PostListModel[] = []
    category: CategoryListModel;
    isStrangerCategory: boolean = false;
    categoryId: number;
    data: PostListModel
    isLoading: boolean;

    constructor(
        public appService: AppService,
        private zone: NgZone,
        private router: Router,
        private route: ActivatedRoute,
        private categoryApiService: CategoryApiService,
        private postApiService: PostApiService,
        private navController: NavController
    ) {
        this.route.queryParams.subscribe(params => {
            if (this.router.getCurrentNavigation().extras.state) {
                if (this.router.getCurrentNavigation().extras.state.newPost != undefined) {
                    this.data = this.router.getCurrentNavigation().extras.state.newPost;
                    this.data.mediaUrl = 'https://panel.wishalink.com/uploads/' + this.data.mediaUrl
                    this.posts.push(this.data)
                }
            }
        });
    }

    ionViewWillEnter() {
        this.appService.toggleStatusBar('light');
        this.appService.setStatusBarBackground('light');

        if (this.categoryId > 0) {
            this.loadData();
        }
    }

    ionViewDidEnter() {
        console.log('enter');
    }

    ngOnInit() {
        this.categoryId = parseInt(this.route.snapshot.params.id);
        const category = this.router.getCurrentNavigation().extras.state as CategoryListModel;
        
        if (category != null) {
            this.onCategoryLoad(category);
        }

        this.router.events.subscribe((e) => {
            if (e instanceof NavigationEnd) {
                this.loadData();
            }
        })
    }

    loadData() {
        this.loadCategory();
        this.loadPosts();
    }

    loadCategory() {
        this.categoryApiService.item(this.categoryId)
            .subscribe(
                v => this.onCategoryLoad(v),
                e => this.onError(e)
            )
    }

    onCategoryLoad(v: CategoryListModel): void {
        this.zone.run(() => {
            this.category = v;
            this.isStrangerCategory = v.createdBy?.id != this.appService.user.id;
        })
    }

    loadPosts() {
        this.isLoading = this.posts == undefined || this.posts.length == 0;
        this.postApiService.category(this.categoryId)
            .subscribe(
                v => this.onPostsLoad(v),
                e => this.onError(e)
            )
    }

    onPostsLoad(v: PostListModel[]): void {
        this.zone.run(() => {
            this.posts = v;
            this.isLoading = false;
        })
    }

    onError(e: any): void {
        this.posts = [];
        this.isLoading = false;
        this.appService.showErrorAlert(e);
    }

    async redirectToUrl(url: string) {
        await Browser.open({ url: url });
    }

    addProduct() {
        this.router.navigate(['add-product', this.category.id, 0]);
    }

    openEditCategory() {
        this.router.navigate(['add-category', this.category.id], { state: this.category });
    }

    goBack() {
        this.navController.back();
    }

    async shareCategory() {
        await Share.share({
            title: this.category.name,
            text: '',
            url: this.appService.getShareLink(window.location.href),
        });
    }
}
