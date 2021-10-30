import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable, of, ReplaySubject} from 'rxjs';
import {ProfileApiService, SocialUserListModel} from "./api.service";
import {AppService} from "./app.service";
import {first} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class UserResolverService implements Resolve<any> {
    private subject: any;

    constructor(private profileApiService: ProfileApiService, private appService: AppService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<SocialUserListModel> {
        console.log("user id", this.appService.user.id)
        if (this.appService.userInfo != null) {
            return of(this.appService.userInfo);
        }
        return this.profileApiService.info(this.appService.user.id)
    }
}