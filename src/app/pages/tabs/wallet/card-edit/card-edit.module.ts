import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CardModule } from "ngx-card";

import { CardEditPageRoutingModule } from "./card-edit-routing.module";

import { CardEditPage } from "./card-edit.page";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        CardModule,
        CardEditPageRoutingModule,
        TranslateModule
    ],
  declarations: [CardEditPage]
})
export class CardEditPageModule {}
