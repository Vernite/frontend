var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{TimeoutTimer}from"../../../../base/common/async.js";import{CancellationTokenSource}from"../../../../base/common/cancellation.js";import{onUnexpectedError}from"../../../../base/common/errors.js";import{Emitter}from"../../../../base/common/event.js";import{DisposableStore,dispose}from"../../../../base/common/lifecycle.js";import{getLeadingWhitespace,isHighSurrogate,isLowSurrogate}from"../../../../base/common/strings.js";import{Selection}from"../../../common/core/selection.js";import{IEditorWorkerService}from"../../../common/services/editorWorker.js";import{SnippetController2}from"../../snippet/browser/snippetController2.js";import{WordDistance}from"./wordDistance.js";import{IClipboardService}from"../../../../platform/clipboard/common/clipboardService.js";import{IConfigurationService}from"../../../../platform/configuration/common/configuration.js";import{IContextKeyService}from"../../../../platform/contextkey/common/contextkey.js";import{ILogService}from"../../../../platform/log/common/log.js";import{ITelemetryService}from"../../../../platform/telemetry/common/telemetry.js";import{CompletionModel}from"./completionModel.js";import{CompletionOptions,getSnippetSuggestSupport,getSuggestionComparator,provideSuggestionItems,QuickSuggestionsOptions}from"./suggest.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";export class LineContext{constructor(model,position,auto,shy,noSelect){this.leadingLineContent=model.getLineContent(position.lineNumber).substr(0,position.column-1),this.leadingWord=model.getWordUntilPosition(position),this.lineNumber=position.lineNumber,this.column=position.column,this.auto=auto,this.shy=shy,this.noSelect=noSelect}static shouldAutoTrigger(editor){if(!editor.hasModel())return!1;const model=editor.getModel(),pos=editor.getPosition();model.tokenization.tokenizeIfCheap(pos.lineNumber);const word=model.getWordAtPosition(pos);return!!word&&(word.endColumn===pos.column&&!!isNaN(Number(word.word)))}}function isSuggestPreviewEnabled(editor){return editor.getOption(108).preview}function canShowQuickSuggest(editor,contextKeyService,configurationService){if(!Boolean(contextKeyService.getContextKeyValue("inlineSuggestionVisible")))return!0;const allowQuickSuggestions=configurationService.getValue("editor.inlineSuggest.allowQuickSuggestions");return void 0!==allowQuickSuggestions&&Boolean(allowQuickSuggestions)}function canShowSuggestOnTriggerCharacters(editor,contextKeyService,configurationService){if(!Boolean(contextKeyService.getContextKeyValue("inlineSuggestionVisible")))return!0;const allowQuickSuggestions=configurationService.getValue("editor.inlineSuggest.allowSuggestOnTriggerCharacters");return void 0!==allowQuickSuggestions&&Boolean(allowQuickSuggestions)}let SuggestModel=class SuggestModel{constructor(_editor,_editorWorkerService,_clipboardService,_telemetryService,_logService,_contextKeyService,_configurationService,_languageFeaturesService){this._editor=_editor,this._editorWorkerService=_editorWorkerService,this._clipboardService=_clipboardService,this._telemetryService=_telemetryService,this._logService=_logService,this._contextKeyService=_contextKeyService,this._configurationService=_configurationService,this._languageFeaturesService=_languageFeaturesService,this._toDispose=new DisposableStore,this._triggerCharacterListener=new DisposableStore,this._triggerQuickSuggest=new TimeoutTimer,this._state=0,this._completionDisposables=new DisposableStore,this._onDidCancel=new Emitter,this._onDidTrigger=new Emitter,this._onDidSuggest=new Emitter,this.onDidCancel=this._onDidCancel.event,this.onDidTrigger=this._onDidTrigger.event,this.onDidSuggest=this._onDidSuggest.event,this._telemetryGate=0,this._currentSelection=this._editor.getSelection()||new Selection(1,1,1,1),this._toDispose.add(this._editor.onDidChangeModel((()=>{this._updateTriggerCharacters(),this.cancel()}))),this._toDispose.add(this._editor.onDidChangeModelLanguage((()=>{this._updateTriggerCharacters(),this.cancel()}))),this._toDispose.add(this._editor.onDidChangeConfiguration((()=>{this._updateTriggerCharacters()}))),this._toDispose.add(this._languageFeaturesService.completionProvider.onDidChange((()=>{this._updateTriggerCharacters(),this._updateActiveSuggestSession()})));let editorIsComposing=!1;this._toDispose.add(this._editor.onDidCompositionStart((()=>{editorIsComposing=!0}))),this._toDispose.add(this._editor.onDidCompositionEnd((()=>{editorIsComposing=!1,this._onCompositionEnd()}))),this._toDispose.add(this._editor.onDidChangeCursorSelection((e=>{editorIsComposing||this._onCursorChange(e)}))),this._toDispose.add(this._editor.onDidChangeModelContent((()=>{editorIsComposing||this._refilterCompletionItems()}))),this._updateTriggerCharacters()}dispose(){dispose(this._triggerCharacterListener),dispose([this._onDidCancel,this._onDidSuggest,this._onDidTrigger,this._triggerQuickSuggest]),this._toDispose.dispose(),this._completionDisposables.dispose(),this.cancel()}_updateTriggerCharacters(){if(this._triggerCharacterListener.clear(),this._editor.getOption(83)||!this._editor.hasModel()||!this._editor.getOption(111))return;const supportsByTriggerCharacter=new Map;for(const support of this._languageFeaturesService.completionProvider.all(this._editor.getModel()))for(const ch of support.triggerCharacters||[]){let set=supportsByTriggerCharacter.get(ch);set||(set=new Set,set.add(getSnippetSuggestSupport()),supportsByTriggerCharacter.set(ch,set)),set.add(support)}const checkTriggerCharacter=text=>{if(!canShowSuggestOnTriggerCharacters(this._editor,this._contextKeyService,this._configurationService))return;if(LineContext.shouldAutoTrigger(this._editor))return;if(!text){const position=this._editor.getPosition();text=this._editor.getModel().getLineContent(position.lineNumber).substr(0,position.column-1)}let lastChar="";isLowSurrogate(text.charCodeAt(text.length-1))?isHighSurrogate(text.charCodeAt(text.length-2))&&(lastChar=text.substr(text.length-2)):lastChar=text.charAt(text.length-1);const supports=supportsByTriggerCharacter.get(lastChar);if(supports){const existing=this._completionModel?{items:this._completionModel.adopt(supports),clipboardText:this._completionModel.clipboardText}:void 0;this.trigger({auto:!0,shy:!1,noSelect:!1,triggerCharacter:lastChar},Boolean(this._completionModel),supports,existing)}};this._triggerCharacterListener.add(this._editor.onDidType(checkTriggerCharacter)),this._triggerCharacterListener.add(this._editor.onDidCompositionEnd((()=>checkTriggerCharacter())))}get state(){return this._state}cancel(retrigger=!1){var _a;0!==this._state&&(this._triggerQuickSuggest.cancel(),null===(_a=this._requestToken)||void 0===_a||_a.cancel(),this._requestToken=void 0,this._state=0,this._completionModel=void 0,this._context=void 0,this._onDidCancel.fire({retrigger}))}clear(){this._completionDisposables.clear()}_updateActiveSuggestSession(){0!==this._state&&(this._editor.hasModel()&&this._languageFeaturesService.completionProvider.has(this._editor.getModel())?this.trigger({auto:2===this._state,shy:!1,noSelect:!1},!0):this.cancel())}_onCursorChange(e){if(!this._editor.hasModel())return;const prevSelection=this._currentSelection;this._currentSelection=this._editor.getSelection(),!e.selection.isEmpty()||0!==e.reason&&3!==e.reason||"keyboard"!==e.source&&"deleteLeft"!==e.source?this.cancel():0===this._state&&0===e.reason?(prevSelection.containsRange(this._currentSelection)||prevSelection.getEndPosition().isBeforeOrEqual(this._currentSelection.getPosition()))&&this._doTriggerQuickSuggest():0!==this._state&&3===e.reason&&this._refilterCompletionItems()}_onCompositionEnd(){0===this._state?this._doTriggerQuickSuggest():this._refilterCompletionItems()}_doTriggerQuickSuggest(){var _a;QuickSuggestionsOptions.isAllOff(this._editor.getOption(81))||this._editor.getOption(108).snippetsPreventQuickSuggestions&&(null===(_a=SnippetController2.get(this._editor))||void 0===_a?void 0:_a.isInSnippet())||(this.cancel(),this._triggerQuickSuggest.cancelAndSet((()=>{if(0!==this._state)return;if(!LineContext.shouldAutoTrigger(this._editor))return;if(!this._editor.hasModel()||!this._editor.hasWidgetFocus())return;const model=this._editor.getModel(),pos=this._editor.getPosition(),config=this._editor.getOption(81);if(!QuickSuggestionsOptions.isAllOff(config)){if(!QuickSuggestionsOptions.isAllOn(config)){model.tokenization.tokenizeIfCheap(pos.lineNumber);const lineTokens=model.tokenization.getLineTokens(pos.lineNumber),tokenType=lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(pos.column-1-1,0)));if("on"!==QuickSuggestionsOptions.valueFor(config,tokenType))return}canShowQuickSuggest(this._editor,this._contextKeyService,this._configurationService)&&this._languageFeaturesService.completionProvider.has(model)&&this.trigger({auto:!0,shy:!1,noSelect:!1})}}),this._editor.getOption(82)))}_refilterCompletionItems(){Promise.resolve().then((()=>{if(0===this._state)return;if(!this._editor.hasModel())return;const model=this._editor.getModel(),position=this._editor.getPosition(),ctx=new LineContext(model,position,2===this._state,!1,!1);this._onNewContext(ctx)}))}trigger(context,retrigger=!1,onlyFrom,existing,noFilter){var _a;if(!this._editor.hasModel())return;const model=this._editor.getModel(),auto=context.auto,ctx=new LineContext(model,this._editor.getPosition(),auto,context.shy,context.noSelect);this.cancel(retrigger),this._state=auto?2:1,this._onDidTrigger.fire({auto,shy:context.shy,position:this._editor.getPosition()}),this._context=ctx;let suggestCtx={triggerKind:null!==(_a=context.triggerKind)&&void 0!==_a?_a:0};context.triggerCharacter&&(suggestCtx={triggerKind:1,triggerCharacter:context.triggerCharacter}),this._requestToken=new CancellationTokenSource;const snippetSuggestions=this._editor.getOption(103);let snippetSortOrder=1;switch(snippetSuggestions){case"top":snippetSortOrder=0;break;case"bottom":snippetSortOrder=2}const{itemKind:itemKindFilter,showDeprecated}=SuggestModel._createSuggestFilter(this._editor),completionOptions=new CompletionOptions(snippetSortOrder,noFilter?new Set:itemKindFilter,onlyFrom,showDeprecated),wordDistance=WordDistance.create(this._editorWorkerService,this._editor),completions=provideSuggestionItems(this._languageFeaturesService.completionProvider,model,this._editor.getPosition(),completionOptions,suggestCtx,this._requestToken.token);Promise.all([completions,wordDistance]).then((([completions,wordDistance])=>__awaiter(this,void 0,void 0,(function*(){var _b;if(null===(_b=this._requestToken)||void 0===_b||_b.dispose(),!this._editor.hasModel())return;let clipboardText=null==existing?void 0:existing.clipboardText;if(!clipboardText&&completions.needsClipboard&&(clipboardText=yield this._clipboardService.readText()),0===this._state)return;const model=this._editor.getModel();let items=completions.items;if(existing){const cmpFn=getSuggestionComparator(snippetSortOrder);items=items.concat(existing.items).sort(cmpFn)}const ctx=new LineContext(model,this._editor.getPosition(),auto,context.shy,context.noSelect);this._completionModel=new CompletionModel(items,this._context.column,{leadingLineContent:ctx.leadingLineContent,characterCountDelta:ctx.column-this._context.column},wordDistance,this._editor.getOption(108),this._editor.getOption(103),void 0,clipboardText),this._completionDisposables.add(completions.disposable),this._onNewContext(ctx),this._reportDurationsTelemetry(completions.durations)})))).catch(onUnexpectedError)}_reportDurationsTelemetry(durations){this._telemetryGate++%230==0&&setTimeout((()=>{this._telemetryService.publicLog2("suggest.durations.json",{data:JSON.stringify(durations)}),this._logService.debug("suggest.durations.json",durations)}))}static _createSuggestFilter(editor){const result=new Set;"none"===editor.getOption(103)&&result.add(27);const suggestOptions=editor.getOption(108);return suggestOptions.showMethods||result.add(0),suggestOptions.showFunctions||result.add(1),suggestOptions.showConstructors||result.add(2),suggestOptions.showFields||result.add(3),suggestOptions.showVariables||result.add(4),suggestOptions.showClasses||result.add(5),suggestOptions.showStructs||result.add(6),suggestOptions.showInterfaces||result.add(7),suggestOptions.showModules||result.add(8),suggestOptions.showProperties||result.add(9),suggestOptions.showEvents||result.add(10),suggestOptions.showOperators||result.add(11),suggestOptions.showUnits||result.add(12),suggestOptions.showValues||result.add(13),suggestOptions.showConstants||result.add(14),suggestOptions.showEnums||result.add(15),suggestOptions.showEnumMembers||result.add(16),suggestOptions.showKeywords||result.add(17),suggestOptions.showWords||result.add(18),suggestOptions.showColors||result.add(19),suggestOptions.showFiles||result.add(20),suggestOptions.showReferences||result.add(21),suggestOptions.showColors||result.add(22),suggestOptions.showFolders||result.add(23),suggestOptions.showTypeParameters||result.add(24),suggestOptions.showSnippets||result.add(27),suggestOptions.showUsers||result.add(25),suggestOptions.showIssues||result.add(26),{itemKind:result,showDeprecated:suggestOptions.showDeprecated}}_onNewContext(ctx){if(this._context)if(ctx.lineNumber===this._context.lineNumber)if(getLeadingWhitespace(ctx.leadingLineContent)===getLeadingWhitespace(this._context.leadingLineContent)){if(ctx.column<this._context.column)ctx.leadingWord.word?this.trigger({auto:this._context.auto,shy:!1,noSelect:!1},!0):this.cancel();else if(this._completionModel)if(0!==ctx.leadingWord.word.length&&ctx.leadingWord.startColumn>this._context.leadingWord.startColumn){const inactiveProvider=new Set(this._languageFeaturesService.completionProvider.all(this._editor.getModel()));for(const provider of this._completionModel.allProvider)inactiveProvider.delete(provider);const items=this._completionModel.adopt(new Set);this.trigger({auto:this._context.auto,shy:!1,noSelect:!1},!0,inactiveProvider,{items,clipboardText:this._completionModel.clipboardText})}else if(ctx.column>this._context.column&&this._completionModel.incomplete.size>0&&0!==ctx.leadingWord.word.length){const{incomplete}=this._completionModel,items=this._completionModel.adopt(incomplete);this.trigger({auto:2===this._state,shy:!1,noSelect:!1,triggerKind:2},!0,incomplete,{items,clipboardText:this._completionModel.clipboardText})}else{const oldLineContext=this._completionModel.lineContext;let isFrozen=!1;if(this._completionModel.lineContext={leadingLineContent:ctx.leadingLineContent,characterCountDelta:ctx.column-this._context.column},0===this._completionModel.items.length){if(LineContext.shouldAutoTrigger(this._editor)&&this._context.leadingWord.endColumn<ctx.leadingWord.startColumn)return void this.trigger({auto:this._context.auto,shy:!1,noSelect:!1},!0);if(this._context.auto)return void this.cancel();if(this._completionModel.lineContext=oldLineContext,isFrozen=this._completionModel.items.length>0,isFrozen&&0===ctx.leadingWord.word.length)return void this.cancel()}this._onDidSuggest.fire({completionModel:this._completionModel,auto:this._context.auto,shy:this._context.shy,noSelect:this._context.noSelect,isFrozen})}}else this.cancel();else this.cancel()}};SuggestModel=__decorate([__param(1,IEditorWorkerService),__param(2,IClipboardService),__param(3,ITelemetryService),__param(4,ILogService),__param(5,IContextKeyService),__param(6,IConfigurationService),__param(7,ILanguageFeaturesService)],SuggestModel);export{SuggestModel};