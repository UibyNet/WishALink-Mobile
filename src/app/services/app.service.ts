import { Injectable } from "@angular/core";
import { Camera, CameraDirection, CameraResultType, Photo } from '@capacitor/camera';
import { StatusBar, Style } from "@capacitor/status-bar";
import { AlertController, LoadingController, Platform, ToastController } from "@ionic/angular";
import jwt_decode from 'jwt-decode';
import { LocalUser } from "../models/localuser";
import { ActivityListModel, CategoryListModel, ErrorDto, getFileReader, SocialUserListModel } from "./api.service";

@Injectable({
    providedIn: "root",
})
export class AppService {

    localVersion: string = 'v1.2.6';
    debugMode: boolean = false;

    loader: HTMLIonLoadingElement;
    loaderCount = 0;
    userInfo: SocialUserListModel;
    userActivities: ActivityListModel[] = [];
    userCategories: CategoryListModel[] = [];
    private mUser: LocalUser;s

    constructor(
        private platform: Platform,
        private loadingController: LoadingController,
        private toastController: ToastController,
        private alertController: AlertController
    ) {
    }

    public get isLoggedIn(): boolean {
        return this.user != null;
    }

    public get user(): LocalUser {

        if (this.mUser != undefined && this.mUser.id > 0) return this.mUser;

        try {
            const token = localStorage.getItem("access_token");
            if (token != undefined && token.length > 0) {
                const decoded = jwt_decode(token);

                var user = new LocalUser();
                user.id = parseInt(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
                user.fullName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'];
                user.userName = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
                user.roles = decoded['roles'];

                if (user.id > 0) this.mUser = user;
                return this.mUser;
            }
        } catch (e) {
            return null;
        }
    }

    get accessToken(): string {
        return localStorage.getItem("access_token");
    }

    set accessToken(v: string) {
        localStorage.setItem("access_token", v);
    }


    logout() {
        this.clearUser();
        localStorage.removeItem("access_token");
    }

    clearUser() {
        this.mUser = new LocalUser();
        this.mUser = null;
    }

    toggleStatusBar(style: 'dark' | 'light') {
        if(this.platform.is('capacitor')) {
            StatusBar.setStyle({style: style == 'dark' ? Style.Dark : Style.Light});
        }
    }

    async toggleLoader(value: boolean = false, message: string = null): Promise<void> {
        if (value) {
            if (this.loaderCount == 0) {
                this.loaderCount++;

                this.loader = await this.loadingController.create({
                    backdropDismiss: false,
                    spinner: "circles",
                    message: message
                });

                return this.loader.present();
            } else {
                this.loaderCount++;
                return;
            }
        } else {
            this.loaderCount--;

            if (this.loaderCount == 0 && this.loader != null) {
                await this.loader.dismiss();
            }
            return;
        }
    }

    async showAlert(message: string, title: string = "Hata!") {
        const alert = await this.alertController.create({
            header: title,
            message,
            buttons: [
                {
                    text: "Tamam",
                    role: "cancel",
                    handler: () => {
                    },
                },
            ],
        });
        await alert.present();
    }

    async showErrorAlert(message: any) {
        if (Array.isArray(message)) {
            const errorDtos: ErrorDto[] = message;
            message = errorDtos.map(x => x.message).join(' ');
        }

        await this.showAlert(message);
    }

    async showToast(
        message: string,
        position: "top" | "bottom" | "middle" = "top"
    ) {
        const toast = await this.toastController.create({
            message,
            position,
            duration: 3000,
        });
        toast.present();
    }

    getImage(): Promise<{ photo: Photo, blob: Blob }> {
        return new Promise((resolve, reject) => {
            this.selectImage()
                .then(async (photo: Photo) => {
                    const base64Response = await fetch(`data:image/jpeg;base64,${photo.base64String}`);
                    const blob = await base64Response.blob();
                    resolve({ photo, blob });
                })
                .catch((error) => {
                    console.log('Select image error: ' + JSON.stringify(error));
                    reject(error);
                })
                ;
        });
    }

    private selectImage(): Promise<Photo> {
        return new Promise((resolve, reject) => {
            const cameraOptions = {
                quality: 90,
                allowEditing: true,
                width: 800,
                height: 800,
                preserveAspectRatio: true,
                direction: CameraDirection.Rear,
                resultType: CameraResultType.Base64,
                promptLabelCancel: 'İptal'
            };

            Camera.checkPermissions().then(
                p => {
                    if (p.camera == "granted" && p.photos == "granted") {
                        Camera.getPhoto(cameraOptions)
                            .then(v => {
                                resolve(v)
                            })
                            .catch(() => {
                                reject()
                            })
                    }
                    else {
                        Camera.requestPermissions({ permissions: ['camera', 'photos'] })
                            .then(
                                cp => {
                                    if (p.camera == "granted" && p.photos == "granted") {
                                        Camera.getPhoto(cameraOptions)
                                            .then(v => {
                                                resolve(v)
                                            })
                                            .catch(() => {
                                                reject()
                                            })
                                    }
                                    else {
                                        reject('Kamera ve fotoğraflara erişim izni vermeniz gerekli.')
                                    }
                                },
                                e => reject('Kamera ve fotoğraflara erişim izni vermeniz gerekli.' + JSON.stringify(e))
                            )
                    }
                },
                e => {
                    Camera.requestPermissions({ permissions: ['camera', 'photos'] })
                        .then(
                            cp => {
                                Camera.getPhoto(cameraOptions)
                                    .then(v => {
                                        resolve(v)
                                    })
                                    .catch(() => {
                                        reject()
                                    })
                            },
                            e => reject('Kamera ve fotoğraflara erişim izni vermeniz gerekli!')
                        )
                }
            )

        });
    }

}
