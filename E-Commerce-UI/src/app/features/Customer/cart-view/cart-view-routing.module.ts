import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShippingComponent} from "./shipping/shipping.component";
import {OverviewComponent} from "./overview/overview.component";
import {PaymentComponent} from "./payment/payment.component";

import {CartViewComponent} from "./cart-view.component";


const routes: Routes = [
  { path: "",
    component: CartViewComponent,
    children: [
      { path: 'shipping', component: ShippingComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'payment', component: PaymentComponent },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartViewRoutingModule { }
