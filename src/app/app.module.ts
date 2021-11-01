import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouteReuseStrategy} from '@angular/router';

import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {File} from '@ionic-native/file/ngx';

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
    ActivityApiService, NotificationApiService
} from './services/api.service';
import {SharedComponentsModule} from './components/shared-components.module';


@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        IonicModule.forRoot(),
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
        ImagePicker,
        Crop,
        File,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {provide: API_BASE_URL, useValue: "https://panel.wishalink.com"},
        // { provide: API_BASE_URL, useValue: "https://localhost:44301" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
