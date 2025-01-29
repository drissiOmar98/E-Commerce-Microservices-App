import {NewProductPicture} from "./picture.model";
import {Pagination} from "../../../shared/model/request.model";


export interface NewProduct {
  id?: number;
  infos: NewProductInfo,
  price: number;
  categoryId: number;
  subcategoryId: number;
  pictures: Array<NewProductPicture>,
}

export interface NewProductInfo {
  name: string;
  description: string;
  availableQuantity: number;
}

export interface CardProduct {
  id: number;
  name: string;
  description: string;
  availableQuantity: number;
  price: number;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  subcategoryId: number;
  subcategoryName: string;
  cover: DisplayPicture;
  rate: number;
}

export interface DisplayPicture {
  file?: string,
  fileContentType?: string,
  isCover?: boolean
}

export interface CreatedProduct {
  id: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  availableQuantity: number;
  price: number;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  subcategoryId: number;
  subcategoryName: string;
  pictures: Array<DisplayPicture>;
  rate:number;
  comments: Array<String>;
}

export interface SearchQuery {
  query: string,
  page: Pagination
}



