import { Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { CheckoutPaymentRequestDTO, KpayFixedqrPaymentPayment_RequestApiService, QRPaymentModeEnum } from "src/app/services/api-kpay-fixedqrpayment.service";
import { AlertController } from "@ionic/angular";
import { Order } from "src/app/models/order";
import { AppService } from 'src/app/services/app.service';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.page.html',
    styleUrls: ['./tabs.page.scss']
})
export class TabsPage implements OnInit {
    isKeyboardOpen: boolean = false;
    barcodeResult: string;

    constructor(
        public router: Router,
        public appService: AppService,
        private zone: NgZone,
        private platform: Platform,
        private navController: NavController,
        private alertController: AlertController,
        private barcodeScanner: BarcodeScanner,
        private paymentRequestApiService: KpayFixedqrPaymentPayment_RequestApiService
    ) {
    }

    ngOnInit() {
        if (this.platform.is('capacitor')) {
            Keyboard.addListener('keyboardWillShow', info => {
                this.zone.run(() => {
                    this.isKeyboardOpen = true;
                })
            });
            Keyboard.addListener('keyboardDidHide', () => {
                this.zone.run(() => {
                    this.isKeyboardOpen = false;
                })
            });
        }
    }

    openPage(page: string) {
        this.zone.run(() => {
            this.navController.navigateRoot(page);
        });
    }

    goHome() {
        this.zone.run(() => {
            this.navController.navigateRoot('/app/profile/me');
        });
    }

    startPayment() {
        this.barcodeScanner
            .scan({
                orientation: "portrait",
                formats: "QR_CODE",
                resultDisplayDuration: 0,
            })
            .then((barcodeData) => {
                console.log("Barcode data", barcodeData);
                if (barcodeData == undefined || barcodeData.text.length == 0) {
                    //this.appService.showAlert("İşlemi İptal Ettiniz.");
                    console.log("Barcode data", barcodeData);
                } else {
                    this.barcodeResult = barcodeData.text.trim();
                    // this.appService.showErrorAlert(
                    //   "initMetropolQR " + this.barcodeResult
                    // );
                    this.checkout(this.barcodeResult);
                }
            })
            .catch((err) => {
                console.log("Error", err);
            });
    }

    checkout(checkoutCode: string) {
        if (checkoutCode != undefined || checkoutCode.length > 1) {
            this.appService.toggleLoader(true).then(() => {
                this.paymentRequestApiService.getPaymentRequest(checkoutCode).subscribe(
                    (v) => this.onCheckout(v),
                    (e) => this.onError(e)
                );
            });
        }
    }

    async onCheckout(v: CheckoutPaymentRequestDTO) {
        this.appService.toggleLoader(false);
        if (v.hasRequest) {
            if (v.qRPaymentMode == QRPaymentModeEnum.FixedQR) {
                this.initFixedQR(v);
            } else if (v.qRPaymentMode == QRPaymentModeEnum.FixedQRAndAmount) {
                this.initFixedQRAndAmount(v);
            } else if (v.qRPaymentMode == QRPaymentModeEnum.FixedQRAndFixedAmount) {
                this.initFixedQRAndFixedAmount(v);
            } else if (v.qRPaymentMode == QRPaymentModeEnum.None) {
                // do nothing
            } else if (v.qRPaymentMode == QRPaymentModeEnum.DynamicQR) {
                // pass
            } else if (v.qRPaymentMode == QRPaymentModeEnum.MetropolQR) {
                this.initMetropolQR(v);
            } else {
                //yeni qr fixed devam ettir
                this.initFixedQR(v);
            }
        } else {
            this.appService.showAlert(
                "İptal veya zaman aşımı nedeniyle ödeme işlemi bulunamadı.",
                "Uyarı!"
            );
        }
    }

