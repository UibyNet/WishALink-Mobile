import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import {
  KpayBackendCardApiService,
  CardDTO,
  MemberDTO,
} from "src/app/services/api-kpay-backend.service";
import { AlertController, ModalController } from "@ionic/angular";
import {
  KpayCcpaymentCCPaymentApiService,
  MemberCCPaymentRequestDTO,
  PaymentSummaryDTO,
} from "src/app/services/api-kpay-ccpayment.service";
import { Order } from "src/app/models/order";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { CardEditPage } from "../../tabs/wallet/card-edit/card-edit.page";

@Component({
  selector: "app-kpaygo",
  templateUrl: "./kpaygo.page.html",
  styleUrls: ["./kpaygo.page.scss"],
})
export class KpaygoPage implements OnInit {
  cards: CardDTO[];
  selectedCard: CardDTO;
  order: Order;
  member: MemberDTO;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private modalController: ModalController,
    private inAppBrowser: InAppBrowser,
    private appService: AppService,
    private cardApiService: KpayBackendCardApiService,
    private ccPaymentApiService: KpayCcpaymentCCPaymentApiService
  ) {}

  ngOnInit() {

    this.appService.getKpayMember().then(v => this.member = v)

    this.order = this.appService.order;
    setTimeout(() => this.loadData(), 100);
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

  async pay() {
    let msg = "";
    let total = 0;
    total = this.order.amount - this.order.point;
    if (this.order.point > 0) {
      msg =
        "<strong>" +
        this.selectedCard.pAN.substr(0, 4) +
        "</strong> ile başlayan kartınızdan " +
        total +
        " TL çekilecek ve " +
        this.order.point +
        " TL puanlarınızdan ödenecektir.";
    } else {
      msg =
        "<strong>" +
        this.selectedCard.pAN.substr(0, 4) +
        "</strong> ile başlayan kartınızdan " +
        this.order.amount +
        " TL çekilecektir.";
    }
    const alert = await this.alertController.create({
      header: "Onay",
      message: msg,
      buttons: [
        {
          text: "İptal",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Onaylıyorum",
          handler: () => {
            this.payWithCard();
          },
        },
      ],
    });

    await alert.present();
  }

  async openCardEdit() {
    const modal = await this.modalController.create({
      component: CardEditPage,
      componentProps: { isModal: "true" },
    });

    return await modal.present();
  }

  payWithCard() {
    const paymentRequest: MemberCCPaymentRequestDTO = new MemberCCPaymentRequestDTO();
    paymentRequest.checkoutCode = this.order.checkoutCode;
    paymentRequest.customerID = this.order.customerID;
    paymentRequest.transactionAmountTRY = this.order.amount;
    paymentRequest.creditCardInstallments = 1;
    paymentRequest.vATAmountTRY = 0;
    paymentRequest.merchantTransactionID = this.appService.getUniqId();
    paymentRequest.paymentRequestKPayTxnID = this.order.txnID;

    if (this.order.point > 0) {
      paymentRequest.usedPointsTRY = this.order.point;
    }

    // if (
    //   this.order.customerID != undefined &&
    //   this.order.customerID.length > 0
    // ) {
    //   paymentRequest.customerID = this.order.customerID;
    // }
    //this.appService.showErrorAlert("this.order.note " + this.order.note);

    // if (this.order.note != undefined && this.order.note.length > 0) {
    //   paymentRequest.paymentNote = this.order.note;
    // }

    this.appService.toggleLoader(true).then(() => {
      if (this.order.isMetropol) {
        paymentRequest.useThreeDS = true;
      }
      this.ccPaymentApiService
        .makeCCPayment(
          this.member.memberID,
          this.selectedCard.cardID,
          paymentRequest
        )
        .subscribe(
          (v) => this.onPayment(v),
          (e) => this.onError(e)
        );
    });
  }
  onPayment(v: PaymentSummaryDTO): void {
    this.appService.toggleLoader(false);

    if (v.isThreeDS) {
      this.openBrowser(v);
    } else {
      this.router.navigateByUrl("/checkout/result/" + v.kPayTxnID.toString());
    }
  }

  openBrowser(v: PaymentSummaryDTO) {
    var html = v.threeDS_HTML;

    if (html != undefined && html.length > 0) {
      html = html.replace(/(\r\n|\n|\r)/gm, "");
    }

    if (html == undefined || html.length == 0) {
      this.router.navigateByUrl("/checkout/result/" + v.kPayTxnID.toString());
    } else {
      html = "data:text/html;base64," + btoa(html);
    }

    const browser = this.inAppBrowser.create(
      html,
      "_blank",
      "hidden=no,location=yes,clearsessioncache=yes,clearcache=yes"
    );
    browser.on("loadstart").subscribe((event) => {
      if (event && event.url) {
        if (event.url.includes("kpay.com.tr")) {
          setTimeout(() => {
            browser.close();
            this.router.navigateByUrl(
              "/checkout/result/" + v.kPayTxnID.toString()
            );
          }, 1000);
        }
      }
    });
  }

  onCardsLoad(v: CardDTO[]) {
    this.cards = v.sort((c1, c2) => {
      if (c1.cardID == this.member.defaultCard) {
        return -1;
      } else {
        return 1;
      }
    });
    this.appService.toggleLoader();
  }

  onError(e) {
    this.appService.toggleLoader(false);
    this.appService.showErrorAlert(e);
  }

  onCardSelect(card: CardDTO) {
    this.selectedCard = card;
  }
}
