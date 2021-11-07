import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PostListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';
import {StatusBar, Style} from "@capacitor/status-bar";

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  post: PostListModel;
  isStrangerPost: boolean = false;

  constructor(
    private zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private navController: NavController
  ) { }
  ionViewWillEnter() {
    StatusBar.setStyle({style: Style.Dark})

  }
  ngOnInit() {
    this.post = this.router.getCurrentNavigation().extras.state as PostListModel;

    this.route.queryParams.subscribe(v => {
      this.isStrangerPost = v.isStrangerPost === true || v.isStrangerPost === 'true';
    })

  }

  async redirectToUrl(url: string) {
    await Browser.open({ url: url });
  }

  close() {
    this.navController.back();
  }

}
