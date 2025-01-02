import {Component, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputTextModule} from "primeng/inputtext";
import {QuantityStepControlComponent} from "../quantity-step/quantity-step-control/quantity-step-control.component";

@Component({
  selector: 'app-price-step',
  standalone: true,
  imports: [
    FormsModule,
    FaIconComponent,
    InputTextModule,
    QuantityStepControlComponent
  ],
  templateUrl: './price-step.component.html',
  styleUrl: './price-step.component.scss'
})
export class PriceStepComponent {

  price = input.required<number>();


  @Output()
  priceChange = new EventEmitter<number>();


  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  @ViewChild("formPrice")
  formPrice: NgForm | undefined;

  onPriceChange(newPrice: number) {
    this.priceChange.emit(newPrice);
    this.stepValidityChange.emit(this.validateForm());
  }


  private validateForm(): boolean {
    // Validate the price form (if exists)
    return this.formPrice?.valid ?? false;
  }












}
