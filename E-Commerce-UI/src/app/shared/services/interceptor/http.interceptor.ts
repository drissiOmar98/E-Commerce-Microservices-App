import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from "@angular/core";
import {KeycloakService} from "../keycloak/keycloak.service";
import {Observable} from "rxjs";


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private oauth2Service: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.oauth2Service.accessToken;
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req);
  }
}
