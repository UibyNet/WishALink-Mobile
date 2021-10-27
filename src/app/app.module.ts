import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppPipesModule } from './pipes/pipes.module';
import { ApiService, API_BASE_URL } from './services/api.service';
import { TokenInterceptor } from './helpers/token.interceptor';
import { AppService } from './services/app.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonIntlTelInputModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AppPipesModule,
    AppService,
    ApiService,
  ],

  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: API_BASE_URL, useValue: "https://panel.wishalink.com" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
