import { AfterViewInit, Directive, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { DomController, IonContent } from '@ionic/angular';
import { ScrollDetail } from '@ionic/core';

@Directive({
  selector: '[shrink-header]'
})
export class ShrinkHeaderDirective implements AfterViewInit {

  @Input() scrollArea: IonContent;
  shrinkable: any;
  shrinkableInitialHeight: number = 0;
  minHeaderHeight: number = 56;
  profileName: any;
  profileAvatar: any;
  profileAvatarOffset: any;
  profileAvatarOption: any;
  profileNameOffset: any;
  profileInfo: any;
  hasStartItem: boolean = false;
  profileCommunity: any;
  searchBar: any;

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    private domController: DomController
  ) { }

  async ngAfterViewInit() {
    await this.element.nativeElement.componentOnReady();

    this.shrinkable = this.element.nativeElement.getElementsByClassName('shrinkable')[0];
    this.searchBar = this.element.nativeElement.getElementsByClassName('search-bar')[0];
    this.hasStartItem = this.element.nativeElement.querySelectorAll('ion-back-button').length > 0; 

    const profile = this.element.nativeElement.getElementsByClassName('profile')[0];
    if (profile != undefined) {
      this.profileAvatar = profile.getElementsByClassName('avatar')[0];
      this.profileAvatarOption = profile.getElementsByClassName('options')[0];
      this.profileAvatarOffset = this.profileAvatar.offsetLeft;
      this.profileName = profile.getElementsByClassName('name')[0];
      this.profileNameOffset = this.profileName.offsetLeft;
      this.profileInfo = profile.getElementsByClassName('info')[0];
      this.profileCommunity = profile.getElementsByClassName('community')[0];
    }

    this.shrinkableInitialHeight = this.shrinkable.clientHeight;
    console.log(this.shrinkableInitialHeight)

    this.scrollArea.ionScroll.subscribe((e) => {
      this.onScroll(e);
    })
  }

  onScroll(e: CustomEvent<ScrollDetail>) {
    let newHeight = this.shrinkableInitialHeight - e.detail.scrollTop;
    if (newHeight < this.minHeaderHeight) {
      newHeight = this.minHeaderHeight;
    }

    const opacity = Math.max(0, 1 - e.detail.scrollTop / newHeight);
    const percent =  opacity * 100;

    this.domController.write(() => {
      this.shrinkable.style.height = newHeight + 'px';

      const startOffset = this.hasStartItem ? 60 : 0;

      if (this.profileName != null) {
        const offsetLeft = (this.profileNameOffset - startOffset) * Math.pow(1 - percent / 100, 3);
        //this.profileName.style.marginLeft = -offsetLeft + 'px';
        this.profileName.style.marginTop = (-46* (1 - percent / 100)) + 'px';
        this.profileName.style.fontSize = (1.1 + 0.4 * ( percent / 100)) + 'em';
      }

      if(this.profileInfo != null) {
        this.profileInfo.style.opacity = opacity;
        this.profileInfo.style.display = opacity > 0 ? 'block' : 'none';
      } 

      
      if(this.profileCommunity != null) {
        this.profileCommunity.style.opacity = opacity;
        this.profileCommunity.style.display = opacity > 0 ? 'flex' : 'none';
      } 

      if(this.profileAvatarOption != null) {
        this.profileAvatarOption.style.opacity = opacity * opacity;
        this.profileAvatarOption.style.display = opacity > 0 ? 'flex' : 'none';
      } 

      if (this.profileAvatar != null) {
        const offsetLeft = (this.profileAvatarOffset + 160 - startOffset) * Math.sqrt(1 - percent / 100) ;
        this.profileAvatar.style.marginLeft = -offsetLeft + 'px';
        this.profileAvatar.style.marginTop = (-9* (1 - percent / 100)) + 'px';
        this.profileAvatar.style.width =  (44 + 52 * ( percent / 100))  + 'px';
        this.profileAvatar.style.height =  (44 + 52 * (percent / 100))  + 'px';
      }

      if(this.searchBar != null) {
        let searchBarWidth = 100 - percent;
        if(searchBarWidth < 80) searchBarWidth = 80;
        this.searchBar.style.width = searchBarWidth + '%';
      } 
    });
  }

}
