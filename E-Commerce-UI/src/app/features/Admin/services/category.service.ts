import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../../../shared/model/state.model";
import {CategoryResponse, CreatedCategory, NewCategory} from "../model/category.model";
import {CreatedProduct} from "../model/product.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  http = inject(HttpClient);

  private create$: WritableSignal<State<CreatedCategory>> = signal(State.Builder<CreatedCategory>().forInit());
  private getAll$: WritableSignal<State<Array<CategoryResponse>>> = signal(State.Builder<Array<CategoryResponse>>().forInit());
  private getById$: WritableSignal<State<CategoryResponse>> = signal(State.Builder<CategoryResponse>().forInit());
  private update$: WritableSignal<State<CategoryResponse>> = signal(State.Builder<CategoryResponse>().forInit());
  private delete$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());

  createSig = computed(() => this.create$());
  getAllSig = computed(() => this.getAll$());
  getByIdSig = computed(() => this.getById$());
  updateSig = computed(() => this.update$());
  deleteSig = computed(() => this.delete$());

  /**
   * Create a new category.
   * @param newCategory - The data for the new category.
   */
  create(newCategory: NewCategory): void {
    this.http.post<CreatedCategory>(`${environment.API_URL}/categories`, newCategory).subscribe({
      next: (categoryId) => this.create$.set(State.Builder<CreatedCategory>().forSuccess(categoryId)),
      error: (err) => this.create$.set(State.Builder<CreatedCategory>().forError(err)),
    });
  }

  /**
   * Retrieve all categories.
   */
  getAllCategories(): void {
    this.http.get<Array<CategoryResponse>>(`${environment.API_URL}/categories`)
      .subscribe({
      next: categories => this.getAll$.set(State.Builder<Array<CategoryResponse>>().forSuccess(categories)),
        error: err => this.getAll$.set(State.Builder<Array<CategoryResponse>>().forError(err)),
    });
  }

  /**
   * Retrieve a category by its ID.
   * @param id - The ID of the category to fetch.
   */
  getCategoryById(id: number): void {
    this.http.get<CategoryResponse>(`${environment.API_URL}/categories/${id}`).subscribe({
      next: (category) => this.getById$.set(State.Builder<CategoryResponse>().forSuccess(category)),
      error: (err) => this.getById$.set(State.Builder<CategoryResponse>().forError(err)),
    });
  }

  /**
   * Update a category by ID.
   * @param id - The ID of the category to update.
   * @param updatedCategory - The updated category data.
   */
  updateCategory(id: number, updatedCategory: NewCategory): void {
    this.http.put<CategoryResponse>(`${environment.API_URL}/categories/${id}`, updatedCategory).subscribe({
      next: (category) => this.update$.set(State.Builder<CategoryResponse>().forSuccess(category)),
      error: (err) => this.update$.set(State.Builder<CategoryResponse>().forError(err)),
    });
  }

  /**
   * Delete a category by ID.
   * @param id - The ID of the category to delete.
   */
  deleteCategory(id: number): void {
    this.http.delete<void>(`${environment.API_URL}/categories/${id}`).subscribe({
      next: () => this.delete$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.delete$.set(State.Builder<void>().forError(err)),
    });
  }


  /**
   * Reset the signal for the creation operation.
   */
  resetCreateSignal(): void {
    this.create$.set(State.Builder<CreatedCategory>().forInit());
  }

  /**
   * Reset the signal for fetching all categories.
   */
  resetGetAllSignal(): void {
    this.getAll$.set(State.Builder<Array<CategoryResponse>>().forInit());
  }

  /**
   * Reset the signal for fetching a category by ID.
   */
  resetGetByIdSignal(): void {
    this.getById$.set(State.Builder<CategoryResponse>().forInit());
  }

  /**
   * Reset the signal for the update operation.
   */
  resetUpdateSignal(): void {
    this.update$.set(State.Builder<CategoryResponse>().forInit());
  }

  /**
   * Reset the signal for the delete operation.
   */
  resetDeleteSignal(): void {
    this.delete$.set(State.Builder<void>().forInit());
  }







  constructor() { }
}
