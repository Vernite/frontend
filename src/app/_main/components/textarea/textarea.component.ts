import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlAccessor } from '@main/classes/control-accessor.class';
import * as monaco from 'monaco-editor';
// eslint-disable-next-line unused-imports/no-unused-imports
import { darkTheme } from './textarea.theme';
import { marked } from 'marked';
import { markdownExample } from './markdown.example';
import hljs from 'highlight.js';
import { EmojiConvertor } from 'emoji-js';
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

  public mode: 'editor' | 'preview' = 'editor';
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

  faCode = faCode;
  faUnderline = faUnderline;
  faBold = faBold;
  faItalic = faItalic;
  faQuoteLeft = faQuoteLeft;
  faList = faList;
  faListNumeric = faListNumeric;
  faLink = faLink;

  ngOnInit(): void {
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
  }

  openEditor() {
    this.mode = 'editor';
  }

  openPreview() {
    this.output.nativeElement.innerHTML = marked.parse(this.editor?.getValue() || '');
    this.output.nativeElement
      .querySelectorAll<HTMLElement>('pre code')
      .forEach((c: HTMLElement) => {
        hljs.highlightElement(c);
      });

    let emoji = new EmojiConvertor();
    emoji.replace_mode = 'unified';
    emoji.allow_native = true;

    this.output.nativeElement.innerHTML = emoji.replace_colons(this.output.nativeElement.innerHTML);

    (window as any).twemoji.parse(this.output.nativeElement, {
      size: '16x16',
      // ext: '.svg',
      base: 'https://twemoji.maxcdn.com/',
    });
    this.mode = 'preview';
  }

  applyUnderline() {
    this.toggleEndAndStartOfEachSelection('<u>', '</u>');
    this.editor?.focus();
  }

  applyBold() {
    this.toggleEndAndStartOfEachSelection('**', '**');
    this.editor?.focus();
  }

  applyItalic() {
    this.toggleEndAndStartOfEachSelection('*', '*');
    this.editor?.focus();
  }

  applyLink() {
    this.toggleEndAndStartOfEachSelection('[', '](https://google.com)');
    this.editor?.focus();
  }

  applyList() {
    this.toggleEndAndStartOfEachSelection('<ul>', '</ul>');
    this.editor?.focus();
  }

  applyListNumeric() {
    this.editor?.focus();
  }

  applyQuote() {
    this.editor?.focus();
  }

  applyCode() {
    this.toggleEndAndStartOfEachSelection('`', '`');
    this.editor?.focus();
  }

  applyCodeBlock() {
    this.toggleEndAndStartOfEachSelection('```javascript\n', '\n```');
    this.editor?.focus();
  }
}
