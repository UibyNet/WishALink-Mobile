import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryApiService, CategoryListModel, PostApiService, PostListModel } from 'src/app/services/api-wishalink.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';

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

  constructor(
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private categoryApiService: CategoryApiService,
    private postApiService: PostApiService,
    private navController: NavController
  ) { }
  ionViewWillEnter() {
    this.appService.toggleStatusBar('light');
    this.appService.setStatusBarBackground('light')

  }
  ngOnInit() {
    this.categoryId = parseInt(this.route.snapshot.params.id);
    const category = this.router.getCurrentNavigation().extras.state as CategoryListModel;
    if (category == null) {
      this.loadCategory();
    }
    else {
      this.onCategoryLoad(category);
    }

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
    this.postApiService.category(this.categoryId)
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
