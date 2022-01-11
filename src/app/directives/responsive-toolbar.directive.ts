import { AfterContentInit, AfterViewInit, Directive, ElementRef } from '@angular/core';
import { AppService } from '../services/app.service';

@Directive({
    selector: '[responsive-toolbar]'
})
export class ResponsiveToolbarDirective implements AfterContentInit {

    constructor(
        public element: ElementRef,
        public appService: AppService
    ) {

    }

    ngAfterContentInit() {
        let toolbar: HTMLElement = this.element.nativeElement;
        if (toolbar != null && !this.appService.isMobile) {
            const viewTimer = setInterval(() => {
                let container: HTMLElement = toolbar.shadowRoot.querySelector(".toolbar-container");
                if (container) {
                    clearInterval(viewTimer);
                    (container.style as any).maxWidth = "1024px";
                    container.style.margin = "0 auto";
                }
            }, 10);
        }
    }
}