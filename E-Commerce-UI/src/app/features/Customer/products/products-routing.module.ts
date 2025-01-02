import { NgModule } from '@angular/core';

import {RouterModule, Routes} from "@angular/router";
import {ProductsViewComponent} from "./products-view.component";
import {CategoriesViewComponent} from "./categories-view/categories-view.component";
import {ProductDetailsComponent} from "./product/product-details/product-details.component";

const routes: Routes = [
  { path: 'search', component: ProductsViewComponent },
  { path: 'categories', component: CategoriesViewComponent },
  { path: 'product/:id', component: ProductDetailsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
