import {Component, OnInit} from '@angular/core';
import {ActionSheetController} from '@ionic/angular';
import {Router} from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  constructor(public actionSheetController: ActionSheetController, private router: Router) {
  }

  ngOnInit() {
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
