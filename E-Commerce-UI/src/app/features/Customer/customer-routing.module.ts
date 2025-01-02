import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("./home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.module").then((m) => m.ProductsModule),
  },
  {
    path: "wishlist",
    loadChildren: () =>
      import("./wishlist/wishlist.module").then((m) => m.WishlistModule),
  },
  {
    path: "cart",
    loadChildren: () =>
      import("./cart-view/cart-view.module").then((m) => m.CartViewModule),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule { }
