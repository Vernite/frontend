var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{Emitter}from"../../../../base/common/event.js";import{Disposable,MutableDisposable}from"../../../../base/common/lifecycle.js";import{Position}from"../../../common/core/position.js";import{InlineCompletionTriggerKind}from"../../../common/languages.js";import{InlineCompletionsModel,SynchronizedInlineCompletionsCache}from"./inlineCompletionsModel.js";import{SuggestWidgetPreviewModel}from"./suggestWidgetPreviewModel.js";import{createDisposableRef}from"./utils.js";import{IInstantiationService}from"../../../../platform/instantiation/common/instantiation.js";export class DelegatingModel extends Disposable{constructor(){super(...arguments),this.onDidChangeEmitter=new Emitter,this.onDidChange=this.onDidChangeEmitter.event,this.hasCachedGhostText=!1,this.currentModelRef=this._register(new MutableDisposable)}get targetModel(){var _a;return null===(_a=this.currentModelRef.value)||void 0===_a?void 0:_a.object}setTargetModel(model){var _a;(null===(_a=this.currentModelRef.value)||void 0===_a?void 0:_a.object)!==model&&(this.currentModelRef.clear(),this.currentModelRef.value=model?createDisposableRef(model,model.onDidChange((()=>{this.hasCachedGhostText=!1,this.onDidChangeEmitter.fire()}))):void 0,this.hasCachedGhostText=!1,this.onDidChangeEmitter.fire())}get ghostText(){var _a,_b;return this.hasCachedGhostText||(this.cachedGhostText=null===(_b=null===(_a=this.currentModelRef.value)||void 0===_a?void 0:_a.object)||void 0===_b?void 0:_b.ghostText,this.hasCachedGhostText=!0),this.cachedGhostText}setExpanded(expanded){var _a;null===(_a=this.targetModel)||void 0===_a||_a.setExpanded(expanded)}get minReservedLineCount(){return this.targetModel?this.targetModel.minReservedLineCount:0}}let GhostTextModel=class GhostTextModel extends DelegatingModel{constructor(editor,instantiationService){super(),this.editor=editor,this.instantiationService=instantiationService,this.sharedCache=this._register(new SharedInlineCompletionCache),this.suggestWidgetAdapterModel=this._register(this.instantiationService.createInstance(SuggestWidgetPreviewModel,this.editor,this.sharedCache)),this.inlineCompletionsModel=this._register(this.instantiationService.createInstance(InlineCompletionsModel,this.editor,this.sharedCache)),this._register(this.suggestWidgetAdapterModel.onDidChange((()=>{this.updateModel()}))),this.updateModel()}get activeInlineCompletionsModel(){if(this.targetModel===this.inlineCompletionsModel)return this.inlineCompletionsModel}updateModel(){this.setTargetModel(this.suggestWidgetAdapterModel.isActive?this.suggestWidgetAdapterModel:this.inlineCompletionsModel),this.inlineCompletionsModel.setActive(this.targetModel===this.inlineCompletionsModel)}shouldShowHoverAt(hoverRange){var _a;const ghostText=null===(_a=this.activeInlineCompletionsModel)||void 0===_a?void 0:_a.ghostText;return!!ghostText&&ghostText.parts.some((p=>hoverRange.containsPosition(new Position(ghostText.lineNumber,p.column))))}triggerInlineCompletion(){var _a;null===(_a=this.activeInlineCompletionsModel)||void 0===_a||_a.trigger(InlineCompletionTriggerKind.Explicit)}commitInlineCompletion(){var _a;null===(_a=this.activeInlineCompletionsModel)||void 0===_a||_a.commitCurrentSuggestion()}hideInlineCompletion(){var _a;null===(_a=this.activeInlineCompletionsModel)||void 0===_a||_a.hide()}showNextInlineCompletion(){var _a;null===(_a=this.activeInlineCompletionsModel)||void 0===_a||_a.showNext()}showPreviousInlineCompletion(){var _a;null===(_a=this.activeInlineCompletionsModel)||void 0===_a||_a.showPrevious()}hasMultipleInlineCompletions(){var _a;return __awaiter(this,void 0,void 0,(function*(){const result=yield null===(_a=this.activeInlineCompletionsModel)||void 0===_a?void 0:_a.hasMultipleInlineCompletions();return void 0!==result&&result}))}};GhostTextModel=__decorate([__param(1,IInstantiationService)],GhostTextModel);export{GhostTextModel};export class SharedInlineCompletionCache extends Disposable{constructor(){super(...arguments),this.onDidChangeEmitter=new Emitter,this.onDidChange=this.onDidChangeEmitter.event,this.cache=this._register(new MutableDisposable)}get value(){return this.cache.value}setValue(editor,completionsSource,triggerKind){this.cache.value=new SynchronizedInlineCompletionsCache(completionsSource,editor,(()=>this.onDidChangeEmitter.fire()),triggerKind)}clearAndLeak(){return this.cache.clearAndLeak()}clear(){this.cache.clear()}}