import { Injectable, InjectionToken, NgZone } from "@angular/core";
import { Camera, CameraDirection, CameraResultType, Photo } from '@capacitor/camera';
import { StatusBar, StatusBarBackgroundColorOptions, Style } from "@capacitor/status-bar";
import { AlertController, LoadingController, Platform, ToastController } from "@ionic/angular";
import jwt_decode from 'jwt-decode';
import { LocalUser } from "../models/localuser";
import { Order } from "../models/order";
import { KpayBackendMemberApiService, MemberDTO } from "./api-kpay-backend.service";
import { CheckoutPaymentRequestDTO } from "./api-kpay-fixedqrpayment.service";
import {
    ActivityListModel,
    CategoryListModel,
    ErrorDto,
    getFileReader,
    Notification,
    NotificationApiService,
    SocialUserListModel
} from "./api-wishalink.service";

@Injectable({
    providedIn: "root",
})
export class AppService {

    localVersion: string = 'v1.2.6';
    debugMode: boolean = false;

    loader: HTMLIonLoadingElement;
    loaderCount = 0;
    userInfo: SocialUserListModel;
    fcmToken: string;
    isFcmTokenSaved: boolean = false;
    userActivities: ActivityListModel[] = [];
    userCategories: CategoryListModel[] = [];
    userNotifications: Notification[] = [];

    kpayAppId: string = 'bG1nwhb8I4n1Mu74NM8XGXjJUPC577PJ';
    kpayApiKey: string = 'IRSkoCGx7oQECLtKKhCOzzYpFfvtyhOA';
    order: Order;
    lastPaymentRequest: CheckoutPaymentRequestDTO;

    private _kpayMember: MemberDTO;

    get unreadNotificationsCount() {
        return this.userNotifications.filter(x => !x.isRead).length
    }

    private mUser: LocalUser;

    get isMobile() {
        return this.platform.is('capacitor') || this.platform.is('ios') || this.platform.is('android') || this.platform.is('tablet') || this.platform.is('ipad') || this.platform.is('mobile')
    }

    constructor(
        private zone: NgZone,
        private platform: Platform,
        private notificationApiService: NotificationApiService,
        private loadingController: LoadingController,
        private toastController: ToastController,
        private alertController: AlertController,
        private memberApiService: KpayBackendMemberApiService
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
                user.kpayMemberId = decoded['KpayMemberId'];
                user.kpayUsername = decoded['KpayUsername'];

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
        this.userInfo = null;
        this.userCategories = null;
        this.userActivities = null;
        this.mUser = new LocalUser();
        this.mUser = null;
    }

    toggleStatusBar(style: 'dark' | 'light') {
        if (this.platform.is('capacitor')) {
            StatusBar.setStyle({ style: style == 'dark' ? Style.Dark : Style.Light });
        }
    }

    setStatusBarBackground(color: 'light' | 'primary') {
        if (this.platform.is('capacitor')) {
            StatusBar.setBackgroundColor({ color: color === 'light' ? '#FFFFFF' : '#6A40D6' })
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
        if (message != null && message.message != null) {
            message = message.message;
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

    getKpayMember(): Promise<MemberDTO> {
        return new Promise((resolve, reject) => {
            if (this._kpayMember != null && this._kpayMember.memberID != null && this._kpayMember.memberID.length > 0) {
                resolve(this._kpayMember);
            }
            else {
                this.memberApiService.getMember(this.user.kpayUsername)
                    .subscribe(
                        v => {
                            this._kpayMember = v;
                            resolve(v);
                        },
                        e => {
                            this.showErrorAlert(e)
                            reject();
                        }
                    );
            }
        });
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
                allowEditing: false,
                width: 800,
                height: 800,
                preserveAspectRatio: true,
                direction: CameraDirection.Rear,
                resultType: CameraResultType.Base64,
                promptLabelHeader: 'Fotoğraf',
                promptLabelCancel: 'İptal',
                promptLabelPhoto: 'Galeriden Seç',
                promptLabelPicture: 'Fotoğraf Çek'
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
                    } else {
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
                                    } else {
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

    checkNotifications() {
        this.getNotifications().then(v => this.void());
        setInterval(() => {
            this.getNotifications().then((v) => this.void());
        }, 60000);
    }

    getNotifications() {
        return new Promise<Notification[]>(
            (resolve, reject) => {
                if (this.user == null) reject('');

                this.notificationApiService.list().subscribe(
                    v => {
                        this.zone.run(() => {
                            this.userNotifications = v;
                            resolve(v);
                        })
                    },
                    e => reject(e)
                )
            }
        )
    }

    markNotificationAsRead(notification: Notification) {
        this.notificationApiService.markasread(notification.id)
            .subscribe(v => {
                this.zone.run(() => {
                    notification.isRead = true;
                })
            })
    }

    void() {

    }


    getFormattedDate(m: moment.Moment): string {
        const v = m.toDate();
        return (
            ("00" + v.getHours()).slice(-2) +
            ":" +
            ("00" + v.getMinutes()).slice(-2) +
            ":" +
            ("00" + v.getSeconds()).slice(-2) +
            " " +
            ("00" + v.getDate()).slice(-2) +
            "/" +
            ("00" + (v.getMonth() + 1)).slice(-2) +
            "/" +
            v.getFullYear()
        );
    }

    getFormattedSqlDate(v: Date): string {
        return (
            v.getFullYear() +
            "-" +
            ("00" + (v.getMonth() + 1)).slice(-2) +
            "-" +
            ("00" + v.getDate()).slice(-2)
        );
    }

    getUniqId(): string {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}
