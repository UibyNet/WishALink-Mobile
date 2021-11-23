import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { HistoryDetailPageRoutingModule } from "./history-detail-routing.module";

import { HistoryDetailPage } from "./history-detail.page";
import { AppPipesModule } from "src/app/pipes/pipes.module";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		HistoryDetailPageRoutingModule,
		AppPipesModule,
	],
	declarations: [HistoryDetailPage],
})
export class HistoryDetailPageModule {}
