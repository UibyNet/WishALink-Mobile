import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { CodeInputModule } from 'angular-code-input';

import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { NgxMaskModule } from 'ngx-mask';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CodeInputModule,
        RegisterPageRoutingModule,
        SharedDirectivesModule,
        NgxMaskModule,
        TranslateModule
    ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
