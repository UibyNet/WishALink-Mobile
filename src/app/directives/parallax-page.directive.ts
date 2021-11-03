import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';
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
  contentContainer: any;
  isFixed: boolean = false;

  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) {
  }

  ngAfterViewInit() {
    this.profileContainer = this.element.nativeElement.getElementsByClassName('profile-header')[0];
    this.contentContainer = this.element.nativeElement.getElementsByClassName('content ')[0];
    this.profileContainerHeight = this.profileContainer.clientHeight;
    this.renderer.setStyle(this.profileContainer, 'webkitTransformOrigin', 'center bottom');
    this.renderer.setStyle(this.profileContainer, 'background-size', 'cover');
    this.checkHeight();
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
        this.isFixed = true;
        this.profileContainer.classList.remove('scrollable')
        this.profileContainer.classList.add('fixed')
      }
      else {
        this.isFixed = false;
        this.profileContainer.classList.add('scrollable')
        this.profileContainer.classList.remove('fixed')
      }
    } else {
      this.isFixed = false;
      this.translateAmt = 0;
      this.scaleAmt = -ev.detail.scrollTop / this.profileContainerHeight + 1;
      this.profileContainer.classList.add('scrollable')
      this.profileContainer.classList.remove('fixed')
    }
    
    this.checkHeight();
  }
  
  checkHeight() {
    if(this.contentContainer == null) return;

    if(this.isFixed) {
      var height = this.profileContainer.offsetHeight + 64;
      this.contentContainer.style.paddingTop = height + 'px';
      this.contentContainer.style.paddingBottom = height + 'px';
    }
    else {
      this.contentContainer.style.paddingTop = '0';
      this.contentContainer.style.paddingBottom = '0';
    }
  }
}