import {Component, effect, inject, OnInit} from '@angular/core';
import { ProductsService } from '../products.service';
import { MenuItem } from 'primeng/api';
import { NavigationExtras, Router } from '@angular/router';
import {ToastService} from "../../../Admin/services/toast.service";
import {CategoryService} from "../../../Admin/services/category.service";
import {CategoryResponse} from "../../../Admin/model/category.model";

@Component({
  selector: 'app-categories-view',
  templateUrl: './categories-view.component.html',
  styleUrls: ['./categories-view.component.scss']
})
export class CategoriesViewComponent implements OnInit {

  toastService = inject(ToastService);
  categoryService= inject(CategoryService);
  router= inject(Router);
  loadingFetchAll = false;
  categories2: Array<CategoryResponse> | undefined = [];

  constructor(
    private _productsService: ProductsService,
  ) {
    this.listenFetchAllCategories();
  }


  /**
   * Fetches all categories from the server.
   * Sets the loading state to true while the request is being processed.
   */
  private fetchCategories() {
    this.loadingFetchAll = true;
    this.categoryService.getAllCategories();
  }


  private listenFetchAllCategories() {
    effect(() => {
      const allCategoriesState = this.categoryService.getAllSig();
      if (allCategoriesState.status === "OK" && allCategoriesState.value) {
        this.loadingFetchAll = false;
        this.categories2 = allCategoriesState.value;
      } else if (allCategoriesState.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when fetching the categories of products",
        });
      }
    });
  }


  categories!: any[];

  public items!: MenuItem[];
  home!: MenuItem;



  ngOnInit(): void {
    this.fetchCategories();
    this._productsService.getProductCategories().subscribe((categories: any) => {
      this.categories = categories.data.category;
    });
    this.items = [
      { label: 'Categories', routerLink: '/categories' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/home' };
  }

  openProductsPage(categoryName: string) {
    this._productsService.setCategoryFilter(categoryName);
    const navigationExtras: NavigationExtras = {
      state: {
        filters: categoryName
      }
    }

    this.router.navigate(['customer/products/search'], navigationExtras);
  }


  navigateToProducts(categoryId: number): void {
    this.router.navigate(['customer/products/search'], { queryParams: { categoryId } });
  }

}
