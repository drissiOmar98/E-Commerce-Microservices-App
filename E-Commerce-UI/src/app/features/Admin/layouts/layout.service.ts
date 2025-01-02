import { effect, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

// export interface AppConfig {
//   inputStyle: string;
//   colorScheme: string;
//   theme: string;
//   ripple: boolean;
//   menuMode: string;
//   scale: number;
// }

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // _config: AppConfig = {
  //   ripple: false,
  //   inputStyle: 'outlined',
  //   menuMode: 'static',
  //   colorScheme: 'light',
  //   theme: 'lara-light-indigo',
  //   scale: 14,
  // };

  //config = signal<AppConfig>(this._config);

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private overlayOpen = new Subject<any>();

  overlayOpen$ = this.overlayOpen.asObservable();

  constructor() {}

  onMenuToggle() {
    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (!this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  changeScale(value: number) {
    document.documentElement.style.fontSize = `${value}px`;
  }
}
