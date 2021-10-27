import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(
    private navController: NavController,
    private appService: AppService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.appService.logout();
    this.navController.navigateRoot('/login');
  }
}
