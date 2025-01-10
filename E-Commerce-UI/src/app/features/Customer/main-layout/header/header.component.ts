import {Component, effect, inject, OnInit} from '@angular/core';

import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import {KeycloakService} from "../../../../shared/services/keycloak/keycloak.service";

import {FavouriteService} from "../../services/favourite.service";
import {CartService} from "../../services/cart.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  wishListCount: number = 0;
  cartListCount: number = 0;
  items: MenuItem[] = [];

  constructor(
    private keycloakService: KeycloakService,
    private router: Router,
    private favouriteService: FavouriteService,
    private cartService: CartService
  ) {
    this.subscribeToWishlistCount();
    this.subscribeToCartlistCount();
  }

  ngOnInit() {


    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: ['/customer/home']
      },
      {
        label: 'Products',
        icon: 'pi pi-list',
        routerLink: ['/customer/products/search']
      },
      {
        label: 'Categories',
        icon: 'pi pi-th-large',
        routerLink: ['/customer/categories']
      },
      {
        label: 'Wishlist',
        icon: 'pi pi-heart',
        routerLink: ['/customer/wishlist']
      },
      {
        label: 'Cart',
        icon: 'pi pi-shopping-cart',
        routerLink: ['/cart']
      }
    ];
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  // Define menu items for Profile
  profileItems = [
    {
      label: 'Edit Profile',
      icon: 'pi pi-pencil',
      command: () => {
        this.keycloakService.goToProfilePage();
        // Navigate to the edit profile page or show profile editing modal
        console.log('Navigate to Edit Profile');
      }
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.keycloakService.logout();
        // Handle logout logic
        console.log('Logout');
        // You can call your authentication service here to logout
      }
    }
  ];

  // Define the notification items (example notifications)
  notifications = [
    { label: 'New order placed', timestamp: '5 mins ago' },
    { label: 'Item back in stock', timestamp: '1 hour ago' },
    { label: 'Profile updated', timestamp: '2 hours ago' }
  ];

  // Define the notification menu items
  notificationItems = this.notifications.map(notification => ({
    label: `${notification.label} - ${notification.timestamp}`,
    icon: 'pi pi-info-circle',
    command: () => {
      // Handle notification click (e.g., navigate to details)
      console.log(notification.label);
    }
  }));

  subscribeToWishlistCount(): void {
    // Using computed signals to track any updates to the wishlist count
    effect(() => {
      this.wishListCount = this.favouriteService.wishListCountSig();
    });
  }

  subscribeToCartlistCount(): void {
    // Using computed signals to track any updates to the wishlist count
    effect(() => {
      this.cartListCount = this.cartService.cartListCountSig();
    });
  }

}
