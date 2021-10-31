import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';
import {LoginPageRoutingModule} from './login-routing.module';

import {LoginPage} from './login.page';
import {CodeInputModule} from 'angular-code-input';

import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ButtonModule} from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        CodeInputModule,
        InputTextModule,
        InputMaskModule,
        ButtonModule,
        LoginPageRoutingModule
    ],
    declarations: [LoginPage]
})
export class LoginPageModule {
}
