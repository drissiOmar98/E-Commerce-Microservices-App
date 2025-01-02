import {Component, effect, EventEmitter, inject, Input, input, OnDestroy, OnInit, Output} from '@angular/core';
import {ToastService} from "../../../../services/toast.service";
import {SubcategoryService} from "../../../../services/subcategory.service";
import {SubCategoryResponse} from "../../../../model/subcategory.model";

@Component({
  selector: 'app-subcategory-step',
  standalone: true,
  imports: [],
  templateUrl: './subcategory-step.component.html',
  styleUrl: './subcategory-step.component.scss'
})
export class SubcategoryStepComponent  implements OnInit, OnDestroy {

  toastService = inject(ToastService);
  subCategoryService= inject(SubcategoryService);
  loadingFetchAll = false;
  subCategories: Array<SubCategoryResponse> | undefined = [];

  @Input() categoryId: number | undefined;

  selectedSubCategory = input.required<Number>();

  @Output() subCategory = new EventEmitter<number>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  onSelectSubCategory(subCategoryId: number) {
    this.subCategory.emit(subCategoryId);
    this.stepValidityChange.emit(true);
  }

  constructor() {
    this.listenToFetchSubCategoriesByCategory();
  }


  ngOnInit(): void {
    if (this.categoryId) {
      this.fetchSubCategories(this.categoryId);  // Fetch subcategories for the selected category
    }
  }

  ngOnDestroy(): void {
    this.subCategoryService.resetGetAllByCategorySignal();
  }



  private listenToFetchSubCategoriesByCategory() {
    effect(() => {
      const subCategoriesByIdCategoryState = this.subCategoryService.getALLByCategorySig();
      if (subCategoriesByIdCategoryState.status === "OK") {
        this.loadingFetchAll = false;
        this.subCategories = subCategoriesByIdCategoryState.value;
        // Handle errors encountered during the fetch
      } else if (subCategoriesByIdCategoryState.status === "ERROR") {
        this.loadingFetchAll = false;
        this.toastService.send({
          severity: "error", detail: "Error when fetching the SubCategories of the Category",
        });
      }
    });
  }

  private fetchSubCategories(categoryId: number) {
    this.loadingFetchAll = true;
    this.subCategoryService.getAllSubCategoriesByCategory(categoryId);
  }

}
