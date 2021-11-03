import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ChangePhoneNumberPageRoutingModule } from './change-phone-number-routing.module';

import { ChangePhoneNumberPage } from './change-phone-number.page';
import { CodeInputModule } from 'angular-code-input';

import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CodeInputModule,
        ChangePhoneNumberPageRoutingModule,
        SharedDirectivesModule,
        NgxMaskModule
    ],
    declarations: [ChangePhoneNumberPage]
})
export class ChangePhoneNumberPageModule {
}
