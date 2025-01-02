import {Component, EventEmitter, input, Output} from '@angular/core';
import {QuantityStepControlComponent} from "./quantity-step-control/quantity-step-control.component";
import {NewProductInfo} from "../../../../model/product.model";

@Component({
  selector: 'app-quantity-step',
  standalone: true,
  imports: [
    QuantityStepControlComponent
  ],
  templateUrl: './quantity-step.component.html',
  styleUrl: './quantity-step.component.scss'
})
export class QuantityStepComponent {

  availableQuantity = input.required<NewProductInfo>();


  @Output()
  quantityChange = new EventEmitter<NewProductInfo>();


  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  onAvailableQuantityChange(newValue: number) {

    this.availableQuantity().availableQuantity=newValue;
    this.quantityChange.emit(this.availableQuantity());
    this.stepValidityChange.emit(this.validationRules());

  }

  validationRules(): boolean {
    return this.availableQuantity().availableQuantity >= 1; // Step is valid if guests are 1 or more.
  }
}
