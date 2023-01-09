var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{Emitter}from"../../base/common/event.js";import{Disposable,toDisposable}from"../../base/common/lifecycle.js";export class TokenizationRegistry{constructor(){this._map=new Map,this._factories=new Map,this._onDidChange=new Emitter,this.onDidChange=this._onDidChange.event,this._colorMap=null}fire(languages){this._onDidChange.fire({changedLanguages:languages,changedColorMap:!1})}register(language,support){return this._map.set(language,support),this.fire([language]),toDisposable((()=>{this._map.get(language)===support&&(this._map.delete(language),this.fire([language]))}))}registerFactory(languageId,factory){var _a;null===(_a=this._factories.get(languageId))||void 0===_a||_a.dispose();const myData=new TokenizationSupportFactoryData(this,languageId,factory);return this._factories.set(languageId,myData),toDisposable((()=>{const v=this._factories.get(languageId);v&&v===myData&&(this._factories.delete(languageId),v.dispose())}))}getOrCreate(languageId){return __awaiter(this,void 0,void 0,(function*(){const tokenizationSupport=this.get(languageId);if(tokenizationSupport)return tokenizationSupport;const factory=this._factories.get(languageId);return!factory||factory.isResolved?null:(yield factory.resolve(),this.get(languageId))}))}get(language){return this._map.get(language)||null}isResolved(languageId){if(this.get(languageId))return!0;const factory=this._factories.get(languageId);return!(factory&&!factory.isResolved)}setColorMap(colorMap){this._colorMap=colorMap,this._onDidChange.fire({changedLanguages:Array.from(this._map.keys()),changedColorMap:!0})}getColorMap(){return this._colorMap}getDefaultBackground(){return this._colorMap&&this._colorMap.length>2?this._colorMap[2]:null}}class TokenizationSupportFactoryData extends Disposable{constructor(_registry,_languageId,_factory){super(),this._registry=_registry,this._languageId=_languageId,this._factory=_factory,this._isDisposed=!1,this._resolvePromise=null,this._isResolved=!1}get isResolved(){return this._isResolved}dispose(){this._isDisposed=!0,super.dispose()}resolve(){return __awaiter(this,void 0,void 0,(function*(){return this._resolvePromise||(this._resolvePromise=this._create()),this._resolvePromise}))}_create(){return __awaiter(this,void 0,void 0,(function*(){const value=yield Promise.resolve(this._factory.createTokenizationSupport());this._isResolved=!0,value&&!this._isDisposed&&this._register(this._registry.register(this._languageId,value))}))}}