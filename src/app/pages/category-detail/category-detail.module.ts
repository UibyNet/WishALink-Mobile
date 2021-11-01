import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategoryDetailPageRoutingModule } from './category-detail-routing.module';

import { CategoryDetailPage } from './category-detail.page';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategoryDetailPageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [CategoryDetailPage]
})
export class CategoryDetailPageModule {}