    async initFixedQR(v: CheckoutPaymentRequestDTO) {
        let alertMessage =
            v.branchName +
            " işletmesinde " +
            v.transactionAmountTRY +
            " TL tutarında işlem yaptınız. </ br> Ödemeye devam etmek istiyor musunuz?";
        if (v.discountAmountTRY > 0) {
            alertMessage =
                v.branchName +
                " işletmesinde " +
                v.transactionAmountTRY +
                " TL tutarında işlem yaptınız ve " +
                v.campaignInfo +
                " kampanyası ile " +
                v.discountAmountTRY +
                " TL indirim kazandınız. Net ödemeniz " +
                v.paymentAmountTRY +
                " TL.</ br>Ödemeye devam etmek istiyor musunuz ?";
        }

        const alert = await this.alertController.create({
            header: "Uyarı!",
            message: alertMessage,
            buttons: [
                {
                    text: "İptal",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: (blah) => { },
                },
                {
                    text: "Ödeme Yap",
                    handler: () => {
                        let order = new Order();
                        order.amount = v.paymentAmountTRY;
                        order.sellerName = v.branchName;
                        order.checkoutCode = v.checkoutPointQRCode; // this.appService.member.checkoutCode;
                        order.txnID = v.kPayTxnID;

                        this.appService.order = order;

                        this.router.navigateByUrl(`/checkout/payment-method`);
                    },
                },
            ],
        });
        await alert.present();
    }

    async initFixedQRAndAmount(v: CheckoutPaymentRequestDTO) {
        if (this.appService.debugMode) {
            v = new CheckoutPaymentRequestDTO();
            v.institutionName = "Hayal Kahvesi";
            v.branchName = "Hayal Kahvesi Avcılar";
            v.transactionAmountTRY = 1.2;
            v.qRPaymentMode = QRPaymentModeEnum.FixedQRAndAmount;
            v.checkoutPointQRCode = "KPAY_VZ58WO_9T21MC_8R1HTQ_000000";
            v.kPayTxnID = "KPAY_VZ58WO_9T21MC_8R1HTQ_000000";
            v.checkoutPointName = "Avcılar";
        }

        this.appService.lastPaymentRequest = v;
        this.router.navigateByUrl(`/checkout/cart`);
    }

    async initFixedQRAndFixedAmount(v: CheckoutPaymentRequestDTO) {
        let alertMessage =
            v.branchName +
            " işletmesinde " +
            v.transactionAmountTRY +
            " TL tutarında işlem yaptınız. </ br> Ödemeye devam etmek istiyor musunuz?";
        if (v.discountAmountTRY > 0) {
            alertMessage =
                v.branchName +
                " işletmesinde " +
                v.transactionAmountTRY +
                " TL tutarında işlem yaptınız ve " +
                v.campaignInfo +
                " kampanyası ile " +
                v.discountAmountTRY +
                " TL indirim kazandınız. Net ödemeniz " +
                v.paymentAmountTRY +
                " TL.</ br>Ödemeye devam etmek istiyor musunuz ?";
        }

        const alert = await this.alertController.create({
            header: "Uyarı!",
            message: alertMessage,
            buttons: [
                {
                    text: "İptal",
                    role: "cancel",
                    cssClass: "secondary",
                    handler: (blah) => { },
                },
                {
                    text: "Ödeme Yap",
                    handler: () => {
                        let order = new Order();
                        order.amount = v.paymentAmountTRY;
                        order.sellerName = v.branchName;
                        order.checkoutCode = v.checkoutPointQRCode; // this.appService.member.checkoutCode;
                        order.txnID = v.kPayTxnID;
                        order.note = v.checkoutPointName;

                        this.appService.order = order;

                        this.router.navigateByUrl(`/checkout/payment-method`);
                    },
                },
            ],
        });
        await alert.present();
    }

    async initMetropolQR(v: CheckoutPaymentRequestDTO) {
        if (this.appService.debugMode) {
            v = new CheckoutPaymentRequestDTO();
            v.institutionName = "Hayal Kahvesi";
            v.branchName = "Hayal Kahvesi Avcılar";
            v.transactionAmountTRY = 1.2;
            v.qRPaymentMode = QRPaymentModeEnum.MetropolQR;
            v.checkoutPointQRCode = "637570646500 ";
            v.kPayTxnID = "KPAY_VZ58WO_9T21MC_8R1HTQ_000000";
            v.checkoutPointName = "Avcılar";
        }
        try {
            this.appService.lastPaymentRequest = v;

            console.log(v);
            this.router.navigateByUrl(`/checkout/cart`);
        } catch (error) { }
    }

    onError(e: any): void {
        this.appService.toggleLoader(false);
        this.appService.showErrorAlert(e);
    }


}
