import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import Keycloak from "keycloak-js";

import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, from, interval, Observable, of, shareReplay, switchMap} from "rxjs";
import {ConnectedUser} from "../../model/user.model";
import {environment} from "../../../../environments/environment";
import {State} from "../../model/state.model";

import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {UserProfile} from "./user-profile";
import {Role} from "../../model/role";
import {Router} from "@angular/router";
@Injectable({
  providedIn: 'root'
})
export class KeycloakService {

  http = inject(HttpClient);
  //modalService = inject(NgbModal);
  notConnected = "NOT_CONNECTED";

  accessToken: string | undefined;
  //private authModalRef: NgbModalRef | undefined;

  private MIN_TOKEN_VALIDITY_MILLISECONDS = 10000;

  //private _keycloak: Keycloak | undefined;

  constructor(private router: Router) {
    this.initFetchUserCaching(false);
  }

  // get keycloak() {
  //   if (!this._keycloak) {
  //     this._keycloak = new Keycloak({
  //       url: 'http://localhost:9098',
  //       realm: 'Ecommerce-microservices',
  //       clientId: 'Ecommerce-microservices-api'
  //     });
  //   }
  //   return this._keycloak;
  // }

  keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId
  });

  private fetchUserHttp$ = new Observable<ConnectedUser>();

  private fetchUser$: WritableSignal<State<ConnectedUser>> =
    signal(State.Builder<ConnectedUser>().forSuccess({email: this.notConnected}));
  fetchUser = computed(() => this.fetchUser$());

  async initAuthentication(): Promise<void> {
    try {
      const isAuthenticated = await this.keycloak.init({
        onLoad: "login-required",
      });

      if (isAuthenticated) {
        this.accessToken = this.keycloak.token;
        this.fetch();
        const roles = this.getUserRoles();
        if (roles.includes(Role.Admin)) {
          this.router.navigate(['admin/acceuil']);
        } else if (roles.includes(Role.Customer)) {
          this.router.navigate(['customer/home']);
        } else {
          this.router.navigate(['unauthorized']);
        }
        this.initUpdateTokenRefresh();
        // if (this.authModalRef) {
        //   this.authModalRef.close();
        // }
      } else {
        // this.authModalRef = this.modalService
        //   .open(AuthModalComponent, {centered: true, backdrop: "static"});
      }
    } catch (error) {
      console.error("Keycloak initialization failed", error);
    }
  }



  initUpdateTokenRefresh(): void {
    interval(this.MIN_TOKEN_VALIDITY_MILLISECONDS)
      .pipe(
        switchMap(() => fromPromise(this.keycloak.updateToken(this.MIN_TOKEN_VALIDITY_MILLISECONDS)))
      ).subscribe({
      next: refreshed => {
        if (refreshed) {
          this.accessToken = this.keycloak.token;
        }
      },
      error: err => console.error("Failed to refresh token" + err)
    });
  }

  initFetchUserCaching(forceResync: boolean): void {
    const params = new HttpParams().set("forceResync", forceResync);
    this.fetchUserHttp$ = this.http.get<ConnectedUser>(`http://localhost:8222/api/users/get-authenticated-user`, {params: params})
      .pipe(
        catchError(() => of({email: this.notConnected})),
        shareReplay(1)
      );
  }

  fetch(): void {
    this.fetchUserHttp$
      .subscribe({
        next: user => this.fetchUser$.set(State.Builder<ConnectedUser>().forSuccess(user)),
        error: (error: HttpErrorResponse) => {
          this.fetchUser$.set(State.Builder<ConnectedUser>().forError(error))
        }
      });
  }



  private _profile: UserProfile | undefined;

  get profile(): UserProfile | undefined {
    return this._profile;
  }


  async init() {
    const authenticated = await this.keycloak.init({
      onLoad: 'login-required',
    });

    if (authenticated) {
      this._profile = (await this.keycloak.loadUserProfile()) as UserProfile;
      this._profile.token = this.keycloak.token || '';
    }
  }

  isAuthenticated(): boolean {
    return this.keycloak.authenticated!;
  }

  login(): void {
    this.keycloak.login();
  }

  logout(): void {
    this.keycloak.logout();
  }

  goToProfilePage(): void {
    this.keycloak.accountManagement();
  }

  hasRole(role: Role): boolean {
    const roles = this.keycloak.tokenParsed?.realm_access?.roles || [];
    return roles.includes(role);
  }

  getUserRoles(): string[] {
    return this.keycloak.tokenParsed?.realm_access?.roles || [];
  }





}
