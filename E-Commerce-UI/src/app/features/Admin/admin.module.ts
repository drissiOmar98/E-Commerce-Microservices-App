import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import {LayoutModule} from "./layouts/layout.module";
import {DialogService} from "primeng/dynamicdialog";
import {ToastModule} from "primeng/toast";



@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutModule,
    ToastModule


  ],
  providers: [DialogService],
})
export class AdminModule { }
