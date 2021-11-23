import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CardModule } from "ngx-card";

import { CreditcardPageRoutingModule } from "./creditcard-routing.module";

import { CreditcardPage } from "./creditcard.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CardModule,
    CreditcardPageRoutingModule
  ],
  declarations: [CreditcardPage]
})
export class CreditcardPageModule {}
