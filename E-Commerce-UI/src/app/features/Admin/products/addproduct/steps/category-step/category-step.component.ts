import {Component, effect, EventEmitter, inject, input, OnDestroy, OnInit, Output} from '@angular/core';
import {ToastService} from "../../../../services/toast.service";
import {CategoryService} from "../../../../services/category.service";
import {CategoryResponse} from "../../../../model/category.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {SubcategoryService} from "../../../../services/subcategory.service";

@Component({
  selector: 'app-category-step',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './category-step.component.html',
  styleUrl: './category-step.component.scss'
})
export class CategoryStepComponent  implements OnInit, OnDestroy{

  toastService = inject(ToastService);
  categoryService= inject(CategoryService);
  subCategoryService= inject(SubcategoryService);

  loadingFetchAll = false;
  categories: Array<CategoryResponse> | undefined = [];

  selectedCategory = input.required<Number>();

  @Output() categorySelected = new EventEmitter<number>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  constructor() {
    this.listenFetchAllCategories();
  }


  private listenFetchAllCategories() {
    effect(() => {
      const allCategoriesState = this.categoryService.getAllSig();
      if (allCategoriesState.status === "OK" && allCategoriesState.value) {
        this.loadingFetchAll = false;
        this.categories = allCategoriesState.value;
        console.log(this.categories)
      } else if (allCategoriesState.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when fetching the categories of products",
        });
      }
    });
  }

  /**
   * Fetches all categories from the server.
   * Sets the loading state to true while the request is being processed.
   */
  private fetchCategories() {
    this.loadingFetchAll = true;
    this.categoryService.getAllCategories();
  }

  ngOnInit(): void {
    this.fetchCategories()
  }

  ngOnDestroy(): void {
  }

  onSelectCategory(categoryId: number) {
    this.categorySelected.emit(categoryId);
    this.stepValidityChange.emit(true);
  }

}
