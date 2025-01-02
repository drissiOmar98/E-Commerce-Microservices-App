import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {LayoutComponent} from "./layout.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MenubarModule} from "primeng/menubar";
import {RippleModule} from "primeng/ripple";
import {InputTextModule} from "primeng/inputtext";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {ButtonModule} from "primeng/button";
import {SplitterModule} from "primeng/splitter";
import {AppTopbarComponent} from "./app.topbar/app.topbar.component";
import {AppMenuitemComponent} from "./app.sidebar/app.menuitem.component";
import {AppSidebarComponent} from "./app.sidebar/app.sidebar.component";


@NgModule({
  declarations: [
    LayoutComponent,
    AppTopbarComponent,
    AppMenuitemComponent,
    AppSidebarComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MenubarModule,
    RippleModule,
    InputTextModule,
    AvatarModule,
    BadgeModule,
    ButtonModule,
    SplitterModule,
  ]
})
export class LayoutModule { }
