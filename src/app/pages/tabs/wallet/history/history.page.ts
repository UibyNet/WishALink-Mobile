import { Component, OnInit, ViewChild } from "@angular/core";
import { AppService } from "src/app/services/app.service";
import {
	KpayBackendPaymentApiService,
	PaginatedPaymentSummaryDTO,
	PaymentSummaryDTO,
	PaymentTypeEnum,
	PaymentStatusEnum,
	MemberDTO,
} from "src/app/services/api-kpay-backend.service";
import { Router } from "@angular/router";
import { IonInfiniteScroll } from "@ionic/angular";
import * as moment from "moment";

@Component({
	selector: "app-history",
	templateUrl: "./history.page.html",
	styleUrls: ["./history.page.scss"],
})
export class HistoryPage implements OnInit {
	@ViewChild(IonInfiniteScroll, { static: true })
	infiniteScroll: IonInfiniteScroll;

	allPayments: PaymentSummaryDTO[] = [];
	filteredPayments: PaymentSummaryDTO[] = [];
	payments: PaymentSummaryDTO[] = [];
	pageNumber: number = 0;
	pageIndex: number = 0;
	pageLoadCount: number = 50;
	pageItemCount: number = 10;
	isLoading: boolean = false;
	isFilterActive: boolean = false;
	hasFilter:boolean = false;

	institutions: string[];
	paymentTypes: PaymentTypeEnum[];
	paymentStatuses: PaymentStatusEnum[];

	selectedInstitution: string;
	selectedPaymentType: PaymentTypeEnum;
	selectedPaymentStatus: PaymentStatusEnum;
	selectedStartDate: string;
	selectedEndDate: string;

	monthNames: string[] = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
	member: MemberDTO;

	constructor(
		private router: Router,
		public appService: AppService,
		private paymentApiService: KpayBackendPaymentApiService
	) {}

	ngOnInit() {
		this.appService.toggleLoader(true).then(() => {
			this.appService.getKpayMember().then(v => {
				this.member = v;
				this.loadAllData();
			})
		});
	}

	loadAllData() {
		if (this.isLoading) return;
		this.isLoading = true;

		this.pageIndex++;
	
		this.paymentApiService
			.getPaginatedPaymentSummary(
				this.member.memberID,
				this.pageIndex,
				this.pageLoadCount,
				"D",
				moment(new Date(2020, 0, 1)),
				moment()
			)
			.subscribe(
				(v) => {
					if(v.resultSet.length > 0) {
						this.allPayments = this.allPayments.concat(v.resultSet);
						this.isLoading = false;

						if(v.paginationInfo.pageNo < v.paginationInfo.totalPages) {
							this.loadAllData();
						}
						else {
							this.appService.toggleLoader(false);
							this.initData();
						}
					}
					else {
						this.isLoading = false;
						this.appService.toggleLoader(false);
						this.initData();
					}
				},
				(e) => this.onError(e)
			);
	}

	initData() {
		this.institutions = this.allPayments.map(x => x.institutionName).filter((value, index, self) => (self.indexOf(value) === index)).sort();
		this.paymentTypes = this.allPayments.map(x => x.paymentType).filter((value, index, self) => (self.indexOf(value) === index)).sort();
		this.paymentStatuses = this.allPayments.map(x => x.paymentStatus).filter((value, index, self) => (self.indexOf(value) === index)).sort();

		this.filter();
	}
	

	getData(e) {
		if(this.filteredPayments == undefined) return;

		this.pageNumber++;

		const pageItems = this.filteredPayments.slice((this.pageNumber - 1) * this.pageItemCount, this.pageNumber * this.pageItemCount)

		if (pageItems.length > 0) {
			this.payments = this.payments.concat(pageItems);
		}

		this.infiniteScroll.complete();
		if (pageItems.length < this.pageItemCount) {
			this.infiniteScroll.disabled = true;
		}
	}

	onError(e) {
		this.isLoading = false;
		this.appService.toggleLoader(false);
		this.appService.showErrorAlert(e);
	}

	openDetail(v: PaymentSummaryDTO) {
		this.router.navigateByUrl(`/app/wallet/history-detail/${v.kPayTxnID}`);
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
				paymentType = v != undefined ? v.toString() : '-';
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
				paymentStatus = v != undefined ? v.toString() : '-';
				break;
		}

		return paymentStatus;
	}

	toggleFilter() {
		this.isFilterActive = !this.isFilterActive;
	}

	filter() {
		this.selectedInstitution = (this.selectedInstitution != undefined && this.selectedInstitution.length > 0) ?  this.selectedInstitution : undefined;
		this.selectedPaymentType = (this.selectedPaymentType != undefined && this.selectedPaymentType.toString().length > 0) ?  this.selectedPaymentType : undefined;
		this.selectedPaymentStatus = (this.selectedPaymentStatus != undefined && this.selectedPaymentStatus.toString().length > 0) ?  this.selectedPaymentStatus : undefined;
		this.selectedStartDate = (this.selectedStartDate != undefined && this.selectedStartDate.length > 0) ?  this.selectedStartDate : undefined;
		this.selectedEndDate = (this.selectedEndDate != undefined && this.selectedEndDate.length > 0) ?  this.selectedEndDate : undefined;

		console.log(this.selectedInstitution);
		console.log(this.selectedPaymentType);
		console.log(this.selectedPaymentStatus);
		console.log(this.selectedStartDate);
		console.log(this.selectedEndDate);

		if(this.allPayments != undefined && this.allPayments.length == 0) return;

		this.filteredPayments = this.allPayments;

		if(this.selectedInstitution != undefined) {
			this.filteredPayments = this.filteredPayments.filter(x => x.institutionName == this.selectedInstitution);
		}

		if(this.selectedPaymentType != undefined) {
			this.filteredPayments = this.filteredPayments.filter(x => x.paymentType == this.selectedPaymentType);
		}

		if(this.selectedPaymentStatus != undefined) {
			this.filteredPayments = this.filteredPayments.filter(x => x.paymentStatus == this.selectedPaymentStatus);
		}

		if(this.selectedStartDate != undefined) {
			this.filteredPayments = this.filteredPayments.filter(x => x.paymentTimeStamp.toDate().getTime() >= (new Date(this.selectedStartDate)).getTime());
		}

		if(this.selectedEndDate != undefined) {
			this.filteredPayments = this.filteredPayments.filter(x => x.paymentTimeStamp.toDate().getTime() <= (new Date(this.selectedEndDate)).getTime());
		}

		this.refresh();
	}

	refresh() {
		this.pageNumber = 0;
		this.isFilterActive = false;
		this.payments = [];

		this.infiniteScroll.disabled = false;

		this.checkFilter();
		this.appService.toggleLoader(true).then(() => {
			setTimeout(() => {
				this.getData(null);
				this.appService.toggleLoader(false);
			}, 100);
		});
	}

	reset() {
		this.selectedInstitution = null;
		this.selectedPaymentType = null;
		this.selectedPaymentStatus = null;
		this.selectedStartDate = null;
		this.selectedEndDate = null;

		this.filter();
	}

	checkFilter() {
		this.hasFilter = this.selectedInstitution != undefined || this.selectedPaymentType != undefined || this.selectedPaymentStatus != undefined || this.selectedStartDate != undefined || this.selectedEndDate != undefined;
	}
}
