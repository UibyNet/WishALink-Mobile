import { Component, Input, OnInit } from '@angular/core';
import { PostListModel } from 'src/app/services/api-wishalink.service';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss'],
})
export class PostItemComponent implements OnInit {

  @Input() item: PostListModel;
  @Input() index: number = 0;

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

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

  async redirectToUrl(url: string) {
    await Browser.open({ url: url });
  }
}
