import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CountrySelectorComponent} from './country-selector/country-selector.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NotificationComponent} from "./notification/notification.component";
import {FooterComponent} from './web/footer/footer.component';
import {NavbarComponent} from './web/navbar/navbar.component';
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {AppPipesModule} from "../pipes/pipes.module";
import { PostItemComponent } from './post-item/post-item.component';

@NgModule({
    declarations: [
        CountrySelectorComponent,
        NotificationComponent,
        NavbarComponent,
        FooterComponent,
        PrivacyPolicyComponent,
        PostItemComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        IonicModule,
        RouterModule,
        ScrollingModule,
        AppPipesModule
    ],
    exports: [
        CountrySelectorComponent,
        NotificationComponent,
        NavbarComponent,
        FooterComponent,
        PrivacyPolicyComponent,
        PostItemComponent
    ]
})
export class SharedComponentsModule {
}
