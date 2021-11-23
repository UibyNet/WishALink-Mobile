import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CardListPageRoutingModule } from './card-list-routing.module';

import { CardListPage } from './card-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CardListPageRoutingModule
  ],
  declarations: [CardListPage]
})
export class CardListPageModule {}
