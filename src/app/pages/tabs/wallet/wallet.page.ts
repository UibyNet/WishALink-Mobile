import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AppService } from "../../../services/app.service";


@Component({
  selector: "app-wallet",
  templateUrl: "wallet.page.html",
  styleUrls: ["wallet.page.scss"],
})
export class WalletPage {

  constructor(
    private router: Router,
  ) { }

  ionViewDidEnter() {
  }

  openCards() {
    this.router.navigateByUrl(`/app/wallet/cards`);
  }

  showHistory() {
    this.router.navigateByUrl(`/app/wallet/history`);
  }
}
