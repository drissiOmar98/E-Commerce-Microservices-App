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
import {CardProduct} from "../model/product.model";
import {Pagination} from "../../../shared/model/request.model";



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
  products: Array<CardProduct> | undefined = [];  // Array to store the products
  pageRequest: Pagination = {size: 20, page: 0, sort: ["name", "ASC"]};
  loading = false;
  emptySearch = false;

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

  categoryOptions: SelectItem[] = [
    {
      label: 'Headphone',
      value: 'headphone',
    },
    {
      label: 'Wearable',
      value: 'wearable',
    },
    {
      label: 'Laptop',
      value: 'laptop',
    },
    {
      label: 'Smarthome',
      value: 'smarthome',
    },
    {
      label: 'Tablet',
      value: 'tablet',
    },
    {
      label: 'Mobile',
      value: 'mobile',
    },
    {
      label: 'Monitor',
      value: 'monitor',
    },
    {
      label: 'All',
      value: 'all',
    },
  ];

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
    {
      label: 'Sold High to Low',
      value: '!sold',
    },
    {
      label: 'Sold Low to High',
      value: 'sold',
    },
    {
      label: 'Revenue High to Low',
      value: '!revenue',
    },
    {
      label: 'Revenue Low to High',
      value: 'revenue',
    },
  ];

  selectedStatus: string = 'all';
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

  onSortChange(event: any) {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }

    this.applyFilters();
  }

  onStatusChange(event: any) {
    this.selectedStatus = event.value;

    this.applyFilters();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.value;

    this.applyFilters();
  }

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
      if (categoryProductsState.status === "OK") {
        this.products = categoryProductsState.value?.content;
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


}
