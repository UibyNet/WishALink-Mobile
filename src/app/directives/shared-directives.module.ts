import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ParallaxPageDirective } from './parallax-page.directive';
import { ParallaxHeaderDirective } from './parallax-header.directive';
import { ShrinkHeaderDirective } from './shrink-header.directive';

@NgModule({
  declarations: [
    ParallaxPageDirective,
    ParallaxHeaderDirective,
    ShrinkHeaderDirective,
  ],
  imports: [
    FormsModule,
    CommonModule,
    IonicModule,
    RouterModule,
    ScrollingModule
  ],
  exports: [
    ParallaxPageDirective,
    ParallaxHeaderDirective,
    ShrinkHeaderDirective
  ]
})
export class SharedDirectivesModule { }
