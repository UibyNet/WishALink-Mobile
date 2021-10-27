import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChooseCategoryPage } from './choose-category.page';

const routes: Routes = [
  {
    path: '',
    component: ChooseCategoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChooseCategoryPageRoutingModule {}
