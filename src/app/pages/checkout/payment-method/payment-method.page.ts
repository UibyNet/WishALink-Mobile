import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { Order } from "src/app/models/order";

@Component({
	selector: "app-payment-method",
	templateUrl: "./payment-method.page.html",
	styleUrls: ["./payment-method.page.scss"],
})
export class PaymentMethodPage implements OnInit {
	selectedMethod: string;
	order: Order;

	kPayTxnID: string;

	constructor(
		private router: Router,
		private appService: AppService,
	) {}

	ngOnInit() {
		this.order = this.appService.order;
	}

	onPaymentMethodChange(event) {
		this.selectedMethod = event.detail.value;
	}

	pay() {
		if (this.selectedMethod == "kpay") {
			this.router.navigateByUrl(`/checkout/kpaygo`);
		} else if (this.selectedMethod == "creditcard") {
			this.router.navigateByUrl(`/checkout/creditcard`);
		} 
	}
}
