import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable, of, ReplaySubject} from 'rxjs';
import {ProfileApiService, SocialUserListModel} from "./api-wishalink.service";
import {AppService} from "./app.service";
import {first} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})

export class UserResolverService implements Resolve<any> {

    constructor(private profileApiService: ProfileApiService, private appService: AppService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<SocialUserListModel> {
        return this.profileApiService.info(this.appService.user.id)
    }
}