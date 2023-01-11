var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{Color}from"../../../base/common/color.js";import{Range}from"../../common/core/range.js";import*as languages from"../../common/languages.js";import{ILanguageConfigurationService}from"../../common/languages/languageConfigurationRegistry.js";import{ModesRegistry}from"../../common/languages/modesRegistry.js";import{ILanguageService}from"../../common/languages/language.js";import*as standaloneEnums from"../../common/standalone/standaloneEnums.js";import{StandaloneServices}from"./standaloneServices.js";import{compile}from"../common/monarch/monarchCompile.js";import{MonarchTokenizer}from"../common/monarch/monarchLexer.js";import{IStandaloneThemeService}from"../common/standaloneTheme.js";import{IMarkerService}from"../../../platform/markers/common/markers.js";import{ILanguageFeaturesService}from"../../common/services/languageFeatures.js";import{IConfigurationService}from"../../../platform/configuration/common/configuration.js";export function register(language){ModesRegistry.registerLanguage(language)}export function getLanguages(){let result=[];return result=result.concat(ModesRegistry.getLanguages()),result}export function getEncodedLanguageId(languageId){return StandaloneServices.get(ILanguageService).languageIdCodec.encodeLanguageId(languageId)}export function onLanguage(languageId,callback){const disposable=StandaloneServices.get(ILanguageService).onDidEncounterLanguage((encounteredLanguageId=>{encounteredLanguageId===languageId&&(disposable.dispose(),callback())}));return disposable}export function setLanguageConfiguration(languageId,configuration){if(!StandaloneServices.get(ILanguageService).isRegisteredLanguageId(languageId))throw new Error(`Cannot set configuration for unknown language ${languageId}`);return StandaloneServices.get(ILanguageConfigurationService).register(languageId,configuration,100)}export class EncodedTokenizationSupportAdapter{constructor(languageId,actual){this._languageId=languageId,this._actual=actual}getInitialState(){return this._actual.getInitialState()}tokenize(line,hasEOL,state){if("function"==typeof this._actual.tokenize)return TokenizationSupportAdapter.adaptTokenize(this._languageId,this._actual,line,state);throw new Error("Not supported!")}tokenizeEncoded(line,hasEOL,state){const result=this._actual.tokenizeEncoded(line,state);return new languages.EncodedTokenizationResult(result.tokens,result.endState)}}export class TokenizationSupportAdapter{constructor(_languageId,_actual,_languageService,_standaloneThemeService){this._languageId=_languageId,this._actual=_actual,this._languageService=_languageService,this._standaloneThemeService=_standaloneThemeService}getInitialState(){return this._actual.getInitialState()}static _toClassicTokens(tokens,language){const result=[];let previousStartIndex=0;for(let i=0,len=tokens.length;i<len;i++){const t=tokens[i];let startIndex=t.startIndex;0===i?startIndex=0:startIndex<previousStartIndex&&(startIndex=previousStartIndex),result[i]=new languages.Token(startIndex,t.scopes,language),previousStartIndex=startIndex}return result}static adaptTokenize(language,actual,line,state){const actualResult=actual.tokenize(line,state),tokens=TokenizationSupportAdapter._toClassicTokens(actualResult.tokens,language);let endState;return endState=actualResult.endState.equals(state)?state:actualResult.endState,new languages.TokenizationResult(tokens,endState)}tokenize(line,hasEOL,state){return TokenizationSupportAdapter.adaptTokenize(this._languageId,this._actual,line,state)}_toBinaryTokens(languageIdCodec,tokens){const languageId=languageIdCodec.encodeLanguageId(this._languageId),tokenTheme=this._standaloneThemeService.getColorTheme().tokenTheme,result=[];let resultLen=0,previousStartIndex=0;for(let i=0,len=tokens.length;i<len;i++){const t=tokens[i],metadata=tokenTheme.match(languageId,t.scopes);if(resultLen>0&&result[resultLen-1]===metadata)continue;let startIndex=t.startIndex;0===i?startIndex=0:startIndex<previousStartIndex&&(startIndex=previousStartIndex),result[resultLen++]=startIndex,result[resultLen++]=metadata,previousStartIndex=startIndex}const actualResult=new Uint32Array(resultLen);for(let i=0;i<resultLen;i++)actualResult[i]=result[i];return actualResult}tokenizeEncoded(line,hasEOL,state){const actualResult=this._actual.tokenize(line,state),tokens=this._toBinaryTokens(this._languageService.languageIdCodec,actualResult.tokens);let endState;return endState=actualResult.endState.equals(state)?state:actualResult.endState,new languages.EncodedTokenizationResult(tokens,endState)}}function isATokensProvider(provider){return"function"==typeof provider.getInitialState}function isEncodedTokensProvider(provider){return"tokenizeEncoded"in provider}function isThenable(obj){return obj&&"function"==typeof obj.then}export function setColorMap(colorMap){const standaloneThemeService=StandaloneServices.get(IStandaloneThemeService);if(colorMap){const result=[null];for(let i=1,len=colorMap.length;i<len;i++)result[i]=Color.fromHex(colorMap[i]);standaloneThemeService.setColorMapOverride(result)}else standaloneThemeService.setColorMapOverride(null)}function createTokenizationSupportAdapter(languageId,provider){return isEncodedTokensProvider(provider)?new EncodedTokenizationSupportAdapter(languageId,provider):new TokenizationSupportAdapter(languageId,provider,StandaloneServices.get(ILanguageService),StandaloneServices.get(IStandaloneThemeService))}export function registerTokensProviderFactory(languageId,factory){const adaptedFactory={createTokenizationSupport:()=>__awaiter(this,void 0,void 0,(function*(){const result=yield Promise.resolve(factory.create());return result?isATokensProvider(result)?createTokenizationSupportAdapter(languageId,result):new MonarchTokenizer(StandaloneServices.get(ILanguageService),StandaloneServices.get(IStandaloneThemeService),languageId,compile(languageId,result),StandaloneServices.get(IConfigurationService)):null}))};return languages.TokenizationRegistry.registerFactory(languageId,adaptedFactory)}export function setTokensProvider(languageId,provider){if(!StandaloneServices.get(ILanguageService).isRegisteredLanguageId(languageId))throw new Error(`Cannot set tokens provider for unknown language ${languageId}`);return isThenable(provider)?registerTokensProviderFactory(languageId,{create:()=>provider}):languages.TokenizationRegistry.register(languageId,createTokenizationSupportAdapter(languageId,provider))}export function setMonarchTokensProvider(languageId,languageDef){return isThenable(languageDef)?registerTokensProviderFactory(languageId,{create:()=>languageDef}):languages.TokenizationRegistry.register(languageId,(languageDef=>new MonarchTokenizer(StandaloneServices.get(ILanguageService),StandaloneServices.get(IStandaloneThemeService),languageId,compile(languageId,languageDef),StandaloneServices.get(IConfigurationService)))(languageDef))}export function registerReferenceProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).referenceProvider.register(languageSelector,provider)}export function registerRenameProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).renameProvider.register(languageSelector,provider)}export function registerSignatureHelpProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).signatureHelpProvider.register(languageSelector,provider)}export function registerHoverProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).hoverProvider.register(languageSelector,{provideHover:(model,position,token)=>{const word=model.getWordAtPosition(position);return Promise.resolve(provider.provideHover(model,position,token)).then((value=>{if(value)return!value.range&&word&&(value.range=new Range(position.lineNumber,word.startColumn,position.lineNumber,word.endColumn)),value.range||(value.range=new Range(position.lineNumber,position.column,position.lineNumber,position.column)),value}))}})}export function registerDocumentSymbolProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).documentSymbolProvider.register(languageSelector,provider)}export function registerDocumentHighlightProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).documentHighlightProvider.register(languageSelector,provider)}export function registerLinkedEditingRangeProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).linkedEditingRangeProvider.register(languageSelector,provider)}export function registerDefinitionProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).definitionProvider.register(languageSelector,provider)}export function registerImplementationProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).implementationProvider.register(languageSelector,provider)}export function registerTypeDefinitionProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).typeDefinitionProvider.register(languageSelector,provider)}export function registerCodeLensProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).codeLensProvider.register(languageSelector,provider)}export function registerCodeActionProvider(languageSelector,provider,metadata){return StandaloneServices.get(ILanguageFeaturesService).codeActionProvider.register(languageSelector,{providedCodeActionKinds:null==metadata?void 0:metadata.providedCodeActionKinds,documentation:null==metadata?void 0:metadata.documentation,provideCodeActions:(model,range,context,token)=>{const markers=StandaloneServices.get(IMarkerService).read({resource:model.uri}).filter((m=>Range.areIntersectingOrTouching(m,range)));return provider.provideCodeActions(model,range,{markers,only:context.only,trigger:context.trigger},token)},resolveCodeAction:provider.resolveCodeAction})}export function registerDocumentFormattingEditProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).documentFormattingEditProvider.register(languageSelector,provider)}export function registerDocumentRangeFormattingEditProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).documentRangeFormattingEditProvider.register(languageSelector,provider)}export function registerOnTypeFormattingEditProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).onTypeFormattingEditProvider.register(languageSelector,provider)}export function registerLinkProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).linkProvider.register(languageSelector,provider)}export function registerCompletionItemProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).completionProvider.register(languageSelector,provider)}export function registerColorProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).colorProvider.register(languageSelector,provider)}export function registerFoldingRangeProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).foldingRangeProvider.register(languageSelector,provider)}export function registerDeclarationProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).declarationProvider.register(languageSelector,provider)}export function registerSelectionRangeProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).selectionRangeProvider.register(languageSelector,provider)}export function registerDocumentSemanticTokensProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).documentSemanticTokensProvider.register(languageSelector,provider)}export function registerDocumentRangeSemanticTokensProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).documentRangeSemanticTokensProvider.register(languageSelector,provider)}export function registerInlineCompletionsProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).inlineCompletionsProvider.register(languageSelector,provider)}export function registerInlayHintsProvider(languageSelector,provider){return StandaloneServices.get(ILanguageFeaturesService).inlayHintsProvider.register(languageSelector,provider)}export function createMonacoLanguagesAPI(){return{register,getLanguages,onLanguage,getEncodedLanguageId,setLanguageConfiguration,setColorMap,registerTokensProviderFactory,setTokensProvider,setMonarchTokensProvider,registerReferenceProvider,registerRenameProvider,registerCompletionItemProvider,registerSignatureHelpProvider,registerHoverProvider,registerDocumentSymbolProvider,registerDocumentHighlightProvider,registerLinkedEditingRangeProvider,registerDefinitionProvider,registerImplementationProvider,registerTypeDefinitionProvider,registerCodeLensProvider,registerCodeActionProvider,registerDocumentFormattingEditProvider,registerDocumentRangeFormattingEditProvider,registerOnTypeFormattingEditProvider,registerLinkProvider,registerColorProvider,registerFoldingRangeProvider,registerDeclarationProvider,registerSelectionRangeProvider,registerDocumentSemanticTokensProvider,registerDocumentRangeSemanticTokensProvider,registerInlineCompletionsProvider,registerInlayHintsProvider,DocumentHighlightKind:standaloneEnums.DocumentHighlightKind,CompletionItemKind:standaloneEnums.CompletionItemKind,CompletionItemTag:standaloneEnums.CompletionItemTag,CompletionItemInsertTextRule:standaloneEnums.CompletionItemInsertTextRule,SymbolKind:standaloneEnums.SymbolKind,SymbolTag:standaloneEnums.SymbolTag,IndentAction:standaloneEnums.IndentAction,CompletionTriggerKind:standaloneEnums.CompletionTriggerKind,SignatureHelpTriggerKind:standaloneEnums.SignatureHelpTriggerKind,InlayHintKind:standaloneEnums.InlayHintKind,InlineCompletionTriggerKind:standaloneEnums.InlineCompletionTriggerKind,CodeActionTriggerType:standaloneEnums.CodeActionTriggerType,FoldingRangeKind:languages.FoldingRangeKind}}