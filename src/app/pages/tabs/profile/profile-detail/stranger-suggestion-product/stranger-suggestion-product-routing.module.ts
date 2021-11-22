import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StrangerSuggestionProductPage } from './stranger-suggestion-product.page';

const routes: Routes = [
  {
    path: '',
    component: StrangerSuggestionProductPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StrangerSuggestionProductPageRoutingModule {}
