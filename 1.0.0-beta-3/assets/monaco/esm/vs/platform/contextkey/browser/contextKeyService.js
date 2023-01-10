var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{PauseableEmitter}from"../../../base/common/event.js";import{Iterable}from"../../../base/common/iterator.js";import{DisposableStore,MutableDisposable}from"../../../base/common/lifecycle.js";import{TernarySearchTree}from"../../../base/common/map.js";import{cloneAndChange}from"../../../base/common/objects.js";import{URI}from"../../../base/common/uri.js";import{localize}from"../../../nls.js";import{CommandsRegistry}from"../../commands/common/commands.js";import{IConfigurationService}from"../../configuration/common/configuration.js";import{IContextKeyService,RawContextKey,SET_CONTEXT_COMMAND_ID}from"../common/contextkey.js";const KEYBINDING_CONTEXT_ATTR="data-keybinding-context";export class Context{constructor(id,parent){this._id=id,this._parent=parent,this._value=Object.create(null),this._value._contextId=id}get value(){return Object.assign({},this._value)}setValue(key,value){return this._value[key]!==value&&(this._value[key]=value,!0)}removeValue(key){return key in this._value&&(delete this._value[key],!0)}getValue(key){const ret=this._value[key];return void 0===ret&&this._parent?this._parent.getValue(key):ret}}class NullContext extends Context{constructor(){super(-1,null)}setValue(key,value){return!1}removeValue(key){return!1}getValue(key){}}NullContext.INSTANCE=new NullContext;class ConfigAwareContextValuesContainer extends Context{constructor(id,_configurationService,emitter){super(id,null),this._configurationService=_configurationService,this._values=TernarySearchTree.forConfigKeys(),this._listener=this._configurationService.onDidChangeConfiguration((event=>{if(7===event.source){const allKeys=Array.from(Iterable.map(this._values,(([k])=>k)));this._values.clear(),emitter.fire(new ArrayContextKeyChangeEvent(allKeys))}else{const changedKeys=[];for(const configKey of event.affectedKeys){const contextKey=`config.${configKey}`,cachedItems=this._values.findSuperstr(contextKey);void 0!==cachedItems&&(changedKeys.push(...Iterable.map(cachedItems,(([key])=>key))),this._values.deleteSuperstr(contextKey)),this._values.has(contextKey)&&(changedKeys.push(contextKey),this._values.delete(contextKey))}emitter.fire(new ArrayContextKeyChangeEvent(changedKeys))}}))}dispose(){this._listener.dispose()}getValue(key){if(0!==key.indexOf(ConfigAwareContextValuesContainer._keyPrefix))return super.getValue(key);if(this._values.has(key))return this._values.get(key);const configKey=key.substr(ConfigAwareContextValuesContainer._keyPrefix.length),configValue=this._configurationService.getValue(configKey);let value;switch(typeof configValue){case"number":case"boolean":case"string":value=configValue;break;default:value=Array.isArray(configValue)?JSON.stringify(configValue):configValue}return this._values.set(key,value),value}setValue(key,value){return super.setValue(key,value)}removeValue(key){return super.removeValue(key)}}ConfigAwareContextValuesContainer._keyPrefix="config.";class ContextKey{constructor(service,key,defaultValue){this._service=service,this._key=key,this._defaultValue=defaultValue,this.reset()}set(value){this._service.setContext(this._key,value)}reset(){void 0===this._defaultValue?this._service.removeContext(this._key):this._service.setContext(this._key,this._defaultValue)}get(){return this._service.getContextKeyValue(this._key)}}class SimpleContextKeyChangeEvent{constructor(key){this.key=key}affectsSome(keys){return keys.has(this.key)}allKeysContainedIn(keys){return this.affectsSome(keys)}}class ArrayContextKeyChangeEvent{constructor(keys){this.keys=keys}affectsSome(keys){for(const key of this.keys)if(keys.has(key))return!0;return!1}allKeysContainedIn(keys){return this.keys.every((key=>keys.has(key)))}}class CompositeContextKeyChangeEvent{constructor(events){this.events=events}affectsSome(keys){for(const e of this.events)if(e.affectsSome(keys))return!0;return!1}allKeysContainedIn(keys){return this.events.every((evt=>evt.allKeysContainedIn(keys)))}}function allEventKeysInContext(event,context){return event.allKeysContainedIn(new Set(Object.keys(context)))}export class AbstractContextKeyService{constructor(myContextId){this._onDidChangeContext=new PauseableEmitter({merge:input=>new CompositeContextKeyChangeEvent(input)}),this.onDidChangeContext=this._onDidChangeContext.event,this._isDisposed=!1,this._myContextId=myContextId}createKey(key,defaultValue){if(this._isDisposed)throw new Error("AbstractContextKeyService has been disposed");return new ContextKey(this,key,defaultValue)}bufferChangeEvents(callback){this._onDidChangeContext.pause();try{callback()}finally{this._onDidChangeContext.resume()}}createScoped(domNode){if(this._isDisposed)throw new Error("AbstractContextKeyService has been disposed");return new ScopedContextKeyService(this,domNode)}contextMatchesRules(rules){if(this._isDisposed)throw new Error("AbstractContextKeyService has been disposed");const context=this.getContextValuesContainer(this._myContextId);return!rules||rules.evaluate(context)}getContextKeyValue(key){if(!this._isDisposed)return this.getContextValuesContainer(this._myContextId).getValue(key)}setContext(key,value){if(this._isDisposed)return;const myContext=this.getContextValuesContainer(this._myContextId);myContext&&myContext.setValue(key,value)&&this._onDidChangeContext.fire(new SimpleContextKeyChangeEvent(key))}removeContext(key){this._isDisposed||this.getContextValuesContainer(this._myContextId).removeValue(key)&&this._onDidChangeContext.fire(new SimpleContextKeyChangeEvent(key))}getContext(target){return this._isDisposed?NullContext.INSTANCE:this.getContextValuesContainer(findContextAttr(target))}}let ContextKeyService=class ContextKeyService extends AbstractContextKeyService{constructor(configurationService){super(0),this._contexts=new Map,this._toDispose=new DisposableStore,this._lastContextId=0;const myContext=new ConfigAwareContextValuesContainer(this._myContextId,configurationService,this._onDidChangeContext);this._contexts.set(this._myContextId,myContext),this._toDispose.add(myContext)}dispose(){this._onDidChangeContext.dispose(),this._isDisposed=!0,this._toDispose.dispose()}getContextValuesContainer(contextId){return this._isDisposed?NullContext.INSTANCE:this._contexts.get(contextId)||NullContext.INSTANCE}createChildContext(parentContextId=this._myContextId){if(this._isDisposed)throw new Error("ContextKeyService has been disposed");const id=++this._lastContextId;return this._contexts.set(id,new Context(id,this.getContextValuesContainer(parentContextId))),id}disposeContext(contextId){this._isDisposed||this._contexts.delete(contextId)}};ContextKeyService=__decorate([__param(0,IConfigurationService)],ContextKeyService);export{ContextKeyService};class ScopedContextKeyService extends AbstractContextKeyService{constructor(parent,domNode){if(super(parent.createChildContext()),this._parentChangeListener=new MutableDisposable,this._parent=parent,this._updateParentChangeListener(),this._domNode=domNode,this._domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)){let extraInfo="";this._domNode.classList&&(extraInfo=Array.from(this._domNode.classList.values()).join(", ")),console.error("Element already has context attribute"+(extraInfo?": "+extraInfo:""))}this._domNode.setAttribute(KEYBINDING_CONTEXT_ATTR,String(this._myContextId))}_updateParentChangeListener(){this._parentChangeListener.value=this._parent.onDidChangeContext((e=>{allEventKeysInContext(e,this._parent.getContextValuesContainer(this._myContextId).value)||this._onDidChangeContext.fire(e)}))}dispose(){this._isDisposed||(this._onDidChangeContext.dispose(),this._parent.disposeContext(this._myContextId),this._parentChangeListener.dispose(),this._domNode.removeAttribute(KEYBINDING_CONTEXT_ATTR),this._isDisposed=!0)}getContextValuesContainer(contextId){return this._isDisposed?NullContext.INSTANCE:this._parent.getContextValuesContainer(contextId)}createChildContext(parentContextId=this._myContextId){if(this._isDisposed)throw new Error("ScopedContextKeyService has been disposed");return this._parent.createChildContext(parentContextId)}disposeContext(contextId){this._isDisposed||this._parent.disposeContext(contextId)}}function findContextAttr(domNode){for(;domNode;){if(domNode.hasAttribute(KEYBINDING_CONTEXT_ATTR)){const attr=domNode.getAttribute(KEYBINDING_CONTEXT_ATTR);return attr?parseInt(attr,10):NaN}domNode=domNode.parentElement}return 0}export function setContext(accessor,contextKey,contextValue){accessor.get(IContextKeyService).createKey(String(contextKey),stringifyURIs(contextValue))}function stringifyURIs(contextValue){return cloneAndChange(contextValue,(obj=>"object"==typeof obj&&1===obj.$mid?URI.revive(obj).toString():obj instanceof URI?obj.toString():void 0))}CommandsRegistry.registerCommand(SET_CONTEXT_COMMAND_ID,setContext),CommandsRegistry.registerCommand({id:"getContextKeyInfo",handler:()=>[...RawContextKey.all()].sort(((a,b)=>a.key.localeCompare(b.key))),description:{description:localize("getContextKeyInfo","A command that returns information about context keys"),args:[]}}),CommandsRegistry.registerCommand("_generateContextKeyInfo",(function(){const result=[],seen=new Set;for(const info of RawContextKey.all())seen.has(info.key)||(seen.add(info.key),result.push(info));result.sort(((a,b)=>a.key.localeCompare(b.key))),console.log(JSON.stringify(result,void 0,2))}));