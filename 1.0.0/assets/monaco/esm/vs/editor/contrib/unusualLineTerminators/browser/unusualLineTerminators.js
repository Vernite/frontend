var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{Disposable}from"../../../../base/common/lifecycle.js";import{basename}from"../../../../base/common/resources.js";import{registerEditorContribution}from"../../../browser/editorExtensions.js";import{ICodeEditorService}from"../../../browser/services/codeEditorService.js";import*as nls from"../../../../nls.js";import{IDialogService}from"../../../../platform/dialogs/common/dialogs.js";const ignoreUnusualLineTerminators="ignoreUnusualLineTerminators";function writeIgnoreState(codeEditorService,model,state){codeEditorService.setModelProperty(model.uri,ignoreUnusualLineTerminators,state)}function readIgnoreState(codeEditorService,model){return codeEditorService.getModelProperty(model.uri,ignoreUnusualLineTerminators)}let UnusualLineTerminatorsDetector=class UnusualLineTerminatorsDetector extends Disposable{constructor(_editor,_dialogService,_codeEditorService){super(),this._editor=_editor,this._dialogService=_dialogService,this._codeEditorService=_codeEditorService,this._config=this._editor.getOption(116),this._register(this._editor.onDidChangeConfiguration((e=>{e.hasChanged(116)&&(this._config=this._editor.getOption(116),this._checkForUnusualLineTerminators())}))),this._register(this._editor.onDidChangeModel((()=>{this._checkForUnusualLineTerminators()}))),this._register(this._editor.onDidChangeModelContent((e=>{e.isUndoing||this._checkForUnusualLineTerminators()})))}_checkForUnusualLineTerminators(){return __awaiter(this,void 0,void 0,(function*(){if("off"===this._config)return;if(!this._editor.hasModel())return;const model=this._editor.getModel();if(!model.mightContainUnusualLineTerminators())return;if(!0===readIgnoreState(this._codeEditorService,model))return;if(this._editor.getOption(83))return;if("auto"===this._config)return void model.removeUnusualLineTerminators(this._editor.getSelections());(yield this._dialogService.confirm({title:nls.localize("unusualLineTerminators.title","Unusual Line Terminators"),message:nls.localize("unusualLineTerminators.message","Detected unusual line terminators"),detail:nls.localize("unusualLineTerminators.detail","The file '{0}' contains one or more unusual line terminator characters, like Line Separator (LS) or Paragraph Separator (PS).\n\nIt is recommended to remove them from the file. This can be configured via `editor.unusualLineTerminators`.",basename(model.uri)),primaryButton:nls.localize("unusualLineTerminators.fix","Remove Unusual Line Terminators"),secondaryButton:nls.localize("unusualLineTerminators.ignore","Ignore")})).confirmed?model.removeUnusualLineTerminators(this._editor.getSelections()):writeIgnoreState(this._codeEditorService,model,!0)}))}};UnusualLineTerminatorsDetector.ID="editor.contrib.unusualLineTerminatorsDetector",UnusualLineTerminatorsDetector=__decorate([__param(1,IDialogService),__param(2,ICodeEditorService)],UnusualLineTerminatorsDetector);export{UnusualLineTerminatorsDetector};registerEditorContribution(UnusualLineTerminatorsDetector.ID,UnusualLineTerminatorsDetector);