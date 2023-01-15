var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{Disposable}from"../../../base/common/lifecycle.js";import{equalsIgnoreCase,startsWithIgnoreCase}from"../../../base/common/strings.js";import{URI}from"../../../base/common/uri.js";import{createDecorator}from"../../instantiation/common/instantiation.js";export const IOpenerService=createDecorator("openerService");export const NullOpenerService=Object.freeze({_serviceBrand:void 0,registerOpener:()=>Disposable.None,registerValidator:()=>Disposable.None,registerExternalUriResolver:()=>Disposable.None,setDefaultExternalOpener(){},registerExternalOpener:()=>Disposable.None,open(){return __awaiter(this,void 0,void 0,(function*(){return!1}))},resolveExternalUri(uri){return __awaiter(this,void 0,void 0,(function*(){return{resolved:uri,dispose(){}}}))}});export function matchesScheme(target,scheme){return URI.isUri(target)?equalsIgnoreCase(target.scheme,scheme):startsWithIgnoreCase(target,scheme+":")}export function matchesSomeScheme(target,...schemes){return schemes.some((scheme=>matchesScheme(target,scheme)))}export function extractSelection(uri){let selection;const match=/^L?(\d+)(?:,(\d+))?(-L?(\d+)(?:,(\d+))?)?/.exec(uri.fragment);return match&&(selection={startLineNumber:parseInt(match[1]),startColumn:match[2]?parseInt(match[2]):1,endLineNumber:match[4]?parseInt(match[4]):void 0,endColumn:match[4]?match[5]?parseInt(match[5]):1:void 0},uri=uri.with({fragment:""})),{selection,uri}}