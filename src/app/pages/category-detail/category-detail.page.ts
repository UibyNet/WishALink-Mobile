import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryListModel, PostApiService, PostListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage implements OnInit {

  posts: PostListModel[];
  category: CategoryListModel;

  constructor(
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private postApiService: PostApiService
  ) { }

  ngOnInit() {
    this.category = this.router.getCurrentNavigation().extras.state as CategoryListModel;
    if(this.category != null) {
      this.loadPosts();
    }
  }

  loadPosts() {
    this.postApiService.category(this.category.id)
      .subscribe(
        v => this.onPostsLoad(v),
        e => this.onError(e)
      )
  }
  onPostsLoad(v: PostListModel[]): void {
    this.zone.run(()=>{
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
    this.router.navigate(['/add-product', this.category.id])
  }

}
