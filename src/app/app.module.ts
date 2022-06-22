import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { isPlatform, IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppPipesModule } from './pipes/pipes.module';
import { TokenInterceptor } from './helpers/token.interceptor';
import { AppService } from './services/app.service';
import {
    AuthApiService,
    WISH_API_URL,
    ProfileApiService,
    SocialApiService,
    CategoryApiService,
    PostApiService,
    CampaignApiService,
    ActivityApiService, 
    NotificationApiService, 
    CommonApiService,
    ChatApiService,
    AllowedsiteApiService
} from './services/api-wishalink.service';
import { SharedComponentsModule } from './components/shared-components.module';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { KpayBackendCardApiService, KpayBackendMemberApiService, KpayBackendPaymentApiService, KPAY_BACKEND_API_URL } from './services/api-kpay-backend.service';
import { KpayCcpaymentCCPaymentApiService, KPAY_CCPAYMENT_API_URL } from './services/api-kpay-ccpayment.service';
import { KpayFixedqrPayment_RequestApiService, KPAY_FIXEDQR_API_URL } from './services/api-kpay-fixedqr.service';
import { KpayFixedqrPaymentPayment_RequestApiService, KPAY_FIXEDQRPAYMENT_API_URL } from './services/api-kpay-fixedqrpayment.service';
import { ChatService } from './services/chat.service';

const isMobile = () => {
    return isPlatform('capacitor') || isPlatform('ios') || isPlatform('android') || isPlatform('ipad') || isPlatform('mobile')
}

const maskConfig: Partial<IConfig> = {
    validation: false,
};

const ionicConig: any = {
    mode: 'ios',
    animated: isMobile(),
};
console.log(isPlatform('mobileweb'))

if(!isMobile()) {
    ionicConig.navAnimation = null;
}

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
    declarations: [
        AppComponent
    ],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(ionicConig),
        NgxMaskModule.forRoot(maskConfig),
        AppRoutingModule,
        AppPipesModule,
        SharedComponentsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [
        InAppBrowser,
        BarcodeScanner,
        AppService,
        ChatService,
        AuthApiService,
        ProfileApiService,
        SocialApiService,
        CategoryApiService,
        PostApiService,
        CampaignApiService,
        NotificationApiService,
        ActivityApiService,
        CommonApiService,
        ChatApiService,
        AllowedsiteApiService,

        KpayBackendCardApiService,
        KpayBackendMemberApiService,
        KpayBackendPaymentApiService,
        KpayFixedqrPaymentPayment_RequestApiService,
        KpayCcpaymentCCPaymentApiService,
        KpayFixedqrPayment_RequestApiService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: LOCALE_ID, useValue: 'tr-TR' },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: KPAY_BACKEND_API_URL, useValue: "https://api.kpay.com.tr/AppBackend/V1" },
        { provide: KPAY_CCPAYMENT_API_URL, useValue: "https://api.kpay.com.tr/CCPayment/V1" },
        { provide: KPAY_FIXEDQR_API_URL, useValue: "https://api.kpay.com.tr/FixedQR/V1" },
        { provide: KPAY_FIXEDQRPAYMENT_API_URL, useValue: "https://api.kpay.com.tr/FixedQRPayment/V1" },
        { provide: WISH_API_URL, useValue: "https://panel.wishalink.com" },
        //{ provide: WISH_API_URL, useValue: "https://localhost:44302" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
