var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{DisposableStore}from"../../../../base/common/lifecycle.js";import"./renameInputField.css";import{Position}from"../../../common/core/position.js";import{localize}from"../../../../nls.js";import{IContextKeyService,RawContextKey}from"../../../../platform/contextkey/common/contextkey.js";import{IKeybindingService}from"../../../../platform/keybinding/common/keybinding.js";import{editorWidgetBackground,inputBackground,inputBorder,inputForeground,widgetShadow}from"../../../../platform/theme/common/colorRegistry.js";import{IThemeService}from"../../../../platform/theme/common/themeService.js";export const CONTEXT_RENAME_INPUT_VISIBLE=new RawContextKey("renameInputVisible",!1,localize("renameInputVisible","Whether the rename input widget is visible"));let RenameInputField=class RenameInputField{constructor(_editor,_acceptKeybindings,_themeService,_keybindingService,contextKeyService){this._editor=_editor,this._acceptKeybindings=_acceptKeybindings,this._themeService=_themeService,this._keybindingService=_keybindingService,this._disposables=new DisposableStore,this.allowEditorOverflow=!0,this._visibleContextKey=CONTEXT_RENAME_INPUT_VISIBLE.bindTo(contextKeyService),this._editor.addContentWidget(this),this._disposables.add(this._editor.onDidChangeConfiguration((e=>{e.hasChanged(46)&&this._updateFont()}))),this._disposables.add(_themeService.onDidColorThemeChange(this._updateStyles,this))}dispose(){this._disposables.dispose(),this._editor.removeContentWidget(this)}getId(){return"__renameInputWidget"}getDomNode(){if(!this._domNode){this._domNode=document.createElement("div"),this._domNode.className="monaco-editor rename-box",this._input=document.createElement("input"),this._input.className="rename-input",this._input.type="text",this._input.setAttribute("aria-label",localize("renameAriaLabel","Rename input. Type new name and press Enter to commit.")),this._domNode.appendChild(this._input),this._label=document.createElement("div"),this._label.className="rename-label",this._domNode.appendChild(this._label);const updateLabel=()=>{var _a,_b;const[accept,preview]=this._acceptKeybindings;this._keybindingService.lookupKeybinding(accept),this._label.innerText=localize({key:"label",comment:['placeholders are keybindings, e.g "F2 to Rename, Shift+F2 to Preview"']},"{0} to Rename, {1} to Preview",null===(_a=this._keybindingService.lookupKeybinding(accept))||void 0===_a?void 0:_a.getLabel(),null===(_b=this._keybindingService.lookupKeybinding(preview))||void 0===_b?void 0:_b.getLabel())};updateLabel(),this._disposables.add(this._keybindingService.onDidUpdateKeybindings(updateLabel)),this._updateFont(),this._updateStyles(this._themeService.getColorTheme())}return this._domNode}_updateStyles(theme){var _a,_b,_c,_d;if(!this._input||!this._domNode)return;const widgetShadowColor=theme.getColor(widgetShadow);this._domNode.style.backgroundColor=String(null!==(_a=theme.getColor(editorWidgetBackground))&&void 0!==_a?_a:""),this._domNode.style.boxShadow=widgetShadowColor?` 0 0 8px 2px ${widgetShadowColor}`:"",this._domNode.style.color=String(null!==(_b=theme.getColor(inputForeground))&&void 0!==_b?_b:""),this._input.style.backgroundColor=String(null!==(_c=theme.getColor(inputBackground))&&void 0!==_c?_c:"");const border=theme.getColor(inputBorder);this._input.style.borderWidth=border?"1px":"0px",this._input.style.borderStyle=border?"solid":"none",this._input.style.borderColor=null!==(_d=null==border?void 0:border.toString())&&void 0!==_d?_d:"none"}_updateFont(){if(!this._input||!this._label)return;const fontInfo=this._editor.getOption(46);this._input.style.fontFamily=fontInfo.fontFamily,this._input.style.fontWeight=fontInfo.fontWeight,this._input.style.fontSize=`${fontInfo.fontSize}px`,this._label.style.fontSize=.8*fontInfo.fontSize+"px"}getPosition(){return this._visible?{position:this._position,preference:[2,1]}:null}afterRender(position){position||this.cancelInput(!0)}acceptInput(wantsPreview){var _a;null===(_a=this._currentAcceptInput)||void 0===_a||_a.call(this,wantsPreview)}cancelInput(focusEditor){var _a;null===(_a=this._currentCancelInput)||void 0===_a||_a.call(this,focusEditor)}getInput(where,value,selectionStart,selectionEnd,supportPreview,token){this._domNode.classList.toggle("preview",supportPreview),this._position=new Position(where.startLineNumber,where.startColumn),this._input.value=value,this._input.setAttribute("selectionStart",selectionStart.toString()),this._input.setAttribute("selectionEnd",selectionEnd.toString()),this._input.size=Math.max(1.1*(where.endColumn-where.startColumn),20);const disposeOnDone=new DisposableStore;return new Promise((resolve=>{this._currentCancelInput=focusEditor=>(this._currentAcceptInput=void 0,this._currentCancelInput=void 0,resolve(focusEditor),!0),this._currentAcceptInput=wantsPreview=>{0!==this._input.value.trim().length&&this._input.value!==value?(this._currentAcceptInput=void 0,this._currentCancelInput=void 0,resolve({newName:this._input.value,wantsPreview:supportPreview&&wantsPreview})):this.cancelInput(!0)},disposeOnDone.add(token.onCancellationRequested((()=>this.cancelInput(!0)))),disposeOnDone.add(this._editor.onDidBlurEditorWidget((()=>this.cancelInput(!1)))),this._show()})).finally((()=>{disposeOnDone.dispose(),this._hide()}))}_show(){this._editor.revealLineInCenterIfOutsideViewport(this._position.lineNumber,0),this._visible=!0,this._visibleContextKey.set(!0),this._editor.layoutContentWidget(this),setTimeout((()=>{this._input.focus(),this._input.setSelectionRange(parseInt(this._input.getAttribute("selectionStart")),parseInt(this._input.getAttribute("selectionEnd")))}),100)}_hide(){this._visible=!1,this._visibleContextKey.reset(),this._editor.layoutContentWidget(this)}};RenameInputField=__decorate([__param(2,IThemeService),__param(3,IKeybindingService),__param(4,IContextKeyService)],RenameInputField);export{RenameInputField};