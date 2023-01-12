var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import*as dom from"../../../../base/browser/dom.js";import{Action,Separator}from"../../../../base/common/actions.js";import{CancellationToken}from"../../../../base/common/cancellation.js";import{EditorExtensionsRegistry}from"../../../browser/editorExtensions.js";import{Range}from"../../../common/core/range.js";import{ITextModelService}from"../../../common/services/resolverService.js";import{DefinitionAction,SymbolNavigationAction,SymbolNavigationAnchor}from"../../gotoSymbol/browser/goToCommands.js";import{PeekContext}from"../../peekView/browser/peekView.js";import{isIMenuItem,MenuId,MenuRegistry}from"../../../../platform/actions/common/actions.js";import{ICommandService}from"../../../../platform/commands/common/commands.js";import{IContextKeyService}from"../../../../platform/contextkey/common/contextkey.js";import{IContextMenuService}from"../../../../platform/contextview/browser/contextView.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";import{INotificationService,Severity}from"../../../../platform/notification/common/notification.js";export function showGoToContextMenu(accessor,editor,anchor,part){var _a;return __awaiter(this,void 0,void 0,(function*(){const resolverService=accessor.get(ITextModelService),contextMenuService=accessor.get(IContextMenuService),commandService=accessor.get(ICommandService),instaService=accessor.get(IInstantiationService),notificationService=accessor.get(INotificationService);if(yield part.item.resolve(CancellationToken.None),!part.part.location)return;const location=part.part.location,menuActions=[],filter=new Set(MenuRegistry.getMenuItems(MenuId.EditorContext).map((item=>isIMenuItem(item)?item.command.id:"")));for(const delegate of EditorExtensionsRegistry.getEditorActions())delegate instanceof SymbolNavigationAction&&filter.has(delegate.id)&&menuActions.push(new Action(delegate.id,delegate.label,void 0,!0,(()=>__awaiter(this,void 0,void 0,(function*(){const ref=yield resolverService.createModelReference(location.uri);try{yield instaService.invokeFunction(delegate.run.bind(delegate),editor,new SymbolNavigationAnchor(ref.object.textEditorModel,Range.getStartPosition(location.range)))}finally{ref.dispose()}})))));if(part.part.command){const{command}=part.part;menuActions.push(new Separator),menuActions.push(new Action(command.id,command.title,void 0,!0,(()=>__awaiter(this,void 0,void 0,(function*(){var _b;try{yield commandService.executeCommand(command.id,...null!==(_b=command.arguments)&&void 0!==_b?_b:[])}catch(err){notificationService.notify({severity:Severity.Error,source:part.item.provider.displayName,message:err})}})))))}const useShadowDOM=editor.getOption(117);contextMenuService.showContextMenu({domForShadowRoot:useShadowDOM&&null!==(_a=editor.getDomNode())&&void 0!==_a?_a:void 0,getAnchor:()=>{const box=dom.getDomNodePagePosition(anchor);return{x:box.left,y:box.top+box.height+8}},getActions:()=>menuActions,onHide:()=>{editor.focus()},autoSelectFirstItem:!0})}))}export function goToDefinitionWithLocation(accessor,event,editor,location){return __awaiter(this,void 0,void 0,(function*(){const resolverService=accessor.get(ITextModelService),ref=yield resolverService.createModelReference(location.uri);yield editor.invokeWithinContext((accessor=>__awaiter(this,void 0,void 0,(function*(){const openToSide=event.hasSideBySideModifier,contextKeyService=accessor.get(IContextKeyService),isInPeek=PeekContext.inPeekEditor.getValue(contextKeyService),canPeek=!openToSide&&editor.getOption(80)&&!isInPeek;return new DefinitionAction({openToSide,openInPeek:canPeek,muteMessage:!0},{alias:"",label:"",id:"",precondition:void 0}).run(accessor,editor,{model:ref.object.textEditorModel,position:Range.getStartPosition(location.range)})})))),ref.dispose()}))}