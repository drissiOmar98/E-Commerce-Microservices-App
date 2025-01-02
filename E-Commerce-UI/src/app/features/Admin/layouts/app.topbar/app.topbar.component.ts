
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.scss',
})
export class AppTopbarComponent {

  @ViewChild('menuButton') menuButton!: ElementRef;

  @Input() user: any;

  constructor(public layoutService: LayoutService, public el: ElementRef) {}

  onMenuToggle() {
    this.layoutService.onMenuToggle();
  }
}
