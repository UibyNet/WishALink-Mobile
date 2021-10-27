import { SanitizeHtmlPipe } from "./santisize.html";
import { NgModule } from "@angular/core";

@NgModule({
	imports: [
		// dep modules
	],
	declarations: [SanitizeHtmlPipe],
	exports: [SanitizeHtmlPipe],
})
export class AppPipesModule {}
