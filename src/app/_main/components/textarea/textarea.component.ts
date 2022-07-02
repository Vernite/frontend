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

  insertTextAt(lineNumber: number, column: number, text: string) {
    const { editor } = this;
    if (!editor) return;

    editor.executeEdits('', [
      {
        range: {
          startLineNumber: lineNumber,
          startColumn: column,
          endLineNumber: lineNumber,
          endColumn: column,
        },
        text,
      },
    ]);
  }

  removeTextAt(
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number,
  ) {
    const { editor } = this;
    if (!editor) return;

    editor.executeEdits('', [
      {
        range: {
          startLineNumber,
          startColumn,
          endLineNumber,
          endColumn,
        },
        text: null,
      },
    ]);
  }

  insertCodeAtSelection(beforeSelectionText: string, afterSelectionText?: string) {
    const { editor } = this;

    if (!editor) return;
    const selections = editor.getSelections();
    if (!selections) return;

    for (const selection of selections) {
      if (afterSelectionText) {
        this.insertTextAt(selection.endLineNumber, selection.endColumn, afterSelectionText);
      }
      this.insertTextAt(selection.startLineNumber, selection.startColumn, beforeSelectionText);
    }
  }

  removeCodeAtSelection(beforeSelectionText: string, afterSelectionText?: string) {
    const { editor } = this;

    if (!editor) return;
    const selections = editor.getSelections();
    if (!selections) return;

    const lines = editor.getModel()?.getLinesContent();
    if (!lines) return;

    for (const selection of selections) {
      const selectedStart = lines[selection.startLineNumber - 1].substring(
        selection.startColumn - 1,
        selection.startColumn + beforeSelectionText.length - 1,
      );
      if (afterSelectionText) {
        const selectedEnd = lines[selection.endLineNumber - 1].substring(
          selection.endColumn - afterSelectionText.length - 1,
          selection.endColumn - 1,
        );

        if (selectedEnd === afterSelectionText && selectedStart === beforeSelectionText) {
          this.removeTextAt(
            selection.endLineNumber,
            selection.endColumn,
            selection.endLineNumber,
            selection.endColumn - afterSelectionText.length,
          );
          this.removeTextAt(
            selection.startLineNumber,
            selection.startColumn,
            selection.startLineNumber,
            selection.startColumn + beforeSelectionText.length,
          );
          break;
        }
      } else if (selectedStart === afterSelectionText) {
        this.removeTextAt(
          selection.startLineNumber,
          selection.startColumn,
          selection.startLineNumber,
          selection.startColumn + beforeSelectionText.length,
        );
      }
    }
  }

  toggleCodeAtSelection(beforeSelectionText: string, afterSelectionText?: string) {
    const { editor } = this;

    if (!editor) return;
    const selections = editor.getSelections();
    if (!selections) return;

    let mode = 'add';

    const lines = editor.getModel()?.getLinesContent();

    if (!lines) return;

    for (const selection of selections) {
      const selectedStart = lines[selection.startLineNumber - 1].substring(
        selection.startColumn - 1,
        selection.startColumn + beforeSelectionText.length - 1,
      );
      if (afterSelectionText) {
        const selectedEnd = lines[selection.endLineNumber - 1].substring(
          selection.endColumn - afterSelectionText.length - 1,
          selection.endColumn - 1,
        );

        if (selectedEnd === afterSelectionText && selectedStart === beforeSelectionText) {
          mode = 'delete';
          break;
        }
      } else if (selectedStart === afterSelectionText) {
        mode = 'delete';
      }
    }

    if (mode === 'delete') {
      this.removeCodeAtSelection(beforeSelectionText, afterSelectionText);
    } else {
      this.insertCodeAtSelection(beforeSelectionText, afterSelectionText);
    }
  }

  applyUnderline() {
    this.toggleCodeAtSelection('<u>', '</u>');
    this.editor?.focus();
  }

  applyBold() {
    this.toggleCodeAtSelection('**', '**');
    this.editor?.focus();
  }

  applyItalic() {
    this.toggleCodeAtSelection('*', '*');
    this.editor?.focus();
  }

  applyLink() {
    this.toggleCodeAtSelection('[', '](https://google.com)');
    this.editor?.focus();
  }

  applyCode() {
    this.toggleCodeAtSelection('```', '```');
    this.editor?.focus();
  }
}
