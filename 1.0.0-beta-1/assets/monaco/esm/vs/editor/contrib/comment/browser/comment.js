import{KeyChord}from"../../../../base/common/keyCodes.js";import{EditorAction,registerEditorAction}from"../../../browser/editorExtensions.js";import{Range}from"../../../common/core/range.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{ILanguageConfigurationService}from"../../../common/languages/languageConfigurationRegistry.js";import{BlockCommentCommand}from"./blockCommentCommand.js";import{LineCommentCommand}from"./lineCommentCommand.js";import*as nls from"../../../../nls.js";import{MenuId}from"../../../../platform/actions/common/actions.js";class CommentLineAction extends EditorAction{constructor(type,opts){super(opts),this._type=type}run(accessor,editor){const languageConfigurationService=accessor.get(ILanguageConfigurationService);if(!editor.hasModel())return;const commands=[],modelOptions=editor.getModel().getOptions(),commentsOptions=editor.getOption(19),selections=editor.getSelections().map(((selection,index)=>({selection,index,ignoreFirstLine:!1})));selections.sort(((a,b)=>Range.compareRangesUsingStarts(a.selection,b.selection)));let prev=selections[0];for(let i=1;i<selections.length;i++){const curr=selections[i];prev.selection.endLineNumber===curr.selection.startLineNumber&&(prev.index<curr.index?curr.ignoreFirstLine=!0:(prev.ignoreFirstLine=!0,prev=curr))}for(const selection of selections)commands.push(new LineCommentCommand(languageConfigurationService,selection.selection,modelOptions.tabSize,this._type,commentsOptions.insertSpace,commentsOptions.ignoreEmptyLines,selection.ignoreFirstLine));editor.pushUndoStop(),editor.executeCommands(this.id,commands),editor.pushUndoStop()}}class ToggleCommentLineAction extends CommentLineAction{constructor(){super(0,{id:"editor.action.commentLine",label:nls.localize("comment.line","Toggle Line Comment"),alias:"Toggle Line Comment",precondition:EditorContextKeys.writable,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:2133,weight:100},menuOpts:{menuId:MenuId.MenubarEditMenu,group:"5_insert",title:nls.localize({key:"miToggleLineComment",comment:["&& denotes a mnemonic"]},"&&Toggle Line Comment"),order:1}})}}class AddLineCommentAction extends CommentLineAction{constructor(){super(1,{id:"editor.action.addCommentLine",label:nls.localize("comment.line.add","Add Line Comment"),alias:"Add Line Comment",precondition:EditorContextKeys.writable,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2081),weight:100}})}}class RemoveLineCommentAction extends CommentLineAction{constructor(){super(2,{id:"editor.action.removeCommentLine",label:nls.localize("comment.line.remove","Remove Line Comment"),alias:"Remove Line Comment",precondition:EditorContextKeys.writable,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2099),weight:100}})}}class BlockCommentAction extends EditorAction{constructor(){super({id:"editor.action.blockComment",label:nls.localize("comment.block","Toggle Block Comment"),alias:"Toggle Block Comment",precondition:EditorContextKeys.writable,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:1567,linux:{primary:3103},weight:100},menuOpts:{menuId:MenuId.MenubarEditMenu,group:"5_insert",title:nls.localize({key:"miToggleBlockComment",comment:["&& denotes a mnemonic"]},"Toggle &&Block Comment"),order:2}})}run(accessor,editor){const languageConfigurationService=accessor.get(ILanguageConfigurationService);if(!editor.hasModel())return;const commentsOptions=editor.getOption(19),commands=[],selections=editor.getSelections();for(const selection of selections)commands.push(new BlockCommentCommand(selection,commentsOptions.insertSpace,languageConfigurationService));editor.pushUndoStop(),editor.executeCommands(this.id,commands),editor.pushUndoStop()}}registerEditorAction(ToggleCommentLineAction),registerEditorAction(AddLineCommentAction),registerEditorAction(RemoveLineCommentAction),registerEditorAction(BlockCommentAction);