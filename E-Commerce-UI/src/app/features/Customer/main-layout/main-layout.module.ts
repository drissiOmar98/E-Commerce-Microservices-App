import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FooterComponent} from "./footer/footer.component";
import {HeaderComponent} from "./header/header.component";
import {MainLayoutComponent} from "./main-layout.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {BadgeModule} from "primeng/badge";
import {MenuModule} from "primeng/menu";
import {SlideMenuModule} from "primeng/slidemenu";
import {ButtonDirective, ButtonModule} from "primeng/button";





@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    BadgeModule,
    MenuModule,
    SlideMenuModule,
    ButtonDirective,
    ButtonModule,
  ]
})
export class MainLayoutModule { }
