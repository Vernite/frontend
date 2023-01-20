var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{CancellationToken}from"../../../../base/common/cancellation.js";import{FuzzyScore}from"../../../../base/common/filters.js";import{Iterable}from"../../../../base/common/iterator.js";import{RefCountedDisposable}from"../../../../base/common/lifecycle.js";import{registerEditorContribution}from"../../../browser/editorExtensions.js";import{ICodeEditorService}from"../../../browser/services/codeEditorService.js";import{Range}from"../../../common/core/range.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";import{CompletionItemInsertTextRule}from"../../../common/standalone/standaloneEnums.js";import{CompletionModel,LineContext}from"./completionModel.js";import{CompletionOptions,provideSuggestionItems,QuickSuggestionsOptions}from"./suggest.js";import{ISuggestMemoryService}from"./suggestMemory.js";import{WordDistance}from"./wordDistance.js";import{IClipboardService}from"../../../../platform/clipboard/common/clipboardService.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";class SuggestInlineCompletion{constructor(range,insertText,filterText,additionalTextEdits,command,completion){this.range=range,this.insertText=insertText,this.filterText=filterText,this.additionalTextEdits=additionalTextEdits,this.command=command,this.completion=completion}}let InlineCompletionResults=class InlineCompletionResults extends RefCountedDisposable{constructor(model,line,word,completionModel,completions,_suggestMemoryService){super(completions.disposable),this.model=model,this.line=line,this.word=word,this.completionModel=completionModel,this._suggestMemoryService=_suggestMemoryService}canBeReused(model,line,word){return this.model===model&&this.line===line&&this.word.word.length>0&&this.word.startColumn===word.startColumn&&this.word.endColumn<word.endColumn&&0===this.completionModel.incomplete.size}get items(){var _a;const result=[],{items}=this.completionModel,selectedIndex=this._suggestMemoryService.select(this.model,{lineNumber:this.line,column:this.word.endColumn+this.completionModel.lineContext.characterCountDelta},items),first=Iterable.slice(items,selectedIndex),second=Iterable.slice(items,0,selectedIndex);let resolveCount=5;for(const item of Iterable.concat(first,second)){if(item.score===FuzzyScore.Default)continue;const range=new Range(item.editStart.lineNumber,item.editStart.column,item.editInsertEnd.lineNumber,item.editInsertEnd.column+this.completionModel.lineContext.characterCountDelta),insertText=item.completion.insertTextRules&&item.completion.insertTextRules&CompletionItemInsertTextRule.InsertAsSnippet?{snippet:item.completion.insertText}:item.completion.insertText;result.push(new SuggestInlineCompletion(range,insertText,null!==(_a=item.filterTextLow)&&void 0!==_a?_a:item.labelLow,item.completion.additionalTextEdits,item.completion.command,item)),resolveCount-- >=0&&item.resolve(CancellationToken.None)}return result}};InlineCompletionResults=__decorate([__param(5,ISuggestMemoryService)],InlineCompletionResults);let SuggestInlineCompletions=class SuggestInlineCompletions{constructor(_getEditorOption,_languageFeatureService,_clipboardService,_suggestMemoryService){this._getEditorOption=_getEditorOption,this._languageFeatureService=_languageFeatureService,this._clipboardService=_clipboardService,this._suggestMemoryService=_suggestMemoryService}provideInlineCompletions(model,position,context,token){var _a;return __awaiter(this,void 0,void 0,(function*(){if(context.selectedSuggestionInfo)return;const config=this._getEditorOption(81,model);if(QuickSuggestionsOptions.isAllOff(config))return;model.tokenization.tokenizeIfCheap(position.lineNumber);const lineTokens=model.tokenization.getLineTokens(position.lineNumber),tokenType=lineTokens.getStandardTokenType(lineTokens.findTokenIndexAtOffset(Math.max(position.column-1-1,0)));if("inline"!==QuickSuggestionsOptions.valueFor(config,tokenType))return;let triggerCharacterInfo,result,wordInfo=model.getWordAtPosition(position);if((null==wordInfo?void 0:wordInfo.word)||(triggerCharacterInfo=this._getTriggerCharacterInfo(model,position)),!(null==wordInfo?void 0:wordInfo.word)&&!triggerCharacterInfo)return;if(wordInfo||(wordInfo=model.getWordUntilPosition(position)),wordInfo.endColumn!==position.column)return;const leadingLineContents=model.getValueInRange(new Range(position.lineNumber,1,position.lineNumber,position.column));if(!triggerCharacterInfo&&(null===(_a=this._lastResult)||void 0===_a?void 0:_a.canBeReused(model,position.lineNumber,wordInfo))){const newLineContext=new LineContext(leadingLineContents,position.column-this._lastResult.word.endColumn);this._lastResult.completionModel.lineContext=newLineContext,this._lastResult.acquire(),result=this._lastResult}else{const completions=yield provideSuggestionItems(this._languageFeatureService.completionProvider,model,position,new CompletionOptions(void 0,void 0,null==triggerCharacterInfo?void 0:triggerCharacterInfo.providers),triggerCharacterInfo&&{triggerKind:1,triggerCharacter:triggerCharacterInfo.ch},token);let clipboardText;completions.needsClipboard&&(clipboardText=yield this._clipboardService.readText());const completionModel=new CompletionModel(completions.items,position.column,new LineContext(leadingLineContents,0),WordDistance.None,this._getEditorOption(108,model),this._getEditorOption(103,model),{boostFullMatch:!1,firstMatchCanBeWeak:!1},clipboardText);result=new InlineCompletionResults(model,position.lineNumber,wordInfo,completionModel,completions,this._suggestMemoryService)}return this._lastResult=result,result}))}handleItemDidShow(_completions,item){item.completion.resolve(CancellationToken.None)}freeInlineCompletions(result){result.release()}_getTriggerCharacterInfo(model,position){var _a;const ch=model.getValueInRange(Range.fromPositions({lineNumber:position.lineNumber,column:position.column-1},position)),providers=new Set;for(const provider of this._languageFeatureService.completionProvider.all(model))(null===(_a=provider.triggerCharacters)||void 0===_a?void 0:_a.includes(ch))&&providers.add(provider);if(0!==providers.size)return{providers,ch}}};SuggestInlineCompletions=__decorate([__param(1,ILanguageFeaturesService),__param(2,IClipboardService),__param(3,ISuggestMemoryService)],SuggestInlineCompletions);export{SuggestInlineCompletions};let EditorContribution=class EditorContribution{constructor(_editor,languageFeatureService,editorService,instaService){if(1==++EditorContribution._counter){const provider=instaService.createInstance(SuggestInlineCompletions,((id,model)=>{var _a;return(null!==(_a=editorService.listCodeEditors().find((editor=>editor.getModel()===model)))&&void 0!==_a?_a:_editor).getOption(id)}));EditorContribution._disposable=languageFeatureService.inlineCompletionsProvider.register("*",provider)}}dispose(){var _a;0==--EditorContribution._counter&&(null===(_a=EditorContribution._disposable)||void 0===_a||_a.dispose(),EditorContribution._disposable=void 0)}};EditorContribution._counter=0,EditorContribution=__decorate([__param(1,ILanguageFeaturesService),__param(2,ICodeEditorService),__param(3,IInstantiationService)],EditorContribution),registerEditorContribution("suggest.inlineCompletionsProvider",EditorContribution);