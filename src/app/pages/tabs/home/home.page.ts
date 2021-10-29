import {Component, OnInit} from '@angular/core';
import {ProfileApiService, User} from "../../../services/api.service";
import {AppService} from "../../../services/app.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private apiService: ProfileApiService,
        private appService: AppService,
        private activatedRoute:ActivatedRoute
    ) {
    }

    userData: User

    ngOnInit() {
        this.getUserData()
    }

    async getUserData() {
        this.appService.toggleLoader(true).then(res=>{
            this.activatedRoute.data.subscribe(
                v=>this.userInfo(v.user),
                e=>this.onError(e)
            )
        })

    }
    private userInfo(v: User) {
        this.userData=v
        this.appService.toggleLoader(false)
    }

    // private userInfo(res: User) {
    //     this.userData = res
    //     console.log(this.userData)
    //     this.appService.toggleLoader(false)
    // }


    private onError(error: any) {
        this.appService.toggleLoader(false)
        this.appService.showAlert(error)
    }

}
