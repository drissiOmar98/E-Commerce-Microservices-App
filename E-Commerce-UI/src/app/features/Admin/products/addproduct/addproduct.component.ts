import {Component, effect, inject, OnDestroy} from '@angular/core';
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {Router} from "@angular/router";
import {Step} from "./step.model";
import {ProductService} from "../../services/product.service";
import {ToastService} from "../../services/toast.service";
import {CreatedProduct, NewProduct, NewProductInfo} from "../../model/product.model";
import {NewProductPicture} from "../../model/picture.model";
import {State} from "../../../../shared/model/state.model";

@Component({
  selector: 'app-addproduct',
  templateUrl: './addproduct.component.html',
  styleUrl: './addproduct.component.scss'
})
export class AddproductComponent   implements OnDestroy{

  CATEGORY = "category";
  SUBCATEGORY = "subcategory";
  INFO = "info";
  PHOTOS = "photos";
  DESCRIPTION = "description";
  QUANTITY = "quantity";
  PRICE = "price";

  newProduct: NewProduct = this.initializeNewProduct();
  categoryIdFromStep1: number | undefined;

  dialogDynamicRef = inject(DynamicDialogRef);
  productService = inject(ProductService);
  toastService = inject(ToastService);
  router = inject(Router);

  constructor() {
    this.trackProductCreationStatus()
    this.listenProductCreation();
  }



  steps: Step[] = [
    {
      id: this.CATEGORY,
      idNext: this.SUBCATEGORY,
      idPrevious: null,
      isValid: false
    },
    {
      id: this.SUBCATEGORY,
      idNext: this.INFO,
      idPrevious: this.CATEGORY,
      isValid: false
    },
    {
      id: this.INFO,
      idNext: this.PHOTOS,
      idPrevious: this.SUBCATEGORY,
      isValid: false
    },
    {
      id: this.PHOTOS,
      idNext: this.QUANTITY,
      idPrevious: this.INFO,
      isValid: false
    },
    {
      id: this.QUANTITY,
      idNext: this.PRICE,
      idPrevious: this.PHOTOS,
      isValid: false
    },
    {
      id: this.PRICE,
      idNext: null,
      idPrevious: this.QUANTITY,
      isValid: false
    }
  ];

  currentStep = this.steps[0];

  loadingCreation = false;

  /**
   * Initializes a new product with default values.
   */
  initializeNewProduct(): NewProduct {
    return {
      infos: {
        name: "",
        description: "",
        availableQuantity: 0,
      },
      // name: '',
      // description: '',
      //availableQuantity: 0,
      price: 0,
      categoryId: null!,
      subcategoryId: null!,
      pictures: new Array<NewProductPicture>()
    };
  }

  /**
   * Initiates the process of creating a new product by calling the product service.
   * Sets the `loadingCreation` flag to true while the process is in progress.
   */
  createListing(): void {
    this.loadingCreation = true;
    console.log("new",this.newProduct)
    this.productService.create(this.newProduct);
  }

  ngOnDestroy(): void {
    this.productService.resetProductCreation();
  }

  trackProductCreationStatus() {
    // Start a reactive effect to monitor changes in the creation status signal.
    effect(() => {
      if (this.productService.createSig().status === "OK") {
        //this.router.navigate(["admin", "list"]);
        this.router.navigate(["/admin/products/list"]);
      }
    });
  }





  /**
   * Listens for changes in the product creation process.
   * Calls the appropriate handler method based on whether the creation was successful or resulted in an error.
   */
  listenProductCreation() {

    // Start a reactive effect. This will run automatically whenever the reactive signals it depends on (in this case, createSig) change.
    effect(() => {

      // Get the current state of the product creation process by accessing the createSig signal.
      let createdProductState = this.productService.createSig();

      // Check if the status of the product creation process is "OK" (meaning the creation was successful).
      if (createdProductState.status === "OK") {

        // If the creation is successful, call the onCreateOk handler to handle the success scenario.
        this.onCreateOk(createdProductState);

        // Check if the status of the listing creation process is "ERROR" (meaning the creation failed).
      } else if (createdProductState.status === "ERROR") {

        // If there was an error during the creation process, call the onCreateError handler to handle the error scenario.
        this.onCreateError();
      }
    });
  }


  /**
   * Handles successful creation of a product.
   * Displays a success toast notification, closes the dialog, and refreshes user data.
   *
   * @param createdProductState - The state object containing details about the created product.
   */
  onCreateOk(createdProductState: State<CreatedProduct>) {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "success", summary: "Success", detail: "Product created successfully.",
    });
    this.dialogDynamicRef.close(createdProductState.value?.id);
  }

  /**
   * Handles errors that occur during the product creation process.
   * Displays an error toast notification.
   */
  private onCreateError() {
    this.loadingCreation = false;
    this.toastService.send({
      severity: "error", summary: "Error", detail: "Couldn't create your product, please try again.",
    });
  }


  /**
   * Advances to the next step in the property creation wizard.
   * If there is a next step, updates the `currentStep` to the corresponding step.
   */
  nextStep(): void {
    if (this.currentStep.idNext !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  /**
   * Moves to the previous step in the property creation wizard.
   * If there is a previous step, updates the `currentStep` to the corresponding step.
   */
  previousStep(): void {
    if (this.currentStep.idPrevious !== null) {
      this.currentStep = this.steps.filter((step: Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  /**
   * Checks if all steps in the wizard are valid.
   *
   * @returns `true` if all steps have `isValid` set to `true`; otherwise `false`.
   */
  isAllStepsValid(): boolean {
    return this.steps.filter(step => step.isValid).length === this.steps.length;
  }

  onValidityChange(validity: boolean) {
    this.currentStep.isValid = validity;
  }


  onCategorySelected(categoryId: number): void {
    this.newProduct.categoryId = categoryId;
    this.categoryIdFromStep1 = categoryId;
  }
  onSubCategorySelected(subcategoryId: number) {
    this.newProduct.subcategoryId=subcategoryId;
    console.log("sub:", this.newProduct.subcategoryId)
  }

  onInfoChange(newInfo: NewProductInfo) {
    this.newProduct.infos = newInfo;
    console.log("infos:", this.newProduct.infos);
  }
  onPictureChange(newPictures: NewProductPicture[]) {
    this.newProduct.pictures = newPictures;
  }
  onPriceChange(newPrice: number) {
    this.newProduct.price = newPrice;
  }

  // onAvailableQuantityChange(newAvailableQuantity: number) {
  //   this.newProduct.availableQuantity = newAvailableQuantity;
  // }

  onAvailableQuantityChange(newInfo: NewProductInfo) {
    this.newProduct.infos.availableQuantity = newInfo.availableQuantity;
    console.log("quantity" + this.newProduct.infos.availableQuantity);
  }



}
