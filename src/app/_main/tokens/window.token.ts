import { InjectionToken } from '@angular/core';
import { WebviewWindow, appWindow } from '@tauri-apps/api/window';

export const WINDOW = new InjectionToken<Window | WebviewWindow>('WINDOW', {
  providedIn: 'root',
  factory: () => {
    return appWindow || window;
  },
});
