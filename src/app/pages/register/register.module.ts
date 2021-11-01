import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';
import { CodeInputModule } from 'angular-code-input';

import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ButtonModule} from 'primeng/button';
import { ParallaxHeaderDirective } from 'src/app/directives/parallax-header.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CodeInputModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    RegisterPageRoutingModule
  ],
  declarations: [RegisterPage, ParallaxHeaderDirective]
})
export class RegisterPageModule {}
