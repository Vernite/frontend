var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{DeferredPromise}from"../../../base/common/async.js";import{CancellationTokenSource}from"../../../base/common/cancellation.js";import{once}from"../../../base/common/functional.js";import{Disposable,DisposableStore,toDisposable}from"../../../base/common/lifecycle.js";import{IInstantiationService}from"../../instantiation/common/instantiation.js";import{DefaultQuickAccessFilterValue,Extensions}from"../common/quickAccess.js";import{IQuickInputService,ItemActivation}from"../common/quickInput.js";import{Registry}from"../../registry/common/platform.js";let QuickAccessController=class QuickAccessController extends Disposable{constructor(quickInputService,instantiationService){super(),this.quickInputService=quickInputService,this.instantiationService=instantiationService,this.registry=Registry.as(Extensions.Quickaccess),this.mapProviderToDescriptor=new Map,this.lastAcceptedPickerValues=new Map,this.visibleQuickAccess=void 0}show(value="",options){this.doShowOrPick(value,!1,options)}doShowOrPick(value,pick,options){var _a;const[provider,descriptor]=this.getOrInstantiateProvider(value),visibleQuickAccess=this.visibleQuickAccess,visibleDescriptor=null==visibleQuickAccess?void 0:visibleQuickAccess.descriptor;if(visibleQuickAccess&&descriptor&&visibleDescriptor===descriptor)return value===descriptor.prefix||(null==options?void 0:options.preserveValue)||(visibleQuickAccess.picker.value=value),void this.adjustValueSelection(visibleQuickAccess.picker,descriptor,options);if(descriptor&&!(null==options?void 0:options.preserveValue)){let newValue;if(visibleQuickAccess&&visibleDescriptor&&visibleDescriptor!==descriptor){const newValueCandidateWithoutPrefix=visibleQuickAccess.value.substr(visibleDescriptor.prefix.length);newValueCandidateWithoutPrefix&&(newValue=`${descriptor.prefix}${newValueCandidateWithoutPrefix}`)}if(!newValue){const defaultFilterValue=null==provider?void 0:provider.defaultFilterValue;defaultFilterValue===DefaultQuickAccessFilterValue.LAST?newValue=this.lastAcceptedPickerValues.get(descriptor):"string"==typeof defaultFilterValue&&(newValue=`${descriptor.prefix}${defaultFilterValue}`)}"string"==typeof newValue&&(value=newValue)}const disposables=new DisposableStore,picker=disposables.add(this.quickInputService.createQuickPick());let pickPromise;picker.value=value,this.adjustValueSelection(picker,descriptor,options),picker.placeholder=null==descriptor?void 0:descriptor.placeholder,picker.quickNavigate=null==options?void 0:options.quickNavigateConfiguration,picker.hideInput=!!picker.quickNavigate&&!visibleQuickAccess,("number"==typeof(null==options?void 0:options.itemActivation)||(null==options?void 0:options.quickNavigateConfiguration))&&(picker.itemActivation=null!==(_a=null==options?void 0:options.itemActivation)&&void 0!==_a?_a:ItemActivation.SECOND),picker.contextKey=null==descriptor?void 0:descriptor.contextKey,picker.filterValue=value=>value.substring(descriptor?descriptor.prefix.length:0),(null==descriptor?void 0:descriptor.placeholder)&&(picker.ariaLabel=null==descriptor?void 0:descriptor.placeholder),pick&&(pickPromise=new DeferredPromise,disposables.add(once(picker.onWillAccept)((e=>{e.veto(),picker.hide()})))),disposables.add(this.registerPickerListeners(picker,provider,descriptor,value));const cts=disposables.add(new CancellationTokenSource);return provider&&disposables.add(provider.provide(picker,cts.token)),once(picker.onDidHide)((()=>{0===picker.selectedItems.length&&cts.cancel(),disposables.dispose(),null==pickPromise||pickPromise.complete(picker.selectedItems.slice(0))})),picker.show(),pick?null==pickPromise?void 0:pickPromise.p:void 0}adjustValueSelection(picker,descriptor,options){var _a;let valueSelection;valueSelection=(null==options?void 0:options.preserveValue)?[picker.value.length,picker.value.length]:[null!==(_a=null==descriptor?void 0:descriptor.prefix.length)&&void 0!==_a?_a:0,picker.value.length],picker.valueSelection=valueSelection}registerPickerListeners(picker,provider,descriptor,value){const disposables=new DisposableStore,visibleQuickAccess=this.visibleQuickAccess={picker,descriptor,value};return disposables.add(toDisposable((()=>{visibleQuickAccess===this.visibleQuickAccess&&(this.visibleQuickAccess=void 0)}))),disposables.add(picker.onDidChangeValue((value=>{const[providerForValue]=this.getOrInstantiateProvider(value);providerForValue!==provider?this.show(value,{preserveValue:!0}):visibleQuickAccess.value=value}))),descriptor&&disposables.add(picker.onDidAccept((()=>{this.lastAcceptedPickerValues.set(descriptor,picker.value)}))),disposables}getOrInstantiateProvider(value){const providerDescriptor=this.registry.getQuickAccessProvider(value);if(!providerDescriptor)return[void 0,void 0];let provider=this.mapProviderToDescriptor.get(providerDescriptor);return provider||(provider=this.instantiationService.createInstance(providerDescriptor.ctor),this.mapProviderToDescriptor.set(providerDescriptor,provider)),[provider,providerDescriptor]}};QuickAccessController=__decorate([__param(0,IQuickInputService),__param(1,IInstantiationService)],QuickAccessController);export{QuickAccessController};