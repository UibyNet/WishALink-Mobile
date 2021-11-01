import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostApiService, PostListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-category-detail',
  templateUrl: './category-detail.page.html',
  styleUrls: ['./category-detail.page.scss'],
})
export class CategoryDetailPage implements OnInit {
  categoryId: number;
  posts: PostListModel[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private postApiService: PostApiService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = parseInt(id)
    this.loadPosts();
  }

  loadPosts() {
    this.postApiService.category(this.categoryId)
      .subscribe(
        v => this.onPostsLoad(v),
        e => this.onError(e)
      )
  }
  onPostsLoad(v: PostListModel[]): void {
    this.posts = v;
  }
  onError(e: any): void {
    this.appService.showErrorAlert(e);
  }

  async redirectToUrl(url: string) {
    await Browser.open({ url: url });
  }

  addProduct() {
    this.router.navigate(['/add-product', this.categoryId])
  }

}
