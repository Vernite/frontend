var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import*as dom from"../../../../base/browser/dom.js";import{List}from"../../../../base/browser/ui/list/listWidget.js";import{Action,Separator}from"../../../../base/common/actions.js";import{canceled}from"../../../../base/common/errors.js";import{Lazy}from"../../../../base/common/lazy.js";import{Disposable,dispose,MutableDisposable,DisposableStore}from"../../../../base/common/lifecycle.js";import"./media/action.css";import{Position}from"../../../common/core/position.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";import{codeActionCommandId,CodeActionItem,fixAllCommandId,organizeImportsCommandId,refactorCommandId,sourceActionCommandId}from"./codeAction.js";import{CodeActionCommandArgs,CodeActionKind,CodeActionTriggerSource}from"./types.js";import{localize}from"../../../../nls.js";import{IConfigurationService}from"../../../../platform/configuration/common/configuration.js";import{IContextKeyService,RawContextKey}from"../../../../platform/contextkey/common/contextkey.js";import{IContextMenuService,IContextViewService}from"../../../../platform/contextview/browser/contextView.js";import{IKeybindingService}from"../../../../platform/keybinding/common/keybinding.js";import{ITelemetryService}from"../../../../platform/telemetry/common/telemetry.js";import{IThemeService}from"../../../../platform/theme/common/themeService.js";export const Context={Visible:new RawContextKey("CodeActionMenuVisible",!1,localize("CodeActionMenuVisible","Whether the code action list widget is visible"))};class CodeActionAction extends Action{constructor(action,callback){super(action.command?action.command.id:action.title,stripNewlines(action.title),void 0,!action.disabled,callback),this.action=action}}function stripNewlines(str){return str.replace(/\r\n|\r|\n/g," ")}const TEMPLATE_ID="codeActionWidget",codeActionLineHeight=26;let CodeMenuRenderer=class CodeMenuRenderer{constructor(acceptKeybindings,keybindingService){this.acceptKeybindings=acceptKeybindings,this.keybindingService=keybindingService}get templateId(){return TEMPLATE_ID}renderTemplate(container){const data=Object.create(null);return data.disposables=[],data.root=container,data.text=document.createElement("span"),container.append(data.text),data}renderElement(element,index,templateData){const data=templateData,text=element.title,isEnabled=element.isEnabled,isSeparator=element.isSeparator,isDocumentation=element.isDocumentation;if(data.text.textContent=text,isEnabled?data.root.classList.remove("option-disabled"):(data.root.classList.add("option-disabled"),data.root.style.backgroundColor="transparent !important"),isSeparator&&(data.root.classList.add("separator"),data.root.style.height="10px"),!isDocumentation){(()=>{var _a,_b;const[accept,preview]=this.acceptKeybindings;data.root.title=localize({key:"label",comment:['placeholders are keybindings, e.g "F2 to Refactor, Shift+F2 to Preview"']},"{0} to Refactor, {1} to Preview",null===(_a=this.keybindingService.lookupKeybinding(accept))||void 0===_a?void 0:_a.getLabel(),null===(_b=this.keybindingService.lookupKeybinding(preview))||void 0===_b?void 0:_b.getLabel())})()}}disposeTemplate(templateData){templateData.disposables=dispose(templateData.disposables)}};CodeMenuRenderer=__decorate([__param(1,IKeybindingService)],CodeMenuRenderer);let CodeActionMenu=class CodeActionMenu extends Disposable{constructor(_editor,_delegate,_contextMenuService,keybindingService,_languageFeaturesService,_telemetryService,_themeService,_configurationService,_contextViewService,_contextKeyService){super(),this._editor=_editor,this._delegate=_delegate,this._contextMenuService=_contextMenuService,this._languageFeaturesService=_languageFeaturesService,this._telemetryService=_telemetryService,this._configurationService=_configurationService,this._contextViewService=_contextViewService,this._contextKeyService=_contextKeyService,this._showingActions=this._register(new MutableDisposable),this.codeActionList=this._register(new MutableDisposable),this.options=[],this._visible=!1,this.viewItems=[],this.hasSeperator=!1,this._keybindingResolver=new CodeActionKeybindingResolver({getKeybindings:()=>keybindingService.getKeybindings()}),this._ctxMenuWidgetVisible=Context.Visible.bindTo(this._contextKeyService),this.listRenderer=new CodeMenuRenderer(["onEnterSelectCodeAction","onEnterSelectCodeActionWithPreview"],keybindingService)}get isVisible(){return this._visible}isCodeActionWidgetEnabled(model){return this._configurationService.getValue("editor.experimental.useCustomCodeActionMenu",{resource:model.uri})}_onListSelection(e){e.elements.length&&e.elements.forEach((element=>{element.isEnabled&&(element.action.run(),this.hideCodeActionWidget())}))}_onListHover(e){var _a,_b,_c,_d;e.element?(null===(_b=e.element)||void 0===_b?void 0:_b.isEnabled)?(null===(_c=this.codeActionList.value)||void 0===_c||_c.setFocus([e.element.index]),this.focusedEnabledItem=this.viewItems.indexOf(e.element),this.currSelectedItem=e.element.index):(this.currSelectedItem=void 0,null===(_d=this.codeActionList.value)||void 0===_d||_d.setFocus([e.element.index])):(this.currSelectedItem=void 0,null===(_a=this.codeActionList.value)||void 0===_a||_a.setFocus([]))}renderCodeActionMenuList(element,inputArray){var _a;const renderDisposables=new DisposableStore,renderMenu=document.createElement("div"),menuBlock=document.createElement("div");this.block=element.appendChild(menuBlock),this.block.classList.add("context-view-block"),this.block.style.position="fixed",this.block.style.cursor="initial",this.block.style.left="0",this.block.style.top="0",this.block.style.width="100%",this.block.style.height="100%",this.block.style.zIndex="-1",renderDisposables.add(dom.addDisposableListener(this.block,dom.EventType.MOUSE_DOWN,(e=>e.stopPropagation()))),renderMenu.id="codeActionMenuWidget",renderMenu.classList.add("codeActionMenuWidget"),element.appendChild(renderMenu),this.codeActionList.value=new List("codeActionWidget",renderMenu,{getHeight:element=>element.isSeparator?10:26,getTemplateId:element=>"codeActionWidget"},[this.listRenderer],{keyboardSupport:!1}),renderDisposables.add(this.codeActionList.value.onMouseOver((e=>this._onListHover(e)))),renderDisposables.add(this.codeActionList.value.onDidChangeFocus((e=>{var _a;return null===(_a=this.codeActionList.value)||void 0===_a?void 0:_a.domFocus()}))),renderDisposables.add(this.codeActionList.value.onDidChangeSelection((e=>this._onListSelection(e)))),renderDisposables.add(this._editor.onDidLayoutChange((e=>this.hideCodeActionWidget()))),inputArray.forEach(((item,index)=>{const currIsSeparator="separator"===item.class;let isDocumentation=!1;item instanceof CodeActionAction&&(isDocumentation=item.action.kind===CodeActionMenu.documentationID),currIsSeparator&&(this.hasSeperator=!0);const menuItem={title:item.label,detail:item.tooltip,action:inputArray[index],isEnabled:item.enabled,isSeparator:currIsSeparator,index,isDocumentation};item.enabled&&this.viewItems.push(menuItem),this.options.push(menuItem)})),this.codeActionList.value.splice(0,this.codeActionList.value.length,this.options);const height=this.hasSeperator?26*(inputArray.length-1)+10:26*inputArray.length;renderMenu.style.height=String(height)+"px",this.codeActionList.value.layout(height);const arr=[];this.options.forEach(((item,index)=>{var _a,_b;if(!this.codeActionList.value)return;const element=null===(_b=document.getElementById(null===(_a=this.codeActionList.value)||void 0===_a?void 0:_a.getElementID(index)))||void 0===_b?void 0:_b.getElementsByTagName("span")[0].offsetWidth;arr.push(Number(element))}));const maxWidth=Math.max(...arr);renderMenu.style.width=maxWidth+52+"px",null===(_a=this.codeActionList.value)||void 0===_a||_a.layout(height,maxWidth),this.viewItems.length<1||this.viewItems.every((item=>item.isDocumentation))?this.currSelectedItem=void 0:(this.focusedEnabledItem=0,this.currSelectedItem=this.viewItems[0].index,this.codeActionList.value.setFocus([this.currSelectedItem])),this.codeActionList.value.domFocus();const focusTracker=dom.trackFocus(element),blurListener=focusTracker.onDidBlur((()=>{this.hideCodeActionWidget()}));return renderDisposables.add(blurListener),renderDisposables.add(focusTracker),this._ctxMenuWidgetVisible.set(!0),renderDisposables}focusPrevious(){var _a;if(void 0===this.focusedEnabledItem)this.focusedEnabledItem=this.viewItems[0].index;else if(this.viewItems.length<1)return!1;const startIndex=this.focusedEnabledItem;let item;do{this.focusedEnabledItem=this.focusedEnabledItem-1,this.focusedEnabledItem<0&&(this.focusedEnabledItem=this.viewItems.length-1),item=this.viewItems[this.focusedEnabledItem],null===(_a=this.codeActionList.value)||void 0===_a||_a.setFocus([item.index]),this.currSelectedItem=item.index}while(this.focusedEnabledItem!==startIndex&&(!item.isEnabled||item.action.id===Separator.ID));return!0}focusNext(){var _a;if(void 0===this.focusedEnabledItem)this.focusedEnabledItem=this.viewItems.length-1;else if(this.viewItems.length<1)return!1;const startIndex=this.focusedEnabledItem;let item;do{this.focusedEnabledItem=(this.focusedEnabledItem+1)%this.viewItems.length,item=this.viewItems[this.focusedEnabledItem],null===(_a=this.codeActionList.value)||void 0===_a||_a.setFocus([item.index]),this.currSelectedItem=item.index}while(this.focusedEnabledItem!==startIndex&&(!item.isEnabled||item.action.id===Separator.ID));return!0}navigateListWithKeysUp(){this.focusPrevious()}navigateListWithKeysDown(){this.focusNext()}onEnterSet(){var _a;"number"==typeof this.currSelectedItem&&(null===(_a=this.codeActionList.value)||void 0===_a||_a.setSelection([this.currSelectedItem]))}dispose(){super.dispose()}hideCodeActionWidget(){this._ctxMenuWidgetVisible.reset(),this.options=[],this.viewItems=[],this.focusedEnabledItem=0,this.currSelectedItem=void 0,this.hasSeperator=!1,this._contextViewService.hideContextView({source:this})}codeActionTelemetry(openedFromString,didCancel,CodeActions){this._telemetryService.publicLog2("codeAction.applyCodeAction",{codeActionFrom:openedFromString,validCodeActions:CodeActions.validActions.length,cancelled:didCancel})}show(trigger,codeActions,at,options){return __awaiter(this,void 0,void 0,(function*(){const model=this._editor.getModel();if(!model)return;const actionsToShow=options.includeDisabledActions?codeActions.allActions:codeActions.validActions;if(!actionsToShow.length)return void(this._visible=!1);if(!this._editor.getDomNode())throw this._visible=!1,canceled();this._visible=!0,this._showingActions.value=codeActions;const menuActions=this.getMenuActions(trigger,actionsToShow,codeActions.documentation),anchor=Position.isIPosition(at)?this._toCoords(at):at||{x:0,y:0},resolver=this._keybindingResolver.getResolver(),useShadowDOM=this._editor.getOption(117);this.isCodeActionWidgetEnabled(model)?this._contextViewService.showContextView({getAnchor:()=>anchor,render:container=>this.renderCodeActionMenuList(container,menuActions),onHide:didCancel=>{const openedFromString=options.fromLightbulb?CodeActionTriggerSource.Lightbulb:trigger.triggerAction;this.codeActionTelemetry(openedFromString,didCancel,codeActions),this._visible=!1,this._editor.focus()}},this._editor.getDomNode(),!1):this._contextMenuService.showContextMenu({domForShadowRoot:useShadowDOM?this._editor.getDomNode():void 0,getAnchor:()=>anchor,getActions:()=>menuActions,onHide:didCancel=>{const openedFromString=options.fromLightbulb?CodeActionTriggerSource.Lightbulb:trigger.triggerAction;this.codeActionTelemetry(openedFromString,didCancel,codeActions),this._visible=!1,this._editor.focus()},autoSelectFirstItem:!0,getKeyBinding:action=>action instanceof CodeActionAction?resolver(action.action):void 0})}))}getMenuActions(trigger,actionsToShow,documentation){var _a,_b;const toCodeActionAction=item=>new CodeActionAction(item.action,(()=>this._delegate.onSelectCodeAction(item,trigger))),result=actionsToShow.map(toCodeActionAction),allDocumentation=[...documentation],model=this._editor.getModel();if(model&&result.length)for(const provider of this._languageFeaturesService.codeActionProvider.all(model))provider._getAdditionalMenuItems&&allDocumentation.push(...provider._getAdditionalMenuItems({trigger:trigger.type,only:null===(_b=null===(_a=trigger.filter)||void 0===_a?void 0:_a.include)||void 0===_b?void 0:_b.value},actionsToShow.map((item=>item.action))));return allDocumentation.length&&result.push(new Separator,...allDocumentation.map((command=>toCodeActionAction(new CodeActionItem({title:command.title,command,kind:CodeActionMenu.documentationID},void 0))))),result}_toCoords(position){if(!this._editor.hasModel())return{x:0,y:0};this._editor.revealPosition(position,1),this._editor.render();const cursorCoords=this._editor.getScrolledVisiblePosition(position),editorCoords=dom.getDomNodePagePosition(this._editor.getDomNode());return{x:editorCoords.left+cursorCoords.left,y:editorCoords.top+cursorCoords.top+cursorCoords.height}}};CodeActionMenu.documentationID="_documentation",CodeActionMenu=__decorate([__param(2,IContextMenuService),__param(3,IKeybindingService),__param(4,ILanguageFeaturesService),__param(5,ITelemetryService),__param(6,IThemeService),__param(7,IConfigurationService),__param(8,IContextViewService),__param(9,IContextKeyService)],CodeActionMenu);export{CodeActionMenu};export class CodeActionKeybindingResolver{constructor(_keybindingProvider){this._keybindingProvider=_keybindingProvider}getResolver(){const allCodeActionBindings=new Lazy((()=>this._keybindingProvider.getKeybindings().filter((item=>CodeActionKeybindingResolver.codeActionCommands.indexOf(item.command)>=0)).filter((item=>item.resolvedKeybinding)).map((item=>{let commandArgs=item.commandArgs;return item.command===organizeImportsCommandId?commandArgs={kind:CodeActionKind.SourceOrganizeImports.value}:item.command===fixAllCommandId&&(commandArgs={kind:CodeActionKind.SourceFixAll.value}),Object.assign({resolvedKeybinding:item.resolvedKeybinding},CodeActionCommandArgs.fromUser(commandArgs,{kind:CodeActionKind.None,apply:"never"}))}))));return action=>{if(action.kind){const binding=this.bestKeybindingForCodeAction(action,allCodeActionBindings.getValue());return null==binding?void 0:binding.resolvedKeybinding}}}bestKeybindingForCodeAction(action,candidates){if(!action.kind)return;const kind=new CodeActionKind(action.kind);return candidates.filter((candidate=>candidate.kind.contains(kind))).filter((candidate=>!candidate.preferred||action.isPreferred)).reduceRight(((currentBest,candidate)=>currentBest?currentBest.kind.contains(candidate.kind)?candidate:currentBest:candidate),void 0)}}CodeActionKeybindingResolver.codeActionCommands=[refactorCommandId,codeActionCommandId,sourceActionCommandId,organizeImportsCommandId,fixAllCommandId];