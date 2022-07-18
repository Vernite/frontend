import { marked } from 'marked';
import { emoji } from './extensions/marked-emoji-extension';

export class Marked {
  private static _initialized = false;

  public static init() {
    if (Marked._initialized) return;

    marked.use({
      extensions: [emoji],
    });

    Marked._initialized = true;
  }
}
