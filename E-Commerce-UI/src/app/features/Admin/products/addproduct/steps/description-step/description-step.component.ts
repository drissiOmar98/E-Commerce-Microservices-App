import {Component, EventEmitter, input, Output, ViewChild} from '@angular/core';
import {NewProductInfo} from "../../../../model/product.model";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputTextModule} from "primeng/inputtext";
import {FormsModule, NgForm} from "@angular/forms";

@Component({
  selector: 'app-description-step',
  standalone: true,
  imports: [InputTextModule, FormsModule, InputTextModule, InputTextareaModule],
  templateUrl: './description-step.component.html',
  styleUrl: './description-step.component.scss'
})
export class DescriptionStepComponent {

  infos = input.required<NewProductInfo>();

  @Output()
  infoChange = new EventEmitter<NewProductInfo>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  @ViewChild("formDescription")
  formDescription: NgForm | undefined;

  onTitleChange(newTitle: string) {
    this.infos().name = newTitle;
    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validateForm());
  }

  onDescriptionChange(newDescription: string) {
    this.infos().description = newDescription;
    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validateForm());
  }

  private validateForm(): boolean {
    if (this.formDescription) {
      return this.formDescription?.valid!;
    } else {
      return false;
    }
  }



}
