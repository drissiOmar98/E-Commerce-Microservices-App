import {DisplayPicture} from "../../Admin/model/product.model";

export interface favouriteRequest {
  productId: number;
}

export interface Favourite {
  customerId: string;
  productId: number;
  productName: string;
  description: string;
  cover: DisplayPicture;
  price: number;
  availableQuantity: number;
  categoryName: string;
  subcategoryName: string;
}
