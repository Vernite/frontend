var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{alert}from"../../../../base/browser/ui/aria/aria.js";import{IdleValue,raceCancellation}from"../../../../base/common/async.js";import{CancellationToken,CancellationTokenSource}from"../../../../base/common/cancellation.js";import{onUnexpectedError}from"../../../../base/common/errors.js";import{DisposableStore}from"../../../../base/common/lifecycle.js";import{assertType}from"../../../../base/common/types.js";import{URI}from"../../../../base/common/uri.js";import{EditorStateCancellationTokenSource}from"../../editorState/browser/editorState.js";import{EditorAction,EditorCommand,registerEditorAction,registerEditorCommand,registerEditorContribution,registerModelAndPositionCommand}from"../../../browser/editorExtensions.js";import{IBulkEditService,ResourceEdit}from"../../../browser/services/bulkEditService.js";import{ICodeEditorService}from"../../../browser/services/codeEditorService.js";import{Position}from"../../../common/core/position.js";import{Range}from"../../../common/core/range.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{ITextResourceConfigurationService}from"../../../common/services/textResourceConfiguration.js";import{MessageController}from"../../message/browser/messageController.js";import*as nls from"../../../../nls.js";import{Extensions}from"../../../../platform/configuration/common/configurationRegistry.js";import{ContextKeyExpr}from"../../../../platform/contextkey/common/contextkey.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";import{ILogService}from"../../../../platform/log/common/log.js";import{INotificationService}from"../../../../platform/notification/common/notification.js";import{IEditorProgressService}from"../../../../platform/progress/common/progress.js";import{Registry}from"../../../../platform/registry/common/platform.js";import{CONTEXT_RENAME_INPUT_VISIBLE,RenameInputField}from"./renameInputField.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";class RenameSkeleton{constructor(model,position,registry){this.model=model,this.position=position,this._providerRenameIdx=0,this._providers=registry.ordered(model)}hasProvider(){return this._providers.length>0}resolveRenameLocation(token){return __awaiter(this,void 0,void 0,(function*(){const rejects=[];for(this._providerRenameIdx=0;this._providerRenameIdx<this._providers.length;this._providerRenameIdx++){const provider=this._providers[this._providerRenameIdx];if(!provider.resolveRenameLocation)break;const res=yield provider.resolveRenameLocation(this.model,this.position,token);if(res){if(!res.rejectReason)return res;rejects.push(res.rejectReason)}}const word=this.model.getWordAtPosition(this.position);return word?{range:new Range(this.position.lineNumber,word.startColumn,this.position.lineNumber,word.endColumn),text:word.word,rejectReason:rejects.length>0?rejects.join("\n"):void 0}:{range:Range.fromPositions(this.position),text:"",rejectReason:rejects.length>0?rejects.join("\n"):void 0}}))}provideRenameEdits(newName,token){return __awaiter(this,void 0,void 0,(function*(){return this._provideRenameEdits(newName,this._providerRenameIdx,[],token)}))}_provideRenameEdits(newName,i,rejects,token){return __awaiter(this,void 0,void 0,(function*(){const provider=this._providers[i];if(!provider)return{edits:[],rejectReason:rejects.join("\n")};const result=yield provider.provideRenameEdits(this.model,this.position,newName,token);return result?result.rejectReason?this._provideRenameEdits(newName,i+1,rejects.concat(result.rejectReason),token):result:this._provideRenameEdits(newName,i+1,rejects.concat(nls.localize("no result","No result.")),token)}))}}export function rename(registry,model,position,newName){return __awaiter(this,void 0,void 0,(function*(){const skeleton=new RenameSkeleton(model,position,registry),loc=yield skeleton.resolveRenameLocation(CancellationToken.None);return(null==loc?void 0:loc.rejectReason)?{edits:[],rejectReason:loc.rejectReason}:skeleton.provideRenameEdits(newName,CancellationToken.None)}))}let RenameController=class RenameController{constructor(editor,_instaService,_notificationService,_bulkEditService,_progressService,_logService,_configService,_languageFeaturesService){this.editor=editor,this._instaService=_instaService,this._notificationService=_notificationService,this._bulkEditService=_bulkEditService,this._progressService=_progressService,this._logService=_logService,this._configService=_configService,this._languageFeaturesService=_languageFeaturesService,this._disposableStore=new DisposableStore,this._cts=new CancellationTokenSource,this._renameInputField=this._disposableStore.add(new IdleValue((()=>this._disposableStore.add(this._instaService.createInstance(RenameInputField,this.editor,["acceptRenameInput","acceptRenameInputWithPreview"])))))}static get(editor){return editor.getContribution(RenameController.ID)}dispose(){this._disposableStore.dispose(),this._cts.dispose(!0)}run(){var _a,_b;return __awaiter(this,void 0,void 0,(function*(){if(this._cts.dispose(!0),!this.editor.hasModel())return;const position=this.editor.getPosition(),skeleton=new RenameSkeleton(this.editor.getModel(),position,this._languageFeaturesService.renameProvider);if(!skeleton.hasProvider())return;let loc;this._cts=new EditorStateCancellationTokenSource(this.editor,5);try{const resolveLocationOperation=skeleton.resolveRenameLocation(this._cts.token);this._progressService.showWhile(resolveLocationOperation,250),loc=yield resolveLocationOperation}catch(e){return void(null===(_a=MessageController.get(this.editor))||void 0===_a||_a.showMessage(e||nls.localize("resolveRenameLocationFailed","An unknown error occurred while resolving rename location"),position))}if(!loc)return;if(loc.rejectReason)return void(null===(_b=MessageController.get(this.editor))||void 0===_b||_b.showMessage(loc.rejectReason,position));if(this._cts.token.isCancellationRequested)return;this._cts.dispose(),this._cts=new EditorStateCancellationTokenSource(this.editor,5,loc.range);const selection=this.editor.getSelection();let selectionStart=0,selectionEnd=loc.text.length;Range.isEmpty(selection)||Range.spansMultipleLines(selection)||!Range.containsRange(loc.range,selection)||(selectionStart=Math.max(0,selection.startColumn-loc.range.startColumn),selectionEnd=Math.min(loc.range.endColumn,selection.endColumn)-loc.range.startColumn);const supportPreview=this._bulkEditService.hasPreviewHandler()&&this._configService.getValue(this.editor.getModel().uri,"editor.rename.enablePreview"),inputFieldResult=yield this._renameInputField.value.getInput(loc.range,loc.text,selectionStart,selectionEnd,supportPreview,this._cts.token);if("boolean"==typeof inputFieldResult)return void(inputFieldResult&&this.editor.focus());this.editor.focus();const renameOperation=raceCancellation(skeleton.provideRenameEdits(inputFieldResult.newName,this._cts.token),this._cts.token).then((renameResult=>__awaiter(this,void 0,void 0,(function*(){renameResult&&this.editor.hasModel()&&(renameResult.rejectReason?this._notificationService.info(renameResult.rejectReason):(this.editor.setSelection(Range.fromPositions(this.editor.getSelection().getPosition())),this._bulkEditService.apply(ResourceEdit.convert(renameResult),{editor:this.editor,showPreview:inputFieldResult.wantsPreview,label:nls.localize("label","Renaming '{0}' to '{1}'",null==loc?void 0:loc.text,inputFieldResult.newName),code:"undoredo.rename",quotableLabel:nls.localize("quotableLabel","Renaming {0} to {1}",null==loc?void 0:loc.text,inputFieldResult.newName),respectAutoSaveConfig:!0}).then((result=>{result.ariaSummary&&alert(nls.localize("aria","Successfully renamed '{0}' to '{1}'. Summary: {2}",loc.text,inputFieldResult.newName,result.ariaSummary))})).catch((err=>{this._notificationService.error(nls.localize("rename.failedApply","Rename failed to apply edits")),this._logService.error(err)}))))}))),(err=>{this._notificationService.error(nls.localize("rename.failed","Rename failed to compute edits")),this._logService.error(err)}));return this._progressService.showWhile(renameOperation,250),renameOperation}))}acceptRenameInput(wantsPreview){this._renameInputField.value.acceptInput(wantsPreview)}cancelRenameInput(){this._renameInputField.value.cancelInput(!0)}};RenameController.ID="editor.contrib.renameController",RenameController=__decorate([__param(1,IInstantiationService),__param(2,INotificationService),__param(3,IBulkEditService),__param(4,IEditorProgressService),__param(5,ILogService),__param(6,ITextResourceConfigurationService),__param(7,ILanguageFeaturesService)],RenameController);export class RenameAction extends EditorAction{constructor(){super({id:"editor.action.rename",label:nls.localize("rename.label","Rename Symbol"),alias:"Rename Symbol",precondition:ContextKeyExpr.and(EditorContextKeys.writable,EditorContextKeys.hasRenameProvider),kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:60,weight:100},contextMenuOpts:{group:"1_modification",order:1.1}})}runCommand(accessor,args){const editorService=accessor.get(ICodeEditorService),[uri,pos]=Array.isArray(args)&&args||[void 0,void 0];return URI.isUri(uri)&&Position.isIPosition(pos)?editorService.openCodeEditor({resource:uri},editorService.getActiveCodeEditor()).then((editor=>{editor&&(editor.setPosition(pos),editor.invokeWithinContext((accessor=>(this.reportTelemetry(accessor,editor),this.run(accessor,editor)))))}),onUnexpectedError):super.runCommand(accessor,args)}run(accessor,editor){const controller=RenameController.get(editor);return controller?controller.run():Promise.resolve()}}registerEditorContribution(RenameController.ID,RenameController),registerEditorAction(RenameAction);const RenameCommand=EditorCommand.bindToContribution(RenameController.get);registerEditorCommand(new RenameCommand({id:"acceptRenameInput",precondition:CONTEXT_RENAME_INPUT_VISIBLE,handler:x=>x.acceptRenameInput(!1),kbOpts:{weight:199,kbExpr:EditorContextKeys.focus,primary:3}})),registerEditorCommand(new RenameCommand({id:"acceptRenameInputWithPreview",precondition:ContextKeyExpr.and(CONTEXT_RENAME_INPUT_VISIBLE,ContextKeyExpr.has("config.editor.rename.enablePreview")),handler:x=>x.acceptRenameInput(!0),kbOpts:{weight:199,kbExpr:EditorContextKeys.focus,primary:1027}})),registerEditorCommand(new RenameCommand({id:"cancelRenameInput",precondition:CONTEXT_RENAME_INPUT_VISIBLE,handler:x=>x.cancelRenameInput(),kbOpts:{weight:199,kbExpr:EditorContextKeys.focus,primary:9,secondary:[1033]}})),registerModelAndPositionCommand("_executeDocumentRenameProvider",(function(accessor,model,position,...args){const[newName]=args;assertType("string"==typeof newName);const{renameProvider}=accessor.get(ILanguageFeaturesService);return rename(renameProvider,model,position,newName)})),registerModelAndPositionCommand("_executePrepareRename",(function(accessor,model,position){return __awaiter(this,void 0,void 0,(function*(){const{renameProvider}=accessor.get(ILanguageFeaturesService),skeleton=new RenameSkeleton(model,position,renameProvider),loc=yield skeleton.resolveRenameLocation(CancellationToken.None);if(null==loc?void 0:loc.rejectReason)throw new Error(loc.rejectReason);return loc}))})),Registry.as(Extensions.Configuration).registerConfiguration({id:"editor",properties:{"editor.rename.enablePreview":{scope:5,description:nls.localize("enablePreview","Enable/disable the ability to preview changes before renaming"),default:!0,type:"boolean"}}});