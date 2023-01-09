import*as process from"./process.js";const CHAR_UPPERCASE_A=65,CHAR_LOWERCASE_A=97,CHAR_UPPERCASE_Z=90,CHAR_LOWERCASE_Z=122,CHAR_DOT=46,CHAR_FORWARD_SLASH=47,CHAR_BACKWARD_SLASH=92,CHAR_COLON=58,CHAR_QUESTION_MARK=63;class ErrorInvalidArgType extends Error{constructor(name,expected,actual){let determiner;"string"==typeof expected&&0===expected.indexOf("not ")?(determiner="must not be",expected=expected.replace(/^not /,"")):determiner="must be";const type=-1!==name.indexOf(".")?"property":"argument";let msg=`The "${name}" ${type} ${determiner} of type ${expected}`;msg+=". Received type "+typeof actual,super(msg),this.code="ERR_INVALID_ARG_TYPE"}}function validateString(value,name){if("string"!=typeof value)throw new ErrorInvalidArgType(name,"string",value)}function isPathSeparator(code){return 47===code||92===code}function isPosixPathSeparator(code){return 47===code}function isWindowsDeviceRoot(code){return code>=65&&code<=90||code>=97&&code<=122}function normalizeString(path,allowAboveRoot,separator,isPathSeparator){let res="",lastSegmentLength=0,lastSlash=-1,dots=0,code=0;for(let i=0;i<=path.length;++i){if(i<path.length)code=path.charCodeAt(i);else{if(isPathSeparator(code))break;code=47}if(isPathSeparator(code)){if(lastSlash===i-1||1===dots);else if(2===dots){if(res.length<2||2!==lastSegmentLength||46!==res.charCodeAt(res.length-1)||46!==res.charCodeAt(res.length-2)){if(res.length>2){const lastSlashIndex=res.lastIndexOf(separator);-1===lastSlashIndex?(res="",lastSegmentLength=0):(res=res.slice(0,lastSlashIndex),lastSegmentLength=res.length-1-res.lastIndexOf(separator)),lastSlash=i,dots=0;continue}if(0!==res.length){res="",lastSegmentLength=0,lastSlash=i,dots=0;continue}}allowAboveRoot&&(res+=res.length>0?`${separator}..`:"..",lastSegmentLength=2)}else res.length>0?res+=`${separator}${path.slice(lastSlash+1,i)}`:res=path.slice(lastSlash+1,i),lastSegmentLength=i-lastSlash-1;lastSlash=i,dots=0}else 46===code&&-1!==dots?++dots:dots=-1}return res}function _format(sep,pathObject){if(null===pathObject||"object"!=typeof pathObject)throw new ErrorInvalidArgType("pathObject","Object",pathObject);const dir=pathObject.dir||pathObject.root,base=pathObject.base||`${pathObject.name||""}${pathObject.ext||""}`;return dir?dir===pathObject.root?`${dir}${base}`:`${dir}${sep}${base}`:base}export const win32={resolve(...pathSegments){let resolvedDevice="",resolvedTail="",resolvedAbsolute=!1;for(let i=pathSegments.length-1;i>=-1;i--){let path;if(i>=0){if(path=pathSegments[i],validateString(path,"path"),0===path.length)continue}else 0===resolvedDevice.length?path=process.cwd():(path=process.env[`=${resolvedDevice}`]||process.cwd(),(void 0===path||path.slice(0,2).toLowerCase()!==resolvedDevice.toLowerCase()&&92===path.charCodeAt(2))&&(path=`${resolvedDevice}\\`));const len=path.length;let rootEnd=0,device="",isAbsolute=!1;const code=path.charCodeAt(0);if(1===len)isPathSeparator(code)&&(rootEnd=1,isAbsolute=!0);else if(isPathSeparator(code))if(isAbsolute=!0,isPathSeparator(path.charCodeAt(1))){let j=2,last=j;for(;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){const firstPart=path.slice(last,j);for(last=j;j<len&&isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){for(last=j;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;j!==len&&j===last||(device=`\\\\${firstPart}\\${path.slice(last,j)}`,rootEnd=j)}}}else rootEnd=1;else isWindowsDeviceRoot(code)&&58===path.charCodeAt(1)&&(device=path.slice(0,2),rootEnd=2,len>2&&isPathSeparator(path.charCodeAt(2))&&(isAbsolute=!0,rootEnd=3));if(device.length>0)if(resolvedDevice.length>0){if(device.toLowerCase()!==resolvedDevice.toLowerCase())continue}else resolvedDevice=device;if(resolvedAbsolute){if(resolvedDevice.length>0)break}else if(resolvedTail=`${path.slice(rootEnd)}\\${resolvedTail}`,resolvedAbsolute=isAbsolute,isAbsolute&&resolvedDevice.length>0)break}return resolvedTail=normalizeString(resolvedTail,!resolvedAbsolute,"\\",isPathSeparator),resolvedAbsolute?`${resolvedDevice}\\${resolvedTail}`:`${resolvedDevice}${resolvedTail}`||"."},normalize(path){validateString(path,"path");const len=path.length;if(0===len)return".";let device,rootEnd=0,isAbsolute=!1;const code=path.charCodeAt(0);if(1===len)return isPosixPathSeparator(code)?"\\":path;if(isPathSeparator(code))if(isAbsolute=!0,isPathSeparator(path.charCodeAt(1))){let j=2,last=j;for(;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){const firstPart=path.slice(last,j);for(last=j;j<len&&isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){for(last=j;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;if(j===len)return`\\\\${firstPart}\\${path.slice(last)}\\`;j!==last&&(device=`\\\\${firstPart}\\${path.slice(last,j)}`,rootEnd=j)}}}else rootEnd=1;else isWindowsDeviceRoot(code)&&58===path.charCodeAt(1)&&(device=path.slice(0,2),rootEnd=2,len>2&&isPathSeparator(path.charCodeAt(2))&&(isAbsolute=!0,rootEnd=3));let tail=rootEnd<len?normalizeString(path.slice(rootEnd),!isAbsolute,"\\",isPathSeparator):"";return 0!==tail.length||isAbsolute||(tail="."),tail.length>0&&isPathSeparator(path.charCodeAt(len-1))&&(tail+="\\"),void 0===device?isAbsolute?`\\${tail}`:tail:isAbsolute?`${device}\\${tail}`:`${device}${tail}`},isAbsolute(path){validateString(path,"path");const len=path.length;if(0===len)return!1;const code=path.charCodeAt(0);return isPathSeparator(code)||len>2&&isWindowsDeviceRoot(code)&&58===path.charCodeAt(1)&&isPathSeparator(path.charCodeAt(2))},join(...paths){if(0===paths.length)return".";let joined,firstPart;for(let i=0;i<paths.length;++i){const arg=paths[i];validateString(arg,"path"),arg.length>0&&(void 0===joined?joined=firstPart=arg:joined+=`\\${arg}`)}if(void 0===joined)return".";let needsReplace=!0,slashCount=0;if("string"==typeof firstPart&&isPathSeparator(firstPart.charCodeAt(0))){++slashCount;const firstLen=firstPart.length;firstLen>1&&isPathSeparator(firstPart.charCodeAt(1))&&(++slashCount,firstLen>2&&(isPathSeparator(firstPart.charCodeAt(2))?++slashCount:needsReplace=!1))}if(needsReplace){for(;slashCount<joined.length&&isPathSeparator(joined.charCodeAt(slashCount));)slashCount++;slashCount>=2&&(joined=`\\${joined.slice(slashCount)}`)}return win32.normalize(joined)},relative(from,to){if(validateString(from,"from"),validateString(to,"to"),from===to)return"";const fromOrig=win32.resolve(from),toOrig=win32.resolve(to);if(fromOrig===toOrig)return"";if((from=fromOrig.toLowerCase())===(to=toOrig.toLowerCase()))return"";let fromStart=0;for(;fromStart<from.length&&92===from.charCodeAt(fromStart);)fromStart++;let fromEnd=from.length;for(;fromEnd-1>fromStart&&92===from.charCodeAt(fromEnd-1);)fromEnd--;const fromLen=fromEnd-fromStart;let toStart=0;for(;toStart<to.length&&92===to.charCodeAt(toStart);)toStart++;let toEnd=to.length;for(;toEnd-1>toStart&&92===to.charCodeAt(toEnd-1);)toEnd--;const toLen=toEnd-toStart,length=fromLen<toLen?fromLen:toLen;let lastCommonSep=-1,i=0;for(;i<length;i++){const fromCode=from.charCodeAt(fromStart+i);if(fromCode!==to.charCodeAt(toStart+i))break;92===fromCode&&(lastCommonSep=i)}if(i!==length){if(-1===lastCommonSep)return toOrig}else{if(toLen>length){if(92===to.charCodeAt(toStart+i))return toOrig.slice(toStart+i+1);if(2===i)return toOrig.slice(toStart+i)}fromLen>length&&(92===from.charCodeAt(fromStart+i)?lastCommonSep=i:2===i&&(lastCommonSep=3)),-1===lastCommonSep&&(lastCommonSep=0)}let out="";for(i=fromStart+lastCommonSep+1;i<=fromEnd;++i)i!==fromEnd&&92!==from.charCodeAt(i)||(out+=0===out.length?"..":"\\..");return toStart+=lastCommonSep,out.length>0?`${out}${toOrig.slice(toStart,toEnd)}`:(92===toOrig.charCodeAt(toStart)&&++toStart,toOrig.slice(toStart,toEnd))},toNamespacedPath(path){if("string"!=typeof path)return path;if(0===path.length)return"";const resolvedPath=win32.resolve(path);if(resolvedPath.length<=2)return path;if(92===resolvedPath.charCodeAt(0)){if(92===resolvedPath.charCodeAt(1)){const code=resolvedPath.charCodeAt(2);if(63!==code&&46!==code)return`\\\\?\\UNC\\${resolvedPath.slice(2)}`}}else if(isWindowsDeviceRoot(resolvedPath.charCodeAt(0))&&58===resolvedPath.charCodeAt(1)&&92===resolvedPath.charCodeAt(2))return`\\\\?\\${resolvedPath}`;return path},dirname(path){validateString(path,"path");const len=path.length;if(0===len)return".";let rootEnd=-1,offset=0;const code=path.charCodeAt(0);if(1===len)return isPathSeparator(code)?path:".";if(isPathSeparator(code)){if(rootEnd=offset=1,isPathSeparator(path.charCodeAt(1))){let j=2,last=j;for(;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){for(last=j;j<len&&isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){for(last=j;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;if(j===len)return path;j!==last&&(rootEnd=offset=j+1)}}}}else isWindowsDeviceRoot(code)&&58===path.charCodeAt(1)&&(rootEnd=len>2&&isPathSeparator(path.charCodeAt(2))?3:2,offset=rootEnd);let end=-1,matchedSlash=!0;for(let i=len-1;i>=offset;--i)if(isPathSeparator(path.charCodeAt(i))){if(!matchedSlash){end=i;break}}else matchedSlash=!1;if(-1===end){if(-1===rootEnd)return".";end=rootEnd}return path.slice(0,end)},basename(path,ext){void 0!==ext&&validateString(ext,"ext"),validateString(path,"path");let i,start=0,end=-1,matchedSlash=!0;if(path.length>=2&&isWindowsDeviceRoot(path.charCodeAt(0))&&58===path.charCodeAt(1)&&(start=2),void 0!==ext&&ext.length>0&&ext.length<=path.length){if(ext===path)return"";let extIdx=ext.length-1,firstNonSlashEnd=-1;for(i=path.length-1;i>=start;--i){const code=path.charCodeAt(i);if(isPathSeparator(code)){if(!matchedSlash){start=i+1;break}}else-1===firstNonSlashEnd&&(matchedSlash=!1,firstNonSlashEnd=i+1),extIdx>=0&&(code===ext.charCodeAt(extIdx)?-1==--extIdx&&(end=i):(extIdx=-1,end=firstNonSlashEnd))}return start===end?end=firstNonSlashEnd:-1===end&&(end=path.length),path.slice(start,end)}for(i=path.length-1;i>=start;--i)if(isPathSeparator(path.charCodeAt(i))){if(!matchedSlash){start=i+1;break}}else-1===end&&(matchedSlash=!1,end=i+1);return-1===end?"":path.slice(start,end)},extname(path){validateString(path,"path");let start=0,startDot=-1,startPart=0,end=-1,matchedSlash=!0,preDotState=0;path.length>=2&&58===path.charCodeAt(1)&&isWindowsDeviceRoot(path.charCodeAt(0))&&(start=startPart=2);for(let i=path.length-1;i>=start;--i){const code=path.charCodeAt(i);if(isPathSeparator(code)){if(!matchedSlash){startPart=i+1;break}}else-1===end&&(matchedSlash=!1,end=i+1),46===code?-1===startDot?startDot=i:1!==preDotState&&(preDotState=1):-1!==startDot&&(preDotState=-1)}return-1===startDot||-1===end||0===preDotState||1===preDotState&&startDot===end-1&&startDot===startPart+1?"":path.slice(startDot,end)},format:_format.bind(null,"\\"),parse(path){validateString(path,"path");const ret={root:"",dir:"",base:"",ext:"",name:""};if(0===path.length)return ret;const len=path.length;let rootEnd=0,code=path.charCodeAt(0);if(1===len)return isPathSeparator(code)?(ret.root=ret.dir=path,ret):(ret.base=ret.name=path,ret);if(isPathSeparator(code)){if(rootEnd=1,isPathSeparator(path.charCodeAt(1))){let j=2,last=j;for(;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){for(last=j;j<len&&isPathSeparator(path.charCodeAt(j));)j++;if(j<len&&j!==last){for(last=j;j<len&&!isPathSeparator(path.charCodeAt(j));)j++;j===len?rootEnd=j:j!==last&&(rootEnd=j+1)}}}}else if(isWindowsDeviceRoot(code)&&58===path.charCodeAt(1)){if(len<=2)return ret.root=ret.dir=path,ret;if(rootEnd=2,isPathSeparator(path.charCodeAt(2))){if(3===len)return ret.root=ret.dir=path,ret;rootEnd=3}}rootEnd>0&&(ret.root=path.slice(0,rootEnd));let startDot=-1,startPart=rootEnd,end=-1,matchedSlash=!0,i=path.length-1,preDotState=0;for(;i>=rootEnd;--i)if(code=path.charCodeAt(i),isPathSeparator(code)){if(!matchedSlash){startPart=i+1;break}}else-1===end&&(matchedSlash=!1,end=i+1),46===code?-1===startDot?startDot=i:1!==preDotState&&(preDotState=1):-1!==startDot&&(preDotState=-1);return-1!==end&&(-1===startDot||0===preDotState||1===preDotState&&startDot===end-1&&startDot===startPart+1?ret.base=ret.name=path.slice(startPart,end):(ret.name=path.slice(startPart,startDot),ret.base=path.slice(startPart,end),ret.ext=path.slice(startDot,end))),ret.dir=startPart>0&&startPart!==rootEnd?path.slice(0,startPart-1):ret.root,ret},sep:"\\",delimiter:";",win32:null,posix:null};export const posix={resolve(...pathSegments){let resolvedPath="",resolvedAbsolute=!1;for(let i=pathSegments.length-1;i>=-1&&!resolvedAbsolute;i--){const path=i>=0?pathSegments[i]:process.cwd();validateString(path,"path"),0!==path.length&&(resolvedPath=`${path}/${resolvedPath}`,resolvedAbsolute=47===path.charCodeAt(0))}return resolvedPath=normalizeString(resolvedPath,!resolvedAbsolute,"/",isPosixPathSeparator),resolvedAbsolute?`/${resolvedPath}`:resolvedPath.length>0?resolvedPath:"."},normalize(path){if(validateString(path,"path"),0===path.length)return".";const isAbsolute=47===path.charCodeAt(0),trailingSeparator=47===path.charCodeAt(path.length-1);return 0===(path=normalizeString(path,!isAbsolute,"/",isPosixPathSeparator)).length?isAbsolute?"/":trailingSeparator?"./":".":(trailingSeparator&&(path+="/"),isAbsolute?`/${path}`:path)},isAbsolute:path=>(validateString(path,"path"),path.length>0&&47===path.charCodeAt(0)),join(...paths){if(0===paths.length)return".";let joined;for(let i=0;i<paths.length;++i){const arg=paths[i];validateString(arg,"path"),arg.length>0&&(void 0===joined?joined=arg:joined+=`/${arg}`)}return void 0===joined?".":posix.normalize(joined)},relative(from,to){if(validateString(from,"from"),validateString(to,"to"),from===to)return"";if((from=posix.resolve(from))===(to=posix.resolve(to)))return"";const fromEnd=from.length,fromLen=fromEnd-1,toLen=to.length-1,length=fromLen<toLen?fromLen:toLen;let lastCommonSep=-1,i=0;for(;i<length;i++){const fromCode=from.charCodeAt(1+i);if(fromCode!==to.charCodeAt(1+i))break;47===fromCode&&(lastCommonSep=i)}if(i===length)if(toLen>length){if(47===to.charCodeAt(1+i))return to.slice(1+i+1);if(0===i)return to.slice(1+i)}else fromLen>length&&(47===from.charCodeAt(1+i)?lastCommonSep=i:0===i&&(lastCommonSep=0));let out="";for(i=1+lastCommonSep+1;i<=fromEnd;++i)i!==fromEnd&&47!==from.charCodeAt(i)||(out+=0===out.length?"..":"/..");return`${out}${to.slice(1+lastCommonSep)}`},toNamespacedPath:path=>path,dirname(path){if(validateString(path,"path"),0===path.length)return".";const hasRoot=47===path.charCodeAt(0);let end=-1,matchedSlash=!0;for(let i=path.length-1;i>=1;--i)if(47===path.charCodeAt(i)){if(!matchedSlash){end=i;break}}else matchedSlash=!1;return-1===end?hasRoot?"/":".":hasRoot&&1===end?"//":path.slice(0,end)},basename(path,ext){void 0!==ext&&validateString(ext,"ext"),validateString(path,"path");let i,start=0,end=-1,matchedSlash=!0;if(void 0!==ext&&ext.length>0&&ext.length<=path.length){if(ext===path)return"";let extIdx=ext.length-1,firstNonSlashEnd=-1;for(i=path.length-1;i>=0;--i){const code=path.charCodeAt(i);if(47===code){if(!matchedSlash){start=i+1;break}}else-1===firstNonSlashEnd&&(matchedSlash=!1,firstNonSlashEnd=i+1),extIdx>=0&&(code===ext.charCodeAt(extIdx)?-1==--extIdx&&(end=i):(extIdx=-1,end=firstNonSlashEnd))}return start===end?end=firstNonSlashEnd:-1===end&&(end=path.length),path.slice(start,end)}for(i=path.length-1;i>=0;--i)if(47===path.charCodeAt(i)){if(!matchedSlash){start=i+1;break}}else-1===end&&(matchedSlash=!1,end=i+1);return-1===end?"":path.slice(start,end)},extname(path){validateString(path,"path");let startDot=-1,startPart=0,end=-1,matchedSlash=!0,preDotState=0;for(let i=path.length-1;i>=0;--i){const code=path.charCodeAt(i);if(47!==code)-1===end&&(matchedSlash=!1,end=i+1),46===code?-1===startDot?startDot=i:1!==preDotState&&(preDotState=1):-1!==startDot&&(preDotState=-1);else if(!matchedSlash){startPart=i+1;break}}return-1===startDot||-1===end||0===preDotState||1===preDotState&&startDot===end-1&&startDot===startPart+1?"":path.slice(startDot,end)},format:_format.bind(null,"/"),parse(path){validateString(path,"path");const ret={root:"",dir:"",base:"",ext:"",name:""};if(0===path.length)return ret;const isAbsolute=47===path.charCodeAt(0);let start;isAbsolute?(ret.root="/",start=1):start=0;let startDot=-1,startPart=0,end=-1,matchedSlash=!0,i=path.length-1,preDotState=0;for(;i>=start;--i){const code=path.charCodeAt(i);if(47!==code)-1===end&&(matchedSlash=!1,end=i+1),46===code?-1===startDot?startDot=i:1!==preDotState&&(preDotState=1):-1!==startDot&&(preDotState=-1);else if(!matchedSlash){startPart=i+1;break}}if(-1!==end){const start=0===startPart&&isAbsolute?1:startPart;-1===startDot||0===preDotState||1===preDotState&&startDot===end-1&&startDot===startPart+1?ret.base=ret.name=path.slice(start,end):(ret.name=path.slice(start,startDot),ret.base=path.slice(start,end),ret.ext=path.slice(startDot,end))}return startPart>0?ret.dir=path.slice(0,startPart-1):isAbsolute&&(ret.dir="/"),ret},sep:"/",delimiter:":",win32:null,posix:null};posix.win32=win32.win32=win32,posix.posix=win32.posix=posix;export const normalize="win32"===process.platform?win32.normalize:posix.normalize;export const resolve="win32"===process.platform?win32.resolve:posix.resolve;export const relative="win32"===process.platform?win32.relative:posix.relative;export const dirname="win32"===process.platform?win32.dirname:posix.dirname;export const basename="win32"===process.platform?win32.basename:posix.basename;export const extname="win32"===process.platform?win32.extname:posix.extname;export const sep="win32"===process.platform?win32.sep:posix.sep;