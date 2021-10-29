import {Component, OnInit} from '@angular/core';
import {ProfileApiService, User} from "../../../services/api.service";
import {AppService} from "../../../services/app.service";
import {ActivatedRoute} from "@angular/router";
import {ActionSheetController} from "@ionic/angular";

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private apiService: ProfileApiService,
        private appService: AppService,
        private activatedRoute:ActivatedRoute,
        private actionSheetController:ActionSheetController
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
        console.log(this.userData)
        this.appService.toggleLoader(false)
    }

    async presentActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: '',
            mode: 'md',
            cssClass: 'my-custom-class',
            buttons: [
                {
                    text: 'Profil resmini değiştir',
                    cssClass: 'changeProfilePicture',
                    icon:'image',
                    handler: () => {
                        // this.router.navigate(['login']);
                    }
                },
                {
                    text: 'Profil resmini kaldır',
                    cssClass: 'changeProfilePicture',
                    icon:'trash',
                    handler: () => {
                        // this.router.navigate(['register']);
                    }
                },
            ]
        });
        await actionSheet.present();

        const {role} = await actionSheet.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }


    private onError(error: any) {
        this.appService.toggleLoader(false)
        this.appService.showAlert(error)
    }

}
