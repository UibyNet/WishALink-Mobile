import {Component, NgZone, OnInit} from '@angular/core';
import {CampaignApiService, CampaignListModel} from "../../../services/api-wishalink.service";
import {AppService} from "../../../services/app.service";
import {NavigationExtras, Router} from "@angular/router";

@Component({
    selector: 'app-campaign',
    templateUrl: './campaign.page.html',
    styleUrls: ['./campaign.page.scss'],
})
export class CampaignPage implements OnInit {

    campaign: CampaignListModel[] = []

    constructor(
        public appService: AppService,
        private campaignService: CampaignApiService,
        private zone: NgZone,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.getCampaign()
    }

    getCampaign() {
        this.appService.toggleLoader(true).then(res => {
            this.campaignService.list(1).subscribe(
                v => this.onCampaign(v),
                e => this.onError(e)
            )
        })
    }

    onError(e: any) {
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            this.appService.showErrorAlert(e)
        })
    }

    onCampaign(v: CampaignListModel[]) {
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            console.log(v)
            this.campaign = v
            console.log(this.campaign)
        })
    }

    openDetail(data: CampaignListModel) {
        let navigationExtras: NavigationExtras = {
            state: {
                campaign: data
            }
        };
        this.router.navigate(['app', 'campaign', 'campaign-detail'], navigationExtras);
    }
}
