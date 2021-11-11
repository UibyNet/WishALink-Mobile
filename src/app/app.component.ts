import { Component, OnInit } from '@angular/core';
import { ActionPerformed, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import * as moment from 'moment';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    moment.locale("tr");

    if(!this.platform.is('mobileweb')) {
      PushNotifications.requestPermissions().then(result => {
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
          this.appService.getNotifications().then(v => console.log(v) );
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
