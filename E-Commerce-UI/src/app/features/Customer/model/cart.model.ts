import {DisplayPicture} from "../../Admin/model/product.model";

export interface Cart {
  id: number;
  customerId: string;
  cartItems: CartItem[];
  totalAmount: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  cover: DisplayPicture;
  price: number;
  quantity: number;
  totalPrice: number;
  availableQuantity: number;
}

export interface CartItemRequest {
  productId: number;
  quantity: number
}



