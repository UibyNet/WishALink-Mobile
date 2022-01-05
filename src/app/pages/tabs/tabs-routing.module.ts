import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';
import { UserResolverService } from "../../services/resolve.service";

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('../../pages/tabs/profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'community',
            loadChildren: () => import('./community/community.module').then(m => m.CommunityPageModule)
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
            loadChildren: () => import('./suggestion/suggestion.module').then(m => m.SuggestionPageModule)
          }
        ]
      },
      {
        path: 'chat/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule)
          }
        ]
      },
      {
        path: 'search',
        children: [
          {
            path: '',
            loadChildren: () => import('./search/search.module').then(m => m.SearchPageModule)
          },
          {
            path: 'profile/:id',
            loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'profile/:id/community',
            loadChildren: () => import('./community/community.module').then(m => m.CommunityPageModule)
          },
          {
            path: 'community',
            loadChildren: () => import('./community/community.module').then(m => m.CommunityPageModule)
          }
        ]
      },
      {
        path: 'activity',
        children: [
          {
            path: '',
            loadChildren: () => import('./activity/activity.module').then(m => m.ActivityPageModule)
          }
        ]
      },
      {
        path: 'wallet',
        children: [
          {
            path: '',
            loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletPageModule)
          }
        ]
      },
      {
        path: 'post/:id',
        loadChildren: () => import('./post/post.module').then(m => m.PostPageModule)
      },
      {
        path: 'category/:id',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryPageModule)
      },
      {
        path: '',
        redirectTo: '/app/profile/me',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'campaign',
    loadChildren: () => import('./campaign/campaign.module').then( m => m.CampaignPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
