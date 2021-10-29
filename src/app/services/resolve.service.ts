import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ProfileApiService} from "./api.service";

@Injectable({
    providedIn: 'root'
})

export class UserResolverService implements Resolve<any> {
    constructor(private profileApiService: ProfileApiService) {
    }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.profileApiService.info()
    }
}