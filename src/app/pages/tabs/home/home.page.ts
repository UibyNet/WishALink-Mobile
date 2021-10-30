import { Component, OnInit } from '@angular/core';
import { Media, ProfileApiService, SocialUserListModel } from "../../../services/api.service";
import { AppService } from "../../../services/app.service";
import { ActivatedRoute } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

    constructor(
        private profileApiService: ProfileApiService,
        private appService: AppService,
        private activatedRoute: ActivatedRoute,
        private actionSheetController: ActionSheetController,
        private imagePicker: ImagePicker
    ) {
    }

    userData: SocialUserListModel

    ngOnInit() {
        this.getUserData()
    }

    async getUserData() {
        this.appService.toggleLoader(true).then(res => {
            this.activatedRoute.data.subscribe(
                v => this.userInfo(v.user),
                e => this.onError(e)
            )
        })

    }

    private userInfo(v: SocialUserListModel) {
        this.userData = v;
        this.appService.userInfo = v;
        console.log(this.userData);
        this.appService.toggleLoader(false);
    }

    async presentActionSheet() {
        const options: ImagePickerOptions = {
            maximumImagesCount: 1,

            // max width and height to allow the images to be.  Will keep aspect
            // ratio no matter what.  So if both are 800, the returned image
            // will be at most 800 pixels wide and 800 pixels tall.  If the width is
            // 800 and height 0 the image will be 800 pixels wide if the source
            // is at least that wide.
            width: 320,
            height: 320,

            // quality of resized image, defaults to 100
            quality: 90,

            // output type, defaults to FILE_URIs.
            // available options are 
            // window.imagePicker.OutputType.FILE_URI (0) or 
            // window.imagePicker.OutputType.BASE64_STRING (1)
            outputType: 0
        };

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
                        this.imagePicker.getPictures(options).then((results) => {
                            if (results.length > 0) {
                                const selectedImage = results[0];
                                this.profileApiService.changeprofilepicture({ fileName: 'avatar.png', data: selectedImage })
                                    .subscribe(
                                        v => this.onProfilePictureChanged(v),
                                        e => this.onError(e)
                                    )
                            }
                        }, (err) => { });
                        // this.router.navigate(['login']);
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

}
