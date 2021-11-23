import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CardModule } from "ngx-card";

import { CardEditPageRoutingModule } from "./card-edit-routing.module";

import { CardEditPage } from "./card-edit.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CardModule,
    CardEditPageRoutingModule
  ],
  declarations: [CardEditPage]
})
export class CardEditPageModule { }
