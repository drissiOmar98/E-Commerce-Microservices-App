import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import {FormsModule} from "@angular/forms";
import {MenuModule} from "primeng/menu";
import {TableModule} from "primeng/table";
import {StyleClassModule} from "primeng/styleclass";
import {PanelMenuModule} from "primeng/panelmenu";
import {ButtonModule} from "primeng/button";
import {DashboardComponent} from "./dashboard.component";
import {ChartModule} from "primeng/chart";


@NgModule({
  declarations: [DashboardComponent ],
    imports: [
        CommonModule,
        DashboardRoutingModule,
        FormsModule,
        MenuModule,
        TableModule,
        StyleClassModule,
        PanelMenuModule,
        ButtonModule,
        ChartModule,
    ]
})
export class DashboardModule { }
