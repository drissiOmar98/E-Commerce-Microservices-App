import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {Observable, of, Subject, debounceTime, BehaviorSubject} from 'rxjs';
import { Product } from './Product';
import { ProductsService } from './products.service';
import { SubscriptionContainer } from './SubscriptionContainer';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import {ToastService} from "../../Admin/services/toast.service";
import {ProductService} from "../../Admin/services/product.service";
import {CardProduct} from "../../Admin/model/product.model";
import {Pagination} from "../../../shared/model/request.model";
import {CartService} from "../services/cart.service";
import {State} from "../../../shared/model/state.model";
import {Cart, CartItemRequest} from "../model/cart.model";
import {FavouriteService} from "../services/favourite.service";
import {favouriteRequest} from "../model/favourite.model";


@Component({
  selector: 'app-products-view',
  templateUrl: './products-view.component.html',
  styleUrls: ['./products-view.component.scss'],
})
export class ProductsViewComponent implements OnInit, OnDestroy {

  toastService = inject(ToastService);
  cartService= inject(CartService);
  productService= inject(ProductService);
  favouriteService= inject(FavouriteService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  products: Array<CardProduct> | undefined;
  pageRequest: Pagination = {size: 20, page: 0, sort: []};
  loading = false;
  emptySearch = false;
  loadingCreation = false;

  private priceChange$ = new Subject<void>();

  newItemForMyCart: CartItemRequest = this.initializeNewItemToMyCart();

  initializeNewItemToMyCart() : CartItemRequest {
    return {
      productId: null!,
      quantity: 0
    };
  }

  private priceFilterSubject = new Subject<[number, number]>(); // Subject for price filter changes
  private priceFilterSubscription: any;
  private filteredProductsState$ = new BehaviorSubject<any>(null);





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
  //rangeValues: number[] = [];
  rangeValues: [number, number] = [0, 0]; // Default values for initial state


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
  ) {
    this.listenToGetAllByCategory();
    this.listenToFilterProductsByPrice();
    this.listenCartItemAddition();
    this.listenCartItemRemoval();
    this.listenFavouriteItemAddition();
    this.listenFavouriteItemRemoval();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { filters: any };
    const filters = state?.filters;
    if (filters) {
      this.categoriesFilter = filters;
    }
  }

