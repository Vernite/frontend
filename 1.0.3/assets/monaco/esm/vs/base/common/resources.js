import*as extpath from"./extpath.js";import{Schemas}from"./network.js";import*as paths from"./path.js";import{isLinux,isWindows}from"./platform.js";import{compare as strCompare,equalsIgnoreCase}from"./strings.js";import{URI,uriToFsPath}from"./uri.js";export function originalFSPath(uri){return uriToFsPath(uri,!0)}export class ExtUri{constructor(_ignorePathCasing){this._ignorePathCasing=_ignorePathCasing}compare(uri1,uri2,ignoreFragment=!1){return uri1===uri2?0:strCompare(this.getComparisonKey(uri1,ignoreFragment),this.getComparisonKey(uri2,ignoreFragment))}isEqual(uri1,uri2,ignoreFragment=!1){return uri1===uri2||!(!uri1||!uri2)&&this.getComparisonKey(uri1,ignoreFragment)===this.getComparisonKey(uri2,ignoreFragment)}getComparisonKey(uri,ignoreFragment=!1){return uri.with({path:this._ignorePathCasing(uri)?uri.path.toLowerCase():void 0,fragment:ignoreFragment?null:void 0}).toString()}isEqualOrParent(base,parentCandidate,ignoreFragment=!1){if(base.scheme===parentCandidate.scheme){if(base.scheme===Schemas.file)return extpath.isEqualOrParent(originalFSPath(base),originalFSPath(parentCandidate),this._ignorePathCasing(base))&&base.query===parentCandidate.query&&(ignoreFragment||base.fragment===parentCandidate.fragment);if(isEqualAuthority(base.authority,parentCandidate.authority))return extpath.isEqualOrParent(base.path,parentCandidate.path,this._ignorePathCasing(base),"/")&&base.query===parentCandidate.query&&(ignoreFragment||base.fragment===parentCandidate.fragment)}return!1}joinPath(resource,...pathFragment){return URI.joinPath(resource,...pathFragment)}basenameOrAuthority(resource){return basename(resource)||resource.authority}basename(resource){return paths.posix.basename(resource.path)}extname(resource){return paths.posix.extname(resource.path)}dirname(resource){if(0===resource.path.length)return resource;let dirname;return resource.scheme===Schemas.file?dirname=URI.file(paths.dirname(originalFSPath(resource))).path:(dirname=paths.posix.dirname(resource.path),resource.authority&&dirname.length&&47!==dirname.charCodeAt(0)&&(console.error(`dirname("${resource.toString})) resulted in a relative path`),dirname="/")),resource.with({path:dirname})}normalizePath(resource){if(!resource.path.length)return resource;let normalizedPath;return normalizedPath=resource.scheme===Schemas.file?URI.file(paths.normalize(originalFSPath(resource))).path:paths.posix.normalize(resource.path),resource.with({path:normalizedPath})}relativePath(from,to){if(from.scheme!==to.scheme||!isEqualAuthority(from.authority,to.authority))return;if(from.scheme===Schemas.file){const relativePath=paths.relative(originalFSPath(from),originalFSPath(to));return isWindows?extpath.toSlashes(relativePath):relativePath}let fromPath=from.path||"/";const toPath=to.path||"/";if(this._ignorePathCasing(from)){let i=0;for(const len=Math.min(fromPath.length,toPath.length);i<len&&(fromPath.charCodeAt(i)===toPath.charCodeAt(i)||fromPath.charAt(i).toLowerCase()===toPath.charAt(i).toLowerCase());i++);fromPath=toPath.substr(0,i)+fromPath.substr(i)}return paths.posix.relative(fromPath,toPath)}resolvePath(base,path){if(base.scheme===Schemas.file){const newURI=URI.file(paths.resolve(originalFSPath(base),path));return base.with({authority:newURI.authority,path:newURI.path})}return path=extpath.toPosixPath(path),base.with({path:paths.posix.resolve(base.path,path)})}isAbsolutePath(resource){return!!resource.path&&"/"===resource.path[0]}isEqualAuthority(a1,a2){return a1===a2||void 0!==a1&&void 0!==a2&&equalsIgnoreCase(a1,a2)}hasTrailingPathSeparator(resource,sep=paths.sep){if(resource.scheme===Schemas.file){const fsp=originalFSPath(resource);return fsp.length>extpath.getRoot(fsp).length&&fsp[fsp.length-1]===sep}{const p=resource.path;return p.length>1&&47===p.charCodeAt(p.length-1)&&!/^[a-zA-Z]:(\/$|\\$)/.test(resource.fsPath)}}removeTrailingPathSeparator(resource,sep=paths.sep){return hasTrailingPathSeparator(resource,sep)?resource.with({path:resource.path.substr(0,resource.path.length-1)}):resource}addTrailingPathSeparator(resource,sep=paths.sep){let isRootSep=!1;if(resource.scheme===Schemas.file){const fsp=originalFSPath(resource);isRootSep=void 0!==fsp&&fsp.length===extpath.getRoot(fsp).length&&fsp[fsp.length-1]===sep}else{sep="/";const p=resource.path;isRootSep=1===p.length&&47===p.charCodeAt(p.length-1)}return isRootSep||hasTrailingPathSeparator(resource,sep)?resource:resource.with({path:resource.path+"/"})}}export const extUri=new ExtUri((()=>!1));export const extUriBiasedIgnorePathCase=new ExtUri((uri=>uri.scheme!==Schemas.file||!isLinux));export const extUriIgnorePathCase=new ExtUri((_=>!0));export const isEqual=extUri.isEqual.bind(extUri);export const isEqualOrParent=extUri.isEqualOrParent.bind(extUri);export const getComparisonKey=extUri.getComparisonKey.bind(extUri);export const basenameOrAuthority=extUri.basenameOrAuthority.bind(extUri);export const basename=extUri.basename.bind(extUri);export const extname=extUri.extname.bind(extUri);export const dirname=extUri.dirname.bind(extUri);export const joinPath=extUri.joinPath.bind(extUri);export const normalizePath=extUri.normalizePath.bind(extUri);export const relativePath=extUri.relativePath.bind(extUri);export const resolvePath=extUri.resolvePath.bind(extUri);export const isAbsolutePath=extUri.isAbsolutePath.bind(extUri);export const isEqualAuthority=extUri.isEqualAuthority.bind(extUri);export const hasTrailingPathSeparator=extUri.hasTrailingPathSeparator.bind(extUri);export const removeTrailingPathSeparator=extUri.removeTrailingPathSeparator.bind(extUri);export const addTrailingPathSeparator=extUri.addTrailingPathSeparator.bind(extUri);export var DataUri;!function(DataUri){DataUri.META_DATA_LABEL="label",DataUri.META_DATA_DESCRIPTION="description",DataUri.META_DATA_SIZE="size",DataUri.META_DATA_MIME="mime",DataUri.parseMetaData=function parseMetaData(dataUri){const metadata=new Map;dataUri.path.substring(dataUri.path.indexOf(";")+1,dataUri.path.lastIndexOf(";")).split(";").forEach((property=>{const[key,value]=property.split(":");key&&value&&metadata.set(key,value)}));const mime=dataUri.path.substring(0,dataUri.path.indexOf(";"));return mime&&metadata.set(DataUri.META_DATA_MIME,mime),metadata}}(DataUri||(DataUri={}));