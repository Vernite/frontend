var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{$,addDisposableListener,append,asCSSUrl,EventType,ModifierKeyEmitter,prepend}from"../../../base/browser/dom.js";import{StandardKeyboardEvent}from"../../../base/browser/keyboardEvent.js";import{ActionViewItem,BaseActionViewItem}from"../../../base/browser/ui/actionbar/actionViewItems.js";import{DropdownMenuActionViewItem}from"../../../base/browser/ui/dropdown/dropdownActionViewItem.js";import{ActionRunner,Separator,SubmenuAction}from"../../../base/common/actions.js";import{UILabelProvider}from"../../../base/common/keybindingLabels.js";import{combinedDisposable,DisposableStore,MutableDisposable,toDisposable}from"../../../base/common/lifecycle.js";import{isLinux,isWindows,OS}from"../../../base/common/platform.js";import"./menuEntryActionViewItem.css";import{localize}from"../../../nls.js";import{IMenuService,MenuItemAction,SubmenuItemAction}from"../common/actions.js";import{IContextKeyService}from"../../contextkey/common/contextkey.js";import{IContextMenuService}from"../../contextview/browser/contextView.js";import{IInstantiationService}from"../../instantiation/common/instantiation.js";import{IKeybindingService}from"../../keybinding/common/keybinding.js";import{INotificationService}from"../../notification/common/notification.js";import{IStorageService}from"../../storage/common/storage.js";import{IThemeService,ThemeIcon}from"../../theme/common/themeService.js";import{isDark}from"../../theme/common/theme.js";import{assertType}from"../../../base/common/types.js";export function createAndFillInActionBarActions(menu,options,target,primaryGroup,primaryMaxCount,shouldInlineSubmenu,useSeparatorsInPrimaryActions){const groups=menu.getActions(options);return fillInActions(groups,target,!1,"string"==typeof primaryGroup?actionGroup=>actionGroup===primaryGroup:primaryGroup,primaryMaxCount,shouldInlineSubmenu,useSeparatorsInPrimaryActions),asDisposable(groups)}function asDisposable(groups){const disposables=new DisposableStore;for(const[,actions]of groups)for(const action of actions)disposables.add(action);return disposables}function fillInActions(groups,target,useAlternativeActions,isPrimaryAction=(actionGroup=>"navigation"===actionGroup),primaryMaxCount=Number.MAX_SAFE_INTEGER,shouldInlineSubmenu=(()=>!1),useSeparatorsInPrimaryActions=!1){let primaryBucket,secondaryBucket;Array.isArray(target)?(primaryBucket=target,secondaryBucket=target):(primaryBucket=target.primary,secondaryBucket=target.secondary);const submenuInfo=new Set;for(const[group,actions]of groups){let target;isPrimaryAction(group)?(target=primaryBucket,target.length>0&&useSeparatorsInPrimaryActions&&target.push(new Separator)):(target=secondaryBucket,target.length>0&&target.push(new Separator));for(let action of actions){useAlternativeActions&&(action=action instanceof MenuItemAction&&action.alt?action.alt:action);const newLen=target.push(action);action instanceof SubmenuAction&&submenuInfo.add({group,action,index:newLen-1})}}for(const{group,action,index}of submenuInfo){const target=isPrimaryAction(group)?primaryBucket:secondaryBucket,submenuActions=action.actions;(submenuActions.length<=1||target.length+submenuActions.length-2<=primaryMaxCount)&&shouldInlineSubmenu(action,group,target.length)&&target.splice(index,1,...submenuActions)}if(primaryBucket!==secondaryBucket&&primaryBucket.length>primaryMaxCount){const overflow=primaryBucket.splice(primaryMaxCount,primaryBucket.length-primaryMaxCount);secondaryBucket.unshift(...overflow,new Separator)}}let MenuEntryActionViewItem=class MenuEntryActionViewItem extends ActionViewItem{constructor(action,options,_keybindingService,_notificationService,_contextKeyService,_themeService,_contextMenuService){super(void 0,action,{icon:!(!action.class&&!action.item.icon),label:!action.class&&!action.item.icon,draggable:null==options?void 0:options.draggable,keybinding:null==options?void 0:options.keybinding,hoverDelegate:null==options?void 0:options.hoverDelegate}),this._keybindingService=_keybindingService,this._notificationService=_notificationService,this._contextKeyService=_contextKeyService,this._themeService=_themeService,this._contextMenuService=_contextMenuService,this._wantsAltCommand=!1,this._itemClassDispose=this._register(new MutableDisposable),this._altKey=ModifierKeyEmitter.getInstance()}get _menuItemAction(){return this._action}get _commandAction(){return this._wantsAltCommand&&this._menuItemAction.alt||this._menuItemAction}onClick(event){return __awaiter(this,void 0,void 0,(function*(){event.preventDefault(),event.stopPropagation();try{yield this.actionRunner.run(this._commandAction,this._context)}catch(err){this._notificationService.error(err)}}))}render(container){super.render(container),container.classList.add("menu-entry"),this._updateItemClass(this._menuItemAction.item);let mouseOver=!1,alternativeKeyDown=this._altKey.keyStatus.altKey||(isWindows||isLinux)&&this._altKey.keyStatus.shiftKey;const updateAltState=()=>{var _a;const wantsAltCommand=mouseOver&&alternativeKeyDown&&!!(null===(_a=this._commandAction.alt)||void 0===_a?void 0:_a.enabled);wantsAltCommand!==this._wantsAltCommand&&(this._wantsAltCommand=wantsAltCommand,this.updateLabel(),this.updateTooltip(),this.updateClass())};this._menuItemAction.alt&&this._register(this._altKey.event((value=>{alternativeKeyDown=value.altKey||(isWindows||isLinux)&&value.shiftKey,updateAltState()}))),this._register(addDisposableListener(container,"mouseleave",(_=>{mouseOver=!1,updateAltState()}))),this._register(addDisposableListener(container,"mouseenter",(_=>{mouseOver=!0,updateAltState()})))}updateLabel(){this.options.label&&this.label&&(this.label.textContent=this._commandAction.label)}getTooltip(){var _a;const keybinding=this._keybindingService.lookupKeybinding(this._commandAction.id,this._contextKeyService),keybindingLabel=keybinding&&keybinding.getLabel(),tooltip=this._commandAction.tooltip||this._commandAction.label;let title=keybindingLabel?localize("titleAndKb","{0} ({1})",tooltip,keybindingLabel):tooltip;if(!this._wantsAltCommand&&(null===(_a=this._menuItemAction.alt)||void 0===_a?void 0:_a.enabled)){const altTooltip=this._menuItemAction.alt.tooltip||this._menuItemAction.alt.label,altKeybinding=this._keybindingService.lookupKeybinding(this._menuItemAction.alt.id,this._contextKeyService),altKeybindingLabel=altKeybinding&&altKeybinding.getLabel(),altTitleSection=altKeybindingLabel?localize("titleAndKb","{0} ({1})",altTooltip,altKeybindingLabel):altTooltip;title=localize("titleAndKbAndAlt","{0}\n[{1}] {2}",title,UILabelProvider.modifierLabels[OS].altKey,altTitleSection)}return title}updateClass(){this.options.icon&&(this._commandAction!==this._menuItemAction?this._menuItemAction.alt&&this._updateItemClass(this._menuItemAction.alt.item):this._updateItemClass(this._menuItemAction.item))}_updateItemClass(item){var _a;this._itemClassDispose.value=void 0;const{element,label}=this;if(!element||!label)return;const icon=this._commandAction.checked&&(null===(_a=item.toggled)||void 0===_a?void 0:_a.icon)?item.toggled.icon:item.icon;if(icon)if(ThemeIcon.isThemeIcon(icon)){const iconClasses=ThemeIcon.asClassNameArray(icon);label.classList.add(...iconClasses),this._itemClassDispose.value=toDisposable((()=>{label.classList.remove(...iconClasses)}))}else label.style.backgroundImage=isDark(this._themeService.getColorTheme().type)?asCSSUrl(icon.dark):asCSSUrl(icon.light),label.classList.add("icon"),this._itemClassDispose.value=combinedDisposable(toDisposable((()=>{label.style.backgroundImage="",label.classList.remove("icon")})),this._themeService.onDidColorThemeChange((()=>{this.updateClass()})))}};MenuEntryActionViewItem=__decorate([__param(2,IKeybindingService),__param(3,INotificationService),__param(4,IContextKeyService),__param(5,IThemeService),__param(6,IContextMenuService)],MenuEntryActionViewItem);export{MenuEntryActionViewItem};let SubmenuEntryActionViewItem=class SubmenuEntryActionViewItem extends DropdownMenuActionViewItem{constructor(action,options,_contextMenuService,_themeService){var _a,_b;const dropdownOptions=Object.assign({},null!=options?options:Object.create(null),{menuAsChild:null!==(_a=null==options?void 0:options.menuAsChild)&&void 0!==_a&&_a,classNames:null!==(_b=null==options?void 0:options.classNames)&&void 0!==_b?_b:ThemeIcon.isThemeIcon(action.item.icon)?ThemeIcon.asClassName(action.item.icon):void 0});super(action,{getActions:()=>action.actions},_contextMenuService,dropdownOptions),this._contextMenuService=_contextMenuService,this._themeService=_themeService}render(container){super.render(container),assertType(this.element),container.classList.add("menu-entry");const action=this._action,{icon}=action.item;if(icon&&!ThemeIcon.isThemeIcon(icon)){this.element.classList.add("icon");const setBackgroundImage=()=>{this.element&&(this.element.style.backgroundImage=isDark(this._themeService.getColorTheme().type)?asCSSUrl(icon.dark):asCSSUrl(icon.light))};setBackgroundImage(),this._register(this._themeService.onDidColorThemeChange((()=>{setBackgroundImage()})))}}};SubmenuEntryActionViewItem=__decorate([__param(2,IContextMenuService),__param(3,IThemeService)],SubmenuEntryActionViewItem);export{SubmenuEntryActionViewItem};let DropdownWithDefaultActionViewItem=class DropdownWithDefaultActionViewItem extends BaseActionViewItem{constructor(submenuAction,options,_keybindingService,_notificationService,_contextMenuService,_menuService,_instaService,_storageService){var _a,_b,_c;let defaultAction;super(null,submenuAction),this._keybindingService=_keybindingService,this._notificationService=_notificationService,this._contextMenuService=_contextMenuService,this._menuService=_menuService,this._instaService=_instaService,this._storageService=_storageService,this._container=null,this._options=options,this._storageKey=`${submenuAction.item.submenu.id}_lastActionId`;const defaultActionId=_storageService.get(this._storageKey,1);defaultActionId&&(defaultAction=submenuAction.actions.find((a=>defaultActionId===a.id))),defaultAction||(defaultAction=submenuAction.actions[0]),this._defaultAction=this._instaService.createInstance(MenuEntryActionViewItem,defaultAction,{keybinding:this._getDefaultActionKeybindingLabel(defaultAction)});const dropdownOptions=Object.assign({},null!=options?options:Object.create(null),{menuAsChild:null===(_a=null==options?void 0:options.menuAsChild)||void 0===_a||_a,classNames:null!==(_b=null==options?void 0:options.classNames)&&void 0!==_b?_b:["codicon","codicon-chevron-down"],actionRunner:null!==(_c=null==options?void 0:options.actionRunner)&&void 0!==_c?_c:new ActionRunner});this._dropdown=new DropdownMenuActionViewItem(submenuAction,submenuAction.actions,this._contextMenuService,dropdownOptions),this._dropdown.actionRunner.onDidRun((e=>{e.action instanceof MenuItemAction&&this.update(e.action)}))}update(lastAction){this._storageService.store(this._storageKey,lastAction.id,1,0),this._defaultAction.dispose(),this._defaultAction=this._instaService.createInstance(MenuEntryActionViewItem,lastAction,{keybinding:this._getDefaultActionKeybindingLabel(lastAction)}),this._defaultAction.actionRunner=new class extends ActionRunner{runAction(action,context){return __awaiter(this,void 0,void 0,(function*(){yield action.run(void 0)}))}},this._container&&this._defaultAction.render(prepend(this._container,$(".action-container")))}_getDefaultActionKeybindingLabel(defaultAction){var _a;let defaultActionKeybinding;if(null===(_a=this._options)||void 0===_a?void 0:_a.renderKeybindingWithDefaultActionLabel){const kb=this._keybindingService.lookupKeybinding(defaultAction.id);kb&&(defaultActionKeybinding=`(${kb.getLabel()})`)}return defaultActionKeybinding}setActionContext(newContext){super.setActionContext(newContext),this._defaultAction.setActionContext(newContext),this._dropdown.setActionContext(newContext)}render(container){this._container=container,super.render(this._container),this._container.classList.add("monaco-dropdown-with-default");const primaryContainer=$(".action-container");this._defaultAction.render(append(this._container,primaryContainer)),this._register(addDisposableListener(primaryContainer,EventType.KEY_DOWN,(e=>{const event=new StandardKeyboardEvent(e);event.equals(17)&&(this._defaultAction.element.tabIndex=-1,this._dropdown.focus(),event.stopPropagation())})));const dropdownContainer=$(".dropdown-action-container");this._dropdown.render(append(this._container,dropdownContainer)),this._register(addDisposableListener(dropdownContainer,EventType.KEY_DOWN,(e=>{var _a;const event=new StandardKeyboardEvent(e);event.equals(15)&&(this._defaultAction.element.tabIndex=0,this._dropdown.setFocusable(!1),null===(_a=this._defaultAction.element)||void 0===_a||_a.focus(),event.stopPropagation())})))}focus(fromRight){fromRight?this._dropdown.focus():(this._defaultAction.element.tabIndex=0,this._defaultAction.element.focus())}blur(){this._defaultAction.element.tabIndex=-1,this._dropdown.blur(),this._container.blur()}setFocusable(focusable){focusable?this._defaultAction.element.tabIndex=0:(this._defaultAction.element.tabIndex=-1,this._dropdown.setFocusable(!1))}dispose(){this._defaultAction.dispose(),this._dropdown.dispose(),super.dispose()}};DropdownWithDefaultActionViewItem=__decorate([__param(2,IKeybindingService),__param(3,INotificationService),__param(4,IContextMenuService),__param(5,IMenuService),__param(6,IInstantiationService),__param(7,IStorageService)],DropdownWithDefaultActionViewItem);export{DropdownWithDefaultActionViewItem};export function createActionViewItem(instaService,action,options){return action instanceof MenuItemAction?instaService.createInstance(MenuEntryActionViewItem,action,options):action instanceof SubmenuItemAction?action.item.rememberDefaultAction?instaService.createInstance(DropdownWithDefaultActionViewItem,action,options):instaService.createInstance(SubmenuEntryActionViewItem,action,options):void 0}