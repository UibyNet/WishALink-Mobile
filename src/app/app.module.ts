import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppPipesModule } from './pipes/pipes.module';
import {AuthApiService, API_BASE_URL, ProfileApiService, SocialApiService} from './services/api.service';
import { TokenInterceptor } from './helpers/token.interceptor';
import { AppService } from './services/app.service';
import { ImagePicker } from '@ionic-native/image-picker/ngx';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonIntlTelInputModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AppPipesModule
  ],
  providers: [
    AppService,
    AuthApiService,
    ProfileApiService,
    SocialApiService,
    ImagePicker,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: API_BASE_URL, useValue: "https://panel.wishalink.com" },
    // { provide: API_BASE_URL, useValue: "https://localhost:44301" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
