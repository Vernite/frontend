var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import"./bannerController.css";import{$,append,clearNode}from"../../../../base/browser/dom.js";import{ActionBar}from"../../../../base/browser/ui/actionbar/actionbar.js";import{Action}from"../../../../base/common/actions.js";import{Disposable}from"../../../../base/common/lifecycle.js";import{MarkdownRenderer}from"../../markdownRenderer/browser/markdownRenderer.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";import{Link}from"../../../../platform/opener/browser/link.js";import{widgetClose}from"../../../../platform/theme/common/iconRegistry.js";import{ThemeIcon}from"../../../../platform/theme/common/themeService.js";const BANNER_ELEMENT_HEIGHT=26;let BannerController=class BannerController extends Disposable{constructor(_editor,instantiationService){super(),this._editor=_editor,this.instantiationService=instantiationService,this.banner=this._register(this.instantiationService.createInstance(Banner))}hide(){this._editor.setBanner(null,0),this.banner.clear()}show(item){this.banner.show(Object.assign(Object.assign({},item),{onClose:()=>{var _a;this.hide(),null===(_a=item.onClose)||void 0===_a||_a.call(item)}})),this._editor.setBanner(this.banner.element,26)}};BannerController=__decorate([__param(1,IInstantiationService)],BannerController);export{BannerController};let Banner=class Banner extends Disposable{constructor(instantiationService){super(),this.instantiationService=instantiationService,this.markdownRenderer=this.instantiationService.createInstance(MarkdownRenderer,{}),this.element=$("div.editor-banner"),this.element.tabIndex=0}getAriaLabel(item){return item.ariaLabel?item.ariaLabel:"string"==typeof item.message?item.message:void 0}getBannerMessage(message){if("string"==typeof message){const element=$("span");return element.innerText=message,element}return this.markdownRenderer.render(message).element}clear(){clearNode(this.element)}show(item){clearNode(this.element);const ariaLabel=this.getAriaLabel(item);ariaLabel&&this.element.setAttribute("aria-label",ariaLabel);const iconContainer=append(this.element,$("div.icon-container"));iconContainer.setAttribute("aria-hidden","true"),item.icon&&iconContainer.appendChild($(`div${ThemeIcon.asCSSSelector(item.icon)}`));const messageContainer=append(this.element,$("div.message-container"));if(messageContainer.setAttribute("aria-hidden","true"),messageContainer.appendChild(this.getBannerMessage(item.message)),this.messageActionsContainer=append(this.element,$("div.message-actions-container")),item.actions)for(const action of item.actions)this._register(this.instantiationService.createInstance(Link,this.messageActionsContainer,Object.assign(Object.assign({},action),{tabIndex:-1}),{}));const actionBarContainer=append(this.element,$("div.action-container"));this.actionBar=this._register(new ActionBar(actionBarContainer)),this.actionBar.push(this._register(new Action("banner.close","Close Banner",ThemeIcon.asClassName(widgetClose),!0,(()=>{"function"==typeof item.onClose&&item.onClose()}))),{icon:!0,label:!1}),this.actionBar.setFocusable(!1)}};Banner=__decorate([__param(0,IInstantiationService)],Banner);