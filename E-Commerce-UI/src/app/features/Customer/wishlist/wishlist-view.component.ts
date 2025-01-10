import {Component, effect, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';

import { MenuItem, MessageService } from 'primeng/api';
import { ProductComponent } from '../products/product/product.component';
import {FavouriteService} from "../services/favourite.service";
import {ToastService} from "../../Admin/services/toast.service";

import {Favourite} from "../model/favourite.model";
import {CardProduct} from "../../Admin/model/product.model";
import {CartItemRequest} from "../model/cart.model";
import {CartService} from "../services/cart.service";
import {State} from "../../../shared/model/state.model";

@Component({
  selector: 'app-wishlist-view',
  templateUrl: './wishlist-view.component.html',
  styleUrls: ['./wishlist-view.component.scss']
})
export class WishlistViewComponent implements OnInit ,OnDestroy  {
  favouriteService = inject(FavouriteService);
  toastService = inject(ToastService);
  cartService= inject(CartService);
  loadingCreation = false;

  favouriteItems: Favourite[] | undefined = [];
  wishlistItems: CardProduct[] = [];
  loading = true;

  public items!: MenuItem[];
  home!: MenuItem;

  @ViewChild('productComponent') productComponent!: ProductComponent;


  constructor(
    private _messageService: MessageService,
    private _cartService: CartService,
  ) {
    this.listenToFetchMyWishList();
    this.listenFavouriteItemRemoval();
  }

  ngOnInit(): void {
    this.loadWishList();

    this.items = [
      { label: 'Products', routerLink: '/products/search' },
      { label: 'Wishlist', routerLink: '/wishlist' },
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/home' };
  }

  ngOnDestroy() {
    this.cartService.resetAddItemState();
    this.favouriteService.resetRemoveFromFavouritesState();
  }





  // addToCart(product: Product) {
  //   this._cartService.addToCart(product);
  // }

  // removeFromCart(product: Product) {
  //   this._cartService.removeFromCart(product);
  // }

  // removeFromWishlist(product: CardProduct) {
  //
  //   const removeProduct = this.productComponent.product;
  //   this._messageService.add({ severity: 'info', summary: 'Removed', detail: 'Removed from wishlist' })
  //   //this._wishlistService.removeWishListItem(removeProduct);
  // }

  removeFromWishlist(product: CardProduct): void {
    this.favouriteService.removeFromFavourites(product.id);
  }



  loadWishList(): void {
    this.favouriteService.getMyWishList();
  }

  // private listenToFetchMyWishList() {
  //   effect(() => {
  //     const myWishListState = this.favouriteService.getWishListSig();
  //     if (myWishListState.status === "OK") {
  //       this.loading = false;
  //       this.favouriteItems = myWishListState.value; // Default value in case of undefined
  //       console.log('my Favourites Items:', this.favouriteService);
  //     } else if (myWishListState.status === "ERROR") {
  //       this.loading = false;
  //       this.toastService.send({
  //         severity: "error", detail: "Error when fetching Your Wish List",
  //       });
  //     }
  //   });
  // }

  private listenToFetchMyWishList(): void {
    effect(() => {
      const myWishListState = this.favouriteService.getWishListSig();
      if (myWishListState.status === 'OK') {
        this.loading = false;
        this.favouriteItems = myWishListState.value || [];
        this.mapFavouritesToCardProducts();
      } else if (myWishListState.status === 'ERROR') {
        this.loading = false;
        this.toastService.send({
          severity: 'error',
          detail: 'Error when fetching Your Wish List',
        });
      }
    });
  }

  private mapFavouritesToCardProducts(): void {
    this.wishlistItems = (this.favouriteItems || []).map((fav) => ({
      id: fav.productId,
      name: fav.productName,
      description: fav.description,
      price: fav.price,
      availableQuantity: fav.availableQuantity,
      categoryId: 0, // Add correct mapping if available
      categoryName: fav.categoryName,
      categoryDescription: '',
      subcategoryId: 0, // Add correct mapping if available
      subcategoryName: fav.subcategoryName,
      cover: fav.cover,
    }));
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

  onFavouriteItemRemovalOk(removeItemFromFavouriteState: State<void>): void {
    this.loadingCreation = false; // Set loading state to false
    this.toastService.send({
      severity: 'info',
      summary: 'Removed',
      detail: 'Product removed successfully from your WishList.',
    });
    // Reset signal to prevent repeated notifications
    this.favouriteService.resetRemoveFromFavouritesState();
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
