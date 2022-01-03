import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryPage } from './category.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { CategoryPageRoutingModule } from './category-routing.module';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CategoryPageRoutingModule,
        SharedDirectivesModule,
        SharedComponentsModule,
        TranslateModule
    ],
  declarations: [CategoryPage]
})
export class CategoryPageModule {}
