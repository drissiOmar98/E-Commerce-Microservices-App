import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import {CategoriesComponent} from "./categories.component";
import {Button, ButtonModule} from "primeng/button";
import {RatingModule} from "primeng/rating";
import {DataViewModule} from "primeng/dataview";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {PickListModule} from "primeng/picklist";
import {OrderListModule} from "primeng/orderlist";
import {InputTextModule} from "primeng/inputtext";


@NgModule({
  declarations: [
    CategoriesComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    FormsModule,
    DataViewModule,
    PickListModule,
    OrderListModule,
    InputTextModule,
    DropdownModule,
    RatingModule,
    ButtonModule
  ]
})
export class CategoryModule { }
