import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { ProfileApiService } from "../services/api-wishalink.service";
import { AppService } from "../services/app.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private appService: AppService,
    private profileApiService: ProfileApiService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve, reject) => {
      const currentUser = this.appService.user;
      if (currentUser != null && currentUser.id > 0) {
        if (this.appService.userInfo == undefined) {
          this.appService.toggleLoader(true).then(() => {
            this.profileApiService.info(currentUser.id).subscribe(
              (v) => {
                this.appService.userInfo = v;
                this.appService.toggleLoader(false);
                resolve(true);
              },
              (e) => {
                console.log(e);
                this.appService.toggleLoader(false);
                resolve(false)
              }
            );
          })
        }
        else {
          resolve(true);
        }
      }
      else {
        this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
        resolve(false);
      }
    });

  }
}
