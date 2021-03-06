import { Component, OnInit } from "@angular/core";
import { ModalController, NavController } from "@ionic/angular";
import { AppService } from "src/app/services/app.service";
import { PrivacyPolicyComponent } from "src/app/components/privacy-policy/privacy-policy.component";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  currentYear: number = new Date().getFullYear();

  constructor(
    private appService: AppService,
    public navController: NavController,
    public modalController: ModalController
  ) {}

  ngOnInit() {}
  public st() {
    this.navController.navigateRoot("/contact-us");
  }

  async privacyModal() {
    const modal = await this.modalController.create({
      component: PrivacyPolicyComponent,
      cssClass: "my-custom-class",
    });

    return await modal.present();
  }

  openSocial(site: string) {
    let link = '';
    if(site == 'facebook') {
      link = 'https://www.facebook.com/profile.php?id=100077784110802'; 
    }
    else if(site == 'instagram') {
      link = 'https://www.instagram.com/wishalink/'; 
    }

    window.open(link, '_blank');
  }
}
