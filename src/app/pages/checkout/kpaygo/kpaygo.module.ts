import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { KpaygoPageRoutingModule } from "./kpaygo-routing.module";
import { KpaygoPage } from './kpaygo.page';

@NgModule({
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    KpaygoPageRoutingModule,
  ],
  entryComponents: [],
  declarations: [KpaygoPage]
})
export class KpaygoPageModule {}
