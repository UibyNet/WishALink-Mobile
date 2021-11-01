import { AfterViewInit, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
@Directive({
  selector: '[parallax-page]',
  host: {
    '(ionScroll)': 'onContentScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class ParallaxPageDirective implements AfterViewInit {
  translateAmt: any;
  scaleAmt: any;
  profileContainer: any;
  profileContainerHeight: any;

  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) {
    console.log('aasd2')
  }

  ngAfterViewInit() {
    this.profileContainer = this.element.nativeElement.getElementsByClassName('profile-header')[0];
    this.profileContainerHeight = this.profileContainer.clientHeight;
    this.renderer.setStyle(this.profileContainer, 'webkitTransformOrigin', 'center bottom');
    this.renderer.setStyle(this.profileContainer, 'background-size', 'cover');
  }
  onWindowResize(ev) {
    this.profileContainerHeight = this.profileContainer.clientHeight;
  }
  onContentScroll(ev) {
    this.domCtrl.write(() => {
      this.updateParallaxPage(ev);
    });
  }
  updateParallaxPage(ev) {
    if (ev.detail.scrollTop > 0) {
      this.translateAmt = ev.detail.scrollTop / 2;
      this.scaleAmt = 1;

      if (ev.detail.scrollTop > 50) {
        this.profileContainer.classList.remove('scrollable')
        this.profileContainer.classList.add('fixed')
      }
      else {
        this.profileContainer.classList.add('scrollable')
        this.profileContainer.classList.remove('fixed')
      }
    } else {
      this.translateAmt = 0;
      this.scaleAmt = -ev.detail.scrollTop / this.profileContainerHeight + 1;
      this.profileContainer.classList.add('scrollable')
      this.profileContainer.classList.remove('fixed')
    }
  }
}