import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {authGuard} from "./shared/services/guard/auth.guard";
import {Role} from "./shared/model/role";
import {LayoutComponent} from "./features/Admin/layouts/layout.component";
import {MainLayoutComponent} from "./features/Customer/main-layout/main-layout.component";

const routes: Routes = [

  {
    path: "",
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "admin",
        canActivate: [authGuard],
        data: {
          role: Role.Admin,
        },
        loadChildren: () =>
          import("./features/Admin/admin.module").then((m) => m.AdminModule),
      },
    ],
  },

  {
    path: "",
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: "customer", // Define an empty path for the customer module
        canActivate: [authGuard],
        data: { role: Role.Customer },
        loadChildren: () =>
          import("./features/Customer/customer.module").then((m) => m.CustomerModule),
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
  // { path: 'products/search', component: ProductsViewComponent },
  // { path: 'categories', component: CategoriesViewComponent },
  // { path: 'product/:id', component: ProductDetailsComponent },
  // { path: 'wishlist', component: WishlistViewComponent },
  // {
  //   path: 'cart',
  //   component: CartViewComponent,
  //   canActivate: [authGuard],  // Apply the authGuard here
  //   children: [
  //     { path: 'shipping', component: ShippingComponent },
  //     { path: 'overview', component: OverviewComponent },
  //     { path: 'payment', component: PaymentComponent },
  //   ]
  // },
  // { path: '404', component: NotFoundComponent },
  // { path: 'home', canActivate: [authGuard], loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
  // { path: '**', redirectTo: 'home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
