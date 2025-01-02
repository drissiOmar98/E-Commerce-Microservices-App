import {Component, EventEmitter, input, Input, OnInit, Output} from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Product, Subcategory, Category } from '../Product';
import { WishlistService } from 'src/app/shared/wishlist.service';
import { CartService } from 'src/app/shared/cart.service';
import {CardProduct, DisplayPicture} from "../../../Admin/model/product.model";


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
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
  @Output() addedToCart = new EventEmitter();
  @Output() removedFromCart = new EventEmitter();
  @Output() replaceCurrentProduct = new EventEmitter<number>();

  productX = input.required<CardProduct>();

  inWishlist!: boolean;
  inCart!: boolean;
  public product!: Product;

  cardProduct: CardProduct | undefined;





  constructor(
    private _messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute,
    private _wishlistService: WishlistService,
    private _cartService: CartService
  ) {
    //this.inWishlist = this.checkInWishlist(this.id);
    //this.inCart = this.checkInCart(this.id);
  }

  ngOnInit() {
    this.cardProduct = {
      name: this.name,
      description: this.description,
      categoryName: this.category,
      subcategoryName: this.subcategory,
      categoryDescription:this.categoryDescription,
      categoryId: this.categoryId,
      subcategoryId: this.subcategoryId,
      cover: this.cover,
      id: this.id,
      availableQuantity: this.inStock,
      price: this.price
    }
    //this.inWishlist = this.checkInWishlist(this.id);
    //this.inCart = this.checkInCart(this.id);
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

  addRemoveCartItem(product: Product) {
    this.inCart = !this.inCart;

    if (this.inCart) {
      this.addedToCart.emit(product);
      this._messageService.add({ severity: 'success', summary: 'Added', detail: 'Added to cart' })
    } else {
      this.removedFromCart.emit(product);
      this._messageService.add({ severity: 'info', summary: 'Removed', detail: 'Removed from cart' })
    }
  }

  // openProductDetails(id: number) {
  //   const currentRoute = this.route.snapshot.url.join('/');
  //   if (currentRoute.includes('products')) {
  //     const navigationExtras: NavigationExtras = {
  //       state: {
  //         product: this.product
  //       }
  //     }
  //     this.router.navigate(['/product', id], navigationExtras);
  //   } else {
  //     this.replaceCurrentProduct.emit(id);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // }

  // openProductDetails(id: number) {
  //   console.log('Navigating to Product ID:', id);
  //   const currentRoute = this.route.snapshot.url.join('/');
  //   console.log(currentRoute)
  //   const updatedProduct = this.productX();
  //   const navigationExtras: NavigationExtras = {
  //     state: {
  //       product: updatedProduct,
  //     }
  //   };
  //
  //   if (currentRoute.includes('/search')) {
  //     this.router.navigate(['/customer/products/product', id], navigationExtras);
  //   } else {
  //     this.replaceCurrentProduct.emit(id);
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // }

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

}
