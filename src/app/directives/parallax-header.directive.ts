import { AfterViewInit, Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
@Directive({
  selector: '[parallax-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)',
    '(window:resize)': 'onWindowResize($event)'
  }
})
export class ParallaxHeaderDirective implements AfterViewInit {
  header: any;
  headerHeight: any;
  translateAmt: any;
  scaleAmt: any;
  title: any;
  headerTitleContent: any;
  headerTitle: any;
  headerSubTitle: any;
  constructor(public element: ElementRef, public renderer: Renderer2, private domCtrl: DomController) {
    console.log('aasd2')
  }

  ngAfterViewInit() {
    this.title = this.element.nativeElement.parentNode.getElementsByTagName('ion-title')[0];
    console.log(this.title)
    let content = this.element.nativeElement.getElementsByClassName('page-container')[0];
    this.header = content.getElementsByClassName('lead')[0];
    this.headerTitle = this.header.getElementsByTagName('h2')[0];
    this.headerSubTitle = this.header.getElementsByTagName('h3')[0];
    this.headerTitleContent = this.headerTitle.innerHTML;
    let mainContent = content.getElementsByClassName('bottom-container')[0];
    this.headerHeight = this.header.clientHeight;
    this.renderer.setStyle(this.header, 'webkitTransformOrigin', 'center bottom');
    this.renderer.setStyle(this.header, 'background-size', 'cover');
  }
  onWindowResize(ev) {
    this.headerHeight = this.header.clientHeight;
  }
  onContentScroll(ev) {
    console.log(ev)

    this.domCtrl.write(() => {
      this.updateParallaxHeader(ev);
    });
  }
  updateParallaxHeader(ev) {
    if (ev.detail.scrollTop > 0) {
      this.translateAmt = ev.detail.scrollTop / 2;
      this.scaleAmt = 1;
      if (ev.detail.scrollTop > 40) {
        this.title.innerText = this.headerTitleContent;
        this.headerTitle.innerHTML = '&nbsp;';
      }
      else {
        this.title.innerText = '';
        this.headerTitle.innerHTML = this.headerTitleContent;
      }
      if(this.headerSubTitle) this.renderer.setStyle(this.headerSubTitle, 'opacity', 50 / ev.detail.scrollTop - 0.5);
    } else {
      this.translateAmt = 0;
      this.scaleAmt = -ev.detail.scrollTop / this.headerHeight + 1;
      this.title.innerText = '';
      this.headerTitle.innerHTML = this.headerTitleContent;
      if(this.headerSubTitle) this.renderer.setStyle(this.headerSubTitle, 'opacity', 1);
    }
  }
}