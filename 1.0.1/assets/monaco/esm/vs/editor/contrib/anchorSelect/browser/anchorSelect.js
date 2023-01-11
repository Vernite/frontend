var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{alert}from"../../../../base/browser/ui/aria/aria.js";import{MarkdownString}from"../../../../base/common/htmlContent.js";import{KeyChord}from"../../../../base/common/keyCodes.js";import"./anchorSelect.css";import{EditorAction,registerEditorAction,registerEditorContribution}from"../../../browser/editorExtensions.js";import{Selection}from"../../../common/core/selection.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{localize}from"../../../../nls.js";import{IContextKeyService,RawContextKey}from"../../../../platform/contextkey/common/contextkey.js";export const SelectionAnchorSet=new RawContextKey("selectionAnchorSet",!1);let SelectionAnchorController=class SelectionAnchorController{constructor(editor,contextKeyService){this.editor=editor,this.selectionAnchorSetContextKey=SelectionAnchorSet.bindTo(contextKeyService),this.modelChangeListener=editor.onDidChangeModel((()=>this.selectionAnchorSetContextKey.reset()))}static get(editor){return editor.getContribution(SelectionAnchorController.ID)}setSelectionAnchor(){if(this.editor.hasModel()){const position=this.editor.getPosition();this.editor.changeDecorations((accessor=>{this.decorationId&&accessor.removeDecoration(this.decorationId),this.decorationId=accessor.addDecoration(Selection.fromPositions(position,position),{description:"selection-anchor",stickiness:1,hoverMessage:(new MarkdownString).appendText(localize("selectionAnchor","Selection Anchor")),className:"selection-anchor"})})),this.selectionAnchorSetContextKey.set(!!this.decorationId),alert(localize("anchorSet","Anchor set at {0}:{1}",position.lineNumber,position.column))}}goToSelectionAnchor(){if(this.editor.hasModel()&&this.decorationId){const anchorPosition=this.editor.getModel().getDecorationRange(this.decorationId);anchorPosition&&this.editor.setPosition(anchorPosition.getStartPosition())}}selectFromAnchorToCursor(){if(this.editor.hasModel()&&this.decorationId){const start=this.editor.getModel().getDecorationRange(this.decorationId);if(start){const end=this.editor.getPosition();this.editor.setSelection(Selection.fromPositions(start.getStartPosition(),end)),this.cancelSelectionAnchor()}}}cancelSelectionAnchor(){if(this.decorationId){const decorationId=this.decorationId;this.editor.changeDecorations((accessor=>{accessor.removeDecoration(decorationId),this.decorationId=void 0})),this.selectionAnchorSetContextKey.set(!1)}}dispose(){this.cancelSelectionAnchor(),this.modelChangeListener.dispose()}};SelectionAnchorController.ID="editor.contrib.selectionAnchorController",SelectionAnchorController=__decorate([__param(1,IContextKeyService)],SelectionAnchorController);class SetSelectionAnchor extends EditorAction{constructor(){super({id:"editor.action.setSelectionAnchor",label:localize("setSelectionAnchor","Set Selection Anchor"),alias:"Set Selection Anchor",precondition:void 0,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2080),weight:100}})}run(_accessor,editor){var _a;return __awaiter(this,void 0,void 0,(function*(){null===(_a=SelectionAnchorController.get(editor))||void 0===_a||_a.setSelectionAnchor()}))}}class GoToSelectionAnchor extends EditorAction{constructor(){super({id:"editor.action.goToSelectionAnchor",label:localize("goToSelectionAnchor","Go to Selection Anchor"),alias:"Go to Selection Anchor",precondition:SelectionAnchorSet})}run(_accessor,editor){var _a;return __awaiter(this,void 0,void 0,(function*(){null===(_a=SelectionAnchorController.get(editor))||void 0===_a||_a.goToSelectionAnchor()}))}}class SelectFromAnchorToCursor extends EditorAction{constructor(){super({id:"editor.action.selectFromAnchorToCursor",label:localize("selectFromAnchorToCursor","Select from Anchor to Cursor"),alias:"Select from Anchor to Cursor",precondition:SelectionAnchorSet,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2089),weight:100}})}run(_accessor,editor){var _a;return __awaiter(this,void 0,void 0,(function*(){null===(_a=SelectionAnchorController.get(editor))||void 0===_a||_a.selectFromAnchorToCursor()}))}}class CancelSelectionAnchor extends EditorAction{constructor(){super({id:"editor.action.cancelSelectionAnchor",label:localize("cancelSelectionAnchor","Cancel Selection Anchor"),alias:"Cancel Selection Anchor",precondition:SelectionAnchorSet,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:9,weight:100}})}run(_accessor,editor){var _a;return __awaiter(this,void 0,void 0,(function*(){null===(_a=SelectionAnchorController.get(editor))||void 0===_a||_a.cancelSelectionAnchor()}))}}registerEditorContribution(SelectionAnchorController.ID,SelectionAnchorController),registerEditorAction(SetSelectionAnchor),registerEditorAction(GoToSelectionAnchor),registerEditorAction(SelectFromAnchorToCursor),registerEditorAction(CancelSelectionAnchor);