import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ForgotPageRoutingModule } from './forgot-routing.module';

import { ForgotPage } from './forgot.page';
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
        ForgotPageRoutingModule,
        SharedDirectivesModule,
        NgxMaskModule
    ],
    declarations: [ForgotPage]
})
export class ForgotPageModule {
}
