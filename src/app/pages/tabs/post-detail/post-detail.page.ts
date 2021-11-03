import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PostListModel } from 'src/app/services/api.service';
import { AppService } from 'src/app/services/app.service';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
})
export class PostDetailPage implements OnInit {
  post: PostListModel;

  constructor(
    private zone: NgZone,
    private router: Router,
    private appService: AppService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.post = this.router.getCurrentNavigation().extras.state as PostListModel;
  }
  
  async redirectToUrl(url: string) {
    await Browser.open({ url: url });
  }

  close() {
    this.navController.back();
  }

}
