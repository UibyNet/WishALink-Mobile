import {Component, NgZone, OnInit} from '@angular/core';
import {AppService} from "../../services/app.service";
import {ProfileApiService, UserModel} from "../../services/api.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.page.html',
    styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {

    constructor(
        private profileApiService: ProfileApiService,
        private appService: AppService,
        private zone: NgZone,
        private formBuilder: FormBuilder,
        private router: Router
    ) {
    }

    userData: UserModel
    userProfilePic: string
    updateForm: FormGroup
    isLoading: boolean = false;

    ngOnInit() {
        this.getUserInfo()
        this.userProfilePic = this.appService.userInfo.profilePictureUrl
        this.updateForm = this.formBuilder.group({
            firstName: [this.userData?.firstName, [Validators.required, Validators.minLength(1)]],
            lastName: [this.userData?.lastName, [Validators.required, Validators.minLength(1)]],
            email: [this.userData?.email, [Validators.required, Validators.minLength(1), Validators.email]],
        })
    }

    getUserInfo() {
        this.profileApiService.detail().subscribe(
            v => this.onUserData(v),
            e => this.onError(e)
        )
    }

    onUserData(v: UserModel) {
        this.zone.run(() => {
            this.userData = v
            this.updateForm.get('firstName').setValue(v.firstName)
            this.updateForm.get('lastName').setValue(v.lastName)
            this.updateForm.get('email').setValue(v.email)
        })
    }

    onError(e: any) {
        this.isLoading = false
        this.zone.run(() => {
            this.appService.showAlert(e)
        })
    }

    updateUserData() {
        const model = new UserModel();
        model.firstName = this.updateForm.get('firstName').value.trim();
        model.lastName = this.updateForm.get('lastName').value.trim();
        model.email = this.updateForm.get('email').value.trim();

        this.isLoading = true;
        this.profileApiService.update(model).subscribe(
            v => this.onUpdate(v),
            e => this.onError(e)
        )
    }

    onUpdate(v: void) {
        this.zone.run(() => {
            this.appService.userInfo.fullName = this.updateForm.get('firstName').value.trim() + ' ' + this.updateForm.get('lastName').value.trim()
            this.isLoading = false
            this.appService.showToast('Profil başarıyla güncellendi')
            this.router.navigate(['/tabs/settings'])
        })
    }
}
