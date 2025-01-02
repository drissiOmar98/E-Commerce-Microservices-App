import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import {inject, Injectable} from "@angular/core";
import {KeycloakService} from "../keycloak/keycloak.service";
import {Observable, tap} from "rxjs";


@Injectable()
export class AuthExpiredInterceptorService implements HttpInterceptor {
  constructor(private oauth2Service: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 && err.url && this.oauth2Service.isAuthenticated()) {
            this.oauth2Service.login();
          }
        },
      })
    );
  }
}
