import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { KpaygoPageRoutingModule } from "./kpaygo-routing.module";
import { KpaygoPage } from './kpaygo.page';
import { CardEditPageModule } from "../../tabs/wallet/card-edit/card-edit.module";

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    KpaygoPageRoutingModule,
    CardEditPageModule
  ],
  entryComponents: [],
  declarations: [KpaygoPage]
})
export class KpaygoPageModule {}
