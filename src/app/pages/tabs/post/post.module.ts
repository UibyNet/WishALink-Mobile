import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostPageRoutingModule } from './post-routing.module';

import { PostPage } from './post.page';
import {TranslateModule} from "@ngx-translate/core";
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        PostPageRoutingModule,
        TranslateModule,
        SharedDirectivesModule
    ],
  declarations: [PostPage]
})
export class PostPageModule {}
