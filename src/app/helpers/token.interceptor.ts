import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';


@Injectable()
export class TokenInterceptor {

/**
 * Creates an instance of TokenInterceptor.
 * @param {AppService} appService
 * @memberof TokenInterceptor
 */
constructor(public appService: AppService) {}

/**
 * Intercept all HTTP request to add JWT token to Headers
 * @param {HttpRequest<any>} request
 * @param {HttpHandler} next
 * @returns {Observable<HttpEvent<any>>}
 * @memberof TokenInterceptor
 */
intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
       setHeaders: {
           Authorization: `Bearer ${this.appService.accessToken}`
       }
    });

    return next.handle(request);
  }
}
