import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';

import {FormControl, FormGroup} from "@angular/forms";
import {Table} from "primeng/table";
import {SelectItem} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import { DataView } from 'primeng/dataview';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {AddproductComponent} from "./addproduct/addproduct.component";
import {ToastService} from "../services/toast.service";
import {ProductService} from "../services/product.service";
import {CardProduct, SearchQuery} from "../model/product.model";
import {Page, Pagination} from "../../../shared/model/request.model";
import {Subscription} from "rxjs";



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit , OnDestroy  {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  productService= inject(ProductService);
  fullProductList: Array<CardProduct> = [];  // Store all products, unfiltered
  products: Array<CardProduct> | undefined = [];  // Array to store the products
  productsResults: Page<CardProduct> | undefined = undefined;  // For search results as Page structure
  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};
  loading = false;
  emptySearch = false;


  public query = "";
  searchPage: Pagination = { page: 0, size: 20, sort: ["name", "ASC"] }
  loadingSearch = true;
  searchSubscription: Subscription | undefined;

  // Global array to keep track of all distinct categories
  private allCategories: Set<number> = new Set();
  private categoryMap: Map<number, string> = new Map(); // To store categoryId and name pairs


  ref: DynamicDialogRef | undefined;

  products$:   any;
  filteredproducts$:  any;
  dialogService = inject(DialogService);

  viewForm!: FormGroup;

  viewOptions: any[] = [
    {
      icon: 'pi pi-align-justify',
      view: 'table',
    },
    {
      icon: 'pi pi-th-large',
      view: 'grid',
    },
  ];

  statusOptions: SelectItem[] = [
    {
      label: 'Instock',
      value: 'instock',
    },
    {
      label: 'Low Stock',
      value: 'lowstock',
    },
    {
      label: 'Out of Stock',
      value: 'outofstock',
    },
    {
      label: 'All',
      value: 'all',
    },
  ];

  categoryOptions: any[] = []; // For storing category options dynamically

  sortOptions: SelectItem[] = [
    {
      label: 'Price High to Low',
      value: '!salePrice',
    },
    {
      label: 'Price Low to High',
      value: 'salePrice',
    },
    {
      label: 'Alphabet A to Z',
      value: 'name',
    },
    {
      label: 'Alphabet Z to A',
      value: '!name',
    },
    {
      label: 'Quantity High to Low',
      value: '!quantity',
    },
    {
      label: 'Quantity Low to High',
      value: 'quantity',
    },
  ];

  selectedStatus: string = 'all';
  selectedSort: string = 'salePrice';
  selectedCategory: string = 'all';
  sortOrder: number = 0;
  sortField: string = '';

  constructor(
    //private store: Store<any>,
    //private messageService: MessageService,
    //private toastService: ToastService
  ) {
    this.listenToGetAllByCategory();
    /*this.store.select(selectProducts).subscribe((x) => {
      this.products$ = x.products;
      this.filteredproducts$ = this.products$;
    });*/
    // this.products$ = this.store
    //   .select(selectProducts)
    //   .pipe(map((state) => state.products || []));
    this.viewForm = new FormGroup({
      value: new FormControl('table'),
    });
  }

  switchView() {
    this.filteredproducts$ = this.products$;
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  addProduct(): void {
    this.router.navigate(['/products/addproduct']);
  }

  onFilter(dv: DataView, event: Event) {
    //dv.filter((event.target as HTMLInputElement).value);
  }

  onTableFilter(table: Table, event: Event) {
    table.filter((event.target as HTMLInputElement).value, 'name', 'contains');
  }

  // onStatusFilter(table: Table, event: any) {
  //   table.filter((event.target as HTMLInputElement).value, 'status', 'contains');
  // }

  // onSortChange(event: any) {
  //   const value = event.value;
  //
  //   if (value.indexOf('!') === 0) {
  //     this.sortOrder = -1;
  //     this.sortField = value.substring(1, value.length);
  //   } else {
  //     this.sortOrder = 1;
  //     this.sortField = value;
  //   }
  //
  //   this.applyFilters();
  // }

  // onStatusChange(event: any) {
  //   this.selectedStatus = event.value;
  //
  //   this.applyFilters();
  // }

  // onCategoryChange(event: any) {
  //   this.selectedCategory = event.value;
  //
  //   this.applyFilters();
  // }

  applyFilters() {
    this.filteredproducts$ = this.products$;

    if (this.selectedStatus != 'all') {
      this.filteredproducts$ = this.filteredproducts$.filter(
        (product: any) => product.inventoryStatus === this.selectedStatus
      );
    }

    if (this.selectedCategory != 'all') {
      this.filteredproducts$ = this.filteredproducts$.filter(
        (product: any) => product.category === this.selectedCategory
      );
    }

    if (this.sortField) {
      this.filteredproducts$ = [...this.filteredproducts$].sort(
        (a: any, b: any) => {
          let result = 0;

          if (this.sortField === 'name') {
            result = a['name'].localeCompare(b['name']);
          } else if (this.sortField === 'salePrice') {
            if (a['salePrice'] < b['salePrice']) {
              result = -1;
            } else if (a['salePrice'] > b['salePrice']) {
              result = 1;
            }
          } else if (this.sortField === 'quantity') {
            if (a['quantity'] < b['quantity']) {
              result = -1;
            } else if (a['quantity'] > b['quantity']) {
              result = 1;
            }
          } else if (this.sortField === 'sold') {
            if (a['sold'] < b['sold']) {
              result = -1;
            } else if (a['sold'] > b['sold']) {
              result = 1;
            }
          } else {
            if (a['revenue'] < b['revenue']) {
              result = -1;
            } else if (a['revenue'] > b['revenue']) {
              result = 1;
            }
          }

          return result * this.sortOrder;
        }
      );
    }
  }

  ngOnInit() {
    this.fetchProductsForCategory();
    this.initSearchResultListener();
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as {
      message: string;
      severity: string;
    };
    if (state) {
      /*this.messageService.add({
        severity: state.severity,
        summary: 'Confirmation',
        detail: state.message,
      });*/
      console.log('message added');
    }
  }
  ngOnDestroy() {
    this.productService.resetGetAllCategory();
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }


  openNew() {

  }

  addNewProduct() {
    this.ref = this.dialogService.open(AddproductComponent,
      {
        width: "60%",
        header: "Add New Product",
        closable: true,
        focusOnShow: true,
        modal: true,
        showHeader: true,
        dismissableMask: true
      })
  }

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
      if (categoryProductsState.status === 'OK') {
        this.fullProductList = categoryProductsState.value?.content || [];  // Save unfiltered products list
        this.products = [...this.fullProductList];  // Initially, assign the full product list to products
        this.filterAndSortProducts();  // Apply all filters and sorting
        this.extractCategories(this.products); // Extract categories dynamically
        this.loading = false;
        this.emptySearch = false;
      } else if (categoryProductsState.status === 'ERROR') {
        this.toastService.send({
          severity: 'error',
          detail: 'Error when fetching the products',
          summary: 'Error',
        });
        this.loading = false;
        this.emptySearch = false;
      }
    });
  }




  initSearchResultListener(): void {
    this.searchSubscription = this.productService.searchResult
      .subscribe(productsState => {
        if (productsState.status === "OK" && productsState.value) {
          this.productsResults = productsState.value;  // Full Page structure (with content, metadata)
          this.products = productsState.value.content; // Extract the product list directly here
        } else if (productsState.status === "ERROR") {
          this.toastService.send({
            severity: 'error',
            summary: 'Error',
            detail: "Error occured when fetching search result, please try again",
          });
        }
        this.loadingSearch = false;
      });
    const searchQuery: SearchQuery = {
      query: "",
      page: this.searchPage
    }
    this.productService.search(searchQuery);
  }

  // Search filtering
  onQueryChange(newQuery: string): void {
    this.loadingSearch = true;
    const searchQuery: SearchQuery = {
      query: newQuery,
      page: this.searchPage,
    }
    this.productService.search(searchQuery);
  }

  // Extract categories dynamically from the products
  private extractCategories(products: CardProduct[]): void {
    const categorySet = new Set<number>(); // Set to avoid duplicates

    // Loop through products to extract distinct categories
    products.forEach(product => {
      categorySet.add(product.categoryId);
      this.categoryMap.set(product.categoryId, product.categoryName); // map categoryId to categoryName
    });

    // Update global set to keep track of all categories
    categorySet.forEach(categoryId => {
      this.allCategories.add(categoryId); // Add unique categoryIds to the global set
    });

    // Add the "All" option to the dropdown
    this.categoryOptions = [{ label: 'All', value: null }];

    // Add the categories to the options based on the categoryMap
    this.allCategories.forEach(categoryId => {
      this.categoryOptions.push({
        label: this.categoryMap.get(categoryId) || 'Unknown Category', // Get the name of the category
        value: categoryId, // Use categoryId as value
      });
    });
  }

  private filterProductsByStatus(products: CardProduct[]): CardProduct[] {
    if (this.selectedStatus === 'all') {
      return [...products];  // No filter, return the same list
    }

    return products.filter(product => {
      if (this.selectedStatus === 'instock') {
        return product.availableQuantity > 5;
      }
      if (this.selectedStatus === 'lowstock') {
        return product.availableQuantity > 0 && product.availableQuantity <= 5;
      }
      if (this.selectedStatus === 'outofstock') {
        return product.availableQuantity <= 0;
      }
      return true;
    });
  }
  private sortProducts(products: CardProduct[]): CardProduct[] {
    if (this.selectedSort === '!salePrice') {
      return [...products].sort((a, b) => b.price - a.price); // Price High to Low
    } else if (this.selectedSort === 'salePrice') {
      return [...products].sort((a, b) => a.price - b.price); // Price Low to High
    } else if (this.selectedSort === 'name') {
      return [...products].sort((a, b) => a.name.localeCompare(b.name)); // Alphabet A-Z
    } else if (this.selectedSort === '!name') {
      return [...products].sort((a, b) => b.name.localeCompare(a.name)); // Alphabet Z-A
    } else if (this.selectedSort === '!quantity') {
      return [...products].sort((a, b) => b.availableQuantity - a.availableQuantity); // Quantity High to Low
    } else if (this.selectedSort === 'quantity') {
      return [...products].sort((a, b) => a.availableQuantity - b.availableQuantity); // Quantity Low to High
    }
    return [...products]; // Default, no sorting applied
  }

  private filterByCategory(products: CardProduct[]): CardProduct[] {
    const selectedCategoryId = +this.selectedCategory; // Ensure it's a number

    if (selectedCategoryId === null || isNaN(selectedCategoryId)) {
      return [...products]; // No category filter applied
    } else {
      return products.filter(product => product.categoryId === selectedCategoryId); // Apply category filter
    }
  }
  private filterAndSortProducts() {
    let filteredAndSortedProducts = [...this.fullProductList]; // Start with the full list

    // Apply all the filters in sequence
    filteredAndSortedProducts = this.filterProductsByStatus(filteredAndSortedProducts);
    filteredAndSortedProducts = this.filterByCategory(filteredAndSortedProducts);
    filteredAndSortedProducts = this.sortProducts(filteredAndSortedProducts);

    // Set the result to `this.products`
    this.products = filteredAndSortedProducts;
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.value; // Update selected status
    this.filterAndSortProducts();      // Apply all filters and sorting
  }

  onSortChange(event: any) {
    this.selectedSort = event.value;   // Update selected sort option
    this.filterAndSortProducts();      // Apply all filters and sorting
  }

  onCategoryChange(event: any): void {
    const selectedCategoryId = event.value;

    // Fetch products for the selected category
    this.productService.getAllByCategory(this.pageRequest, selectedCategoryId);

    this.loading = true;
  }



















}
