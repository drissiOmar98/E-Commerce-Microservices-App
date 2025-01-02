import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import {MainLayoutModule} from "./main-layout/main-layout.module";

import {CoreModule} from "../../core/core.module";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "primeng/api";
import {HttpClientModule} from "@angular/common/http";
import {ApolloModule} from "apollo-angular";
import {BadgeModule} from "primeng/badge";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CheckboxModule} from "primeng/checkbox";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ToastModule} from "primeng/toast";
import {InputNumberModule} from "primeng/inputnumber";
import {DividerModule} from "primeng/divider";
import {DropdownModule} from "primeng/dropdown";
import {StepsModule} from "primeng/steps";
import {SlideMenuModule} from "primeng/slidemenu";
import {RadioButtonModule} from "primeng/radiobutton";
import {MenuModule} from "primeng/menu";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    MainLayoutModule,
    CoreModule,
    FormsModule,
    SharedModule,
    HttpClientModule,
    ApolloModule,
    BadgeModule,
    InputTextareaModule,
    CheckboxModule,
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
    MainLayoutModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomerModule { }
