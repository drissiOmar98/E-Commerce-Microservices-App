import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { WishlistRoutingModule } from './wishlist-routing.module';
import {WishlistViewComponent} from "./wishlist-view.component";
import {ProductsModule} from "../products/products.module";
import {Button, ButtonModule} from "primeng/button";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {ToastModule} from "primeng/toast";
import {WishlistService} from "../../../shared/wishlist.service";


@NgModule({
  declarations: [
    WishlistViewComponent
  ],
  imports: [
    CommonModule,
    WishlistRoutingModule,
    ProductsModule,
    Button,
    BreadcrumbModule,
    ToastModule,
    ButtonModule,
  ],
  providers: [
    WishlistService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WishlistModule { }
