import { Component, OnInit } from '@angular/core';
import { ActionPerformed, PushNotifications, PushNotificationSchema, Token } from '@capacitor/push-notifications';
import { Config, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@capacitor/splash-screen';

import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public appService: AppService,
    private config: Config,
    private platform: Platform,
    public translate: TranslateService
  ) {
    translate.addLangs(['tr', 'en']);
    translate.setDefaultLang('tr');
    this.translate.use(this.appService.currentLanguage);
  }

  ngOnInit(): void {

    setTimeout(async () => {
      await SplashScreen.hide();
    }, 100);

    if (!this.appService.isMobile) {
      //this.config.set('navAnimation', null);
      //this.config.set('animated', false);
    }
    console.log('*****', this.platform.platforms(), this.platform.is('capacitor'))

    if (this.platform.is('capacitor')) {
      try {
        window.screen.orientation.lock('portrait');
      } catch (error) {
        console.log(error);

      }
      PushNotifications.requestPermissions().then(result => {
        console.log('***** Izin verildi', result.receive)
        if (result.receive === 'granted') {
          PushNotifications.register();
        } else {
          // Show some error
        }
      });

      PushNotifications.addListener('registration', (token: Token) => {
        this.appService.fcmToken = token.value;
        console.log('Push registration success, token: ' + token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      });

      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          console.log('Push received: ' + JSON.stringify(notification));
          this.appService.getNotifications().then(v => console.log(v));
        },
      );

      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          console.log('Push action performed: ' + JSON.stringify(notification));
        },
      );
    }
  }
}
