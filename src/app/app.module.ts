import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

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
    ActivityApiService, NotificationApiService, CommonApiService
} from './services/api-wishalink.service';
import { SharedComponentsModule } from './components/shared-components.module';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { KpayBackendCardApiService, KpayBackendMemberApiService, KpayBackendPaymentApiService, KPAY_BACKEND_API_URL } from './services/api-kpay-backend.service';
import { KpayCcpaymentCCPaymentApiService, KPAY_CCPAYMENT_API_URL } from './services/api-kpay-ccpayment.service';
import { KpayFixedqrPayment_RequestApiService, KPAY_FIXEDQR_API_URL } from './services/api-kpay-fixedqr.service';
import { KpayFixedqrPaymentPayment_RequestApiService, KPAY_FIXEDQRPAYMENT_API_URL } from './services/api-kpay-fixedqrpayment.service';
import { CardModule } from 'ngx-card';

const maskConfig: Partial<IConfig> = {
    validation: false,
};

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
        IonicModule.forRoot({
            mode: 'ios'
        }),
        NgxMaskModule.forRoot(maskConfig),
        AppRoutingModule,
        AppPipesModule,
        SharedComponentsModule,
        CardModule,
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
        AuthApiService,
        ProfileApiService,
        SocialApiService,
        CategoryApiService,
        PostApiService,
        CampaignApiService,
        NotificationApiService,
        ActivityApiService,
        CommonApiService,

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
        //{ provide: WISH_API_URL, useValue: "https://localhost:44301" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
