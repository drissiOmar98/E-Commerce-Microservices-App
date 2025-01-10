import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Apollo
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';

// Feature modules


// PrimeNG modules
import { BadgeModule } from 'primeng/badge';


import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { RadioButtonModule } from 'primeng/radiobutton';

import { WishlistService } from './shared/wishlist.service';

import { ToastModule } from 'primeng/toast';

import { InputNumberModule } from 'primeng/inputnumber';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import {MessageService, SharedModule} from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { InputTextareaModule } from 'primeng/inputtextarea';

import { SlideMenuModule } from 'primeng/slidemenu';
import {KeycloakService} from "./shared/services/keycloak/keycloak.service";
import {MenuModule} from "primeng/menu";
import {HttpInterceptorService} from "./shared/services/interceptor/http.interceptor";
import {AuthExpiredInterceptorService} from "./shared/services/interceptor/auth-expired.interceptor";
import {LayoutModule} from "./features/Admin/layouts/layout.module";
import {MainLayoutModule} from "./features/Customer/main-layout/main-layout.module";
import {ProductsService} from "./features/Customer/products/products.service";
import {FooterStepComponent} from "./features/Admin/products/addproduct/footer-step/footer-step.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



export function kcFactory(kcService: KeycloakService) {
  return () => kcService.initAuthentication();
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    RouterModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ApolloModule,
    BadgeModule,
    InputTextareaModule,
    CheckboxModule,
    BrowserAnimationsModule,
    ButtonModule,
    InputTextModule,
    BreadcrumbModule,
    ToastModule,
    InputNumberModule,
    DividerModule,
    DropdownModule,
    StepsModule,
    SlideMenuModule,
    RadioButtonModule,
    ReactiveFormsModule,
    MenuModule,
    LayoutModule,
    MainLayoutModule,
    FontAwesomeModule,
  ],
  exports: [],
  providers: [
    ProductsService,
    MessageService,
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: 'https://webshop.hasura.app/v1/graphql',
            headers: new HttpHeaders({
              "x-hasura-admin-secret": "6sftAV4UtDQ6V26v1p4U4mDAS8eXiDDnBo62JFsQbdTjksQQjcF54reBmrA2p7Jl"
            }),
          }),
        };
      },
      deps: [HttpLink],
    },
    {
      provide: APP_INITIALIZER,
      deps: [KeycloakService],
      useFactory: kcFactory,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass:  HttpInterceptorService, // Add your HTTP interceptor
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass:  AuthExpiredInterceptorService, // Add the expired token interceptor
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
