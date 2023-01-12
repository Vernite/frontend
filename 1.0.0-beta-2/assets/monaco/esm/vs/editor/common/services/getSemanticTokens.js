var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{CancellationToken}from"../../../base/common/cancellation.js";import{onUnexpectedExternalError}from"../../../base/common/errors.js";import{URI}from"../../../base/common/uri.js";import{IModelService}from"./model.js";import{CommandsRegistry,ICommandService}from"../../../platform/commands/common/commands.js";import{assertType}from"../../../base/common/types.js";import{encodeSemanticTokensDto}from"./semanticTokensDto.js";import{Range}from"../core/range.js";import{ILanguageFeaturesService}from"./languageFeatures.js";export function isSemanticTokens(v){return v&&!!v.data}export function isSemanticTokensEdits(v){return v&&Array.isArray(v.edits)}export class DocumentSemanticTokensResult{constructor(provider,tokens,error){this.provider=provider,this.tokens=tokens,this.error=error}}export function hasDocumentSemanticTokensProvider(registry,model){return registry.has(model)}function getDocumentSemanticTokensProviders(registry,model){const groups=registry.orderedGroups(model);return groups.length>0?groups[0]:[]}export function getDocumentSemanticTokens(registry,model,lastProvider,lastResultId,token){return __awaiter(this,void 0,void 0,(function*(){const providers=getDocumentSemanticTokensProviders(registry,model),results=yield Promise.all(providers.map((provider=>__awaiter(this,void 0,void 0,(function*(){let result,error=null;try{result=yield provider.provideDocumentSemanticTokens(model,provider===lastProvider?lastResultId:null,token)}catch(err){error=err,result=null}return result&&(isSemanticTokens(result)||isSemanticTokensEdits(result))||(result=null),new DocumentSemanticTokensResult(provider,result,error)})))));for(const result of results){if(result.error)throw result.error;if(result.tokens)return result}return results.length>0?results[0]:null}))}function _getDocumentSemanticTokensProviderHighestGroup(registry,model){const result=registry.orderedGroups(model);return result.length>0?result[0]:null}class DocumentRangeSemanticTokensResult{constructor(provider,tokens){this.provider=provider,this.tokens=tokens}}export function hasDocumentRangeSemanticTokensProvider(providers,model){return providers.has(model)}function getDocumentRangeSemanticTokensProviders(providers,model){const groups=providers.orderedGroups(model);return groups.length>0?groups[0]:[]}export function getDocumentRangeSemanticTokens(registry,model,range,token){return __awaiter(this,void 0,void 0,(function*(){const providers=getDocumentRangeSemanticTokensProviders(registry,model),results=yield Promise.all(providers.map((provider=>__awaiter(this,void 0,void 0,(function*(){let result;try{result=yield provider.provideDocumentRangeSemanticTokens(model,range,token)}catch(err){onUnexpectedExternalError(err),result=null}return result&&isSemanticTokens(result)||(result=null),new DocumentRangeSemanticTokensResult(provider,result)})))));for(const result of results)if(result.tokens)return result;return results.length>0?results[0]:null}))}CommandsRegistry.registerCommand("_provideDocumentSemanticTokensLegend",((accessor,...args)=>__awaiter(void 0,void 0,void 0,(function*(){const[uri]=args;assertType(uri instanceof URI);const model=accessor.get(IModelService).getModel(uri);if(!model)return;const{documentSemanticTokensProvider}=accessor.get(ILanguageFeaturesService),providers=_getDocumentSemanticTokensProviderHighestGroup(documentSemanticTokensProvider,model);return providers?providers[0].getLegend():accessor.get(ICommandService).executeCommand("_provideDocumentRangeSemanticTokensLegend",uri)})))),CommandsRegistry.registerCommand("_provideDocumentSemanticTokens",((accessor,...args)=>__awaiter(void 0,void 0,void 0,(function*(){const[uri]=args;assertType(uri instanceof URI);const model=accessor.get(IModelService).getModel(uri);if(!model)return;const{documentSemanticTokensProvider}=accessor.get(ILanguageFeaturesService);if(!hasDocumentSemanticTokensProvider(documentSemanticTokensProvider,model))return accessor.get(ICommandService).executeCommand("_provideDocumentRangeSemanticTokens",uri,model.getFullModelRange());const r=yield getDocumentSemanticTokens(documentSemanticTokensProvider,model,null,null,CancellationToken.None);if(!r)return;const{provider,tokens}=r;if(!tokens||!isSemanticTokens(tokens))return;const buff=encodeSemanticTokensDto({id:0,type:"full",data:tokens.data});return tokens.resultId&&provider.releaseDocumentSemanticTokens(tokens.resultId),buff})))),CommandsRegistry.registerCommand("_provideDocumentRangeSemanticTokensLegend",((accessor,...args)=>__awaiter(void 0,void 0,void 0,(function*(){const[uri,range]=args;assertType(uri instanceof URI);const model=accessor.get(IModelService).getModel(uri);if(!model)return;const{documentRangeSemanticTokensProvider}=accessor.get(ILanguageFeaturesService),providers=getDocumentRangeSemanticTokensProviders(documentRangeSemanticTokensProvider,model);if(0===providers.length)return;if(1===providers.length)return providers[0].getLegend();if(!range||!Range.isIRange(range))return console.warn("provideDocumentRangeSemanticTokensLegend might be out-of-sync with provideDocumentRangeSemanticTokens unless a range argument is passed in"),providers[0].getLegend();const result=yield getDocumentRangeSemanticTokens(documentRangeSemanticTokensProvider,model,Range.lift(range),CancellationToken.None);return result?result.provider.getLegend():void 0})))),CommandsRegistry.registerCommand("_provideDocumentRangeSemanticTokens",((accessor,...args)=>__awaiter(void 0,void 0,void 0,(function*(){const[uri,range]=args;assertType(uri instanceof URI),assertType(Range.isIRange(range));const model=accessor.get(IModelService).getModel(uri);if(!model)return;const{documentRangeSemanticTokensProvider}=accessor.get(ILanguageFeaturesService),result=yield getDocumentRangeSemanticTokens(documentRangeSemanticTokensProvider,model,Range.lift(range),CancellationToken.None);return result&&result.tokens?encodeSemanticTokensDto({id:0,type:"full",data:result.tokens.data}):void 0}))));