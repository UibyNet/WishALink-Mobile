import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import {
  PaymentStatusEnum,
  KpayFixedqrPayment_RequestApiService,
} from "src/app/services/api-kpay-fixedqr.service";
import { AlertController, NavController } from "@ionic/angular";
import { Order } from "src/app/models/order";

@Component({
  selector: "app-result",
  templateUrl: "./result.page.html",
  styleUrls: ["./result.page.scss"],
})
export class ResultPage implements OnInit {
  transactionId: string;
  checkStatusInterval: any;
  result: string;
  resultText: string = "İşlem tamamlanıyor, lütfen bekleyiniz...";
  isCompleted: boolean = false;
  isLoading: boolean = false;
  order: Order;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private alertController: AlertController,
    private appService: AppService,
    private paymentRequestApiService: KpayFixedqrPayment_RequestApiService
  ) {
    this.transactionId = this.activatedRoute.snapshot.paramMap.get("txnId");
  }

  ngOnInit() {
    this.checkStatusInterval = setInterval(() => this.checkStatus(), 3000);
  }

  ngAfterViewInit() {
    this.order = this.appService.order;
  }

  ionViewDidLeave() {
    clearInterval(this.checkStatusInterval);
  }

  ionViewCanLeave(): boolean {
    debugger;
    if (!this.isCompleted) {
      //this.cancel();
    }
    return this.isCompleted;
  }

  checkStatus() {
    if (this.appService.debugMode) {
      this.onPaymentStatus(PaymentStatusEnum.Paid);
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.paymentRequestApiService
      .getPaymentStatus(this.transactionId)
      .subscribe(
        (v) => {
          this.isLoading = false;
          this.onPaymentStatus(v);
        },
        (e) => {
          this.isLoading = false;
          console.log(e);
        }
      );
  }

  async cancel() {
    const alert = await this.alertController.create({
      header: "Uyarı",
      message: "İşlem sonucunu görmek istemediğinize emin misiniz?",
      buttons: [
        {
          text: "Hayır",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Evet",
          handler: () => {
            this.goHome();
          },
        },
      ],
    });
    await alert.present();
  }

  goHome() {
    this.router.navigate(["/app"], { replaceUrl: true });
  }

  onPaymentStatus(v: PaymentStatusEnum): void {
    if (v == PaymentStatusEnum.Paid) {
      clearInterval(this.checkStatusInterval);
      this.result = "success";
      this.resultText = "Ödeme işlemi tamamlandı.";
      this.isCompleted = true;
    } else if (v == PaymentStatusEnum.Timeout) {
      clearInterval(this.checkStatusInterval);
      this.result = "error";
      this.resultText = "Ödeme işlemi zamanaşımına uğradı.";
      this.isCompleted = true;
    } else if (v == PaymentStatusEnum.Cancelled) {
      clearInterval(this.checkStatusInterval);
      this.result = "error";
      this.resultText = "Ödeme işlemi iptal edildi.";
      this.isCompleted = true;
    } else if (
      v == PaymentStatusEnum.Denied ||
      v == PaymentStatusEnum.Orphaned
    ) {
      clearInterval(this.checkStatusInterval);
      this.result = "error";
      this.resultText = "Ödeme işlemi başarısız.";
      this.isCompleted = true;
    }
  }

  onError(e: any): void {
    this.appService.toggleLoader(false);
    this.appService.showErrorAlert(e);
  }

  openPaymentHistory() {
    this.router.navigate(["/app/wallet/history"]);
  }
}
