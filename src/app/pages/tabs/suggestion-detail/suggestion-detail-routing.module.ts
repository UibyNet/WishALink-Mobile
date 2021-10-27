import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuggestionDetailPage } from './suggestion-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SuggestionDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuggestionDetailPageRoutingModule {}
