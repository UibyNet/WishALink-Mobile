import {
    Component,
    ElementRef,
    ViewChild,
    OnInit,
    AfterViewInit,
    Input,
    Inject,
} from "@angular/core";
import {Router} from "@angular/router";
import {AppService} from "src/app/services/app.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {IonSlides, ModalController, NavParams} from "@ionic/angular";
import {CardCreateDTO, CardDTO, KpayBackendCardApiService} from "src/app/services/api-kpay-backend.service";
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

declare var Payment: any;
declare var Card: any;

@Component({
    selector: "app-card-edit",
    templateUrl: "./card-edit.page.html",
    styleUrls: ["./card-edit.page.scss"],
})
export class CardEditPage implements OnInit, AfterViewInit {
    @Input() isModal: string;

    @ViewChild("cardSlides", {static: true})
    slides: IonSlides;

    @ViewChild("content", {static: true})
    private content: any;

    @ViewChild("inputNumber", {static: false}) ionInputNumber: any;
    @ViewChild("inputName", {static: false}) ionInputName: any;
    @ViewChild("inputCvc", {static: false}) ionInputCvc: any;
    @ViewChild("inputAlias", {static: false}) ionInputAlias: any;

    expirationMonth: string;
    expirationYear: string;

    cardForm: FormGroup;
    cardWidth: number =
        window.innerWidth == 0 || window.innerWidth > 400
            ? 360
            : window.innerWidth - 40;

    placeholders = {
        number: "**** **** **** ****",
        name: this.appService.translateWithParam('CardPlaceHolderName').translatedData,
        expiry: "**/****",
        cvc: "***",
        alias: "",
    };

    slideOpts = {
        noSwiping: true,
        initialSlide: 0,
        speed: 400,
    };

    isNextDisabled = true;
    currentSlideIndex = 1;
    cardCheckCount = 0;

    minCardDate: string;
    maxCardDate: string;
    curCardDate: string;

    constructor(
        public formBuilder: FormBuilder,
        private router: Router,
        private appService: AppService,
        private cardApiService: KpayBackendCardApiService,
        private modalController: ModalController,
        private inAppBrowser: InAppBrowser
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

    ionViewDidEnter() {
        this.initForm();
    }

    ngOnInit() {
        this.initForm();
    }

    ngAfterViewInit() {
        this.ionInputNumber.nativeElement.focus();
        setTimeout(() => {
            this.appService.showAlert(
                this.appService.translateWithParam('KpayWarningAlert').translatedData,
                ""
            );
        }, 300);
    }

    initForm() {
        this.currentSlideIndex = 1;
        this.isNextDisabled = false;
        this.cardCheckCount = 0;
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
            alias: [
                "",
                Validators.compose([
                    Validators.minLength(3),
                    Validators.maxLength(30),
                    Validators.required,
                ]),
            ],
        });
    }

    nextStep() {
        if (this.currentSlideIndex == 5) {
            this.save();
        } else {
            this.isNextDisabled = true;
            this.slides.lockSwipes(false);
            this.slides.slideNext();
            this.slides.lockSwipes(true);
            this.currentSlideIndex++;
        }

        setTimeout(() => {
            if (this.currentSlideIndex == 1) {
                this.ionInputNumber.nativeElement.focus();
            } else if (this.currentSlideIndex == 2) {
                this.ionInputName.nativeElement.focus();
            } else if (this.currentSlideIndex == 4) {
                this.ionInputCvc.nativeElement.focus();
            } else if (this.currentSlideIndex == 5) {
                this.ionInputAlias.nativeElement.focus();
            }
        }, 300);
    }

    dismissModal(value: boolean = false) {
        this.modalController.dismiss({result: value});
    }

    save() {
        const formValues = this.cardForm.value;

        const card = new CardCreateDTO();
        card.cardHolder = formValues.name;
        card.pAN = formValues.number.replace(/ /g, "");
        card.expiryMonth = this.expirationMonth;
        card.expiryYear = this.expirationYear;
        card.cVC = formValues.cvc;
        card.alias = formValues.alias;
        card.useThreeDS = true;
        console.log("cart ", this.appService.user.kpayMemberId, card);
        this.appService.toggleLoader(true).then(() => {
            this.cardApiService
                .addCard(card, this.appService.user.kpayMemberId)
                .subscribe(
                    (v) => this.onCardAdd(v),
                    (e) => this.onError(e)
                );
        });
    }

    onCardAdd(v: CardDTO) {
        this.appService.toggleLoader(false);
        console.log("cart result ", v);
        if (v.isThreeDS) {
            this.openBrowser(v);
        } else {
            this.onCardSaved(v);
        }
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
        } else if (key == "alias") {
            if (event.target.value != undefined && event.target.value.length > 3) {
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

    onCardSaved(v: CardDTO) {
        this.appService.showToast(
            v.pAN.substr(0, 4) + " ile başlayan kartınız başarıyla eklendi"
        );
        if (this.isModal) {
            this.dismissModal(true);
        } else {
            this.router.navigateByUrl(`/app/wallet/cards`);
        }
    }

    openBrowser(v: CardDTO) {
        var html = v.threeDS_HTML;
        if (html != undefined && html.length > 0) {
            html = html.replace(/(\r\n|\n|\r)/gm, "");
        }

        if (html == undefined || html.length == 0) {
            this.appService.showAlert("Kart saklama işleminde bir sorun oluştu.");
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
                        this.checkCard(v);
                    }, 1000);
                }
            }
        });
    }

    checkCard(v: CardDTO) {
        this.appService
            .toggleLoader(true, "İşleminiz devam ediyor; lütfen bekleyiniz.")
            .then(() => {
                this.getCardInfo(v);
            });
    }

    getCardInfo(v: CardDTO) {
        this.cardCheckCount++;
        if (this.cardCheckCount > 5) {
            this.appService.toggleLoader(false);
            this.appService.showAlert("Kart saklama işleminde bir sorun oluştu.");
            this.router.navigateByUrl(`/app/wallet/cards`);
            return;
        }

        this.cardApiService
            .getCard(this.appService.user.kpayMemberId, v.cardID)
            .subscribe(
                (v) => {
                    this.appService.toggleLoader(false);
                    this.onCardSaved(v);
                },
                (e) => {
                    setTimeout(() => {
                        this.getCardInfo(v);
                    }, 2000);
                }
            );
    }
}
