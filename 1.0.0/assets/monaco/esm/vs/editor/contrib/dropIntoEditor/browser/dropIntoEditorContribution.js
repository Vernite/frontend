var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{raceCancellation}from"../../../../base/common/async.js";import{VSDataTransfer}from"../../../../base/common/dataTransfer.js";import{Disposable}from"../../../../base/common/lifecycle.js";import{Mimes}from"../../../../base/common/mime.js";import{relativePath}from"../../../../base/common/resources.js";import{URI}from"../../../../base/common/uri.js";import{addExternalEditorsDropData,toVSDataTransfer,UriList}from"../../../browser/dnd.js";import{registerEditorContribution}from"../../../browser/editorExtensions.js";import{IBulkEditService,ResourceEdit}from"../../../browser/services/bulkEditService.js";import{Range}from"../../../common/core/range.js";import{Selection}from"../../../common/core/selection.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";import{EditorStateCancellationTokenSource}from"../../editorState/browser/editorState.js";import{performSnippetEdit}from"../../snippet/browser/snippetController2.js";import{SnippetParser}from"../../snippet/browser/snippetParser.js";import{localize}from"../../../../nls.js";import{IProgressService}from"../../../../platform/progress/common/progress.js";import{IWorkspaceContextService}from"../../../../platform/workspace/common/workspace.js";let DropIntoEditorController=class DropIntoEditorController extends Disposable{constructor(editor,_bulkEditService,_languageFeaturesService,_progressService,workspaceContextService){super(),this._bulkEditService=_bulkEditService,this._languageFeaturesService=_languageFeaturesService,this._progressService=_progressService,this._register(editor.onDropIntoEditor((e=>this.onDropIntoEditor(editor,e.position,e.event)))),this._languageFeaturesService.documentOnDropEditProvider.register("*",new DefaultOnDropProvider(workspaceContextService))}onDropIntoEditor(editor,position,dragEvent){return __awaiter(this,void 0,void 0,(function*(){if(!dragEvent.dataTransfer||!editor.hasModel())return;const model=editor.getModel(),initialModelVersion=model.getVersionId(),ourDataTransfer=yield this.extractDataTransferData(dragEvent);if(0===ourDataTransfer.size)return;if(editor.getModel().getVersionId()!==initialModelVersion)return;const tokenSource=new EditorStateCancellationTokenSource(editor,1);try{const providers=this._languageFeaturesService.documentOnDropEditProvider.ordered(model),edit=yield this._progressService.withProgress({location:15,delay:750,title:localize("dropProgressTitle","Running drop handlers..."),cancellable:!0},(()=>raceCancellation((()=>__awaiter(this,void 0,void 0,(function*(){for(const provider of providers){const edit=yield provider.provideDocumentOnDropEdits(model,position,ourDataTransfer,tokenSource.token);if(tokenSource.token.isCancellationRequested)return;if(edit)return edit}})))(),tokenSource.token)),(()=>{tokenSource.cancel()}));if(tokenSource.token.isCancellationRequested||editor.getModel().getVersionId()!==initialModelVersion)return;if(edit){const range=new Range(position.lineNumber,position.column,position.lineNumber,position.column);return performSnippetEdit(editor,"string"==typeof edit.insertText?SnippetParser.escape(edit.insertText):edit.insertText.snippet,[Selection.fromRange(range,0)]),void(edit.additionalEdit&&(yield this._bulkEditService.apply(ResourceEdit.convert(edit.additionalEdit),{editor})))}}finally{tokenSource.dispose()}}))}extractDataTransferData(dragEvent){return __awaiter(this,void 0,void 0,(function*(){if(!dragEvent.dataTransfer)return new VSDataTransfer;const textEditorDataTransfer=toVSDataTransfer(dragEvent.dataTransfer);return addExternalEditorsDropData(textEditorDataTransfer,dragEvent),textEditorDataTransfer}))}};DropIntoEditorController.ID="editor.contrib.dropIntoEditorController",DropIntoEditorController=__decorate([__param(1,IBulkEditService),__param(2,ILanguageFeaturesService),__param(3,IProgressService),__param(4,IWorkspaceContextService)],DropIntoEditorController);export{DropIntoEditorController};let DefaultOnDropProvider=class DefaultOnDropProvider{constructor(_workspaceContextService){this._workspaceContextService=_workspaceContextService}provideDocumentOnDropEdits(_model,_position,dataTransfer,_token){var _a;return __awaiter(this,void 0,void 0,(function*(){const urlListEntry=dataTransfer.get(Mimes.uriList);if(urlListEntry){const urlList=yield urlListEntry.asString(),snippet=this.getUriListInsertText(urlList);if(snippet)return{insertText:snippet}}const textEntry=null!==(_a=dataTransfer.get("text"))&&void 0!==_a?_a:dataTransfer.get(Mimes.text);if(textEntry){return{insertText:yield textEntry.asString()}}}))}getUriListInsertText(strUriList){const uris=[];for(const resource of UriList.parse(strUriList))try{uris.push(URI.parse(resource))}catch(_a){}if(uris.length)return uris.map((uri=>{const root=this._workspaceContextService.getWorkspaceFolder(uri);if(root){const rel=relativePath(root.uri,uri);if(rel)return rel}return uri.fsPath})).join(" ")}};DefaultOnDropProvider=__decorate([__param(0,IWorkspaceContextService)],DefaultOnDropProvider),registerEditorContribution(DropIntoEditorController.ID,DropIntoEditorController);