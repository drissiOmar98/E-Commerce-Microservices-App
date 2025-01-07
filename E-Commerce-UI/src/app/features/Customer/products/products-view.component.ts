import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import { Observable, of, filter } from 'rxjs';
import { Product } from './Product';
import { ProductsService } from './products.service';
import { SubscriptionContainer } from './SubscriptionContainer';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';

import {WishlistService} from "../../../shared/wishlist.service";
import {ToastService} from "../../Admin/services/toast.service";
import {ProductService} from "../../Admin/services/product.service";
import {CardProduct, CreatedProduct, NewProduct} from "../../Admin/model/product.model";
import {Pagination} from "../../../shared/model/request.model";
import {CartService} from "../services/cart.service";
import {State} from "../../../shared/model/state.model";
import {Cart, CartItemRequest} from "../model/cart.model";
import {NewProductPicture} from "../../Admin/model/picture.model";


@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent implements OnInit, OnDestroy {

  toastService = inject(ToastService);
  cartService= inject(CartService);
  productService= inject(ProductService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  products: Array<CardProduct> | undefined;
  pageRequest: Pagination = {size: 20, page: 0, sort: []};
  loading = false;
  emptySearch = false;
  loadingCreation = false;

  newItemForMyCart: CartItemRequest = this.initializeNewItemToMyCart();

  initializeNewItemToMyCart() : CartItemRequest {
    return {
      productId: null!,
      quantity: 0
    };
  }




  products$!: Observable<any>

  subs = new SubscriptionContainer();
  categories!: any;

  // Sorting
  sortOptions!: any[];
  sortKey!: string;
  sortField!: string;
  sortOrder!: number;

  // Ordering by price
  priceFrom!: number;
  priceTo!: number;
  rangeValues: number[] = [];

  highestPrice: number = 0;
  lowestPrice: number = 0;

  numberOfProducts!: number;
  isLoading = true;

  searchInput = '';
  categoriesFilter!: string;

  public items!: MenuItem[];
  home!: MenuItem;

  constructor(
    private _productService: ProductsService,
    private _messageService: MessageService,
    private _wishlistService: WishlistService,
    //private _cartService: CartService,
  ) {
    this.listenToGetAllByCategory();
    this.listenCartItemAddition();
    this.listenCartItemRemoval();
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { filters: any };
    const filters = state?.filters;
    if (filters) {
      this.categoriesFilter = filters;
    }
  }

  ngOnInit() {
    this.fetchProductsForCategory();
    // TODO: convert to data stream -> put in constructor
    this.subs.add(this._productService.getProducts("asc", this.categoriesFilter).subscribe((products: any) => {
      this.products$ = of(products.data.product);
      this.numberOfProducts = products.data.product.length;
      this.isLoading = false;

      const sortedPrices = [...products.data.product].sort((productA: any, productB: any) => (productA.price - productB.price))

      this.highestPrice = sortedPrices[0].price
      this.lowestPrice = sortedPrices.at(-1).price;
      this.rangeValues = [this.highestPrice, this.lowestPrice];

      products.data.product.forEach((product: Product) => {
        if (product.price > this.highestPrice) {
          this.highestPrice = product.price;
        }

        if (product.price < this.lowestPrice) {
          this.lowestPrice = product.price;
        }
      });
    }));

    this.subs.add(this._productService.getProductCategories().subscribe((categories: any) => {
      this.categories = categories.data.category;
      this.isLoading = false;
    }))

    // Breadcrumbs
    this.items = [
      { label: 'Products', routerLink: '/products/search' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/home' };

    this.sortOptions = [
      { label: 'Price: Low to High', value: 'asc' },
      { label: 'Price: High to Low', value: 'desc' },
    ];
  }

  // Search filtering
  onChanges(changes: any) {
    this.searchInput = changes;
    this.subs.add(this._productService.searchProducts(changes).subscribe((product: any) => {
      this.products$ = of(product.data.product);
    }))
  }

  trackByProductId(index: number, product: Product): number {
    return index;
  }

  applyFilters(filtersObject: any) {
    if (filtersObject) {
      this.subs.add(this._productService.getFilteredProducts(filtersObject).subscribe((product: any) => {
        this.products$ = of(product.data.product);
      }))
    }
  }

  getBySubcategory(selectedCategory: string) {
    this.subs.add(this._productService.getProductBySubcategory(selectedCategory).subscribe((products: any) => {
      this.products$ = of(products.data.product);
    }))
  }

  filterSubcategories(categories: string[]) {
    this.subs.add(this._productService.getProductsFromSubcategories(categories).subscribe((products: any) => {
      this.products$ = of(products.data.product)
    }))
  }

  addToWishList(product: Product) {
    this._wishlistService.addWishListItem(product);
  }

  removedFromWishList(product: Product) {
    this._wishlistService.removeWishListItem(product);
  }

  // For pagination
  loadData(event: any) {
    event.first = 3
    event.rows = 3;
  }





  openProductDetails(id: number) {
    this.router.navigate(['/product', id]);
  }

  handlePriceFilter(event: any) {
    this.priceFrom = event.values[0]
    this.priceTo = event.values[1]
    this.subs.add(this._productService.getProductsByPrice(this.priceFrom, this.priceTo).subscribe((products: any) => {
      this.products$ = of(products.data.product);
    }))
  }

  addToCart(product: CardProduct) {
    this.loadingCreation = true;
    const cartItemRequest: CartItemRequest = {
      productId: product.id,
      quantity: 1, // Default quantity
    };
    this.cartService.addItemToCart(cartItemRequest);

    //this.cartService.addItemToCart()
    //this._cartService.addToCart(product);
  }

  removeFromCart(product: CardProduct) {
    this.cartService.removeItemFromCart(product.id);
    //this._cartService.removeFromCart(product);
  }

  onPriceChange(event: any) {
    this.subs.add(this._productService.getProductsByPrice(this.rangeValues[0], this.rangeValues[1]).subscribe((products: any) => {
      this.products$ = of(products.data.product);
    }))
  }

  onSortChange(event: any) {
    this.subs.add(this._productService.getProducts(event.value).subscribe((product: any) => {
      this.products$ = of(product.data.product);
    }))

    // For pagination
    // let value = event.value;

    // if (value.indexOf('!') === 0) {
    //   this.sortOrder = -1;
    //   this.sortField = value.substring(1, value.length);
    // }
    // else {
    //   this.sortOrder = 1;
    //   this.sortField = value;
    // }
  }

  ngOnDestroy() {
    this.subs?.dispose()
    this.productService.resetGetAllCategory();
    this.cartService.resetAddItemState();
  }

  /**
   * Extracts the category ID from route parameters and invokes the service.
   */
  // private fetchProductsForCategory(): void {
  //   this.activatedRoute.queryParams.subscribe((params) => {
  //     const categoryId = params['categoryId'];
  //     if (categoryId) {
  //       const defaultPagination = { page: 0, size: 10 };
  //       this.productService.getAllByCategory(this.pageRequest, +categoryId);
  //       this.loading = true; // Set loading state while fetching
  //     } else {
  //       this.products = [];
  //       this.loading = false;
  //       this.emptySearch = true;
  //       this.toastService.send({
  //         severity: 'warn',
  //         detail: 'No category selected',
  //         summary: 'Warning',
  //       });
  //     }
  //   });
  // }
  /**
   * Extracts the category ID from route parameters and invokes the service.
   */
  private fetchProductsForCategory(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const categoryId = params['categoryId'];
      const defaultPagination = { page: 0, size: 10 }; // Set your default pagination values

      // Always call the service to fetch products, with or without categoryId
      this.productService.getAllByCategory(this.pageRequest, categoryId ? +categoryId : null);
      this.loading = true; // Set loading state while fetching

      if (!categoryId) {
        this.emptySearch = false; // Not an empty search, but fetching all products
      }
    });
  }



  private listenToGetAllByCategory() {
    effect(() => {
      const categoryProductsState = this.productService.getAllByCategorySig();
      if (categoryProductsState.status === "OK") {
        this.products = categoryProductsState.value?.content;
        console.log('Products:', this.products);
        this.loading = false;
        this.emptySearch = false;
      } else if (categoryProductsState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Error when fetching the products", summary: "Error",
        });
        this.loading = false;
        this.emptySearch = false;
      }
    });
  }

  listenCartItemAddition() {
    effect(() => {
      let addItemToCartState = this.cartService.addItemSig();
      if (addItemToCartState.status === "OK") {
        this.onCartItemAdditionOk(addItemToCartState);
      } else if (addItemToCartState.status === "ERROR") {
        this.onCartItemAdditionError();
      }
    });
  }
  private listenCartItemRemoval(): void {
    effect(() => {
      let removeItemFromCartState = this.cartService.removeItemSig(); // Track state for item removal
      if (removeItemFromCartState.status === 'OK') {
        this.onCartItemRemovalOk(removeItemFromCartState);
      } else if (removeItemFromCartState.status === 'ERROR') {
        this.onCartItemRemovalError();
      }
    });
  }


  onCartItemAdditionOk(addItemToCartState: State<Cart>) {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "success", summary: "Success", detail: "Product added successfully to your CART.",
    });
  }


  private onCartItemAdditionError() {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "error", summary: "Error", detail: "Couldn't add your product to your CART, please try again.",
    });
  }

  onCartItemRemovalOk(removeItemFromCartState: State<Cart>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.send({
      severity: 'info',
      summary: 'Removed',
      detail: 'Product removed successfully from your CART.',
    });
  }

  private onCartItemRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.send({
      severity: 'error',
      summary: 'Error',
      detail: "Couldn't remove the product from your CART, please try again.",
    });
  }



}
