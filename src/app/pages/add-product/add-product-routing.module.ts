import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProductPage } from './add-product.page';

const routes: Routes = [
  {
    path: '',
    component: AddProductPage
  },
  {
    path: 'choose-category',
    loadChildren: () => import('./choose-category/choose-category.module').then( m => m.ChooseCategoryPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProductPageRoutingModule {}
