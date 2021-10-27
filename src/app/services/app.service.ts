import { Injectable } from "@angular/core";
import { AlertController, LoadingController, ToastController } from "@ionic/angular";
import jwt_decode from 'jwt-decode';
import { LocalUser } from "../models/localuser";

@Injectable({
	providedIn: "root",
})
export class AppService {

	localVersion: string = 'v1.2.6';
	debugMode: boolean = false;

	loader: HTMLIonLoadingElement;
	loaderCount = 0;

	private mUser: LocalUser;

	constructor(
		private loadingController: LoadingController,
		private toastController: ToastController,
		private alertController: AlertController
	) { }


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
					handler: () => { },
				},
			],
		});
		await alert.present();
	}

	async showErrorAlert(message: any) {
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
}
