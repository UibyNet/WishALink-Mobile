import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryListModel, PostApiService, PostListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage implements OnInit {

  posts: PostListModel[];
  category: CategoryListModel;
  isStrangerCategory: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private postApiService: PostApiService,
    private navController: NavController
  ) { }
  ionViewWillEnter() {
    this.appService.toggleStatusBar('light');
    this.appService.setStatusBarBackground('light')

  }
  ngOnInit() {
    this.route.queryParams.subscribe(v => {
      const categoryId = parseInt(v.categoryId);
      this.category = this.appService.userCategories.find(x => x.id == categoryId);

      if(this.category == null) {
       this.category = this.router.getCurrentNavigation().extras.state as CategoryListModel;
       this.isStrangerCategory = true;
      }

      if (this.category != null) {
        this.loadPosts();
      }
    });
  }

  loadPosts() {
    this.postApiService.category(this.category.id)
      .subscribe(
        v => this.onPostsLoad(v),
        e => this.onError(e)
      )
  }
  onPostsLoad(v: PostListModel[]): void {
    this.zone.run(() => {
      this.posts = v;
    })
  }
  onError(e: any): void {
    this.posts = [];
    this.appService.showErrorAlert(e);
  }

  async redirectToUrl(url: string) {
    await Browser.open({ url: url });
  }

  addProduct() {
    this.router.navigate(['/add-product/' + this.category.id]);
  }

  openEditCategory() {
    this.router.navigate(["/app/home/add-category"], { queryParams: { categoryId: this.category.id } });
  }

  goBack() {
    this.navController.back();
  }
}
