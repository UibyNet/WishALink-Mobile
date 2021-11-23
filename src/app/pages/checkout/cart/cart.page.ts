import { Component, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { IonInput } from "@ionic/angular";
import { Location } from "@angular/common";
import { Order } from "src/app/models/order";
import {
  Validators,
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { atLeastOne } from "src/app/helpers/form.validators";
import {
  CheckoutPaymentRequestDTO,
  QRPaymentModeEnum,
} from "src/app/services/api-kpay-fixedqrpayment.service";
import {
  PointPaymentRequestDTO,
  KpayCcpaymentPaymentApiService
} from "src/app/services/api-kpay-ccpayment.service";
import { MemberDTO } from "src/app/services/api-kpay-backend.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.page.html",
  styleUrls: ["./cart.page.scss"],
})
export class CartPage implements OnInit {
  @ViewChild("amountInput", { static: false })
  amountIonInput: IonInput;

  order: Order;

  amount = 0;
  amountStr = "";
  point = 0;
  pointStr = "0";

  note: string;
  name: string;
  gsmNo: string;
  email: string;
  isDifferentUser: boolean = false;

  paymentInfoForm: FormGroup;

  paymentRequest: CheckoutPaymentRequestDTO;
  alertMessage: string;
  member: MemberDTO;

  constructor(
    private router: Router,
    private location: Location,
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private ccPaymentApiService: KpayCcpaymentPaymentApiService
  ) { }

  ngOnInit() {
    this.paymentRequest = this.appService.lastPaymentRequest;
    this.appService.getKpayMember().then(v => this.member = v);

    if (this.appService.debugMode) {
      this.paymentRequest = new CheckoutPaymentRequestDTO();
      this.paymentRequest.branchName = "KPay Cafe";
      this.paymentRequest.qRPaymentMode = QRPaymentModeEnum.MetropolQR;
      this.paymentRequest.transactionAmountTRY = 1.1;
      this.paymentRequest.paymentAmountTRY = 1.1;
    }

    if (
      !(this.paymentRequest != undefined && this.paymentRequest.hasRequest) &&
      !this.appService.debugMode
    ) {
      this.location.back();
    } else {
      this.paymentInfoForm = this.formBuilder.group({
        amount: [
          this.amountStr,
          Validators.compose([
            Validators.minLength(1),
            Validators.maxLength(30),
            Validators.required,
          ]),
        ],

        point: [
          this.pointStr,
          Validators.compose([
            Validators.minLength(1),
            Validators.maxLength(30),
            Validators.required,
          ]),
        ],

        note: [this.note, Validators.compose([Validators.maxLength(80)])],
        name: [this.name],
        gsmNo: [this.gsmNo],
        email: [this.email],
        differentUser: [this.isDifferentUser],
      });
    }

    switch (this.paymentRequest.qRPaymentMode) {
      case QRPaymentModeEnum.FixedQRAndAmount:
        this.alertMessage = `${this.paymentRequest.branchName} işletmesine
				yapacağınız ödemenin miktarını girin.`;
        break;

      case QRPaymentModeEnum.FixedQRAndFixedAmount:
        this.alertMessage = `${this.paymentRequest.branchName} işletmesinde
				${this.paymentRequest.paymentAmountTRY} TL tutarında hizmet satın aldınız. Ödemeye devam etmek istiyor musunuz?`;
        break;

      case QRPaymentModeEnum.MetropolQR:
        this.alertMessage = `KpayGO ile Metropol noktası  ${this.paymentRequest.branchName} işletmesinde ${this.paymentRequest.transactionAmountTRY}  TL tutarında hizmet satın aldınız. </ br> Ödemeye devam etmek istiyor musunuz?`;

        const fieldAmount = this.paymentInfoForm.controls.amount;
        fieldAmount.clearValidators();

        this.paymentInfoForm.clearValidators();
        const fieldPoint = this.paymentInfoForm.controls.point;
        fieldPoint.setValidators([
          Validators.min(0),
          Validators.max(
            Math.min(
              this.member.pointsTRY,
              this.paymentRequest.paymentAmountTRY
            )
          ),
        ]);
        this.checkFormControls();

        break;
      default:
        break;
    }
  }

  addBalance() {
    this.checkFormControls();
    setTimeout(() => {
      if (!this.paymentInfoForm.valid) return;

      var orderDesc = {
        Note: this.paymentInfoForm.value.note,
        Name: this.paymentInfoForm.value.name,
        Email: this.paymentInfoForm.value.email,
        GSMNo: this.paymentInfoForm.value.gsmNo,
      };

      const isDifferentUser = this.paymentInfoForm.value.differentUser;

      this.amount = parseFloat(this.paymentInfoForm.value.amount);

      if (this.amount > 0) {
        let order = new Order();
        order.amount = this.amount;
        order.checkoutCode = this.paymentRequest.checkoutPointQRCode;
        order.txnID = this.paymentRequest.kPayTxnID;
        order.sellerName = this.paymentRequest.branchName;
        order.note = this.paymentRequest.checkoutPointName;

        if (isDifferentUser) {
          order.customerID =
            this.paymentInfoForm.value.name +
            " - " +
            this.paymentInfoForm.value.note;
        } else {
          orderDesc.Name = "";
          orderDesc.Email = "";
          orderDesc.GSMNo = "";
          order.customerID =
            this.member.firstName +
            " " +
            this.member.lastName +
            " - " +
            this.paymentInfoForm.value.note;
        }

        //order.note = JSON.stringify(orderDesc);
        this.appService.order = order;

        this.router.navigateByUrl(`/checkout/payment-method`);
      }
    }, 150);
  }

  goCheckout() {
    this.point = parseFloat(this.paymentInfoForm.value.point);
    if (this.point > this.paymentRequest.paymentAmountTRY) return;
    if (this.point > this.member.pointsTRY) return;

    let order = new Order();
    order.amount = this.paymentRequest.paymentAmountTRY;
    order.sellerName = this.paymentRequest.branchName;
    order.checkoutCode = this.paymentRequest.checkoutPointQRCode; // this.appService.member.checkoutCode;
    order.txnID = this.paymentRequest.kPayTxnID;
    order.isMetropol = true;
    order.point = this.point;

    this.appService.order = order;
    this.order = order;

    if (this.point == this.paymentRequest.paymentAmountTRY) {
      // this.router.navigateByUrl("/checkout/result/" + order.txnID);
      this.save();
    } else {
      this.router.navigateByUrl(`/checkout/payment-method`);
    }
  }

  //halil start
  save() {
    try {
      const paymentRequest: PointPaymentRequestDTO = new PointPaymentRequestDTO();

      if (
        this.order.customerID != undefined &&
        this.order.customerID.length > 0
      ) {
        paymentRequest.customerID = this.order.customerID;
      }
      if (this.order.note != undefined && this.order.note.length > 0) {
        paymentRequest.paymentNote = this.order.note;
      }
      //this.appService.showErrorAlert(e);

      paymentRequest.checkoutCode = this.order.checkoutCode;
      paymentRequest.memberID = this.member.memberID;
      paymentRequest.paymentRequestKPayTxnID = this.order.txnID;
      paymentRequest.merchantTransactionID = this.appService.getUniqId();

      this.appService.toggleLoader(true).then(() => {
        //   " paymentRequest ; " + JSON.stringify(paymentRequest)

        console.log(paymentRequest);
        this.ccPaymentApiService.makePointPayment(paymentRequest).subscribe(
          (v) => this.onPayment(v),
          (e) => this.onError(e)
        );
      });
    } catch (error) {
      this.onError(error);
    }
  }

  onPayment(v: any): void {
    this.appService.toggleLoader(false);

    this.router.navigateByUrl("/checkout/result/" + v.kPayTxnID.toString());
  }
  onError(e) {
    this.appService.toggleLoader(false);
    this.appService.showErrorAlert(e);
  }

  //halil end
  goBack() {
    this.location.back();
  }

  onCheck() {
    const fieldName = this.paymentInfoForm.controls.name;
    const fieldGsmNo = this.paymentInfoForm.controls.gsmNo;
    const fieldEmail = this.paymentInfoForm.controls.email;

    let isDifferentUser = this.paymentInfoForm.value.differentUser;

    setTimeout(() => {
      if (isDifferentUser) {
        fieldName.setValidators([
          Validators.minLength(3),
          Validators.maxLength(30),
          Validators.required,
        ]);
        fieldGsmNo.setValidators([
          Validators.minLength(10),
          Validators.maxLength(11),
          Validators.pattern("^[0-9]+$"),
        ]);
        fieldEmail.setValidators([
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ]);

        this.paymentInfoForm.setValidators(
          atLeastOne(Validators.required, ["email", "gsmNo"], this.renderer)
        );
      } else {
        fieldName.clearValidators();
        fieldGsmNo.clearValidators();
        fieldEmail.clearValidators();
        this.paymentInfoForm.clearValidators();
        this.checkFormControls();
      }
    }, 100);
  }

  onAmountChange() {
    this.amount = parseFloat(this.amountStr);
  }

  onPointChange() {
    this.point = parseFloat(this.paymentInfoForm.value.point);
    if (this.point > this.member.pointsTRY) {
    }
    this.checkFormControls();
  }

  checkFormControls() {
    setTimeout(() => {
      for (var controlName in this.paymentInfoForm.controls) {
        let ele = document.querySelector(
          '[formControlName="' + controlName + '"]'
        );
        this.paymentInfoForm.controls[controlName].markAsTouched();
        this.paymentInfoForm.controls[controlName].updateValueAndValidity();

        this.getFormValidationErrors();

        if (ele) {
          this.setControlCss(
            ele.parentElement,
            this.paymentInfoForm.controls[controlName]
          );
        }
      }
    }, 100);
  }

  getFormValidationErrors() {
    Object.keys(this.paymentInfoForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.paymentInfoForm.get(key)
        .errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            "Key control: " + key + ", keyError: " + keyError + ", err value: ",
            controlErrors[keyError]
          );
        });
      }
    });
  }

  setControlCss(element: any, control: AbstractControl) {
    /*
    this.renderer.setElementClass(element, "ion-untouched", control.untouched);
    this.renderer.setElementClass(element, "ion-touched", control.touched);
    this.renderer.setElementClass(element, "ion-pristine", control.pristine);
    this.renderer.setElementClass(element, "ion-dirty", control.dirty);
    this.renderer.setElementClass(element, "ion-valid", control.valid);
    this.renderer.setElementClass(element, "ion-invalid", !control.valid);
    */
  }
}
