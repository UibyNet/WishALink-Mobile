import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import {
  CardCreateDTO, MemberDTO,
} from "src/app/services/api-kpay-backend.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IonSlides } from "@ionic/angular";
import {
  CCPaymentRequestDTO,
  KpayCcpaymentCCPaymentApiService,
  PaymentSummaryDTO,
} from "src/app/services/api-kpay-ccpayment.service";
import { Order } from "src/app/models/order";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";

declare var Payment: any;
declare var Card: any;

@Component({
  selector: "app-creditcard",
  templateUrl: "./creditcard.page.html",
  styleUrls: ["./creditcard.page.scss"],
})
export class CreditcardPage implements OnInit, AfterViewInit {
  @ViewChild("cardSlides", { static: true })
  slides: IonSlides;

  @ViewChild("content", { static: true })
  private content: any;

  @ViewChild("inputNumber", { static: false }) ionInputNumber: any;
  @ViewChild("inputName", { static: false }) ionInputName: any;
  @ViewChild("inputCvc", { static: false }) ionInputCvc: any;

  expirationMonth: string;
  expirationYear: string;

  cardForm: FormGroup;

  placeholders = {
    number: "**** **** **** ****",
    name: "Ad Soyad",
    expiry: "**/****",
    cvc: "***",
  };

  slideOpts = {
    noSwiping: true,
    initialSlide: 0,
    speed: 400,
  };

  isNextDisabled = true;
  currentSlideIndex = 1;

  minCardDate: string;
  maxCardDate: string;
  curCardDate: string;

  order: Order;
  member: MemberDTO;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private inAppBrowser: InAppBrowser,
    private appService: AppService,
    private ccPaymentApiService: KpayCcpaymentCCPaymentApiService
  ) {
    var date = new Date();
    this.minCardDate = this.appService.getFormattedSqlDate(date);
    this.curCardDate = this.appService.getFormattedSqlDate(date);

    var maxDate = new Date(
      date.getFullYear() + 15,
      date.getMonth(),
      date.getDate()
    );
    this.maxCardDate = this.appService.getFormattedSqlDate(maxDate);
  }

  ngAfterViewInit() {
    this.order = this.appService.order;
    console.log('or', this.order)
    setTimeout(() => {
      console.log(this.ionInputNumber);
      this.ionInputNumber.nativeElement.focus();
    }, 300);
  }

  ngOnInit() {
    this.appService.getKpayMember().then(v => this.member = v);

    this.slides.lockSwipes(true);

    this.cardForm = this.formBuilder.group({
      number: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      name: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.required,
        ]),
      ],
      expiry: [
        "",
        Validators.compose([
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern("^[0-9]+$"),
          Validators.required,
        ]),
      ],
      cvc: [
        "",
        Validators.compose([
          Validators.minLength(3),
          Validators.maxLength(4),
          Validators.required,
        ]),
      ],
    });
  }

  nextStep() {
    if (this.currentSlideIndex == 4) {
      this.save();
    } else {
      this.isNextDisabled = true;
      this.slides.lockSwipes(false);
      this.slides.slideNext();
      this.slides.lockSwipes(true);
      this.currentSlideIndex++;

      setTimeout(() => {
        if (this.currentSlideIndex == 1) {
          this.ionInputNumber.nativeElement.focus();
        } else if (this.currentSlideIndex == 2) {
          this.ionInputName.nativeElement.focus();
        } else if (this.currentSlideIndex == 4) {
          this.ionInputCvc.nativeElement.focus();
        }
      }, 300);
    }
  }

  save() {
    const formValues = this.cardForm.value;

    const card = new CardCreateDTO();
    card.cardHolder = formValues.name;
    card.pAN = formValues.number.replace(/ /g, "");
    card.expiryMonth = this.expirationMonth;
    card.expiryYear = this.expirationYear;
    card.cVC = formValues.cvc;
    card.alias = formValues.name;

    const paymentRequest: CCPaymentRequestDTO = new CCPaymentRequestDTO();
    paymentRequest.checkoutCode = this.order.checkoutCode;
    paymentRequest.customerID = this.order.customerID;
    paymentRequest.transactionAmountTRY = this.order.amount;
    //paymentRequest.customerFirstName = member.firstName;
    //paymentRequest.customerLastName = member.lastName;
    //paymentRequest.customerGSMNo = member.gSMNo;
    paymentRequest.creditCardInstallments = 1;
    paymentRequest.vATAmountTRY = 0;
    paymentRequest.creditCardPAN = card.pAN;
    paymentRequest.creditCardHolder = card.cardHolder;
    paymentRequest.creditCardExpiryMonth = card.expiryMonth;
    paymentRequest.creditCardExpiryYear = card.expiryYear;
    paymentRequest.creditCardCVC = card.cVC;
    paymentRequest.merchantTransactionID = this.appService.getUniqId();

    if (this.order.point > 0) {
      paymentRequest.usedPointsTRY = this.order.point;
    }

    if (
      this.order.customerID != undefined &&
      this.order.customerID.length > 0
    ) {
      paymentRequest.customerID = this.order.customerID;
    }
    if (this.order.note != undefined && this.order.note.length > 0) {
      paymentRequest.paymentNote = this.order.note;
    }

    paymentRequest.memberID = this.member.memberID;

    this.appService.toggleLoader(true).then(() => {
      if (this.order.isMetropol) {
        paymentRequest.useThreeDS = true;
      }
      this.ccPaymentApiService.makeDirectCCPayment(paymentRequest).subscribe(
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

  onError(e) {
    this.appService.toggleLoader(false);
    this.appService.showErrorAlert(e);

    this.isNextDisabled = true;
    this.slides.lockSwipes(false);
    this.slides.slideTo(0);
    this.slides.lockSwipes(true);
    this.currentSlideIndex = 1;

    setTimeout(() => {
      this.ionInputNumber.nativeElement.focus();
    }, 1000);
  }

  onFocus(event) {
    setTimeout(() => {
      this.content.nativeElement.scrollTop = 200;
    }, 100);
  }

  onChange(key, event) {
    if (key == "number") {
      if (event.target.value != undefined && event.target.value.length > 12) {
        this.isNextDisabled = false;
      }
    } else if (key == "name") {
      if (
        event.target.value != undefined &&
        event.target.value.length > 3 &&
        event.target.value.indexOf(" ") > 0
      ) {
        this.isNextDisabled = false;
      }
    } else if (key == "expiry") {
      if (event.target.value != undefined && event.target.value.length > 2) {
        this.isNextDisabled = false;
      }
    } else if (key == "cvc") {
      if (event.target.value != undefined && event.target.value.length > 2) {
        this.isNextDisabled = false;
      }
    }
  }

  onDateChange(event) {
    const expiry = event.detail.value;
    if (expiry == undefined) return;

    const expiryParts = expiry.split("-");
    this.expirationYear = expiryParts[0];
    this.expirationMonth = expiryParts[1];
    if (
      this.expirationMonth != undefined &&
      this.expirationMonth.length == 2 &&
      this.expirationYear != undefined &&
      this.expirationYear.length == 4
    ) {
      this.isNextDisabled = false;
    }
  }
}
