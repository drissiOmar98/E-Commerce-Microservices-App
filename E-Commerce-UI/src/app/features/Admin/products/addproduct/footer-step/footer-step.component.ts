import {Component, EventEmitter, input, Output} from '@angular/core';
import {Step} from "../step.model";

@Component({
  selector: 'app-footer-step',
  templateUrl: './footer-step.component.html',
  styleUrl: './footer-step.component.scss'
})
export class FooterStepComponent {

  // A required input signal that represents the current step in the process.
  currentStep = input.required<Step>();

  // An input signal to track whether the listing creation process is loading (default value is false).
  loading = input<boolean>(false);

  // An input signal that indicates if all steps are valid (default value is false).
  isAllStepsValid = input<boolean>(false);

  // An input signal for the label of the "Finish" button, defaulting to "Finish".
  labelFinishedBtn = input<string>("Finish");

  // Output event emitter to signal when the "Finish" button is clicked.
  @Output()
  finish = new EventEmitter<boolean>();

  // Output event emitter to signal when the "Previous" button is clicked.
  @Output()
  previous = new EventEmitter<boolean>();

  // Output event emitter to signal when the "Next" button is clicked.
  @Output()
  next = new EventEmitter<boolean>();

  /**
   * Emits the 'finish' event when the "Finish" button is clicked.
   */
  onFinish() {
    // Emit true to signal the finish event when the user clicks the finish button.
    this.finish.emit(true);
  }

  /**
   * Emits the 'previous' event when the "Previous" button is clicked.
   */
  onPrevious() {
    // Emit true to signal the previous event when the user clicks the previous button.
    this.previous.emit(true);
  }

  /**
   * Emits the 'next' event when the "Next" button is clicked.
   */
  onNext() {
    // Emit true to signal the next event when the user clicks the next button.
    this.next.emit(true);
  }

}
