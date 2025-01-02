import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddproductComponent} from "./addproduct/addproduct.component";
import {ProductsComponent} from "./products.component";
import {ViewproductComponent} from "./viewproduct/viewproduct.component";


const routes: Routes = [

  {
    path: "list",
    component: ProductsComponent
  },
  {
    path: "add-product",
    component: AddproductComponent
  },
  {
    path: 'details/:id',
    component: ViewproductComponent,

  },





];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
