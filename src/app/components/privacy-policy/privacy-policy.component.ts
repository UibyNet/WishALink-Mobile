import {Component, NgZone, OnInit} from '@angular/core';
import {CommonApiService, StringStringKeyValuePair} from "../../services/api.service";
import {AppService} from "../../services/app.service";
import {ModalController} from "@ionic/angular";

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {

    policy: string = ''

    constructor(
        private commonApiService: CommonApiService,
        private appService: AppService,
        private modalController: ModalController,
        private zone: NgZone
    ) {
    }


    ngOnInit() {
        this.getPolicy()
    }

    getPolicy() {
        this.appService.toggleLoader(true).then(res => {
            this.commonApiService.privacypolicy().subscribe(
                v => this.onPrivacyPolicy(v),
                e => this.onError(e)
            )
        })
    }

    onPrivacyPolicy(v: StringStringKeyValuePair) {
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            this.policy = v.value
        })
    }

    onError(e: any) {
        this.zone.run(() => {
            this.appService.toggleLoader(false)
            this.appService.showErrorAlert(e)
        })
    }

    closeModal() {
        this.modalController.dismiss();
    }


}
