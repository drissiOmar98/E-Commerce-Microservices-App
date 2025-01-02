import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../../../shared/model/state.model";
import {CategoryResponse, NewCategory} from "../model/category.model";
import {environment} from "../../../../environments/environment";
import {CreatedSubCategory, NewSubCategory, SubCategoryResponse} from "../model/subcategory.model";

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {

  http = inject(HttpClient);

  private create$: WritableSignal<State<CreatedSubCategory>> = signal(State.Builder<CreatedSubCategory>().forInit());
  private getAll$: WritableSignal<State<Array<SubCategoryResponse>>> = signal(State.Builder<Array<SubCategoryResponse>>().forInit());
  private getAllByCategory$: WritableSignal<State<Array<SubCategoryResponse>>> = signal(State.Builder<Array<SubCategoryResponse>>().forInit());
  private getById$: WritableSignal<State<SubCategoryResponse>> = signal(State.Builder<SubCategoryResponse>().forInit());
  private update$: WritableSignal<State<SubCategoryResponse>> = signal(State.Builder<SubCategoryResponse>().forInit());
  private delete$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());

  createSig = computed(() => this.create$());
  getAllSig = computed(() => this.getAll$());
  getALLByCategorySig = computed(() => this.getAllByCategory$());
  getByIdSig = computed(() => this.getById$());
  updateSig = computed(() => this.update$());
  deleteSig = computed(() => this.delete$());

  /**
   * Create a new subcategory.
   * @param newSubCategory - The data for the new subcategory.
   */
  create(newSubCategory: NewSubCategory): void {
    this.http.post<CreatedSubCategory>(`${environment.API_URL}/categories`, newSubCategory).subscribe({
      next: (subCategoryId) => this.create$.set(State.Builder<CreatedSubCategory>().forSuccess(subCategoryId)),
      error: (err) => this.create$.set(State.Builder<CreatedSubCategory>().forError(err)),
    });
  }

  /**
   * Retrieve all subcategories.
   */
  getAllSubCategories(): void {
    this.http.get<Array<SubCategoryResponse>>(`${environment.API_URL}/categories`)
      .subscribe({
        next: subCategories => this.getAll$.set(State.Builder<Array<SubCategoryResponse>>().forSuccess(subCategories)),
        error: err => this.getAll$.set(State.Builder<Array<SubCategoryResponse>>().forError(err)),
      });
  }

  getAllSubCategoriesByCategory(categoryId: number): void {
    this.http.get<Array<SubCategoryResponse>>(`${environment.API_URL}/subcategories/by-category/${categoryId}`)
      .subscribe({
        next: subCategories => this.getAllByCategory$.set(State.Builder<Array<SubCategoryResponse>>().forSuccess(subCategories)),
        error: err => this.getAllByCategory$.set(State.Builder<Array<SubCategoryResponse>>().forError(err)),
      });
  }

  /**
   * Retrieve a subcategory by its ID.
   * @param id - The ID of the subcategory to fetch.
   */
  getSubCategoryById(id: number): void {
    this.http.get<SubCategoryResponse>(`${environment.API_URL}/categories/${id}`).subscribe({
      next: (subCategory) => this.getById$.set(State.Builder<SubCategoryResponse>().forSuccess(subCategory)),
      error: (err) => this.getById$.set(State.Builder<SubCategoryResponse>().forError(err)),
    });
  }

  /**
   * Update a subcategory by ID.
   * @param id - The ID of the subcategory to update.
   * @param updatedSubCategory - The updated subcategory data.
   */
  updateSubCategory(id: number, updatedSubCategory: NewCategory): void {
    this.http.put<SubCategoryResponse>(`${environment.API_URL}/categories/${id}`, updatedSubCategory).subscribe({
      next: (subCategory) => this.update$.set(State.Builder<SubCategoryResponse>().forSuccess(subCategory)),
      error: (err) => this.update$.set(State.Builder<SubCategoryResponse>().forError(err)),
    });
  }

  /**
   * Delete a subcategory by ID.
   * @param id - The ID of the subcategory to delete.
   */
  deleteSubCategory(id: number): void {
    this.http.delete<void>(`${environment.API_URL}/categories/${id}`).subscribe({
      next: () => this.delete$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.delete$.set(State.Builder<void>().forError(err)),
    });
  }


  /**
   * Reset the signal for the creation operation.
   */
  resetCreateSignal(): void {
    this.create$.set(State.Builder<CreatedSubCategory>().forInit());
  }

  /**
   * Reset the signal for fetching all subcategories.
   */
  resetGetAllSignal(): void {
    this.getAll$.set(State.Builder<Array<SubCategoryResponse>>().forInit());
  }

  /**
   * Reset the signal for fetching all subcategories.
   */
  resetGetAllByCategorySignal(): void {
    this.getAllByCategory$.set(State.Builder<Array<SubCategoryResponse>>().forInit());
  }

  /**
   * Reset the signal for fetching a subcategory by ID.
   */
  resetGetByIdSignal(): void {
    this.getById$.set(State.Builder<SubCategoryResponse>().forInit());
  }

  /**
   * Reset the signal for the update operation.
   */
  resetUpdateSignal(): void {
    this.update$.set(State.Builder<SubCategoryResponse>().forInit());
  }

  /**
   * Reset the signal for the delete operation.
   */
  resetDeleteSignal(): void {
    this.delete$.set(State.Builder<void>().forInit());
  }




  constructor() { }
}
