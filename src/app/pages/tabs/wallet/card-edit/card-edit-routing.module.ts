import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardEditPage } from './card-edit.page';

const routes: Routes = [
  {
    path: '',
    component: CardEditPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardEditPageRoutingModule {}
