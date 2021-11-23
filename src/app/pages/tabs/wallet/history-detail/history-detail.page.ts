import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import {
	KpayBackendPaymentApiService,
	PaymentDTO,
	PaymentTypeEnum,
	PaymentStatusEnum,
	MemberDTO,
} from "src/app/services/api-kpay-backend.service";

@Component({
	selector: "app-history-detail",
	templateUrl: "./history-detail.page.html",
	styleUrls: ["./history-detail.page.scss"],
})
export class HistoryDetailPage implements OnInit {
	txnId: string;
	payment: PaymentDTO;
	member: MemberDTO;

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		public appService: AppService,
		private paymentApiService: KpayBackendPaymentApiService
	) {
		this.txnId = this.activatedRoute.snapshot.paramMap.get("kpayTxnId");
	}

	ngOnInit() {
		this.appService.toggleLoader(true).then(() => {
			this.appService.getKpayMember().then(v => {
				this.member = v;


				this.paymentApiService
					.getPayment(v.memberID, this.txnId)
					.subscribe(
						(v) => this.onPaymentLoad(v),
						(e) => this.onError(e)
					);
			})

		});
	}

	onPaymentLoad(v: PaymentDTO) {
		this.appService.toggleLoader(false);
		this.payment = v;
	}

	onError(e) {
		this.appService.toggleLoader(false);
		this.appService.showErrorAlert(e);
	}

	getPaymentType(v: PaymentTypeEnum): string {
		let paymentType = "";
		switch (v) {
			case PaymentTypeEnum.Cash:
				paymentType = "Nakit";
				break;
			case PaymentTypeEnum.CreditCard:
				paymentType = "Kredi Kartı";
				break;
			case PaymentTypeEnum.DynamicQRBEX:
				paymentType = "BKM Express";
				break;
			case PaymentTypeEnum.FixedQRBEX:
				paymentType = "BKM Express";
				break;
			case PaymentTypeEnum.StoredCreditCard:
				paymentType = "Kayıtlı Kredi Kartı";
				break;
			default:
				paymentType = v.toString();
				break;
		}

		return paymentType;
	}

	getPaymentStatus(v: PaymentStatusEnum): string {
		let paymentStatus = "";
		switch (v) {
			case PaymentStatusEnum.AutoCancelled:
				paymentStatus = "Otomatik iptal edildi";
				break;
			case PaymentStatusEnum.Cancelled:
				paymentStatus = "İptal edildi";
				break;
			case PaymentStatusEnum.Closed:
				paymentStatus = "Kapalı";
				break;
			case PaymentStatusEnum.Denied:
				paymentStatus = "Reddedildi";
				break;
			case PaymentStatusEnum.Orphaned:
				paymentStatus = "Boşta";
				break;
			case PaymentStatusEnum.Paid:
				paymentStatus = "Ödendi";
				break;
			case PaymentStatusEnum.Refunded:
				paymentStatus = "İade edildi";
				break;
			case PaymentStatusEnum.Started:
				paymentStatus = "Başlatıldı";
				break;
			case PaymentStatusEnum.Timeout:
				paymentStatus = "Zamanaşımına uğradı";
				break;
			default:
				paymentStatus = v.toString();
				break;
		}

		return paymentStatus;
	}

	getPaymentNote(v: string) {
		if (v == undefined || v.length == 0) return "";

		try {
			let note: string = "";

			if (v.indexOf("{") > -1 && v.indexOf("}") > -1) {
				v = v.split('"Name":').join('"name":');
				v = v.split('"Email":').join('"email":');
				v = v.split('"GSMNo":').join('"gsmNo":');

				var noteJson = JSON.parse(v);

				note = '<ion-grid class="ion-no-padding">';

				if (noteJson.name != undefined && noteJson.name.length > 0) {
					note += "<ion-row>";
					note +=
						'<ion-col size="3">Ad Soyad</ion-col><ion-col size="9">: ' +
						noteJson.name +
						"</ion-col>";
					note += "</ion-row>";
				}
				if (noteJson.email != undefined && noteJson.email.length > 0) {
					note += "<ion-row>";
					note +=
						'<ion-col size="3">E-mail</ion-col><ion-col size="9">: ' +
						noteJson.email +
						"</ion-col>";
					note += "</ion-row>";
				}
				if (noteJson.gsmNo != undefined && noteJson.gsmNo.length > 0) {
					note += "<ion-row>";
					note +=
						'<ion-col size="3">Telefon</ion-col><ion-col size="9">: ' +
						noteJson.gsmNo +
						"</ion-col>";
					note += "</ion-row>";
				}
				note += "</ion-grid>";
			} else {
				note = v;
			}

			return note;
		} catch (error) {
			console.log("getPaymentNote error", error);
		}

		return "";
	}
}
