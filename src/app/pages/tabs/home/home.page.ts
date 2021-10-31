import { Component, OnInit } from '@angular/core';
import { Media, ProfileApiService, SocialUserListModel } from "../../../services/api.service";
import { AppService } from "../../../services/app.service";
import { ActivatedRoute } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private appService: AppService,
        private profileApiService: ProfileApiService,
        private activatedRoute: ActivatedRoute,
        private actionSheetController: ActionSheetController,
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {
        this.getUserData()
    }

    async getUserData() {
        this.userData = this.appService.userInfo;

        if(this.userData == null) {
            this.appService.toggleLoader(true).then(res => {
                this.activatedRoute.data.subscribe(
                    v => this.userInfo(v.user),
                    e => this.onError(e)
                ) 
            })
        }
        else {
            this.activatedRoute.data.subscribe(
                v => this.userInfo(v.user),
                e => this.onError(e)
            )
        }
    }

    private userInfo(v: SocialUserListModel) {
        this.userData = v;
        this.appService.userInfo = v;
        console.log(this.userData);
        this.appService.toggleLoader(false);
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
                    icon: 'image',
                    handler: () => {
                       this.changePicture();
                    }
                },
                {
                    text: 'Profil resmini kaldır',
                    cssClass: 'changeProfilePicture',
                    icon: 'trash',
                    handler: () => {
                        this.profileApiService.removeprofilepicture()
                            .subscribe(
                                v => this.onProfilePictureChanged(),
                                e => this.onError(e)
                            )
                    }
                },
            ]
        });
        await actionSheet.present();

        const { role } = await actionSheet.onDidDismiss();
        console.log('onDidDismiss resolved with role', role);
    }

    onProfilePictureChanged(v: string = '') {
        if (v == null || v == '') {
            this.profileApiService.info(this.appService.user.id)
                .subscribe(
                    v => this.userInfo(v),
                    e => this.onError(e)
                )
        }
        else {
            this.appService.userInfo.profilePictureUrl = v;
            this.userData.profilePictureUrl = v;
        }
    }


    private onError(error: any) {
        this.appService.toggleLoader(false)
        this.appService.showAlert(error)
    }

    private changePicture() {

        this.appService.getImage()
            .then(
                (imgData) => {
                    this.profileApiService.changeprofilepicture({ fileName: 'avatar.jpg', data: imgData })
                        .subscribe(
                            v => this.onProfilePictureChanged(v),
                            e => this.onError(e)
                        )
                }
            );
    }
}
