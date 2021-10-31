import { Injectable } from "@angular/core";
import { Crop } from "@ionic-native/crop/ngx";
import { Entry, File } from "@ionic-native/file/ngx";
import { ImagePicker } from "@ionic-native/image-picker/ngx";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import jwt_decode from 'jwt-decode';
import { LocalUser } from "../models/localuser";
import { ErrorDto, SocialUserListModel } from "./api.service";

@Injectable({
    providedIn: "root",
})
export class AppService {

    localVersion: string = 'v1.2.6';
    debugMode: boolean = false;

    loader: HTMLIonLoadingElement;
    loaderCount = 0;
    userInfo: SocialUserListModel
    private mUser: LocalUser;

    constructor(
        private crop: Crop,
        private file: File,
        private imagePicker: ImagePicker,
        private loadingController: LoadingController,
        private toastController: ToastController,
        private alertController: AlertController
    ) {
    }

    public get isLoggedIn() : boolean {
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
        this.mUser = new LocalUser();
        this.mUser = null;
        localStorage.removeItem("access_token");
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

    getImage(): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            this.selectImage()
                .then((imageUrl: string) => {
                    this.cropImage(imageUrl)
                        .then((croppedImageUrl: string) => {
                            console.log('Image cropped');

                            this.getImageData(croppedImageUrl)
                                .then((imgData) => {
                                    resolve(imgData);
                                })
                        })
                        .catch((error) => {
                            console.log('Crop error: ' + JSON.stringify(error));
                            reject(error);
                        })
                        ;
                })
                .catch((error) => {
                    console.log('Select image error: ' + JSON.stringify(error));
                    reject(error);
                })
                ;
        });
    }

    private selectImage(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.imagePicker.getPictures({ maximumImagesCount: 1, outputType: 0 }).then((results) => {
                if (results.length > 0) {
                    resolve(results[0]);
                }
                else {
                    reject();
                }
            });
        });
    }

    private cropImage(url: string): Promise<string> {
        return this.crop.crop(url);
    }

    private getImageData(url: string): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            console.log('File url: ' + url);
            this.file.resolveLocalFilesystemUrl(url)
                .then((entry: Entry) => {
                    console.log('Entry: ' + JSON.stringify(entry));
                    entry.getParent((directoryEntry: Entry) => {
                        console.log('Directory entry: ' + JSON.stringify(directoryEntry));
                        this.file.readAsArrayBuffer(directoryEntry.nativeURL, entry.name)
                            .then((imageData: ArrayBuffer) => {
                                console.log('File read');
                                resolve(imageData);
                            })
                            .catch((error) => {
                                console.log('Can not read file: ' + JSON.stringify(error));
                                reject(error);
                            })
                            ;
                    }, (error) => {
                        console.log('Can not resolve file directory: ' + JSON.stringify(error));
                        reject(error);
                    });
                })
                .catch((error) => {
                    console.log('Can not resolve file path: ' + JSON.stringify(error));
                    reject(error);
                })
                ;
        });
    }
}
