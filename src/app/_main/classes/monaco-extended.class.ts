import * as monaco from 'monaco-editor';

type MonacoEditor = monaco.editor.IStandaloneCodeEditor;
type Selection = monaco.Selection;
type Range = monaco.IRange;
type EndOfLinePreference = monaco.editor.EndOfLinePreference;

export class MonacoExtended {
  public static insertTextAt(
    editor: MonacoEditor,
    lineNumber: number,
    column: number,
    text: string,
  ) {
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

  public static removeTextAt(
    editor: MonacoEditor,
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number,
  ) {
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

  public static insertTextBeforeSelection(
    editor: MonacoEditor,
    selection: Selection,
    text: string,
  ) {
    MonacoExtended.insertTextAt(editor, selection.startLineNumber, selection.startColumn, text);
  }

  public static insertTextAfterSelection(editor: MonacoEditor, selection: Selection, text: string) {
    MonacoExtended.insertTextAt(editor, selection.endLineNumber, selection.endColumn, text);
  }

  public static insertTextBeforeAndAfterEachSelection(
    editor: MonacoEditor,
    selections: Selection[],
    beforeSelectionText: string,
    afterSelectionText: string = '',
  ) {
    const edits = ([] as any[]).concat(
      ...selections.map((selection) => {
        return [
          {
            range: {
              startLineNumber: selection.startLineNumber,
              startColumn: selection.startColumn,
              endLineNumber: selection.startLineNumber,
              endColumn: selection.startColumn,
            },
            text: beforeSelectionText,
          },
          {
            range: {
              startLineNumber: selection.endLineNumber,
              startColumn: selection.endColumn,
              endLineNumber: selection.endLineNumber,
              endColumn: selection.endColumn,
            },
            text: afterSelectionText,
          },
        ];
      }),
    );

    editor.executeEdits('', edits);
  }

  public static removeTextBeforeAndAfterEachSelection(
    editor: MonacoEditor,
    selections: Selection[],
    beforeSelectionText: string,
    afterSelectionText: string = '',
  ) {
    const edits: any[] = [];

    for (const selection of selections) {
      if (
        MonacoExtended.selectionStartWith(editor, selection, beforeSelectionText) &&
        MonacoExtended.selectionEndsWith(editor, selection, afterSelectionText)
      ) {
        edits.push({
          range: {
            startLineNumber: selection.startLineNumber,
            startColumn: selection.startColumn,
            endLineNumber:
              selection.startLineNumber + (beforeSelectionText.match(/\n/g) || [])?.length,
            endColumn,
          },
          text: '',
        });
      }
    }

    const edits = ([] as any[]).concat(
      ...selections.map((selection) => {
        return [
          {
            range: {
              startLineNumber: selection.startLineNumber,
              startColumn: selection.startColumn,
              endLineNumber: selection.startLineNumber,
              endColumn: selection.startColumn,
            },
            text: beforeSelectionText,
          },
          {
            range: {
              startLineNumber: selection.endLineNumber,
              startColumn: selection.endColumn,
              endLineNumber: selection.endLineNumber,
              endColumn: selection.endColumn,
            },
            text: afterSelectionText,
          },
        ];
      }),
    );

    editor.executeEdits('', edits);
  }

  public static selectionStartWith(editor: MonacoEditor, selection: Selection, text: string) {
    const selectedValue = editor
      .getModel()
      ?.getValueInRange(selection, monaco.editor.EndOfLinePreference.LF);
    return selectedValue?.startsWith(text);
  }

  public static selectionEndsWith(editor: MonacoEditor, selection: Selection, text: string) {
    const selectedValue = editor
      .getModel()
      ?.getValueInRange(selection, monaco.editor.EndOfLinePreference.LF);
    return selectedValue?.endsWith(text);
  }

  public static removeCodeAtSelection(beforeSelectionText: string, afterSelectionText?: string) {
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

  toggleTextAtSelection(
    editor: MonacoEditor,
    beforeSelectionText: string,
    afterSelectionText: string = '',
  ) {
    const selections = editor.getSelections();
    if (!selections) return;

    const shouldDelete = selections.some(
      (selection) =>
        MonacoExtended.selectionStartWith(editor, selection, beforeSelectionText) &&
        MonacoExtended.selectionEndsWith(editor, selection, afterSelectionText),
    );

    const mode: 'delete' | 'add' = shouldDelete ? 'delete' : 'add';

    if (mode === 'delete') {
      this.removeCodeAtSelection(beforeSelectionText, afterSelectionText);
    } else {
      MonacoExtended.insertTextBeforeAndAfterEachSelection(
        editor,
        selections,
        beforeSelectionText,
        afterSelectionText,
      );
    }
  }
}
