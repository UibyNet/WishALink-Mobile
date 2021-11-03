import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  isKeyboardOpen: boolean = true;

  constructor(
    public router: Router,
    private zone: NgZone,
    private platform: Platform,
    private navController: NavController
  ) { }

  ngOnInit() {
    if(!this.platform.is('mobileweb')) {
      Keyboard.addListener('keyboardWillShow', info => {
        this.zone.run(()=>{
          this.isKeyboardOpen = true;
        })
      });
      Keyboard.addListener('keyboardDidHide', () => {
        this.zone.run(()=>{
          this.isKeyboardOpen = false;
        })
      });
    }
  }

  openPage(page: string) {
    this.zone.run(()=>{
      this.navController.navigateRoot(page);
    });
  }

}
