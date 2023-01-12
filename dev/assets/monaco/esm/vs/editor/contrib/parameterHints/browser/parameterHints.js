var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{Disposable}from"../../../../base/common/lifecycle.js";import{EditorAction,EditorCommand,registerEditorAction,registerEditorCommand,registerEditorContribution}from"../../../browser/editorExtensions.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import*as languages from"../../../common/languages.js";import{Context}from"./provideSignatureHelp.js";import*as nls from"../../../../nls.js";import{ContextKeyExpr}from"../../../../platform/contextkey/common/contextkey.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";import{ParameterHintsWidget}from"./parameterHintsWidget.js";let ParameterHintsController=class ParameterHintsController extends Disposable{constructor(editor,instantiationService){super(),this.editor=editor,this.widget=this._register(instantiationService.createInstance(ParameterHintsWidget,this.editor))}static get(editor){return editor.getContribution(ParameterHintsController.ID)}cancel(){this.widget.cancel()}previous(){this.widget.previous()}next(){this.widget.next()}trigger(context){this.widget.trigger(context)}};ParameterHintsController.ID="editor.controller.parameterHints",ParameterHintsController=__decorate([__param(1,IInstantiationService)],ParameterHintsController);export class TriggerParameterHintsAction extends EditorAction{constructor(){super({id:"editor.action.triggerParameterHints",label:nls.localize("parameterHints.trigger.label","Trigger Parameter Hints"),alias:"Trigger Parameter Hints",precondition:EditorContextKeys.hasSignatureHelpProvider,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:3082,weight:100}})}run(accessor,editor){const controller=ParameterHintsController.get(editor);controller&&controller.trigger({triggerKind:languages.SignatureHelpTriggerKind.Invoke})}}registerEditorContribution(ParameterHintsController.ID,ParameterHintsController),registerEditorAction(TriggerParameterHintsAction);const weight=175,ParameterHintsCommand=EditorCommand.bindToContribution(ParameterHintsController.get);registerEditorCommand(new ParameterHintsCommand({id:"closeParameterHints",precondition:Context.Visible,handler:x=>x.cancel(),kbOpts:{weight:175,kbExpr:EditorContextKeys.focus,primary:9,secondary:[1033]}})),registerEditorCommand(new ParameterHintsCommand({id:"showPrevParameterHint",precondition:ContextKeyExpr.and(Context.Visible,Context.MultipleSignatures),handler:x=>x.previous(),kbOpts:{weight:175,kbExpr:EditorContextKeys.focus,primary:16,secondary:[528],mac:{primary:16,secondary:[528,302]}}})),registerEditorCommand(new ParameterHintsCommand({id:"showNextParameterHint",precondition:ContextKeyExpr.and(Context.Visible,Context.MultipleSignatures),handler:x=>x.next(),kbOpts:{weight:175,kbExpr:EditorContextKeys.focus,primary:18,secondary:[530],mac:{primary:18,secondary:[530,300]}}}));