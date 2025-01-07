import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartViewRoutingModule } from './cart-view-routing.module';
import {CartViewComponent} from "./cart-view.component";
import {CartItemComponent} from "./cart-item/cart-item.component";
import {OverviewComponent} from "./overview/overview.component";
import {PaymentComponent} from "./payment/payment.component";
import {ShippingComponent} from "./shipping/shipping.component";
import {Button, ButtonDirective} from "primeng/button";
import {InputNumberModule} from "primeng/inputnumber";
import {FormsModule} from "@angular/forms";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {RadioButtonModule} from "primeng/radiobutton";
import {CheckboxModule} from "primeng/checkbox";
import {ToastModule} from "primeng/toast";
import {StepsModule} from "primeng/steps";
import {DropdownModule} from "primeng/dropdown";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {MessageService} from "primeng/api";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    CartViewComponent,
    CartItemComponent,
    OverviewComponent,
    PaymentComponent,
    ShippingComponent
  ],
    imports: [
        CommonModule,
        CartViewRoutingModule,
        Button,
        InputNumberModule,
        FormsModule,
        DividerModule,
        CardModule,
        RadioButtonModule,
        CheckboxModule,
        ButtonDirective,
        ToastModule,
        StepsModule,
        DropdownModule,
        BreadcrumbModule,
        FaIconComponent,
    ],
  providers: [MessageService]
})
export class CartViewModule { }
