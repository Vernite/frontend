import { Inject, Injectable } from '@angular/core';
import { IWindow } from '@main/interfaces/window.interface';
import { WINDOW } from '@main/tokens/window.token';
import { UAParser } from 'ua-parser-js';

@Injectable({
  providedIn: 'root',
})
export class PlatformService {
  constructor(@Inject(WINDOW) private window: IWindow) {}

  public isDesktopApp() {
    return Boolean(this.window?.__TAURI__);
  }

  public isBrowser() {
    return !this.isDesktopApp() && this.window;
  }

  public get agent() {
    if (!this.window?.navigator?.userAgent) return null;
    return new UAParser(this.window.navigator.userAgent);
  }
}
