import { Component, NgZone, OnInit } from '@angular/core';
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
    private zone: NgZone,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  openPage(page: string) {
    this.zone.run(()=>{
      this.navController.navigateRoot(page);
    });
  }

}
