import { WebviewWindow } from '@tauri-apps/api/window';

export interface IWindow extends Window {
  __TAURI__?: WebviewWindow;
}