  ngOnInit() {
    this.fetchProductsForCategory();
    this.initializePriceFilterListener();
    // TODO: convert to data stream -> put in constructor
    // this.subs.add(this._productService.getProducts("asc", this.categoriesFilter).subscribe((products: any) => {
    //   this.products$ = of(products.data.product);
    //   this.numberOfProducts = products.data.product.length;
    //   this.isLoading = false;
    //
    //   const sortedPrices = [...products.data.product].sort((productA: any, productB: any) => (productA.price - productB.price))
    //
    //   this.highestPrice = sortedPrices[0].price
    //   this.lowestPrice = sortedPrices.at(-1).price;
    //   this.rangeValues = [this.highestPrice, this.lowestPrice];
    //
    //   products.data.product.forEach((product: Product) => {
    //     if (product.price > this.highestPrice) {
    //       this.highestPrice = product.price;
    //     }
    //
    //     if (product.price < this.lowestPrice) {
    //       this.lowestPrice = product.price;
    //     }
    //   });
    // }));

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

  addToWishList(product: CardProduct) {
    this.loadingCreation = true;
    const favRequest: favouriteRequest = {
      productId: product.id,
    };
    this.favouriteService.addToFavourites(favRequest);
  }

  removedFromWishList(product: CardProduct) {
    this.favouriteService.removeFromFavourites(product.id);
  }

  // For pagination
  loadData(event: any) {
    event.first = 3
    event.rows = 3;
  }





  openProductDetails(id: number) {
    this.router.navigate(['/product', id]);
  }

  // handlePriceFilter(event: any) {
  //   this.priceFrom = event.values[0]
  //   this.priceTo = event.values[1]
  //   this.subs.add(this._productService.getProductsByPrice(this.priceFrom, this.priceTo).subscribe((products: any) => {
  //     this.products$ = of(products.data.product);
  //   }))
  // }

  addToCart(product: CardProduct) {
    this.loadingCreation = true;
    const cartItemRequest: CartItemRequest = {
      productId: product.id,
      quantity: 1, // Default quantity
    };
    this.cartService.addItemToCart(cartItemRequest);
  }

  removeFromCart(product: CardProduct) {
    this.cartService.removeItemFromCart(product.id);
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
    this.productService.resetGetProductsByPrice();
    this.cartService.resetAddItemState();
    this.favouriteService.resetAddToFavouritesState();
    this.favouriteService.resetRemoveFromFavouritesState();
    if (this.priceFilterSubscription) {
      this.priceFilterSubscription.unsubscribe();
    }
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
        // Calculate price range if products exist
        if (this.products && this.products.length > 0) {
          this.calculatePriceRange(this.products);
        }
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
  /**
   * Listens to price filter state changes and updates the product list accordingly.
   */

  // private listenToFilterProductsByPrice(): void {
  //   effect(() => {
  //     const filterProductsByPriceState = this.productService.filterProductsByPriceRangeSig();
  //
  //     if (filterProductsByPriceState.status === 'OK') {
  //       this.products = filterProductsByPriceState.value?.content || [];
  //       console.log('Filtered Products:', this.products);
  //
  //       this.isLoading = false;
  //       this.emptySearch = this.products.length === 0;
  //     } else if (filterProductsByPriceState.status === 'ERROR') {
  //       this.toastService.send({
  //         severity: 'error',
  //         detail: 'Error fetching products by price range',
  //         summary: 'Error',
  //       });
  //
  //       this.isLoading = false;
  //       this.emptySearch = true;
  //     }
  //   });
  // }

  private listenToFilterProductsByPrice(): void {
    // Watch for signal updates and push to BehaviorSubject
    effect(() => {
      const filterProductsByPriceState = this.productService.filterProductsByPriceRangeSig();
      this.filteredProductsState$.next(filterProductsByPriceState);
    });

    // Handle debounced state updates
    this.filteredProductsState$
      .pipe(debounceTime(300)) // Debounce state processing
      .subscribe((state) => {
        if (!state) return;

        if (state.status === 'OK') {
          this.products = state.value?.content || [];
          this.isLoading = false;
          this.emptySearch = this.products?.length === 0;
        } else if (state.status === 'ERROR') {
          this.toastService.send({
            severity: 'error',
            detail: 'Error fetching products by price range',
            summary: 'Error',
          });
          this.isLoading = false;
          this.emptySearch = true;
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

  listenFavouriteItemAddition() {
    effect(() => {
      let addItemToFavouriteState = this.favouriteService.addToFavouritesSig();
      if (addItemToFavouriteState.status === "OK") {
        this.onWishlistAdditionOk(addItemToFavouriteState);
      } else if (addItemToFavouriteState.status === "ERROR") {
        this.onWishlistAdditionError();
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

  private listenFavouriteItemRemoval(): void {
    effect(() => {
      let removeItemFromFavouriteState = this.favouriteService.removeFromFavouritesSig(); // Track state for item removal
      if (removeItemFromFavouriteState.status === 'OK') {
        this.onFavouriteItemRemovalOk(removeItemFromFavouriteState);
      } else if (removeItemFromFavouriteState.status === 'ERROR') {
        this.onFavouriteItemRemovalError();
      }
    });
  }


  onCartItemAdditionOk(addItemToCartState: State<Cart>) {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "success", summary: "Success", detail: "Product added successfully to your CART.",
    });
  }

  onWishlistAdditionOk(state: State<void>) {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "success",
      summary: "Success",
      detail: "Product added successfully to your wishlist.",
    });
  }

  onWishlistAdditionError() {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "error",
      summary: "Error",
      detail: `Failed to add product to wishlist`,
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
  onFavouriteItemRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.send({
      severity: 'info',
      summary: 'Removed',
      detail: 'Product removed successfully from your WishList.',
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

  private onFavouriteItemRemovalError(): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.send({
      severity: 'error',
      summary: 'Error',
      detail: "Couldn't remove the product from your WishList, please try again.",
    });
  }



  /**
   * Calculates the lowest and highest prices from the product list and updates the range values.
   * @param products - Array of products to compute the price range from.
   */
  // private calculatePriceRange(products: Array<CardProduct>): void {
  //   const sortedPrices = [...products].sort((a, b) => a.price - b.price);
  //
  //   this.lowestPrice = sortedPrices[0].price;
  //   this.highestPrice = sortedPrices[sortedPrices.length - 1].price;
  //   this.rangeValues = [this.lowestPrice, this.highestPrice];
  //
  //   console.log('Price Range:', { lowestPrice: this.lowestPrice, highestPrice: this.highestPrice });
  // }
  private calculatePriceRange(products: Array<CardProduct>): void {
    if (products.length > 0) {
      const sortedPrices = [...products].sort((a, b) => a.price - b.price);

      this.lowestPrice = sortedPrices[0].price;
      this.highestPrice = sortedPrices[sortedPrices.length - 1].price;

      // Ensure it always sets the tuple `[number, number]`
      this.rangeValues = [this.lowestPrice, this.highestPrice];

      console.log('Price Range:', { lowestPrice: this.lowestPrice, highestPrice: this.highestPrice });
    } else {
      // Handle empty product list if needed
      console.log("No products available to calculate the price range.");
    }
  }


  // private handlePriceFilter(): void {
  //   const [minPrice, maxPrice] = this.rangeValues;         // Extract range values
  //   this.productService.filterProductsByPriceRange(minPrice, maxPrice, this.pageRequest);
  //   this.isLoading = true;  // Optionally show a loading spinner
  // }
  //
  // public onPriceFilterChange(): void {
  //   this.handlePriceFilter();
  // }


  // Listen to changes and debounce filter calls
  private initializePriceFilterListener(): void {
    this.priceFilterSubscription = this.priceFilterSubject
      .pipe(debounceTime(300)) // Wait for 300ms of inactivity
      .subscribe(([minPrice, maxPrice]) => {
        this.isLoading = true; // Start loading
        this.productService.filterProductsByPriceRange(minPrice, maxPrice, this.pageRequest);
      });
  }



  public onPriceFilterChange(): void {
    this.priceFilterSubject.next([...this.rangeValues]); // Emit updated range values
  }







}
