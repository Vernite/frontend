var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{ContextView}from"../../../base/browser/ui/contextview/contextview.js";import{Disposable,toDisposable}from"../../../base/common/lifecycle.js";import{ILayoutService}from"../../layout/browser/layoutService.js";let ContextViewService=class ContextViewService extends Disposable{constructor(layoutService){super(),this.layoutService=layoutService,this.currentViewDisposable=Disposable.None,this.container=layoutService.hasContainer?layoutService.container:null,this.contextView=this._register(new ContextView(this.container,1)),this.layout(),this._register(layoutService.onDidLayout((()=>this.layout())))}setContainer(container,domPosition){this.contextView.setContainer(container,domPosition||1)}showContextView(delegate,container,shadowRoot){container?container===this.container&&this.shadowRoot===shadowRoot||(this.container=container,this.setContainer(container,shadowRoot?3:2)):this.layoutService.hasContainer&&this.container!==this.layoutService.container&&(this.container=this.layoutService.container,this.setContainer(this.container,1)),this.shadowRoot=shadowRoot,this.contextView.show(delegate);const disposable=toDisposable((()=>{this.currentViewDisposable===disposable&&this.hideContextView()}));return this.currentViewDisposable=disposable,disposable}getContextViewElement(){return this.contextView.getViewElement()}layout(){this.contextView.layout()}hideContextView(data){this.contextView.hide(data)}};ContextViewService=__decorate([__param(0,ILayoutService)],ContextViewService);export{ContextViewService};