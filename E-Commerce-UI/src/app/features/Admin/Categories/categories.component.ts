import {Component, effect, inject, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {ToastService} from "../services/toast.service";
import {CategoryService} from "../services/category.service";
import {SubcategoryService} from "../services/subcategory.service";
import {CategoryResponse} from "../model/category.model";
import {SubCategoryResponse} from "../model/subcategory.model";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  toastService = inject(ToastService);
  categoryService= inject(CategoryService);
  subCategoryService= inject(SubcategoryService);

  loadingFetchAll = false;
  categories: Array<CategoryResponse> | undefined = [];
  //subCategories: Array<SubCategoryResponse> | undefined = [];
  subCategories: { [key: number]: SubCategoryResponse[] } = {}; // Map category ID to subcategories
  selectedCategoryId: number | null = null;

  // Track visibility for each category
  subcategoriesVisible: { [key: number]: boolean } = {};



  constructor() {
    this.listenFetchAllCategories();
    this.listenToFetchSubCategoriesByCategory()
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
        this.categories = allCategoriesState.value;
      } else if (allCategoriesState.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when fetching the categories of products",
        });
      }
    });
  }

  // private listenToFetchSubCategoriesByCategory() {
  //   effect(() => {
  //     const subCategoriesByIdCategoryState = this.subCategoryService.getALLByCategorySig();
  //     if (subCategoriesByIdCategoryState.status === "OK") {
  //       this.loadingFetchAll = false;
  //       this.subCategories = subCategoriesByIdCategoryState.value;
  //       // Handle errors encountered during the fetch
  //     } else if (subCategoriesByIdCategoryState.status === "ERROR") {
  //       this.loadingFetchAll = false;
  //       this.toastService.send({
  //         severity: "error", detail: "Error when fetching the SubCategories of the Category",
  //       });
  //     }
  //   });
  // }
  private listenToFetchSubCategoriesByCategory() {
    effect(() => {
      const subCategoriesByIdCategoryState = this.subCategoryService.getALLByCategorySig();
      if (subCategoriesByIdCategoryState.status === 'OK') {
        this.loadingFetchAll = false;

        // Ensure that subcategories are a valid array, default to an empty array if undefined
        const fetchedSubcategories = subCategoriesByIdCategoryState.value ?? [];

        const categoryId = this.selectedCategoryId;
        if (categoryId !== null) {
          this.subCategories[categoryId] = fetchedSubcategories;
        }
      } else if (subCategoriesByIdCategoryState.status === 'ERROR') {
        this.loadingFetchAll = false;
        this.toastService.send({
          severity: 'error', detail: 'Error when fetching the SubCategories of the Category',
        });
      }
    });
  }

  // private fetchSubCategories(categoryId: number) {
  //   this.loadingFetchAll = true;
  //   this.subCategoryService.getAllSubCategoriesByCategory(categoryId);
  // }

  fetchSubCategories(categoryId: number) {
    if (!this.subCategories[categoryId]) {  // Check if subcategories are already fetched
      this.selectedCategoryId = categoryId;
      this.loadingFetchAll = true;
      this.subCategoryService.getAllSubCategoriesByCategory(categoryId);
      this.subcategoriesVisible[categoryId] = true;  // Show the subcategories after fetch
    } else {
      this.subcategoriesVisible[categoryId] = !this.subcategoriesVisible[categoryId]; // Toggle visibility
    }
  }




  sortOptions: SelectItem[] = [];

  sortOrder: number = 0;

  sortField: string = '';




  ngOnInit() {
    this.fetchCategories();

    this.sortOptions = [
      { label: 'Price High to Low', value: '!price' },
      { label: 'Price Low to High', value: 'price' }
    ];
  }

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }


}
