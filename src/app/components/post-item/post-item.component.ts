import { Component, Input, NgZone, OnInit } from '@angular/core';
import { PostApiService, PostLikeModel, PostListModel } from 'src/app/services/api-wishalink.service';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import * as moment from 'moment';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {

  @Input() item: PostListModel;
  @Input() index: number = 0;

  isLoading: boolean = false;
  postDate: string;

  constructor(
    private zone: NgZone,
    private router: Router,
    private appService: AppService,
    private postApiService: PostApiService
  ) { }

  ngOnInit() {
    if(this.item != null && moment(this.item.createdOn, 'DD.MM.YYYY HH:mm:ss').isValid()) {
      this.postDate = moment(this.item.createdOn, 'DD.MM.YYYY HH:mm:ss').fromNow();
    }
  }

  openPostDetail(event: any, redirect: boolean = false) {
    if (redirect === true) {
      this.redirectToUrl(this.item.url)
      event.stopPropagation();
    } else {
      this.router.navigate(['app', 'post', this.item.id], { state: this.item });
    }

    return false
  }

  openCreator(event: any) {
    this.router.navigate(['app', 'profile', this.item.createdBy.id]);

    event.stopPropagation();
    return false;
  }

  togglePostLike(event) {
    this.isLoading = true;

    this.postApiService.like(this.item.id)
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
      this.item.isUserLike = v.isUserLike;
      this.item.likeCount = v.likeCount;
    })
  }

  onError(e: any): void {
    this.appService.showErrorAlert(e);
  }

  async redirectToUrl(url: string) {
    await Browser.open({ url: url });
  }
}
