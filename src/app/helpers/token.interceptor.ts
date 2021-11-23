import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';
import { WISH_API_URL } from '../services/api-wishalink.service';


@Injectable()
export class TokenInterceptor {
  wishApiBaseUrl: string;

  /**
   * Creates an instance of TokenInterceptor.
   * @param {AppService} appService
   * @memberof TokenInterceptor
   */
  constructor(
    public appService: AppService,
    @Optional() @Inject(WISH_API_URL) baseUrl?: string
    ) { 
      this.wishApiBaseUrl = baseUrl; 
    }

  /**
   * Intercept all HTTP request to add JWT token to Headers
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {Observable<HttpEvent<any>>}
   * @memberof TokenInterceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf(this.wishApiBaseUrl) > -1) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.appService.accessToken}`
        }
      });
    }
    else if (request.url.indexOf('api.kpay.com.tr') > -1) {
      request = request.clone({
        setHeaders: {
          'X-API-KEY': this.appService.kpayApiKey,
          'X-APPLICATION-ID': this.appService.kpayAppId,
        }
      });
    }


    return next.handle(request);
  }
}
