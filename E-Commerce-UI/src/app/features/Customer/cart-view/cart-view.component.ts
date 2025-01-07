import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { MenuItem, MessageService } from 'primeng/api';
import { map, Observable, of, Subscription } from 'rxjs';
import { Product } from '../products/Product';
import {ToastService} from "../../Admin/services/toast.service";
import {CartService} from "../services/cart.service";
import {Cart} from "../model/cart.model";
import {State} from "../../../shared/model/state.model";

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss'],
})
export class CartViewComponent implements OnInit ,OnDestroy {
  toastService = inject(ToastService);
  cartService= inject(CartService);
  myCart: Cart = { id: 0, customerId: '', cartItems: [], totalAmount: 0 };
  loading = true;
  loadingCreation = false;



  products$!: Observable<Product[]>;
  totalPrice$!: Observable<number>;

  pieces: number[] = [];
  numberOfItems!: number;
  shippingView = false;
  activeIndex: number = 1;

  selectedMonthlyPayment: any = { name: 12 };
  monthlyPaymentOptions: any[] = [{ name: 12 }, { name: 24 }, { name: 36 }];

  stepperItems!: MenuItem[];

  public items!: MenuItem[];
  home!: MenuItem;
  shippingViewText!: 'Proceed with shipping' | 'Back to cart view';

  constructor(
    private router: Router
  ) {
    this.listenToFetchMyCart();
    this.listenCartItemRemoval();
  }

  ngOnInit() {
    this.loadCart();
    this.stepperItems = [
      {
        label: 'Shipping',
        routerLink: 'shipping',
      },
      {
        label: 'Overview',
        routerLink: 'overview',
      },
      {
        label: 'Payment',
        routerLink: 'payment',
      },
    ];

    this.shippingViewText = 'Proceed with shipping';

    this.items = [
      { label: 'Products', routerLink: '/customer/products/search' },
      { label: 'Cart', routerLink: '/customer/cart' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/customer/home' };
  }

  onActiveIndexChange(event: any) {
    this.activeIndex = event;
  }

  ngOnDestroy() {
    this.cartService.resetGetCartState();

  }

  incrementProductCount(index: number, availableQuantity: number): void {
    if (this.myCart?.cartItems[index].quantity < availableQuantity) {
      const newQuantity = this.myCart?.cartItems[index].quantity + 1;
      this.myCart.cartItems[index].quantity = newQuantity;

      // Update backend with the new quantity
      const cartItemId = this.myCart.cartItems[index].id;
      const cartItemRequest = { quantity: newQuantity };
      this.cartService.updateCartItemQuantity(cartItemId, cartItemRequest);

      // Recalculate the total amount in the cart after changing quantity
      this.calculateTotalAmount();
    }
  }

  decrementProductCount(index: number): void {
    if (this.myCart?.cartItems[index].quantity > 1) {
      const newQuantity = this.myCart.cartItems[index].quantity - 1;
      this.myCart.cartItems[index].quantity = newQuantity;

      // Update backend with the new quantity
      const cartItemId = this.myCart.cartItems[index].id;
      const cartItemRequest = { quantity: newQuantity };
      this.cartService.updateCartItemQuantity(cartItemId, cartItemRequest);

      // Recalculate the total amount in the cart after changing quantity
      this.calculateTotalAmount();
    }
  }

  calculateTotalAmount(): void {
    if (this.myCart?.cartItems?.length) {
      this.myCart.totalAmount = this.myCart.cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    } else {
      this.myCart.totalAmount = 0;
    }
  }



  openShippingView() {
    this.shippingView = !this.shippingView;
    this.shippingView
      ? (this.shippingViewText = 'Back to cart view')
      : (this.shippingViewText = 'Proceed with shipping');
    this.router.navigate(['cart/shipping']);
  }

  getInstallmentPayAmount(price: number | null | undefined, months: any) {
    return Math.floor(price! / months);
  }

  removeFromCart(productId: number): void {
    if (!productId) {
      console.error("Invalid Product ID");
      return;
    }
    this.cartService.removeItemFromCart(productId);
    // The UI will be updated when the state changes and `onCartItemRemovalOk` is called.
  }


  openProductDetails(id: number) {
    this.router.navigate(['/customer/products/product', id]);
  }




  loadCart(): void {
    this.cartService.getMyCart();
  }

  private listenToFetchMyCart() {
    effect(() => {
      const myCartState = this.cartService.getCartSig();
      if (myCartState.status === "OK") {
        this.loading = false;
        this.myCart = myCartState.value ?? { id: 0, customerId: '', cartItems: [], totalAmount: 0 }; // Default value in case of undefined
        console.log('my Cart:', this.myCart);
        // if (this.myCart) {
        //   this.setBreadcrumbItems();
        // }
        // Handle errors encountered during the fetch
      } else if (myCartState.status === "ERROR") {
        this.loading = false;
        this.toastService.send({
          severity: "error", detail: "Error when fetching Your Cart",
        });
      }
    });
  }

  private listenCartItemRemoval(): void {
    effect(() => {
      const removeItemFromCartState = this.cartService.removeItemSig(); // Track state for item removal

      if (removeItemFromCartState.status === 'OK') {
        this.onCartItemRemovalOk(removeItemFromCartState); // Update the cart and UI on success
      } else if (removeItemFromCartState.status === 'ERROR') {
        this.onCartItemRemovalError(); // Handle error gracefully
      }
    });
  }



  onCartItemRemovalOk(removeItemFromCartState: State<Cart>): void {
    this.loadingCreation = false; // Set loading state to false

    // Update local cart and total amount
    if (removeItemFromCartState.value) {
      this.myCart = removeItemFromCartState.value; // Use `value` to get the updated cart
      this.calculateTotalAmount(); // Recalculate total amount
    }

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
