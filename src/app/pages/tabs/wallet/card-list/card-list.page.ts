import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { AlertController, ActionSheetController } from "@ionic/angular";
import { CardDTO, KpayBackendCardApiService, KpayBackendMemberApiService, MemberDTO } from "src/app/services/api-kpay-backend.service";

@Component({
  selector: "app-card-list",
  templateUrl: "./card-list.page.html",
  styleUrls: ["./card-list.page.scss"],
})
export class CardListPage implements OnInit {
  member: MemberDTO;
  cards: CardDTO[];

  constructor(
    public appService: AppService,
    private zone: NgZone,
    private router: Router,
    private cardApiService: KpayBackendCardApiService,
    private memberApiService: KpayBackendMemberApiService,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.appService.getKpayMember().then(v => {
      this.member = v;
      this.zone.run(()=>{
        this.loadData();
      })
    })
  }

  loadData() {
    this.appService.toggleLoader(true).then(() => {
      this.cardApiService
        .getCardList(this.member.memberID)
        .subscribe(
          (v) => this.onCardsLoad(v),
          (e) => this.onError(e)
        );
    });
  }

  setDefault(card: CardDTO) {
    this.appService.toggleLoader(true).then(() => {
      const member = this.member;
      member.defaultCard = card.cardID;
      this.memberApiService.updateMember(member, member.memberID).subscribe(
        (v) => this.onSetDefault(v),
        (e) => this.onError(e)
      );
    });
  }

  onSetDefault(v: MemberDTO): void {
    this.appService.toggleLoader(false);
    this.member = v;
    this.member = v;
  }

  openCard(id: any) {
    this.router.navigateByUrl(`/app/wallet/card/${id}`);
  }

  async delete(card: CardDTO) {
    const alert = await this.alertController.create({
      header: "Uyarı",
      message:
        card.pAN.substr(0, 4) +
        " ile başlayan kartı silmek istediğinize emin misiniz?",
      buttons: [
        {
          text: "İptal",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => { },
        },
        {
          text: "Sil",
          handler: () => {
            this.cardApiService
              .deleteCard(this.member.memberID, card.cardID)
              .subscribe(
                (v) => this.onCardDelete(v),
                (e) => this.onError(e)
              );
          },
        },
      ],
    });
    await alert.present();
  }

  onCardsLoad(v: CardDTO[]) {
    this.zone.run(() => {
      this.cards = v.sort((c1, c2) => {
        if (c1.cardID == this.member.defaultCard) {
          return -1;
        } else {
          return 1;
        }
      });
      console.log(this.cards);
      if (this.cards.length > 0) {
        var stringArray = this.cards[0].pAN
          .split(/(\s+)/)
          .filter((e) => e.trim().length > 0);
      }
      this.appService.toggleLoader();
    })
  }

  onCardDelete(v) {
    console.log("card deleted");
    this.loadData();
  }

  onError(e) {
    this.appService.toggleLoader(false);
    this.appService.showErrorAlert(e);
  }

  async showActions(card: CardDTO) {
    let buttons = [];

    if (
      this.member.defaultCard != undefined &&
      card.cardID == this.member.defaultCard
    ) {
      buttons = [
        {
          text: "Bu Kartı Sil",
          role: "destructive",
          handler: () => {
            this.delete(card);
          },
        },
        {
          text: "İptal",
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ];
    } else {
      buttons = [
        {
          text: "Varsayılan Olarak Ayarla",
          handler: () => {
            this.setDefault(card);
          },
        },
        {
          text: "Bu Kartı Sil",
          role: "destructive",
          handler: () => {
            this.delete(card);
          },
        },
        {
          text: "İptal",
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ];
    }

    const actionSheet = await this.actionSheetController.create({
      header: "Kart İşlemleri",
      buttons: buttons,
    });
    await actionSheet.present();
  }
}
