import {Component, OnInit} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {Router} from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  isLoggedIn: boolean = true;

  constructor(
    private appService: AppService,
    private router: Router,
    public actionSheetController: ActionSheetController, 
  ) { }

  ionViewWillEnter() {
    this.hideSplashScreen();
    
    if(this.appService.isLoggedIn) {
      this.router.navigate(['tabs']);
    }
  }
  
  async hideSplashScreen() {
    await SplashScreen.hide();
  }

  ngOnInit() {
    this.isLoggedIn = this.appService.isLoggedIn;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: '',
      mode: 'md',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Giriş Yap',
          cssClass: 'login',
          handler: () => {
            this.router.navigate(['login']);
          }
        },
        {
          text: 'Üye Ol',
          cssClass: 'register',
          handler: () => {
            this.router.navigate(['register']);
          }
        },
      ]
    });
    await actionSheet.present();

    const {role} = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
