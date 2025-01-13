import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ProductsService } from '../../products.service';
import { MenuItem, MessageService } from 'primeng/api';
import { WishlistService } from 'src/app/shared/wishlist.service';
import {CardProduct, DisplayPicture, Product} from "../../../../Admin/model/product.model";
import {ToastService} from "../../../../Admin/services/toast.service";
import {ProductService} from "../../../../Admin/services/product.service";
import {map} from "rxjs";
import {Pagination} from "../../../../../shared/model/request.model";
import {Cart, CartItemRequest} from "../../../model/cart.model";
import {State} from "../../../../../shared/model/state.model";
import {FavouriteService} from "../../../services/favourite.service";
import {CartService} from "../../../services/cart.service";
import {favouriteRequest} from "../../../model/favourite.model";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit ,  OnDestroy {


  toastService = inject(ToastService);
  productService= inject(ProductService);
  cartService= inject(CartService);
  favouriteService= inject(FavouriteService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  loading = true;
  emptySearch = false;
  loadingCreation = false;
  relatedProducts: CardProduct[] = [];
  inWishlist: Map<number , boolean> = new Map();
  myProduct: Product | undefined;
  currentProductId!: number;

  pageRequest: Pagination = {size: 20, page: 0, sort: []};







  id!: number;

  selectedMonthlyPayment: any = { name: 12 }
  monthlyPaymentOptions: any[] = [
    { name: 12 },
    { name: 24 },
    { name: 36 },
  ];

  suggestedProducts!: any[];

  public items!: MenuItem[];
  home!: MenuItem;

  galleryResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  carouselResponsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  displayCustom!: boolean;

  activeIndex: number = 0;


  constructor(
    private _location: Location,
    private _productService: ProductsService,
  ) {
    this.listenToFetchProduct();
    this.listenToFetchRelatedProducts();
    this.listenCartItemAddition();
    this.listenCartItemRemoval();
    this.listenFavouriteItemAddition();
    this.listenFavouriteItemRemoval();
    this.listenCheckIfProductInWishList();
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { product: any };
  }

  ngOnInit() {
    this.extractIdParamFromRouter();
    // Breadcrumbs setup
    //this.setBreadcrumbItems();
    this.home = { icon: 'pi pi-home', routerLink: '/home' };
  }

  ngOnDestroy(): void {
    this.productService.resetGetOneById();
    this.productService.resetGetRelatedProducts();
    this.cartService.resetAddItemState();
    this.favouriteService.resetAddToFavouritesState();
    this.favouriteService.resetRemoveFromFavouritesState();
  }

  getNumVisible(): number {
    const width = window.innerWidth;
    if (width <= 560) return 1;
    if (width <= 768) return 2;
    return 3;
  }

  navigateBack() {
    this._location.back();
  }


  addProductToWishList(product: Product) {
    console.log("inWishList before action:", this.inWishlist.get(product.id));

    const cardProduct: CardProduct = {
      ...product,               // Spread the properties of Product
      cover: product.pictures.length > 0 ? product.pictures[0] : { file: '', fileContentType: '', isCover: false },  // Set the first picture or a default
    };
    if (this.inWishlist.get(product.id)) {
      this.removedFromWishList(cardProduct);
      this.favouriteService.getIsProductInWishListSignal(product.id).set(State.Builder<boolean>().forSuccess(false)); // Update inCart status directly
    } else {
      this.addToWishList(cardProduct);
      this.favouriteService.getIsProductInWishListSignal(product.id).set(State.Builder<boolean>().forSuccess(true)); // Update inCart status directly
    }
  }




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



  // Move to service
  // openProductDetails(id: number) {
  //   const product = {
  //     name: this.product.name,
  //     description: this.product.description,
  //     subcategory: this.product.subcategory,
  //     images: this.product.images,
  //     EAN: this.product.EAN,
  //     id,
  //     inStock: this.product.inStock,
  //     price: this.product.price
  //   }
  //
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       product
  //     }
  //   }
  //   this.router.navigate(['/product', id], navigationExtras);
  // }


  getInstallmentPayAmount(price: number, months: number): number {
    if (!months || months <= 0) {
      return 0; // Return 0 for invalid input
    }
    return Math.round(price / months);
  }

  setBreadcrumbItems() {
    this.items = [
      { label: 'Products', routerLink: '/customer/products/search' },
      { label: `${this.myProduct?.name}`, routerLink: `/customer/products/product/${this.myProduct?.id}` }
    ];
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }



  replaceProduct(newProductId: number): void {
    console.log('Replacing product with ID:', newProductId);
    this.fetchProductDetails(newProductId);
    this.fetchRelatedProducts(newProductId);
  }

  buyProduct(product: Product) {
    //this._cartService.addToCart(product);
    this.router.navigate(['/cart'])
  }

  imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }

  protected readonly scrollY = scrollY;





  private extractIdParamFromRouter() {
    this.activatedRoute.paramMap.pipe(
      map(params => params.get('id')),
      map(id => id ? +id : null)
    ).subscribe({
      next: productId => {
        if (productId !== null) {
          this.currentProductId=productId;
          this.fetchProductDetails(productId);
          this.checkProductInWishlist(productId);
          this.fetchRelatedProducts(productId);
        } else {
          this.toastService.send({
            severity: "error",
            detail: "Invalid product ID",
          });
        }
      },
      error: () => {
        this.toastService.send({
          severity: "error",
          detail: "Error extracting product ID",
        });
      }
    });
  }

  private fetchProductDetails(productId: number) {
    this.loading = true;
    this.currentProductId=productId;
    this.productService.getProductById(productId);
  }

  private fetchRelatedProducts(productId: number): void {
    this.productService.getRelatedProducts(this.pageRequest, productId);
  }

  private checkProductInWishlist(productId: number): void {
    console.log("Checking if this product is in Favourite List:", productId);
    this.favouriteService.checkProductInWishList(productId);
  }


  getButtonLikeCLass(productId: number): string{
    const isInWishList: boolean|undefined= this.inWishlist.get(productId);
    return isInWishList ? 'pi pi-heart-fill wishlist' : 'pi pi-heart';
  }




  private listenToFetchProduct() {
    effect(() => {
      const productByIdState = this.productService.getProductByIdSig();
      if (productByIdState.status === "OK") {
        this.loading = false;
        this.myProduct = productByIdState.value;
        console.log('Products Details:', this.myProduct);
        if (this.myProduct) {
          this.myProduct.pictures = this.putCoverPictureFirst(this.myProduct.pictures);
          this.setBreadcrumbItems();
        }
        // Handle errors encountered during the fetch
      } else if (productByIdState.status === "ERROR") {
        this.loading = false;
        this.toastService.send({
          severity: "error", detail: "Error when fetching the product",
        });
      }
    });
  }

  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    const coverIndex = pictures.findIndex(picture => picture.isCover);
    if (coverIndex) {
      const cover = pictures[coverIndex];
      pictures.splice(coverIndex, 1);
      pictures.unshift(cover);
    }
    return pictures;
  }

  private listenToFetchRelatedProducts() {
    effect(() => {
      const relatedProductsState = this.productService.getRelatedProductsSig();
      if (relatedProductsState.status === "OK") {
        this.relatedProducts = relatedProductsState.value?.content || [];
        this.loading = false;
        this.emptySearch = false;
      } else if (relatedProductsState.status === "ERROR") {
        this.toastService.send({
          severity: "error", detail: "Error when fetching the related products", summary: "Error",
        });
        this.loading = false;
        this.emptySearch = false;
      }
    });
  }

  private listenCheckIfProductInWishList(): void {

    effect(() => {
      const itemStateSignal = this.favouriteService.getIsProductInWishListSignal(this.currentProductId);
      const state = itemStateSignal();

      if (state.status === "OK") {
        this.inWishlist.set(this.currentProductId, state.value ?? false);
        console.log("Product in wishlist:",this.currentProductId, state.value);
      } else if (state.status === "ERROR") {
        this.toastService.send({
          severity: "error",
          summary: "Error",
          detail: "Failed to check product status",
        });
        console.error("Error fetching product in wishlist state");
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











}
