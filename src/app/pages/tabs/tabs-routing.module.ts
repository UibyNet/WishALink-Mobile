import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {TabsPage} from './tabs.page';
import {UserResolverService} from "../../services/resolve.service";

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../../pages/tabs/home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'community',
            loadChildren: () => import('./community/community.module').then( m => m.CommunityPageModule)
          }
        ]
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../../pages/tabs/settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: 'suggestion',
        children: [
          {
            path: '',
            loadChildren: () => import('./suggestion/suggestion.module').then( m => m.SuggestionPageModule)
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
          },
          {
            path: 'stranger-profile/:id',
            loadChildren: () => import('./stranger-profile/stranger-profile.module').then( m => m.StrangerProfilePageModule)
          }
        ]
      },
      {
        path: 'activity',
        children: [
          {
            path: '',
            loadChildren: () => import('./activity/activity.module').then( m => m.ActivityPageModule)
          }
        ]
      },
      {
        path: 'post-detail',
        loadChildren: () => import('./post-detail/post-detail.module').then( m => m.PostDetailPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {
}
