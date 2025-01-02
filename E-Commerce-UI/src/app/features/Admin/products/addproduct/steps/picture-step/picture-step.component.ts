import {Component, EventEmitter, input, Output} from '@angular/core';
import {NewProductPicture} from "../../../../model/picture.model";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {InputTextModule} from "primeng/inputtext";

@Component({
  selector: 'app-picture-step',
  standalone: true,
  imports: [
    FaIconComponent,
    InputTextModule
  ],
  templateUrl: './picture-step.component.html',
  styleUrl: './picture-step.component.scss'
})
export class PictureStepComponent {

  pictures = input.required<Array<NewProductPicture>>();

  @Output()
  picturesChange = new EventEmitter<Array<NewProductPicture>>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();



  extractFileFromTarget(target: EventTarget | null) {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) {
      return null;
    }
    return htmlInputTarget.files;
  }

  onUploadNewPicture(target: EventTarget | null) {
    const picturesFileList = this.extractFileFromTarget(target);
    if(picturesFileList !== null) {
      for(let i = 0 ; i < picturesFileList.length; i++) {
        const picture = picturesFileList.item(i);
        if (picture !== null) {
          const displayPicture: NewProductPicture = {
            file: picture,
            urlDisplay: URL.createObjectURL(picture)
          }
          this.pictures().push(displayPicture);
        }
      }
      this.picturesChange.emit(this.pictures());
      this.validatePictures();
    }
  }

  private validatePictures() {
    if (this.pictures().length >= 4) {
      this.stepValidityChange.emit(true);
    } else {
      this.stepValidityChange.emit(false);
    }
  }

  onTrashPicture(pictureToDelete: NewProductPicture) {
    const indexToDelete = this.pictures().findIndex(picture => picture.file.name === pictureToDelete.file.name);
    this.pictures().splice(indexToDelete, 1);
    this.validatePictures();
  }


}
