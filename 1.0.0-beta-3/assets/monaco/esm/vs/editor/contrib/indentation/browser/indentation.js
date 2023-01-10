var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{DisposableStore}from"../../../../base/common/lifecycle.js";import*as strings from"../../../../base/common/strings.js";import{EditorAction,registerEditorAction,registerEditorContribution}from"../../../browser/editorExtensions.js";import{ShiftCommand}from"../../../common/commands/shiftCommand.js";import{EditOperation}from"../../../common/core/editOperation.js";import{Range}from"../../../common/core/range.js";import{Selection}from"../../../common/core/selection.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{ILanguageConfigurationService}from"../../../common/languages/languageConfigurationRegistry.js";import{IModelService}from"../../../common/services/model.js";import*as indentUtils from"./indentUtils.js";import*as nls from"../../../../nls.js";import{IQuickInputService}from"../../../../platform/quickinput/common/quickInput.js";import{normalizeIndentation}from"../../../common/core/indentation.js";import{getGoodIndentForLine,getIndentMetadata}from"../../../common/languages/autoIndent.js";export function getReindentEditOperations(model,languageConfigurationService,startLineNumber,endLineNumber,inheritedIndent){if(1===model.getLineCount()&&1===model.getLineMaxColumn(1))return[];const indentationRules=languageConfigurationService.getLanguageConfiguration(model.getLanguageId()).indentationRules;if(!indentationRules)return[];for(endLineNumber=Math.min(endLineNumber,model.getLineCount());startLineNumber<=endLineNumber&&indentationRules.unIndentedLinePattern;){const text=model.getLineContent(startLineNumber);if(!indentationRules.unIndentedLinePattern.test(text))break;startLineNumber++}if(startLineNumber>endLineNumber-1)return[];const{tabSize,indentSize,insertSpaces}=model.getOptions(),shiftIndent=(indentation,count)=>(count=count||1,ShiftCommand.shiftIndent(indentation,indentation.length+count,tabSize,indentSize,insertSpaces)),unshiftIndent=(indentation,count)=>(count=count||1,ShiftCommand.unshiftIndent(indentation,indentation.length+count,tabSize,indentSize,insertSpaces)),indentEdits=[];let globalIndent;const currentLineText=model.getLineContent(startLineNumber);let adjustedLineContent=currentLineText;if(null!=inheritedIndent){globalIndent=inheritedIndent;const oldIndentation=strings.getLeadingWhitespace(currentLineText);adjustedLineContent=globalIndent+currentLineText.substring(oldIndentation.length),indentationRules.decreaseIndentPattern&&indentationRules.decreaseIndentPattern.test(adjustedLineContent)&&(globalIndent=unshiftIndent(globalIndent),adjustedLineContent=globalIndent+currentLineText.substring(oldIndentation.length)),currentLineText!==adjustedLineContent&&indentEdits.push(EditOperation.replaceMove(new Selection(startLineNumber,1,startLineNumber,oldIndentation.length+1),normalizeIndentation(globalIndent,indentSize,insertSpaces)))}else globalIndent=strings.getLeadingWhitespace(currentLineText);let idealIndentForNextLine=globalIndent;indentationRules.increaseIndentPattern&&indentationRules.increaseIndentPattern.test(adjustedLineContent)?(idealIndentForNextLine=shiftIndent(idealIndentForNextLine),globalIndent=shiftIndent(globalIndent)):indentationRules.indentNextLinePattern&&indentationRules.indentNextLinePattern.test(adjustedLineContent)&&(idealIndentForNextLine=shiftIndent(idealIndentForNextLine));for(let lineNumber=++startLineNumber;lineNumber<=endLineNumber;lineNumber++){const text=model.getLineContent(lineNumber),oldIndentation=strings.getLeadingWhitespace(text),adjustedLineContent=idealIndentForNextLine+text.substring(oldIndentation.length);indentationRules.decreaseIndentPattern&&indentationRules.decreaseIndentPattern.test(adjustedLineContent)&&(idealIndentForNextLine=unshiftIndent(idealIndentForNextLine),globalIndent=unshiftIndent(globalIndent)),oldIndentation!==idealIndentForNextLine&&indentEdits.push(EditOperation.replaceMove(new Selection(lineNumber,1,lineNumber,oldIndentation.length+1),normalizeIndentation(idealIndentForNextLine,indentSize,insertSpaces))),indentationRules.unIndentedLinePattern&&indentationRules.unIndentedLinePattern.test(text)||(indentationRules.increaseIndentPattern&&indentationRules.increaseIndentPattern.test(adjustedLineContent)?(globalIndent=shiftIndent(globalIndent),idealIndentForNextLine=globalIndent):idealIndentForNextLine=indentationRules.indentNextLinePattern&&indentationRules.indentNextLinePattern.test(adjustedLineContent)?shiftIndent(idealIndentForNextLine):globalIndent)}return indentEdits}export class IndentationToSpacesAction extends EditorAction{constructor(){super({id:IndentationToSpacesAction.ID,label:nls.localize("indentationToSpaces","Convert Indentation to Spaces"),alias:"Convert Indentation to Spaces",precondition:EditorContextKeys.writable})}run(accessor,editor){const model=editor.getModel();if(!model)return;const modelOpts=model.getOptions(),selection=editor.getSelection();if(!selection)return;const command=new IndentationToSpacesCommand(selection,modelOpts.tabSize);editor.pushUndoStop(),editor.executeCommands(this.id,[command]),editor.pushUndoStop(),model.updateOptions({insertSpaces:!0})}}IndentationToSpacesAction.ID="editor.action.indentationToSpaces";export class IndentationToTabsAction extends EditorAction{constructor(){super({id:IndentationToTabsAction.ID,label:nls.localize("indentationToTabs","Convert Indentation to Tabs"),alias:"Convert Indentation to Tabs",precondition:EditorContextKeys.writable})}run(accessor,editor){const model=editor.getModel();if(!model)return;const modelOpts=model.getOptions(),selection=editor.getSelection();if(!selection)return;const command=new IndentationToTabsCommand(selection,modelOpts.tabSize);editor.pushUndoStop(),editor.executeCommands(this.id,[command]),editor.pushUndoStop(),model.updateOptions({insertSpaces:!1})}}IndentationToTabsAction.ID="editor.action.indentationToTabs";export class ChangeIndentationSizeAction extends EditorAction{constructor(insertSpaces,opts){super(opts),this.insertSpaces=insertSpaces}run(accessor,editor){const quickInputService=accessor.get(IQuickInputService),modelService=accessor.get(IModelService),model=editor.getModel();if(!model)return;const creationOpts=modelService.getCreationOptions(model.getLanguageId(),model.uri,model.isForSimpleWidget),picks=[1,2,3,4,5,6,7,8].map((n=>({id:n.toString(),label:n.toString(),description:n===creationOpts.tabSize?nls.localize("configuredTabSize","Configured Tab Size"):void 0}))),autoFocusIndex=Math.min(model.getOptions().tabSize-1,7);setTimeout((()=>{quickInputService.pick(picks,{placeHolder:nls.localize({key:"selectTabWidth",comment:["Tab corresponds to the tab key"]},"Select Tab Size for Current File"),activeItem:picks[autoFocusIndex]}).then((pick=>{pick&&model&&!model.isDisposed()&&model.updateOptions({tabSize:parseInt(pick.label,10),insertSpaces:this.insertSpaces})}))}),50)}}export class IndentUsingTabs extends ChangeIndentationSizeAction{constructor(){super(!1,{id:IndentUsingTabs.ID,label:nls.localize("indentUsingTabs","Indent Using Tabs"),alias:"Indent Using Tabs",precondition:void 0})}}IndentUsingTabs.ID="editor.action.indentUsingTabs";export class IndentUsingSpaces extends ChangeIndentationSizeAction{constructor(){super(!0,{id:IndentUsingSpaces.ID,label:nls.localize("indentUsingSpaces","Indent Using Spaces"),alias:"Indent Using Spaces",precondition:void 0})}}IndentUsingSpaces.ID="editor.action.indentUsingSpaces";export class DetectIndentation extends EditorAction{constructor(){super({id:DetectIndentation.ID,label:nls.localize("detectIndentation","Detect Indentation from Content"),alias:"Detect Indentation from Content",precondition:void 0})}run(accessor,editor){const modelService=accessor.get(IModelService),model=editor.getModel();if(!model)return;const creationOpts=modelService.getCreationOptions(model.getLanguageId(),model.uri,model.isForSimpleWidget);model.detectIndentation(creationOpts.insertSpaces,creationOpts.tabSize)}}DetectIndentation.ID="editor.action.detectIndentation";export class ReindentLinesAction extends EditorAction{constructor(){super({id:"editor.action.reindentlines",label:nls.localize("editor.reindentlines","Reindent Lines"),alias:"Reindent Lines",precondition:EditorContextKeys.writable})}run(accessor,editor){const languageConfigurationService=accessor.get(ILanguageConfigurationService),model=editor.getModel();if(!model)return;const edits=getReindentEditOperations(model,languageConfigurationService,1,model.getLineCount());edits.length>0&&(editor.pushUndoStop(),editor.executeEdits(this.id,edits),editor.pushUndoStop())}}export class ReindentSelectedLinesAction extends EditorAction{constructor(){super({id:"editor.action.reindentselectedlines",label:nls.localize("editor.reindentselectedlines","Reindent Selected Lines"),alias:"Reindent Selected Lines",precondition:EditorContextKeys.writable})}run(accessor,editor){const languageConfigurationService=accessor.get(ILanguageConfigurationService),model=editor.getModel();if(!model)return;const selections=editor.getSelections();if(null===selections)return;const edits=[];for(const selection of selections){let startLineNumber=selection.startLineNumber,endLineNumber=selection.endLineNumber;if(startLineNumber!==endLineNumber&&1===selection.endColumn&&endLineNumber--,1===startLineNumber){if(startLineNumber===endLineNumber)continue}else startLineNumber--;const editOperations=getReindentEditOperations(model,languageConfigurationService,startLineNumber,endLineNumber);edits.push(...editOperations)}edits.length>0&&(editor.pushUndoStop(),editor.executeEdits(this.id,edits),editor.pushUndoStop())}}export class AutoIndentOnPasteCommand{constructor(edits,initialSelection){this._initialSelection=initialSelection,this._edits=[],this._selectionId=null;for(const edit of edits)edit.range&&"string"==typeof edit.text&&this._edits.push(edit)}getEditOperations(model,builder){for(const edit of this._edits)builder.addEditOperation(Range.lift(edit.range),edit.text);let selectionIsSet=!1;Array.isArray(this._edits)&&1===this._edits.length&&this._initialSelection.isEmpty()&&(this._edits[0].range.startColumn===this._initialSelection.endColumn&&this._edits[0].range.startLineNumber===this._initialSelection.endLineNumber?(selectionIsSet=!0,this._selectionId=builder.trackSelection(this._initialSelection,!0)):this._edits[0].range.endColumn===this._initialSelection.startColumn&&this._edits[0].range.endLineNumber===this._initialSelection.startLineNumber&&(selectionIsSet=!0,this._selectionId=builder.trackSelection(this._initialSelection,!1))),selectionIsSet||(this._selectionId=builder.trackSelection(this._initialSelection))}computeCursorState(model,helper){return helper.getTrackedSelection(this._selectionId)}}let AutoIndentOnPaste=class AutoIndentOnPaste{constructor(editor,_languageConfigurationService){this.editor=editor,this._languageConfigurationService=_languageConfigurationService,this.callOnDispose=new DisposableStore,this.callOnModel=new DisposableStore,this.callOnDispose.add(editor.onDidChangeConfiguration((()=>this.update()))),this.callOnDispose.add(editor.onDidChangeModel((()=>this.update()))),this.callOnDispose.add(editor.onDidChangeModelLanguage((()=>this.update())))}update(){this.callOnModel.clear(),this.editor.getOption(9)<4||this.editor.getOption(50)||this.editor.hasModel()&&this.callOnModel.add(this.editor.onDidPaste((({range})=>{this.trigger(range)})))}trigger(range){const selections=this.editor.getSelections();if(null===selections||selections.length>1)return;const model=this.editor.getModel();if(!model)return;if(!model.tokenization.isCheapToTokenize(range.getStartPosition().lineNumber))return;const autoIndent=this.editor.getOption(9),{tabSize,indentSize,insertSpaces}=model.getOptions(),textEdits=[],indentConverter={shiftIndent:indentation=>ShiftCommand.shiftIndent(indentation,indentation.length+1,tabSize,indentSize,insertSpaces),unshiftIndent:indentation=>ShiftCommand.unshiftIndent(indentation,indentation.length+1,tabSize,indentSize,insertSpaces)};let startLineNumber=range.startLineNumber;for(;startLineNumber<=range.endLineNumber&&this.shouldIgnoreLine(model,startLineNumber);)startLineNumber++;if(startLineNumber>range.endLineNumber)return;let firstLineText=model.getLineContent(startLineNumber);if(!/\S/.test(firstLineText.substring(0,range.startColumn-1))){const indentOfFirstLine=getGoodIndentForLine(autoIndent,model,model.getLanguageId(),startLineNumber,indentConverter,this._languageConfigurationService);if(null!==indentOfFirstLine){const oldIndentation=strings.getLeadingWhitespace(firstLineText),newSpaceCnt=indentUtils.getSpaceCnt(indentOfFirstLine,tabSize);if(newSpaceCnt!==indentUtils.getSpaceCnt(oldIndentation,tabSize)){const newIndent=indentUtils.generateIndent(newSpaceCnt,tabSize,insertSpaces);textEdits.push({range:new Range(startLineNumber,1,startLineNumber,oldIndentation.length+1),text:newIndent}),firstLineText=newIndent+firstLineText.substr(oldIndentation.length)}else{const indentMetadata=getIndentMetadata(model,startLineNumber,this._languageConfigurationService);if(0===indentMetadata||8===indentMetadata)return}}}const firstLineNumber=startLineNumber;for(;startLineNumber<range.endLineNumber&&!/\S/.test(model.getLineContent(startLineNumber+1));)startLineNumber++;if(startLineNumber!==range.endLineNumber){const indentOfSecondLine=getGoodIndentForLine(autoIndent,{tokenization:{getLineTokens:lineNumber=>model.tokenization.getLineTokens(lineNumber),getLanguageId:()=>model.getLanguageId(),getLanguageIdAtPosition:(lineNumber,column)=>model.getLanguageIdAtPosition(lineNumber,column)},getLineContent:lineNumber=>lineNumber===firstLineNumber?firstLineText:model.getLineContent(lineNumber)},model.getLanguageId(),startLineNumber+1,indentConverter,this._languageConfigurationService);if(null!==indentOfSecondLine){const newSpaceCntOfSecondLine=indentUtils.getSpaceCnt(indentOfSecondLine,tabSize),oldSpaceCntOfSecondLine=indentUtils.getSpaceCnt(strings.getLeadingWhitespace(model.getLineContent(startLineNumber+1)),tabSize);if(newSpaceCntOfSecondLine!==oldSpaceCntOfSecondLine){const spaceCntOffset=newSpaceCntOfSecondLine-oldSpaceCntOfSecondLine;for(let i=startLineNumber+1;i<=range.endLineNumber;i++){const lineContent=model.getLineContent(i),originalIndent=strings.getLeadingWhitespace(lineContent),newSpacesCnt=indentUtils.getSpaceCnt(originalIndent,tabSize)+spaceCntOffset,newIndent=indentUtils.generateIndent(newSpacesCnt,tabSize,insertSpaces);newIndent!==originalIndent&&textEdits.push({range:new Range(i,1,i,originalIndent.length+1),text:newIndent})}}}}if(textEdits.length>0){this.editor.pushUndoStop();const cmd=new AutoIndentOnPasteCommand(textEdits,this.editor.getSelection());this.editor.executeCommand("autoIndentOnPaste",cmd),this.editor.pushUndoStop()}}shouldIgnoreLine(model,lineNumber){model.tokenization.forceTokenization(lineNumber);const nonWhitespaceColumn=model.getLineFirstNonWhitespaceColumn(lineNumber);if(0===nonWhitespaceColumn)return!0;const tokens=model.tokenization.getLineTokens(lineNumber);if(tokens.getCount()>0){const firstNonWhitespaceTokenIndex=tokens.findTokenIndexAtOffset(nonWhitespaceColumn);if(firstNonWhitespaceTokenIndex>=0&&1===tokens.getStandardTokenType(firstNonWhitespaceTokenIndex))return!0}return!1}dispose(){this.callOnDispose.dispose(),this.callOnModel.dispose()}};AutoIndentOnPaste.ID="editor.contrib.autoIndentOnPaste",AutoIndentOnPaste=__decorate([__param(1,ILanguageConfigurationService)],AutoIndentOnPaste);export{AutoIndentOnPaste};function getIndentationEditOperations(model,builder,tabSize,tabsToSpaces){if(1===model.getLineCount()&&1===model.getLineMaxColumn(1))return;let spaces="";for(let i=0;i<tabSize;i++)spaces+=" ";const spacesRegExp=new RegExp(spaces,"gi");for(let lineNumber=1,lineCount=model.getLineCount();lineNumber<=lineCount;lineNumber++){let lastIndentationColumn=model.getLineFirstNonWhitespaceColumn(lineNumber);if(0===lastIndentationColumn&&(lastIndentationColumn=model.getLineMaxColumn(lineNumber)),1===lastIndentationColumn)continue;const originalIndentationRange=new Range(lineNumber,1,lineNumber,lastIndentationColumn),originalIndentation=model.getValueInRange(originalIndentationRange),newIndentation=tabsToSpaces?originalIndentation.replace(/\t/gi,spaces):originalIndentation.replace(spacesRegExp,"\t");builder.addEditOperation(originalIndentationRange,newIndentation)}}export class IndentationToSpacesCommand{constructor(selection,tabSize){this.selection=selection,this.tabSize=tabSize,this.selectionId=null}getEditOperations(model,builder){this.selectionId=builder.trackSelection(this.selection),getIndentationEditOperations(model,builder,this.tabSize,!0)}computeCursorState(model,helper){return helper.getTrackedSelection(this.selectionId)}}export class IndentationToTabsCommand{constructor(selection,tabSize){this.selection=selection,this.tabSize=tabSize,this.selectionId=null}getEditOperations(model,builder){this.selectionId=builder.trackSelection(this.selection),getIndentationEditOperations(model,builder,this.tabSize,!1)}computeCursorState(model,helper){return helper.getTrackedSelection(this.selectionId)}}registerEditorContribution(AutoIndentOnPaste.ID,AutoIndentOnPaste),registerEditorAction(IndentationToSpacesAction),registerEditorAction(IndentationToTabsAction),registerEditorAction(IndentUsingTabs),registerEditorAction(IndentUsingSpaces),registerEditorAction(DetectIndentation),registerEditorAction(ReindentLinesAction),registerEditorAction(ReindentSelectedLinesAction);