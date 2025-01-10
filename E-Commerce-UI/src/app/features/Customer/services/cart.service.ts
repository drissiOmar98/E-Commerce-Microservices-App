import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../../../shared/model/state.model";
import {Cart, CartItemRequest} from "../model/cart.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  http = inject(HttpClient);

  constructor() {
    this.getMyCart();  // Automatically fetch the cartList on service initialization
  }

  private getCart$: WritableSignal<State<Cart>> = signal(State.Builder<Cart>().forInit());
  getCartSig = computed(() => this.getCart$());

  private clearCart$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  clearCartSig = computed(() => this.clearCart$());

  private addItem$: WritableSignal<State<Cart>> = signal(State.Builder<Cart>().forInit());
  addItemSig = computed(() => this.addItem$());

  private removeItem$: WritableSignal<State<Cart>> = signal(State.Builder<Cart>().forInit());
  removeItemSig = computed(() => this.removeItem$());

  private updateItem$: WritableSignal<State<Cart>> = signal(State.Builder<Cart>().forInit());
  updateItemSig = computed(() => this.updateItem$());

  private cartListCount$: WritableSignal<number> = signal(0);
  cartListCountSig = computed(() => this.cartListCount$());







  private isProductInCartMap$: Map<number, WritableSignal<State<boolean>>> = new Map();

  // Get the signal for a specific product
  getIsProductInCartSignal(productId: number): WritableSignal<State<boolean>> {
    if (!this.isProductInCartMap$.has(productId)) {
      this.isProductInCartMap$.set(productId, signal(State.Builder<boolean>().forInit()));
    }
    return this.isProductInCartMap$.get(productId)!;
  }

  checkProductInCart(productId: number): void {
    const productStateSignal = this.getIsProductInCartSignal(productId);
    console.log("Checking product in cart for productId:", productId);

    this.http
      .get<{ productInCart: boolean }>(
        `${environment.API_URL}/cart/items/check`,
        { params: { productId: productId.toString() } }
      )
      .subscribe({
        next: (response) => {
          console.log("Backend response:", response);
          productStateSignal.set(State.Builder<boolean>().forSuccess(response.productInCart));
        },
        error: (err) => {
          console.error(`Error checking product ${productId} in cart:`, err);
          productStateSignal.set(State.Builder<boolean>().forError(err));
        },
      });
  }

  /**
   * Updates the cart item count based on cart data.
   * This method will update the cartListCount$ writable signal.
   */
  /**
   * Update the cart item count based on the fetched cart state.
   */
  updateCartlistCount(): void {
    const state = this.getCart$();  // Get the current cart state

    if (state.status === 'OK' && state.value) {
      console.log("Cart item count being set:", state.value.cartItems.length);
      this.cartListCount$.set(state.value.cartItems.length);  // Set the cart item count
    } else {
      console.log("Defaulting cart count to 0");
      this.cartListCount$.set(0);  // Default cart count to 0 if the state is not 'OK'
    }
  }



  /**
   * Fetch user's cart
   */
  getMyCart(): void {
    this.http.get<Cart>(`${environment.API_URL}/cart`).subscribe({
      next: (cart) =>{
        this.getCart$.set(State.Builder<Cart>().forSuccess(cart));
        this.updateCartlistCount();
      },
      error: (err) => this.getCart$.set(State.Builder<Cart>().forError(err)),
    });
  }


  /**
   * Clear the user's cart
   */
  clearCart(): void {
    this.http.delete<void>(`${environment.API_URL}/cart/clear`).subscribe({
      next: () => this.clearCart$.set(State.Builder<void>().forSuccess()),
      error: (err) => this.clearCart$.set(State.Builder<void>().forError(err)),
    });
  }

  /**
   * Add an item to the cart
   * @param cartItemRequest Object containing product details and quantity
   */
  addItemToCart(cartItemRequest: CartItemRequest): void {
    this.http.post<Cart>(`${environment.API_URL}/cart/add/item`, cartItemRequest).subscribe({
      next: (cart) =>{
        this.addItem$.set(State.Builder<Cart>().forSuccess(cart));
        this.getMyCart();
      },
      error: (err) => this.addItem$.set(State.Builder<Cart>().forError(err)),
    });
  }



  removeItemFromCart(productId: number): void {
    // Fetch the cart first to dynamically retrieve the `cartItemId` for the given `productId`
    this.http.get<Cart>(`${environment.API_URL}/cart`).subscribe({
      next: (cart) => {
        const cartItem = cart.cartItems.find((item) => item.productId === productId);
        if (!cartItem) {
          console.error("CartItem not found for Product ID:", productId);
          return;
        }
        const cartItemId = cartItem.id;
        this.removeItemById(cartItemId);
      },
      error: (err) => console.error("Failed to fetch cart:", err),
    });
  }



  private removeItemById(cartItemId: number): void {
    this.http.delete<Cart>(`${environment.API_URL}/cart/remove/item/${cartItemId}`).subscribe({
      next: (updatedCart) => {
        this.removeItem$.set(State.Builder<Cart>().forSuccess(updatedCart));
        this.getMyCart();
        this.resetRemoveItemState(); // Automatically reset state after success
      },
      error: (err) => {
        this.removeItem$.set(State.Builder<Cart>().forError(err));
        this.resetRemoveItemState(); // Automatically reset state after error
      },
    });
  }



  /**
   * Update the quantity of a cart item
   * @param cartItemId ID of the cart item to update
   * @param cartItemRequest Object containing updated quantity
   */
  updateCartItemQuantity(cartItemId: number, cartItemRequest: { quantity: number }): void {
    this.http
      .put<Cart>(`${environment.API_URL}/cart/update/item/${cartItemId}`, cartItemRequest)
      .subscribe({
        next: (cart) => this.updateItem$.set(State.Builder<Cart>().forSuccess(cart)),
        error: (err) => this.updateItem$.set(State.Builder<Cart>().forError(err)),
      });
  }








  /**
   * Resets the getCart signal state.
   */
  resetGetCartState(): void {
    this.getCart$.set(State.Builder<Cart>().forInit());
  }

  /**
   * Resets the clearCart signal state.
   */
  resetClearCartState(): void {
    this.clearCart$.set(State.Builder<void>().forInit());
  }

  /**
   * Resets the addItem signal state.
   */
  resetAddItemState(): void {
    this.addItem$.set(State.Builder<Cart>().forInit());
  }

  /**
   * Resets the removeItem signal state.
   */
  resetRemoveItemState(): void {
    setTimeout(() => {
      this.removeItem$.set(State.Builder<Cart>().forInit());
    });
  }


  /**
   * Resets the updateItem signal state.
   */
  resetUpdateItemState(): void {
    this.updateItem$.set(State.Builder<Cart>().forInit());
  }

  /**
   * Resets the isProductInCart signal state.
   */
  // resetIsProductInCartState(): void {
  //   this.isProductInCart$.set(State.Builder<boolean>().forInit());
  // }







}
