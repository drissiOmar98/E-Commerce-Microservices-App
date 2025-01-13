import {Component, effect, EventEmitter, inject, Inject, input, Input, OnInit, Output} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product, Subcategory, Category } from '../Product';
import { WishlistService } from 'src/app/shared/wishlist.service';
import {CardProduct, DisplayPicture} from "../../../Admin/model/product.model";
import {State} from "../../../../shared/model/state.model";
import {Cart, CartItemRequest} from "../../model/cart.model";
import {ToastService} from "../../../Admin/services/toast.service";
import {CartService} from "../../services/cart.service";
import {FavouriteService} from "../../services/favourite.service";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  toastService = inject(ToastService);
  favouriteService = inject(FavouriteService);
  inCart: Map<number, boolean> = new Map();
  inWishlist: Map<number , boolean> = new Map();
  //cartService = Inject(CartService);
  loadingCreation = false;

  @Input() isListView!: boolean;
  @Input() wishlistView?: boolean;


  @Output() addedToWishList = new EventEmitter();
  @Output() removedFromWishList = new EventEmitter();
  @Output() addedToCart = new EventEmitter<CardProduct>();
  @Output() removedFromCart = new EventEmitter<CardProduct>();
  @Output() replaceCurrentProduct = new EventEmitter<number>();

  productX = input.required<CardProduct>();

  public product!: Product;







  constructor(
    private _messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService,
  ) {
    this.listenCheckIfProductInCart();
    this.listenCheckIfProductInWishList();
  }

  ngOnInit() {
    this.checkProductInCart(this.productX().id);
    this.checkProductInWishlist(this.productX().id)
  }

  addRemoveItemWishlist(product: CardProduct) {
    console.log("inWishList before action:", this.inWishlist.get(product.id));
    if (this.inWishlist.get(product.id)) {
      this.removedFromWishList.emit(product); // Emit event for removal
      this.favouriteService.getIsProductInWishListSignal(product.id).set(State.Builder<boolean>().forSuccess(false)); // Update inCart status directly
    } else {
      this.addedToWishList.emit(product); // Emit event for addition
      this.favouriteService.getIsProductInWishListSignal(product.id).set(State.Builder<boolean>().forSuccess(true)); // Update inCart status directly
    }
    console.log("inCart after action:", this.inCart.get(product.id));
  }


  addRemoveCartItem(product: CardProduct): void {
    console.log("inCart before action:", this.inCart.get(product.id));

    if (this.inCart.get(product.id)) {
      this.removedFromCart.emit(product); // Emit event for removal
      this.cartService.getIsProductInCartSignal(product.id).set(State.Builder<boolean>().forSuccess(false)); // Update inCart status directly
    } else {
      this.addedToCart.emit(product); // Emit event for addition
      this.cartService.getIsProductInCartSignal(product.id).set(State.Builder<boolean>().forSuccess(true)); // Update inCart status directly
    }

    console.log("inCart after action:", this.inCart.get(product.id));
  }


  // In your template, update inCart button classes based on the product's inCart state
  getButtonClass(productId: number): string {
    const isInCart = this.inCart.get(productId); // Fetch the `inCart` status of the product
    return isInCart ? 'p-button-rounded p-button-primary' : 'p-button-rounded p-button-outlined'; // Set the appropriate button class
  }

  getButtonLikeCLass(productId: number): string{
    const isInWishList: boolean|undefined= this.inWishlist.get(productId);
    return isInWishList ? 'pi pi-heart-fill wishlist' : 'pi pi-heart';
  }




  openProductDetails(id: number) {
    console.log('Navigating to Product ID:', id);

    // Resolve full current URL path
    const currentPath = this.router.url;
    console.log('Full Current Path:', currentPath);

    const updatedProduct = this.productX();
    const navigationExtras: NavigationExtras = {
      state: {
        product: updatedProduct,
      },
    };

    if (currentPath.includes('/search')) {
      console.log('Navigating from a search route.');
      this.router.navigate(['/customer/products/product', id], navigationExtras)
        .then(() => console.log('Navigation to product details successful.'))
        .catch(err => console.error('Navigation failed:', err));
    } else {
      console.log('Updating current product state.');
      this.replaceCurrentProduct.emit(id);
      // Navigate to the new product details page
      this.router.navigate(['/customer/products/product', id], navigationExtras)
        .then(() => console.log('Navigation to new product successful.'))
        .catch(err => console.error('Navigation failed:', err));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }



  getInstallmentPayAmount(price: number) {
    return Math.floor(price / 12);
  }



  // checkIfProductInCart(product: CardProduct): void {
  //   this.cartService.isProductInCart(product.id);
  // }
  private checkProductInCart(productId: number): void {
    console.log("Checking if product is in cart:", productId);
    this.cartService.checkProductInCart(productId);
  }
  private checkProductInWishlist(productId: number): void {
    console.log("Checking if product is in Favourite List:", productId);
    this.favouriteService.checkProductInWishList(productId);
  }



  private listenCheckIfProductInCart(): void {
    effect(() => {
      const productStateSignal = this.cartService.getIsProductInCartSignal(this.productX().id);
      const state = productStateSignal();  // Get the current state of the product

      if (state.status === "OK") {
        // Update the product inCart status immediately
        this.inCart.set(this.productX().id, state.value ?? false);  // Update the map with inCart status
        console.log("Product in cart:", this.productX().id, state.value);
      } else if (state.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Failed to check product status",
        });
        console.error("Error fetching product in cart state");
      }
    });
  }
  private listenCheckIfProductInWishList(): void {
    effect(() => {
      const itemStateSignal = this.favouriteService.getIsProductInWishListSignal(this.productX().id);
      const state = itemStateSignal();  // Get the current state of the product

      if (state.status === "OK") {
        // Update the product inCart status immediately
        this.inWishlist.set(this.productX().id, state.value ?? false);  // Update the map with inWishList status
        console.log("Product in wishList:", this.productX().id, state.value);
      } else if (state.status === "ERROR") {
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Failed to check product status",
        });
        console.error("Error fetching product in wishlist state");
      }
    });
  }





  private listenCartItemAddition() {
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
      severity: 'success',
      summary: 'Success',
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
