import {Component, input, Input} from '@angular/core';
import {CardProduct} from "../../features/Admin/model/product.model";

@Component({
  selector: 'app-card-product',
  standalone: true,
  imports: [],
  templateUrl: './card-product.component.html',
  styleUrl: './card-product.component.scss'
})
export class CardProductComponent {

  product = input.required<CardProduct>();

}
