import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import {TableModule} from "primeng/table";
import {StyleClassModule} from "primeng/styleclass";
import {PanelMenuModule} from "primeng/panelmenu";
import {ButtonModule} from "primeng/button";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";
import {RatingModule} from "primeng/rating";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
import {ToastModule} from "primeng/toast";
import {ProductsComponent} from "./products.component";
import {AddproductComponent} from "./addproduct/addproduct.component";
import {ViewproductComponent} from "./viewproduct/viewproduct.component";
import {ProductsService} from "../../Customer/products/products.service";
import {MessageService} from "primeng/api";
import {FooterStepComponent} from "./addproduct/footer-step/footer-step.component";
import {FaIconComponent, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CategoryStepComponent} from "./addproduct/steps/category-step/category-step.component";
import {SubcategoryStepComponent} from "./addproduct/steps/subcategory-step/subcategory-step.component";
import {DescriptionStepComponent} from "./addproduct/steps/description-step/description-step.component";
import {PictureStepComponent} from "./addproduct/steps/picture-step/picture-step.component";
import {PriceStepComponent} from "./addproduct/steps/price-step/price-step.component";
import {QuantityStepComponent} from "./addproduct/steps/quantity-step/quantity-step.component";


@NgModule({
  declarations: [
    ProductsComponent,
    AddproductComponent,
    ViewproductComponent,
    FooterStepComponent
  ],
    imports: [
        CommonModule,
        ProductsRoutingModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        DataViewModule,
        DropdownModule,
        InputTextModule,
        DividerModule,
        RatingModule,
        FormsModule,
        SelectButtonModule,
        ReactiveFormsModule,
        ToastModule,
        FontAwesomeModule,
        CategoryStepComponent,
        SubcategoryStepComponent,
        DescriptionStepComponent,
        PictureStepComponent,
        PriceStepComponent,
        QuantityStepComponent,
    ],
  providers: [ MessageService],
})
export class ProductsModule { }
