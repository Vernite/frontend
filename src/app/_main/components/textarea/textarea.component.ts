import { Monaco } from './../../libs/monaco/monaco.lib';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlAccessor } from '@main/classes/control-accessor.class';
import * as monaco from 'monaco-editor';
// eslint-disable-next-line unused-imports/no-unused-imports
import { darkTheme } from './textarea.theme';
import { marked, Renderer } from 'marked';
import { markdownExample } from './markdown.example';
import hljs from 'highlight.js';
import {
  faBold,
  faCode,
  faItalic,
  faLink,
  faList,
  faListNumeric,
  faQuoteLeft,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import { MonacoExtended } from '@main/classes/monaco-extended.class';
import { Marked } from '@main/libs/marked/marked.lib';

console.log(darkTheme);

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
})
export class TextareaComponent extends ControlAccessor implements OnInit, AfterViewInit {
  /**
   * Floating label text to display
   */
  @Input() floatingLabel?: string;

  /**
   * Static label text to display
   */
  @Input() staticLabel?: string;

  /**
   * Input placeholder text
   */
  @Input() placeholder: string = '';

  /**
   * Hint to display beneath the input to provide additional information of how to use the input
   */
  @Input() hint?: string;

  @Input() rows?: number = 4;

  @Input() cols?: number = 50;

  @ViewChild('input') input!: ElementRef<HTMLElement>;
  @ViewChild('output') output!: ElementRef<HTMLElement>;

  private renderer: Renderer = Marked.getRenderer();

  public mode: 'editor' | 'preview' = 'editor';

  /** @ignore */
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;

  private toggleEndAndStartOfEachSelection(
    beforeSelectionText: string,
    afterSelectionText: string = '',
  ) {
    const { editor } = this;
    if (!editor) return;

    return MonacoExtended.toggleEndAndStartOfEachSelection(
      editor,
      beforeSelectionText,
      afterSelectionText,
    );
  }

  /** @ignore */
  faCode = faCode;

  /** @ignore */
  faUnderline = faUnderline;

  /** @ignore */
  faBold = faBold;

  /** @ignore */
  faItalic = faItalic;

  /** @ignore */
  faQuoteLeft = faQuoteLeft;

  /** @ignore */
  faList = faList;

  /** @ignore */
  faListNumeric = faListNumeric;

  /** @ignore */
  faLink = faLink;

  ngOnInit(): void {
    Marked.init();
    Monaco.init();
    hljs.configure({ languages: [] });
  }

  ngAfterViewInit(): void {
    const container = this.input.nativeElement;
    const editor = monaco.editor.create(container, {
      value: markdownExample,
      language: 'markdown',
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      wrappingStrategy: 'advanced',
      minimap: {
        enabled: false,
      },
      overviewRulerLanes: 0,
      theme: 'dark',
    });
    let ignoreEvent = false;
    const updateHeight = () => {
      const contentHeight = Math.min(500, editor.getContentHeight());
      const containerWidth = Math.min(1000, container.scrollWidth);
      container.style.width = `${containerWidth}px`;
      container.style.height = `${contentHeight}px`;
      try {
        ignoreEvent = true;
        editor.layout({ width: containerWidth, height: contentHeight });
      } finally {
        ignoreEvent = false;
      }
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight();
    this.editor = editor;

    console.log(this.editor);
    (window as any).textarea = this;
  }

  openEditor() {
    this.mode = 'editor';
  }

  openPreview() {
    const { renderer } = this;

    this.output.nativeElement.innerHTML = marked.parse(this.editor?.getValue() || '', { renderer });
    this.output.nativeElement
      .querySelectorAll<HTMLElement>('pre code')
      .forEach((c: HTMLElement) => {
        hljs.highlightElement(c);
      });

    this.mode = 'preview';
  }

  applyUnderline() {
    this.editor?.executeSelectionEdits({
      before: '<u>',
      after: '</u>',
    });
    this.editor?.focus();
  }

  applyBold() {
    this.editor?.executeSelectionEdits({
      before: '**',
      after: '**',
    });
    this.editor?.focus();
  }

  applyItalic() {
    this.editor?.executeSelectionEdits({
      before: '*',
      after: '*',
    });
    this.editor?.focus();
  }

  applyLink() {
    this.editor?.executeSelectionEdits({
      before: '[',
      after: '](https://google.com)',
    });
    this.editor?.focus();
  }

  applyList() {
    this.editor?.executeSelectionEdits({
      before: '<ul>\n',
      after: '\n</ul>',
      beforeEachLine: '  <li>',
      afterEachLine: '</li>',
    });
    this.editor?.focus();
  }

  applyListNumeric() {
    this.editor?.executeSelectionEdits({
      before: '<ol>\n',
      after: '\n</ol>',
      beforeEachLine: '  <li>',
      afterEachLine: '</li>',
    });
    this.editor?.focus();
  }

  applyQuote() {
    this.editor?.executeSelectionEdits({
      beforeEachLine: '>',
    });
    this.editor?.focus();
  }

  applyCode() {
    this.editor?.executeSelectionEdits({
      before: '`',
      after: '`',
    });
    this.editor?.focus();
  }

  applyCodeBlock() {
    this.editor?.executeSelectionEdits({
      before: '```javascript\n',
      after: '\n```',
    });
    this.editor?.focus();
  }
}
