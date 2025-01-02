import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: "acceuil",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
  },
  {
    path: "products",
    loadChildren: () =>
      import("./products/products.module").then((m) => m.ProductsModule),
  },
  {
    path: "categories",
    loadChildren: () =>
      import("./Categories/category.module").then((m) => m.CategoryModule),
  },
  { path: '**', redirectTo: 'acceuil', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
