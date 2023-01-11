import{registerEditorAction,registerEditorCommand,registerEditorContribution}from"../../../browser/editorExtensions.js";import{AutoFixAction,CodeActionCommand,FixAllAction,OrganizeImportsAction,QuickFixAction,QuickFixController,RefactorAction,RefactorPreview,SourceAction}from"./codeActionCommands.js";import"./codeActionWidgetContribution.js";registerEditorContribution(QuickFixController.ID,QuickFixController),registerEditorAction(QuickFixAction),registerEditorAction(RefactorAction),registerEditorAction(RefactorPreview),registerEditorAction(SourceAction),registerEditorAction(OrganizeImportsAction),registerEditorAction(AutoFixAction),registerEditorAction(FixAllAction),registerEditorCommand(new CodeActionCommand);