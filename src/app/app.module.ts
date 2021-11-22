import {NgModule, LOCALE_ID} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
// import { IonIntlTelInputModule } from 'ion-intl-tel-input';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppPipesModule} from './pipes/pipes.module';
import {TokenInterceptor} from './helpers/token.interceptor';
import {AppService} from './services/app.service';
import {
    AuthApiService,
    API_BASE_URL,
    ProfileApiService,
    SocialApiService,
    CategoryApiService,
    PostApiService,
    ActivityApiService, NotificationApiService, CommonApiService
} from './services/api.service';
import {SharedComponentsModule} from './components/shared-components.module';
import {NgxMaskModule, IConfig} from 'ngx-mask'

const maskConfig: Partial<IConfig> = {
    validation: false,
};


@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot({
            mode: 'ios'
        }),
        NgxMaskModule.forRoot(maskConfig),
        AppRoutingModule,
        AppPipesModule,
        SharedComponentsModule,

    ],
    providers: [
        AppService,
        AuthApiService,
        ProfileApiService,
        SocialApiService,
        CategoryApiService,
        PostApiService,
        NotificationApiService,
        ActivityApiService,
        CommonApiService,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: LOCALE_ID, useValue: 'tr-TR'},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {provide: API_BASE_URL, useValue: "https://panel.wishalink.com"},
        //{ provide: API_BASE_URL, useValue: "http://192.168.0.102:5000" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
