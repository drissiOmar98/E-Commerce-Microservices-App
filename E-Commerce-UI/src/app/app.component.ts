import {Component, inject, OnInit} from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {FaIconLibrary} from "@fortawesome/angular-fontawesome";
import {fontAwesomeIcons} from "./shared/font-awesome-icons";
import {ToastService} from "./features/Admin/services/toast.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'E-Commerce-Front';

  faIconLibrary = inject(FaIconLibrary);
  toastService = inject(ToastService);
  messageService = inject(MessageService);

  constructor(private primengConfig: PrimeNGConfig) { }

  private initFontAwesome() {
    this.faIconLibrary.addIcons(...fontAwesomeIcons);
  }

  ngOnInit() {
    this.initFontAwesome();
    this.listenToastService();
    this.primengConfig.ripple = true;
  }


  /**
   * Subscribes to the toast service to listen for incoming toast messages.
   * When a new message is received (and it's not the initial state), the message service adds it to the UI to notify the user.
   */
  private listenToastService() {
    this.toastService.sendSub.subscribe({
      next: newMessage => {
        if(newMessage && newMessage.summary !== this.toastService.INIT_STATE) {
          this.messageService.add(newMessage);
        }
      }
    })
  }
}
