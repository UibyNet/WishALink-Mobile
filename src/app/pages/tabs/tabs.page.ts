import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  constructor(
    public router: Router,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  openPage(page: string) {
    this.navController.navigateRoot(page);
  }

}
