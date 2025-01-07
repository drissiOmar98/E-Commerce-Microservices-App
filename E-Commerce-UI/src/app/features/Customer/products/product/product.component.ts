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


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  toastService = inject(ToastService);

  inCart: Map<number, boolean> = new Map();
  //cartService = Inject(CartService);
  loadingCreation = false;
  @Input() name!: string;
  @Input() description!: string;
  @Input() subcategory!: string;
  @Input() categoryDescription!: string;
  @Input() category!: string;
  @Input() categoryId!: number;
  @Input() subcategoryId!: number;
  @Input() cover!: DisplayPicture;
  @Input() id!: number;
  @Input() inStock!: number;
  @Input() price!: number;
  @Input() isListView!: boolean;
  @Input() wishlistView?: boolean;


  @Output() addedToWishList = new EventEmitter();
  @Output() removedFromWishList = new EventEmitter();
  @Output() addedToCart = new EventEmitter<CardProduct>();
  @Output() removedFromCart = new EventEmitter<CardProduct>();
  @Output() replaceCurrentProduct = new EventEmitter<number>();

  productX = input.required<CardProduct>();


  inWishlist!: boolean;
  //inCart!: boolean;
  public product!: Product;

  //inCart!: boolean;

  cardProduct: CardProduct | undefined;





  constructor(
    private _messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private _wishlistService: WishlistService,
    private cartService: CartService,
  ) {
    this.listenCheckIfProductInCart();
    //this.listenCartItemAddition();
    //this.listenCartItemRemoval();
    //this.inCart=this.checkIfProductInCart(this.productX())
    //this.inWishlist = this.checkInWishlist(this.id);
    //this.inCart = this.checkInCart(this.id);
  }

  ngOnInit() {
    //this.inWishlist = this.checkInWishlist(this.id);
    //this.inCart = this.checkInCart(this.id);
    this.checkProductInCart(this.productX().id);

  }

  addRemoveItemWishlist(product: Product) {
    this.inWishlist = !this.inWishlist;

    if (this.inWishlist) {
      this.addedToWishList.emit(product);
      this._messageService.add({ severity: 'success', summary: 'Added', detail: 'Added to wishlist' })
    } else {
      this.removedFromWishList.emit(product);
      this._messageService.add({ severity: 'info', summary: 'Removed', detail: 'Removed from wishlist' })
    }
  }

  // Check to see if item is in wishlist
  // checkInWishlist(id: number) {
  //   return this._wishlistService.inWishlist(id)
  // }

  // checkInCart(id: number) {
  //   return this._cartService.inCart(id);
  // }

  /*addRemoveCartItem(product: CardProduct) {
    this.inCart = !this.inCart;

    if (this.inCart) {
      this.addedToCart.emit(product);
      this._messageService.add({ severity: 'success', summary: 'Added', detail: 'Added to cart' })
    } else {
      this.removedFromCart.emit(product);
      this._messageService.add({ severity: 'info', summary: 'Removed', detail: 'Removed from cart' })
    }
  }*/
  // addRemoveCartItem(product: CardProduct): void {
  //   if (this.inCart) {
  //     this.cartService.removeItemFromCart(product.id); // This invokes the service method
  //   } else {
  //     const cartItemRequest: CartItemRequest = {
  //       productId: product.id,
  //       quantity: 1, // Default quantity to add
  //     };
  //     this.cartService.addItemToCart(cartItemRequest);
  //   }
  // }

  // addRemoveCartItem(product: CardProduct): void {
  //   console.log("inCart",this.inCart)
  //   if (this.inCart) {
  //     this.removedFromCart.emit(product); // Emit event for removal
  //   } else {
  //     this.addedToCart.emit(product); // Emit event for addition
  //   }
  // }

  // // Method for handling add/remove cart logic
  // addRemoveCartItem(product: CardProduct): void {
  //   if (this.inCart.get(product.id)) {
  //     this.removedFromCart.emit(product);  // Emit for cart removal
  //   } else {
  //     this.addedToCart.emit(product);  // Emit for cart addition
  //   }
  // }

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

  // // Listen for product state changes and update the local inCart state for the specific product
  // private listenCheckIfProductInCart(): void {
  //   effect(() => {
  //     // Access the specific product signal for the given productId
  //     const productStateSignal = this.cartService.getIsProductInCartSignal(this.productX().id);
  //     const state = productStateSignal(); // Get the current state of the product
  //
  //     if (state.status === "OK") {
  //       // If state.value is undefined, handle it with a fallback to false
  //       const inCart = state.value ?? false; // Fallback to `false` if `state.value` is undefined
  //
  //       this.inCart.set(this.productX().id, inCart); // Update the map with inCart status for that product
  //       console.log("Product is in cart:", this.productX().id, inCart);
  //     } else if (state.status === "ERROR") {
  //       this.toastService.send({
  //         severity: "error", summary: "Error", detail: "Failed to check product status",
  //       });
  //       console.error("Error fetching product in cart state");
  //     }
  //   });
  // }

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
