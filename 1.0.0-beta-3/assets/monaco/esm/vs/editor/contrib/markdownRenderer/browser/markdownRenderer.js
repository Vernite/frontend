var _a,__decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{renderMarkdown}from"../../../../base/browser/markdownRenderer.js";import{IOpenerService}from"../../../../platform/opener/common/opener.js";import{ILanguageService}from"../../../common/languages/language.js";import{onUnexpectedError}from"../../../../base/common/errors.js";import{tokenizeToString}from"../../../common/languages/textToHtmlTokenizer.js";import{Emitter}from"../../../../base/common/event.js";import{DisposableStore}from"../../../../base/common/lifecycle.js";import{applyFontInfo}from"../../../browser/config/domFontInfo.js";import{PLAINTEXT_LANGUAGE_ID}from"../../../common/languages/modesRegistry.js";let MarkdownRenderer=class MarkdownRenderer{constructor(_options,_languageService,_openerService){this._options=_options,this._languageService=_languageService,this._openerService=_openerService,this._onDidRenderAsync=new Emitter,this.onDidRenderAsync=this._onDidRenderAsync.event}dispose(){this._onDidRenderAsync.dispose()}render(markdown,options,markedOptions){if(!markdown){return{element:document.createElement("span"),dispose:()=>{}}}const disposables=new DisposableStore;return{element:disposables.add(renderMarkdown(markdown,Object.assign(Object.assign({},this._getRenderOptions(markdown,disposables)),options),markedOptions)).element,dispose:()=>disposables.dispose()}}_getRenderOptions(markdown,disposables){return{codeBlockRenderer:(languageAlias,value)=>__awaiter(this,void 0,void 0,(function*(){var _a,_b,_c;let languageId;languageAlias?languageId=this._languageService.getLanguageIdByLanguageName(languageAlias):this._options.editor&&(languageId=null===(_a=this._options.editor.getModel())||void 0===_a?void 0:_a.getLanguageId()),languageId||(languageId=PLAINTEXT_LANGUAGE_ID);const html=yield tokenizeToString(this._languageService,value,languageId),element=document.createElement("span");if(element.innerHTML=null!==(_c=null===(_b=MarkdownRenderer._ttpTokenizer)||void 0===_b?void 0:_b.createHTML(html))&&void 0!==_c?_c:html,this._options.editor){const fontInfo=this._options.editor.getOption(46);applyFontInfo(element,fontInfo)}else this._options.codeBlockFontFamily&&(element.style.fontFamily=this._options.codeBlockFontFamily);return void 0!==this._options.codeBlockFontSize&&(element.style.fontSize=this._options.codeBlockFontSize),element})),asyncRenderCallback:()=>this._onDidRenderAsync.fire(),actionHandler:{callback:content=>this._openerService.open(content,{fromUserGesture:!0,allowContributedOpeners:!0,allowCommands:markdown.isTrusted}).catch(onUnexpectedError),disposables}}}};MarkdownRenderer._ttpTokenizer=null===(_a=window.trustedTypes)||void 0===_a?void 0:_a.createPolicy("tokenizeToString",{createHTML:html=>html}),MarkdownRenderer=__decorate([__param(1,ILanguageService),__param(2,IOpenerService)],MarkdownRenderer);export{MarkdownRenderer};