import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { CodeInputModule } from 'angular-code-input';

import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { NgxMaskModule } from 'ngx-mask';
import {TranslateModule} from "@ngx-translate/core";
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CodeInputModule,
        LoginPageRoutingModule,
        SharedDirectivesModule,
        SharedComponentsModule,
        NgxMaskModule,
        TranslateModule
    ],
    declarations: [LoginPage]
})
export class LoginPageModule {
}
