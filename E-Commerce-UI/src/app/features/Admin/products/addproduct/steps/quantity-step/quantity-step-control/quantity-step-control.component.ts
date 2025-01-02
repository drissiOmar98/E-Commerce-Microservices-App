import {Component, EventEmitter, input, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-quantity-step-control',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './quantity-step-control.component.html',
  styleUrl: './quantity-step-control.component.scss'
})
export class QuantityStepControlComponent {

  title = input.required<string>();
  value = input.required<number>();
  minValue = input<number>(0);

  @Output()
  valueChange = new EventEmitter<number>();

  separator = input<boolean>(true);

  onIncrement() {
    this.valueChange.emit(this.value() + 1);
  }

  onDecrement() {
    this.valueChange.emit(this.value() - 1);
  }


}
