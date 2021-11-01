import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CountrySelectorComponent} from './country-selector/country-selector.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {NotificationComponent} from "./notification/notification.component";

@NgModule({
    declarations: [
        CountrySelectorComponent,
        NotificationComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        IonicModule,
        RouterModule,
        ScrollingModule
    ],
    exports: [
        CountrySelectorComponent,
        NotificationComponent
    ]
})
export class SharedComponentsModule {
}
