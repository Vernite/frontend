import * as monaco from 'monaco-editor';

export const darkTheme = monaco.editor.defineTheme('dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#364053',
  },
});
