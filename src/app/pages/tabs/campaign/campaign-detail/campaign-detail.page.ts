import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "src/app/services/app.service";
import { CampaignListModel } from "../../../../services/api-wishalink.service";

@Component({
  selector: "app-campaign-detail",
  templateUrl: "./campaign-detail.page.html",
  styleUrls: ["./campaign-detail.page.scss"],
})
export class CampaignDetailPage implements OnInit {
  campaign: CampaignListModel;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService
  ) {
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.campaign =
          this.router.getCurrentNavigation().extras.state.campaign;
      }
    });
  }

  ngOnInit() {}
}
