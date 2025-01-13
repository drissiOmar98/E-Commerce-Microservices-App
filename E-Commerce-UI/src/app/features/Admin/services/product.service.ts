import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../../../shared/model/state.model";
import {CardProduct, CreatedProduct, NewProduct, Product} from "../model/product.model";
import {environment} from "../../../../environments/environment";
import {createPaginationOption, Page, Pagination} from "../../../shared/model/request.model";
import {SubCategoryResponse} from "../model/subcategory.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  http = inject(HttpClient);

  private create$: WritableSignal<State<CreatedProduct>> = signal(State.Builder<CreatedProduct>().forInit());
  createSig = computed(() => this.create$());

  private getRelatedProducts$: WritableSignal<State<Page<CardProduct>>>
    = signal(State.Builder<Page<CardProduct>>().forInit());
  getRelatedProductsSig = computed(() => this.getRelatedProducts$());

  private getAllByCategory$: WritableSignal<State<Page<CardProduct>>>
    = signal(State.Builder<Page<CardProduct>>().forInit());
  getAllByCategorySig = computed(() => this.getAllByCategory$());

  private getProductById$: WritableSignal<State<Product>> = signal(State.Builder<Product>().forInit());
  getProductByIdSig = computed(()=> this.getProductById$());





  /**
   * Method to create a new Product with associated pictures.
   *
   * @param newProduct The new product data, including pictures.
   */
  create(newProduct: NewProduct): void {
    // Creating a FormData object to prepare the data for the HTTP request
    const formData = new FormData();

    // Loop through each picture and append it to the FormData
    for(let i = 0; i < newProduct.pictures.length; ++i) {
      formData.append("picture-" + i, newProduct.pictures[i].file);
    }
    // Clone the newProduct object to avoid mutating the original data
    const clone = structuredClone(newProduct);
    // Clear the pictures array from the clone since it's already appended
    clone.pictures = [];
    // Append the DTO as a JSON string to the FormData
    formData.append("productRequest", JSON.stringify(clone));
    this.http.post<CreatedProduct>(`${environment.API_URL}/products/create`,
      formData).subscribe({
      next: product => this.create$.set(State.Builder<CreatedProduct>().forSuccess(product)),
      error: err => this.create$.set(State.Builder<CreatedProduct>().forError(err)),
    });
  }

  /**
   * Method to reset the product creation state.
   */
  resetProductCreation(): void {
    this.create$.set(State.Builder<CreatedProduct>().forInit())
  }


  /**
   * Fetch products filtered by category ID (optional).
   * @param pageRequest - Pagination options.
   * @param categoryId - The optional category ID to filter by.
   */
  getAllByCategory(pageRequest: Pagination, categoryId: number | null): void {
    let params = createPaginationOption(pageRequest);

    if (categoryId !== null && categoryId !== undefined) {
      params = params.append('categoryId', categoryId.toString());
    }

    const url = `${environment.API_URL}/products/get-all-by-category`;

    console.log('Fetching from URL:', url, 'with params:', params);

    this.http.get<Page<CardProduct>>(url, { params })
      .subscribe({
        next: (products) => this.getAllByCategory$.set(State.Builder<Page<CardProduct>>().forSuccess(products)),
        error: (error) => {
          console.error('Error fetching products:', error);
          this.getAllByCategory$.set(State.Builder<Page<CardProduct>>().forError(error));
        }
      });
  }

  getRelatedProducts(pageRequest: Pagination, productId: number): void {
    this.http.get<Page<CardProduct>>(`${environment.API_URL}/products/${productId}/related`)
      .subscribe({
        next: (relatedProducts) => this.getRelatedProducts$.set(State.Builder<Page<CardProduct>>().forSuccess(relatedProducts)),
        error: (error) => {
          this.getRelatedProducts$.set(State.Builder<Page<CardProduct>>().forError(error));
        }
      });
  }



  getProductById(productId: number): void {
    this.http.get<Product>(`${environment.API_URL}/products/get-one/${productId}`)
      .subscribe({
        next: product => this.getProductById$.set(State.Builder<Product>().forSuccess(product)),
        error: err => this.getProductById$.set(State.Builder<Product>().forError(err)),
      });
  }

  /**
   * Reset the "get all products by category" state.
   */
  resetGetAllCategory(): void {
    this.getAllByCategory$.set(State.Builder<Page<CardProduct>>().forInit())
  }

  resetGetRelatedProducts():void{
    this.getRelatedProducts$.set(State.Builder<Page<CardProduct>>().forInit());
  }

  resetGetOneById(): void {
    this.getProductById$.set(State.Builder<Product>().forInit())
  }





  constructor() { }
}
