import {computed, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {State} from "../../../shared/model/state.model";
import {Favourite, favouriteRequest} from "../model/favourite.model";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FavouriteService {
  http = inject(HttpClient);

  private getWishList$: WritableSignal<State<Array<Favourite>>> = signal(State.Builder<Array<Favourite>>().forInit());
  getWishListSig = computed(() => this.getWishList$());

  private addToFavourites$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  addToFavouritesSig = computed(() => this.addToFavourites$());

  private removeFromFavourites$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  removeFromFavouritesSig = computed(() => this.removeFromFavourites$());

  private clearFavourites$: WritableSignal<State<void>> = signal(State.Builder<void>().forInit());
  clearFavouritesStateSig = computed(() => this.clearFavourites$());

  private isProductInFavouriteMap$: Map<number, WritableSignal<State<boolean>>> = new Map();

  // Get the signal for a specific product
  getIsProductInWishListSignal(productId: number): WritableSignal<State<boolean>> {
    if (!this.isProductInFavouriteMap$.has(productId)) {
      this.isProductInFavouriteMap$.set(productId, signal(State.Builder<boolean>().forInit()));
    }
    return this.isProductInFavouriteMap$.get(productId)!;
  }

  checkProductInWishList(productId: number): void {
    const productStateSignal = this.getIsProductInWishListSignal(productId);
    console.log("Checking product in wishList for productId:", productId);

    this.http
      .get<boolean>(`${environment.API_URL}/favourites/is-favourite/${productId}`)
      .subscribe({
        next: (isFavourite) => {
          console.log("Backend response:", isFavourite);
          productStateSignal.set(State.Builder<boolean>().forSuccess(isFavourite));
        },
        error: (err) => {
          console.error(`Error checking product ${productId} in wishList:`, err);
          productStateSignal.set(State.Builder<boolean>().forError(err));
        },
      });
  }

  addToFavourites(favRequest: favouriteRequest): void {
    this.http.post<void>(`${environment.API_URL}/favourites`, favRequest)
      .subscribe({
        next: () => {
          this.addToFavourites$.set(State.Builder<void>().forSuccess());  // Update success state
          this.getMyWishList();  // Refresh the wishlist
        },
        error: (err) => {
          this.addToFavourites$.set(State.Builder<void>().forError(err));  // Set error in state
        }
      });
  }


  getMyWishList(): void {
    this.http.get<Array<Favourite>>(`${environment.API_URL}/favourites`)
      .subscribe({
        next: favourites => this.getWishList$.set(State.Builder<Array<Favourite>>().forSuccess(favourites)),
        error: err => this.getWishList$.set(State.Builder<Array<Favourite>>().forError(err)),
      });
  }

  clearFavourites(): void {
    this.http.delete<void>(`${environment.API_URL}/favourites/clear`)
      .subscribe({
        next: () => {
          this.clearFavourites$.set(State.Builder<void>().forSuccess());
        },
        error: (err) => {
          this.clearFavourites$.set(State.Builder<void>().forError(err));
        }
      });
  }

  removeFromFavourites(productId: number): void {
    this.http.delete<void>(`${environment.API_URL}/favourites/${productId}`)
      .subscribe({
        next: () => {
          this.removeFromFavourites$.set(State.Builder<void>().forSuccess());  // Set success state
          this.getMyWishList();  // Refresh the wishlist
        },
        error: (err) => {
          this.removeFromFavourites$.set(State.Builder<void>().forError(err));  // Set error in state
        }
      });
  }

  // Reset state for the wish list
  resetGetWishListState(): void {
    this.getWishList$.set(State.Builder<Array<Favourite>>().forInit());
  }

  // Reset state for adding to favourites
  resetAddToFavouritesState(): void {
    this.addToFavourites$.set(State.Builder<void>().forInit());
  }

  // Reset state for removing from favourites
  resetRemoveFromFavouritesState(): void {
    this.removeFromFavourites$.set(State.Builder<void>().forInit());
  }

  // Reset state for clearing favourites
  resetClearFavouritesState(): void {
    this.clearFavourites$.set(State.Builder<void>().forInit());
  }

  resetAllIsProductInWishListStates(): void {
    this.isProductInFavouriteMap$.forEach(signal => {
      signal.set(State.Builder<boolean>().forInit());
    });
  }




  constructor() { }
}
