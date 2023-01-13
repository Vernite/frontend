/*! For license information please see loader.js.LICENSE.txt */
"use strict";var define,AMDLoader,_amdLoaderGlobal=this,_commonjsGlobal="object"==typeof global?global:{};!function(l){l.global=_amdLoaderGlobal;var E=function(){function p(){this._detected=!1,this._isWindows=!1,this._isNode=!1,this._isElectronRenderer=!1,this._isWebWorker=!1,this._isElectronNodeIntegrationWebWorker=!1}return Object.defineProperty(p.prototype,"isWindows",{get:function(){return this._detect(),this._isWindows},enumerable:!1,configurable:!0}),Object.defineProperty(p.prototype,"isNode",{get:function(){return this._detect(),this._isNode},enumerable:!1,configurable:!0}),Object.defineProperty(p.prototype,"isElectronRenderer",{get:function(){return this._detect(),this._isElectronRenderer},enumerable:!1,configurable:!0}),Object.defineProperty(p.prototype,"isWebWorker",{get:function(){return this._detect(),this._isWebWorker},enumerable:!1,configurable:!0}),Object.defineProperty(p.prototype,"isElectronNodeIntegrationWebWorker",{get:function(){return this._detect(),this._isElectronNodeIntegrationWebWorker},enumerable:!1,configurable:!0}),p.prototype._detect=function(){this._detected||(this._detected=!0,this._isWindows=p._isWindows(),this._isNode="undefined"!=typeof module&&!!module.exports,this._isElectronRenderer="undefined"!=typeof process&&void 0!==process.versions&&void 0!==process.versions.electron&&"renderer"===process.type,this._isWebWorker="function"==typeof l.global.importScripts,this._isElectronNodeIntegrationWebWorker=this._isWebWorker&&"undefined"!=typeof process&&void 0!==process.versions&&void 0!==process.versions.electron&&"worker"===process.type)},p._isWindows=function(){return!!("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.indexOf("Windows")>=0)||"undefined"!=typeof process&&"win32"===process.platform},p}();l.Environment=E}(AMDLoader||(AMDLoader={})),function(l){var E=function a(n,v,s){this.type=n,this.detail=v,this.timestamp=s};l.LoaderEvent=E;var p=function(){function a(n){this._events=[new E(1,"",n)]}return a.prototype.record=function(n,v){this._events.push(new E(n,v,l.Utilities.getHighPerformanceTimestamp()))},a.prototype.getEvents=function(){return this._events},a}();l.LoaderEventRecorder=p;var g=function(){function a(){}return a.prototype.record=function(n,v){},a.prototype.getEvents=function(){return[]},a.INSTANCE=new a,a}();l.NullLoaderEventRecorder=g}(AMDLoader||(AMDLoader={})),function(l){var E=function(){function p(){}return p.fileUriToFilePath=function(g,a){if(a=decodeURI(a).replace(/%23/g,"#"),g){if(/^file:\/\/\//.test(a))return a.substr(8);if(/^file:\/\//.test(a))return a.substr(5)}else if(/^file:\/\//.test(a))return a.substr(7);return a},p.startsWith=function(g,a){return g.length>=a.length&&g.substr(0,a.length)===a},p.endsWith=function(g,a){return g.length>=a.length&&g.substr(g.length-a.length)===a},p.containsQueryString=function(g){return/^[^\#]*\?/gi.test(g)},p.isAbsolutePath=function(g){return/^((http:\/\/)|(https:\/\/)|(file:\/\/)|(\/))/.test(g)},p.forEachProperty=function(g,a){if(g){var n=void 0;for(n in g)g.hasOwnProperty(n)&&a(n,g[n])}},p.isEmpty=function(g){var a=!0;return p.forEachProperty(g,(function(){a=!1})),a},p.recursiveClone=function(g){if(!g||"object"!=typeof g||g instanceof RegExp||!Array.isArray(g)&&Object.getPrototypeOf(g)!==Object.prototype)return g;var a=Array.isArray(g)?[]:{};return p.forEachProperty(g,(function(n,v){a[n]=v&&"object"==typeof v?p.recursiveClone(v):v})),a},p.generateAnonymousModule=function(){return"===anonymous"+p.NEXT_ANONYMOUS_ID+++"==="},p.isAnonymousModule=function(g){return p.startsWith(g,"===anonymous")},p.getHighPerformanceTimestamp=function(){return this.PERFORMANCE_NOW_PROBED||(this.PERFORMANCE_NOW_PROBED=!0,this.HAS_PERFORMANCE_NOW=l.global.performance&&"function"==typeof l.global.performance.now),this.HAS_PERFORMANCE_NOW?l.global.performance.now():Date.now()},p.NEXT_ANONYMOUS_ID=1,p.PERFORMANCE_NOW_PROBED=!1,p.HAS_PERFORMANCE_NOW=!1,p}();l.Utilities=E}(AMDLoader||(AMDLoader={})),function(l){function E(a){if(a instanceof Error)return a;var n=new Error(a.message||String(a)||"Unknown Error");return a.stack&&(n.stack=a.stack),n}l.ensureError=E;var p=function(){function a(){}return a.validateConfigurationOptions=function(n){if("string"!=typeof(n=n||{}).baseUrl&&(n.baseUrl=""),"boolean"!=typeof n.isBuild&&(n.isBuild=!1),"object"!=typeof n.buildForceInvokeFactory&&(n.buildForceInvokeFactory={}),"object"!=typeof n.paths&&(n.paths={}),"object"!=typeof n.config&&(n.config={}),void 0===n.catchError&&(n.catchError=!1),void 0===n.recordStats&&(n.recordStats=!1),"string"!=typeof n.urlArgs&&(n.urlArgs=""),"function"!=typeof n.onError&&(n.onError=function v(e){return"loading"===e.phase?(console.error('Loading "'+e.moduleId+'" failed'),console.error(e),console.error("Here are the modules that depend on it:"),void console.error(e.neededBy)):"factory"===e.phase?(console.error('The factory function of "'+e.moduleId+'" has thrown an exception'),console.error(e),console.error("Here are the modules that depend on it:"),void console.error(e.neededBy)):void 0}),Array.isArray(n.ignoreDuplicateModules)||(n.ignoreDuplicateModules=[]),n.baseUrl.length>0&&(l.Utilities.endsWith(n.baseUrl,"/")||(n.baseUrl+="/")),"string"!=typeof n.cspNonce&&(n.cspNonce=""),void 0===n.preferScriptTags&&(n.preferScriptTags=!1),Array.isArray(n.nodeModules)||(n.nodeModules=[]),n.nodeCachedData&&"object"==typeof n.nodeCachedData&&("string"!=typeof n.nodeCachedData.seed&&(n.nodeCachedData.seed="seed"),("number"!=typeof n.nodeCachedData.writeDelay||n.nodeCachedData.writeDelay<0)&&(n.nodeCachedData.writeDelay=7e3),!n.nodeCachedData.path||"string"!=typeof n.nodeCachedData.path)){var s=E(new Error("INVALID cached data configuration, 'path' MUST be set"));s.phase="configuration",n.onError(s),n.nodeCachedData=void 0}return n},a.mergeConfigurationOptions=function(n,v){void 0===n&&(n=null),void 0===v&&(v=null);var s=l.Utilities.recursiveClone(v||{});return l.Utilities.forEachProperty(n,(function(e,t){"ignoreDuplicateModules"===e&&void 0!==s.ignoreDuplicateModules?s.ignoreDuplicateModules=s.ignoreDuplicateModules.concat(t):"paths"===e&&void 0!==s.paths?l.Utilities.forEachProperty(t,(function(r,o){return s.paths[r]=o})):"config"===e&&void 0!==s.config?l.Utilities.forEachProperty(t,(function(r,o){return s.config[r]=o})):s[e]=l.Utilities.recursiveClone(t)})),a.validateConfigurationOptions(s)},a}();l.ConfigurationOptionsUtil=p;var g=function(){function a(n,v){if(this._env=n,this.options=p.mergeConfigurationOptions(v),this._createIgnoreDuplicateModulesMap(),this._createNodeModulesMap(),this._createSortedPathsRules(),""===this.options.baseUrl){if(this.options.nodeRequire&&this.options.nodeRequire.main&&this.options.nodeRequire.main.filename&&this._env.isNode){var s=this.options.nodeRequire.main.filename,e=Math.max(s.lastIndexOf("/"),s.lastIndexOf("\\"));this.options.baseUrl=s.substring(0,e+1)}if(this.options.nodeMain&&this._env.isNode){s=this.options.nodeMain,e=Math.max(s.lastIndexOf("/"),s.lastIndexOf("\\"));this.options.baseUrl=s.substring(0,e+1)}}}return a.prototype._createIgnoreDuplicateModulesMap=function(){this.ignoreDuplicateModulesMap={};for(var n=0;n<this.options.ignoreDuplicateModules.length;n++)this.ignoreDuplicateModulesMap[this.options.ignoreDuplicateModules[n]]=!0},a.prototype._createNodeModulesMap=function(){this.nodeModulesMap=Object.create(null);for(var n=0,v=this.options.nodeModules;n<v.length;n++){var s=v[n];this.nodeModulesMap[s]=!0}},a.prototype._createSortedPathsRules=function(){var n=this;this.sortedPathsRules=[],l.Utilities.forEachProperty(this.options.paths,(function(v,s){Array.isArray(s)?n.sortedPathsRules.push({from:v,to:s}):n.sortedPathsRules.push({from:v,to:[s]})})),this.sortedPathsRules.sort((function(v,s){return s.from.length-v.from.length}))},a.prototype.cloneAndMerge=function(n){return new a(this._env,p.mergeConfigurationOptions(n,this.options))},a.prototype.getOptionsLiteral=function(){return this.options},a.prototype._applyPaths=function(n){for(var v,s=0,e=this.sortedPathsRules.length;s<e;s++)if(v=this.sortedPathsRules[s],l.Utilities.startsWith(n,v.from)){for(var t=[],r=0,o=v.to.length;r<o;r++)t.push(v.to[r]+n.substr(v.from.length));return t}return[n]},a.prototype._addUrlArgsToUrl=function(n){return l.Utilities.containsQueryString(n)?n+"&"+this.options.urlArgs:n+"?"+this.options.urlArgs},a.prototype._addUrlArgsIfNecessaryToUrl=function(n){return this.options.urlArgs?this._addUrlArgsToUrl(n):n},a.prototype._addUrlArgsIfNecessaryToUrls=function(n){if(this.options.urlArgs)for(var v=0,s=n.length;v<s;v++)n[v]=this._addUrlArgsToUrl(n[v]);return n},a.prototype.moduleIdToPaths=function(n){if(this._env.isNode&&(!0===this.nodeModulesMap[n]||this.options.amdModulesPattern instanceof RegExp&&!this.options.amdModulesPattern.test(n)))return this.isBuild()?["empty:"]:["node|"+n];var e,s=n;if(l.Utilities.endsWith(s,".js")||l.Utilities.isAbsolutePath(s))!l.Utilities.endsWith(s,".js")&&!l.Utilities.containsQueryString(s)&&(s+=".js"),e=[s];else for(var t=0,r=(e=this._applyPaths(s)).length;t<r;t++)this.isBuild()&&"empty:"===e[t]||(l.Utilities.isAbsolutePath(e[t])||(e[t]=this.options.baseUrl+e[t]),!l.Utilities.endsWith(e[t],".js")&&!l.Utilities.containsQueryString(e[t])&&(e[t]=e[t]+".js"));return this._addUrlArgsIfNecessaryToUrls(e)},a.prototype.requireToUrl=function(n){var v=n;return l.Utilities.isAbsolutePath(v)||(v=this._applyPaths(v)[0],l.Utilities.isAbsolutePath(v)||(v=this.options.baseUrl+v)),this._addUrlArgsIfNecessaryToUrl(v)},a.prototype.isBuild=function(){return this.options.isBuild},a.prototype.shouldInvokeFactory=function(n){return!this.options.isBuild||(this.options.buildForceInvokeFactory[n]||l.Utilities.isAnonymousModule(n))},a.prototype.isDuplicateMessageIgnoredFor=function(n){return this.ignoreDuplicateModulesMap.hasOwnProperty(n)},a.prototype.getConfigForModule=function(n){if(this.options.config)return this.options.config[n]},a.prototype.shouldCatchError=function(){return this.options.catchError},a.prototype.shouldRecordStats=function(){return this.options.recordStats},a.prototype.onError=function(n){this.options.onError(n)},a}();l.Configuration=g}(AMDLoader||(AMDLoader={})),function(l){var E=function(){function e(t){this._env=t,this._scriptLoader=null,this._callbackMap={}}return e.prototype.load=function(t,r,o,i){var u=this;if(!this._scriptLoader)if(this._env.isWebWorker)this._scriptLoader=new a;else if(this._env.isElectronRenderer){var f=t.getConfig().getOptionsLiteral().preferScriptTags;this._scriptLoader=f?new p:new n(this._env)}else this._env.isNode?this._scriptLoader=new n(this._env):this._scriptLoader=new p;var c={callback:o,errorback:i};this._callbackMap.hasOwnProperty(r)?this._callbackMap[r].push(c):(this._callbackMap[r]=[c],this._scriptLoader.load(t,r,(function(){return u.triggerCallback(r)}),(function(d){return u.triggerErrorback(r,d)})))},e.prototype.triggerCallback=function(t){var r=this._callbackMap[t];delete this._callbackMap[t];for(var o=0;o<r.length;o++)r[o].callback()},e.prototype.triggerErrorback=function(t,r){var o=this._callbackMap[t];delete this._callbackMap[t];for(var i=0;i<o.length;i++)o[i].errorback(r)},e}(),p=function(){function e(){}return e.prototype.attachListeners=function(t,r,o){var i=function(){t.removeEventListener("load",u),t.removeEventListener("error",f)},u=function(c){i(),r()},f=function(c){i(),o(c)};t.addEventListener("load",u),t.addEventListener("error",f)},e.prototype.load=function(t,r,o,i){if(/^node\|/.test(r)){var u=t.getConfig().getOptionsLiteral(),f=v(t.getRecorder(),u.nodeRequire||l.global.nodeRequire),c=r.split("|"),d=null;try{d=f(c[1])}catch(m){return void i(m)}t.enqueueDefineAnonymousModule([],(function(){return d})),o()}else{var h=document.createElement("script");h.setAttribute("async","async"),h.setAttribute("type","text/javascript"),this.attachListeners(h,o,i);var y=t.getConfig().getOptionsLiteral().trustedTypesPolicy;y&&(r=y.createScriptURL(r)),h.setAttribute("src",r);var _=t.getConfig().getOptionsLiteral().cspNonce;_&&h.setAttribute("nonce",_),document.getElementsByTagName("head")[0].appendChild(h)}},e}();var a=function(){function e(){this._cachedCanUseEval=null}return e.prototype._canUseEval=function(t){return null===this._cachedCanUseEval&&(this._cachedCanUseEval=function g(e){var t=e.getConfig().getOptionsLiteral().trustedTypesPolicy;try{return(t?self.eval(t.createScript("","true")):new Function("true")).call(self),!0}catch{return!1}}(t)),this._cachedCanUseEval},e.prototype.load=function(t,r,o,i){if(/^node\|/.test(r)){var u=t.getConfig().getOptionsLiteral(),f=v(t.getRecorder(),u.nodeRequire||l.global.nodeRequire),c=r.split("|"),d=null;try{d=f(c[1])}catch(_){return void i(_)}t.enqueueDefineAnonymousModule([],(function(){return d})),o()}else{var h=t.getConfig().getOptionsLiteral().trustedTypesPolicy;if(!(/^((http:)|(https:)|(file:))/.test(r)&&r.substring(0,self.origin.length)!==self.origin)&&this._canUseEval(t))return void fetch(r).then((function(_){if(200!==_.status)throw new Error(_.statusText);return _.text()})).then((function(_){_=_+"\n//# sourceURL="+r,(h?self.eval(h.createScript("",_)):new Function(_)).call(self),o()})).then(void 0,i);try{h&&(r=h.createScriptURL(r)),importScripts(r),o()}catch(_){i(_)}}},e}(),n=function(){function e(t){this._env=t,this._didInitialize=!1,this._didPatchNodeRequire=!1}return e.prototype._init=function(t){this._didInitialize||(this._didInitialize=!0,this._fs=t("fs"),this._vm=t("vm"),this._path=t("path"),this._crypto=t("crypto"))},e.prototype._initNodeRequire=function(t,r){var o=r.getConfig().getOptionsLiteral().nodeCachedData;if(o&&!this._didPatchNodeRequire){this._didPatchNodeRequire=!0;var i=this,u=t("module");u.prototype._compile=function(c,d){var R,h=u.wrap(c.replace(/^#!.*/,"")),y=r.getRecorder(),_=i._getCachedDataPath(o,d),m={filename:d};try{var P=i._fs.readFileSync(_);R=P.slice(0,16),m.cachedData=P.slice(16),y.record(60,_)}catch{y.record(61,_)}var b=new i._vm.Script(h,m),I=b.runInThisContext(m),U=i._path.dirname(d),w=function f(c){var d=c.constructor,h=function(_){try{return c.require(_)}finally{}};return(h.resolve=function(_,m){return d._resolveFilename(_,c,!1,m)}).paths=function(_){return d._resolveLookupPaths(_,c)},h.main=process.mainModule,h.extensions=d._extensions,h.cache=d._cache,h}(this),O=[this.exports,w,this,d,U,process,_commonjsGlobal,Buffer],C=I.apply(this.exports,O);return i._handleCachedData(b,h,_,!m.cachedData,r),i._verifyCachedData(b,h,_,R,r),C}}},e.prototype.load=function(t,r,o,i){var u=this,f=t.getConfig().getOptionsLiteral(),c=v(t.getRecorder(),f.nodeRequire||l.global.nodeRequire),d=f.nodeInstrumenter||function(I){return I};this._init(c),this._initNodeRequire(c,t);var h=t.getRecorder();if(/^node\|/.test(r)){var y=r.split("|"),_=null;try{_=c(y[1])}catch(I){return void i(I)}t.enqueueDefineAnonymousModule([],(function(){return _})),o()}else{r=l.Utilities.fileUriToFilePath(this._env.isWindows,r);var m=this._path.normalize(r),R=this._getElectronRendererScriptPathOrUri(m),P=Boolean(f.nodeCachedData),b=P?this._getCachedDataPath(f.nodeCachedData,r):void 0;this._readSourceAndCachedData(m,b,h,(function(I,U,w,O){if(I)i(I);else{var C;C=U.charCodeAt(0)===e._BOM?e._PREFIX+U.substring(1)+e._SUFFIX:e._PREFIX+U+e._SUFFIX,C=d(C,m);var M={filename:R,cachedData:w},N=u._createAndEvalScript(t,C,M,o,i);u._handleCachedData(N,C,b,P&&!w,t),u._verifyCachedData(N,C,b,O,t)}}))}},e.prototype._createAndEvalScript=function(t,r,o,i,u){var f=t.getRecorder();f.record(31,o.filename);var c=new this._vm.Script(r,o),d=c.runInThisContext(o),h=t.getGlobalAMDDefineFunc(),y=!1,_=function(){return y=!0,h.apply(null,arguments)};return _.amd=h.amd,d.call(l.global,t.getGlobalAMDRequireFunc(),_,o.filename,this._path.dirname(o.filename)),f.record(32,o.filename),y?i():u(new Error("Didn't receive define call in "+o.filename+"!")),c},e.prototype._getElectronRendererScriptPathOrUri=function(t){if(!this._env.isElectronRenderer)return t;var r=t.match(/^([a-z])\:(.*)/i);return r?"file:///"+(r[1].toUpperCase()+":"+r[2]).replace(/\\/g,"/"):"file://"+t},e.prototype._getCachedDataPath=function(t,r){var o=this._crypto.createHash("md5").update(r,"utf8").update(t.seed,"utf8").update(process.arch,"").digest("hex"),i=this._path.basename(r).replace(/\.js$/,"");return this._path.join(t.path,i+"-"+o+".code")},e.prototype._handleCachedData=function(t,r,o,i,u){var f=this;t.cachedDataRejected?this._fs.unlink(o,(function(c){u.getRecorder().record(62,o),f._createAndWriteCachedData(t,r,o,u),c&&u.getConfig().onError(c)})):i&&this._createAndWriteCachedData(t,r,o,u)},e.prototype._createAndWriteCachedData=function(t,r,o,i){var u=this,f=Math.ceil(i.getConfig().getOptionsLiteral().nodeCachedData.writeDelay*(1+Math.random())),c=-1,d=0,h=void 0,y=function(){setTimeout((function(){h||(h=u._crypto.createHash("md5").update(r,"utf8").digest());var _=t.createCachedData();if(!(0===_.length||_.length===c||d>=5)){if(_.length<c)return void y();c=_.length,u._fs.writeFile(o,Buffer.concat([h,_]),(function(m){m&&i.getConfig().onError(m),i.getRecorder().record(63,o),y()}))}}),f*Math.pow(4,d++))};y()},e.prototype._readSourceAndCachedData=function(t,r,o,i){if(r){var u=void 0,f=void 0,c=void 0,d=2,h=function(y){y?i(y):0==--d&&i(void 0,u,f,c)};this._fs.readFile(t,{encoding:"utf8"},(function(y,_){u=_,h(y)})),this._fs.readFile(r,(function(y,_){!y&&_&&_.length>0?(c=_.slice(0,16),f=_.slice(16),o.record(60,r)):o.record(61,r),h()}))}else this._fs.readFile(t,{encoding:"utf8"},i)},e.prototype._verifyCachedData=function(t,r,o,i,u){var f=this;!i||t.cachedDataRejected||setTimeout((function(){var c=f._crypto.createHash("md5").update(r,"utf8").digest();i.equals(c)||(u.getConfig().onError(new Error("FAILED TO VERIFY CACHED DATA, deleting stale '"+o+"' now, but a RESTART IS REQUIRED")),f._fs.unlink(o,(function(d){d&&u.getConfig().onError(d)})))}),Math.ceil(5e3*(1+Math.random())))},e._BOM=65279,e._PREFIX="(function (require, define, __filename, __dirname) { ",e._SUFFIX="\n});",e}();function v(e,t){if(t.__$__isRecorded)return t;var r=function(i){e.record(33,i);try{return t(i)}finally{e.record(34,i)}};return r.__$__isRecorded=!0,r}l.ensureRecordedNodeRequire=v,l.createScriptLoader=function s(e){return new E(e)}}(AMDLoader||(AMDLoader={})),function(l){var E=function(){function s(e){var t=e.lastIndexOf("/");this.fromModulePath=-1!==t?e.substr(0,t+1):""}return s._normalizeModuleId=function(e){var r,t=e;for(r=/\/\.\//;r.test(t);)t=t.replace(r,"/");for(t=t.replace(/^\.\//g,""),r=/\/(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//;r.test(t);)t=t.replace(r,"/");return t=t.replace(/^(([^\/])|([^\/][^\/\.])|([^\/\.][^\/])|([^\/][^\/][^\/]+))\/\.\.\//,"")},s.prototype.resolveModule=function(e){var t=e;return l.Utilities.isAbsolutePath(t)||(l.Utilities.startsWith(t,"./")||l.Utilities.startsWith(t,"../"))&&(t=s._normalizeModuleId(this.fromModulePath+t)),t},s.ROOT=new s(""),s}();l.ModuleIdResolver=E;var p=function(){function s(e,t,r,o,i,u){this.id=e,this.strId=t,this.dependencies=r,this._callback=o,this._errorback=i,this.moduleIdResolver=u,this.exports={},this.error=null,this.exportsPassedIn=!1,this.unresolvedDependenciesCount=this.dependencies.length,this._isComplete=!1}return s._safeInvokeFunction=function(e,t){try{return{returnedValue:e.apply(l.global,t),producedError:null}}catch(r){return{returnedValue:null,producedError:r}}},s._invokeFactory=function(e,t,r,o){return e.shouldInvokeFactory(t)?e.shouldCatchError()?this._safeInvokeFunction(r,o):{returnedValue:r.apply(l.global,o),producedError:null}:{returnedValue:null,producedError:null}},s.prototype.complete=function(e,t,r,o){this._isComplete=!0;var i=null;if(this._callback)if("function"==typeof this._callback){e.record(21,this.strId);var u=s._invokeFactory(t,this.strId,this._callback,r);i=u.producedError,e.record(22,this.strId),!i&&void 0!==u.returnedValue&&(!this.exportsPassedIn||l.Utilities.isEmpty(this.exports))&&(this.exports=u.returnedValue)}else this.exports=this._callback;if(i){var f=l.ensureError(i);f.phase="factory",f.moduleId=this.strId,f.neededBy=o(this.id),this.error=f,t.onError(f)}this.dependencies=null,this._callback=null,this._errorback=null,this.moduleIdResolver=null},s.prototype.onDependencyError=function(e){return this._isComplete=!0,this.error=e,!!this._errorback&&(this._errorback(e),!0)},s.prototype.isComplete=function(){return this._isComplete},s}();l.Module=p;var g=function(){function s(){this._nextId=0,this._strModuleIdToIntModuleId=new Map,this._intModuleIdToStrModuleId=[],this.getModuleId("exports"),this.getModuleId("module"),this.getModuleId("require")}return s.prototype.getMaxModuleId=function(){return this._nextId},s.prototype.getModuleId=function(e){var t=this._strModuleIdToIntModuleId.get(e);return void 0===t&&(t=this._nextId++,this._strModuleIdToIntModuleId.set(e,t),this._intModuleIdToStrModuleId[t]=e),t},s.prototype.getStrModuleId=function(e){return this._intModuleIdToStrModuleId[e]},s}(),a=function(){function s(e){this.id=e}return s.EXPORTS=new s(0),s.MODULE=new s(1),s.REQUIRE=new s(2),s}();l.RegularDependency=a;var n=function s(e,t,r){this.id=e,this.pluginId=t,this.pluginParam=r};l.PluginDependency=n;var v=function(){function s(e,t,r,o,i){void 0===i&&(i=0),this._env=e,this._scriptLoader=t,this._loaderAvailableTimestamp=i,this._defineFunc=r,this._requireFunc=o,this._moduleIdProvider=new g,this._config=new l.Configuration(this._env),this._hasDependencyCycle=!1,this._modules2=[],this._knownModules2=[],this._inverseDependencies2=[],this._inversePluginDependencies2=new Map,this._currentAnonymousDefineCall=null,this._recorder=null,this._buildInfoPath=[],this._buildInfoDefineStack=[],this._buildInfoDependencies=[]}return s.prototype.reset=function(){return new s(this._env,this._scriptLoader,this._defineFunc,this._requireFunc,this._loaderAvailableTimestamp)},s.prototype.getGlobalAMDDefineFunc=function(){return this._defineFunc},s.prototype.getGlobalAMDRequireFunc=function(){return this._requireFunc},s._findRelevantLocationInStack=function(e,t){for(var r=function(m){return m.replace(/\\/g,"/")},o=r(e),i=t.split(/\n/),u=0;u<i.length;u++){var f=i[u].match(/(.*):(\d+):(\d+)\)?$/);if(f){var c=f[1],d=f[2],h=f[3],y=Math.max(c.lastIndexOf(" ")+1,c.lastIndexOf("(")+1);if((c=r(c=c.substr(y)))===o){var _={line:parseInt(d,10),col:parseInt(h,10)};return 1===_.line&&(_.col-="(function (require, define, __filename, __dirname) { ".length),_}}}throw new Error("Could not correlate define call site for needle "+e)},s.prototype.getBuildInfo=function(){if(!this._config.isBuild())return null;for(var e=[],t=0,r=0,o=this._modules2.length;r<o;r++){var i=this._modules2[r];if(i){var u=this._buildInfoPath[i.id]||null,f=this._buildInfoDefineStack[i.id]||null,c=this._buildInfoDependencies[i.id];e[t++]={id:i.strId,path:u,defineLocation:u&&f?s._findRelevantLocationInStack(u,f):null,dependencies:c,shim:null,exports:i.exports}}}return e},s.prototype.getRecorder=function(){return this._recorder||(this._config.shouldRecordStats()?this._recorder=new l.LoaderEventRecorder(this._loaderAvailableTimestamp):this._recorder=l.NullLoaderEventRecorder.INSTANCE),this._recorder},s.prototype.getLoaderEvents=function(){return this.getRecorder().getEvents()},s.prototype.enqueueDefineAnonymousModule=function(e,t){if(null!==this._currentAnonymousDefineCall)throw new Error("Can only have one anonymous define call per script file");var r=null;this._config.isBuild()&&(r=new Error("StackLocation").stack||null),this._currentAnonymousDefineCall={stack:r,dependencies:e,callback:t}},s.prototype.defineModule=function(e,t,r,o,i,u){var f=this;void 0===u&&(u=new E(e));var c=this._moduleIdProvider.getModuleId(e);if(this._modules2[c])this._config.isDuplicateMessageIgnoredFor(e)||console.warn("Duplicate definition of module '"+e+"'");else{var d=new p(c,e,this._normalizeDependencies(t,u),r,o,u);this._modules2[c]=d,this._config.isBuild()&&(this._buildInfoDefineStack[c]=i,this._buildInfoDependencies[c]=(d.dependencies||[]).map((function(h){return f._moduleIdProvider.getStrModuleId(h.id)}))),this._resolve(d)}},s.prototype._normalizeDependency=function(e,t){if("exports"===e)return a.EXPORTS;if("module"===e)return a.MODULE;if("require"===e)return a.REQUIRE;var r=e.indexOf("!");if(r>=0){var o=t.resolveModule(e.substr(0,r)),i=t.resolveModule(e.substr(r+1)),u=this._moduleIdProvider.getModuleId(o+"!"+i),f=this._moduleIdProvider.getModuleId(o);return new n(u,f,i)}return new a(this._moduleIdProvider.getModuleId(t.resolveModule(e)))},s.prototype._normalizeDependencies=function(e,t){for(var r=[],o=0,i=0,u=e.length;i<u;i++)r[o++]=this._normalizeDependency(e[i],t);return r},s.prototype._relativeRequire=function(e,t,r,o){if("string"==typeof t)return this.synchronousRequire(t,e);this.defineModule(l.Utilities.generateAnonymousModule(),t,r,o,null,e)},s.prototype.synchronousRequire=function(e,t){void 0===t&&(t=new E(e));var r=this._normalizeDependency(e,t),o=this._modules2[r.id];if(!o)throw new Error("Check dependency list! Synchronous require cannot resolve module '"+e+"'. This is the first mention of this module!");if(!o.isComplete())throw new Error("Check dependency list! Synchronous require cannot resolve module '"+e+"'. This module has not been resolved completely yet.");if(o.error)throw o.error;return o.exports},s.prototype.configure=function(e,t){var r=this._config.shouldRecordStats();this._config=t?new l.Configuration(this._env,e):this._config.cloneAndMerge(e),this._config.shouldRecordStats()&&!r&&(this._recorder=null)},s.prototype.getConfig=function(){return this._config},s.prototype._onLoad=function(e){if(null!==this._currentAnonymousDefineCall){var t=this._currentAnonymousDefineCall;this._currentAnonymousDefineCall=null,this.defineModule(this._moduleIdProvider.getStrModuleId(e),t.dependencies,t.callback,null,t.stack)}},s.prototype._createLoadError=function(e,t){var r=this,o=this._moduleIdProvider.getStrModuleId(e),i=(this._inverseDependencies2[e]||[]).map((function(f){return r._moduleIdProvider.getStrModuleId(f)})),u=l.ensureError(t);return u.phase="loading",u.moduleId=o,u.neededBy=i,u},s.prototype._onLoadError=function(e,t){var r=this._createLoadError(e,t);this._modules2[e]||(this._modules2[e]=new p(e,this._moduleIdProvider.getStrModuleId(e),[],(function(){}),null,null));for(var o=[],i=0,u=this._moduleIdProvider.getMaxModuleId();i<u;i++)o[i]=!1;var f=!1,c=[];for(c.push(e),o[e]=!0;c.length>0;){var d=c.shift(),h=this._modules2[d];h&&(f=h.onDependencyError(r)||f);var y=this._inverseDependencies2[d];if(y)for(i=0,u=y.length;i<u;i++){var _=y[i];o[_]||(c.push(_),o[_]=!0)}}f||this._config.onError(r)},s.prototype._hasDependencyPath=function(e,t){var r=this._modules2[e];if(!r)return!1;for(var o=[],i=0,u=this._moduleIdProvider.getMaxModuleId();i<u;i++)o[i]=!1;var f=[];for(f.push(r),o[e]=!0;f.length>0;){var d=f.shift().dependencies;if(d)for(i=0,u=d.length;i<u;i++){var h=d[i];if(h.id===t)return!0;var y=this._modules2[h.id];y&&!o[h.id]&&(o[h.id]=!0,f.push(y))}}return!1},s.prototype._findCyclePath=function(e,t,r){if(e===t||50===r)return[e];var o=this._modules2[e];if(!o)return null;var i=o.dependencies;if(i)for(var u=0,f=i.length;u<f;u++){var c=this._findCyclePath(i[u].id,t,r+1);if(null!==c)return c.push(e),c}return null},s.prototype._createRequire=function(e){var t=this,r=function(o,i,u){return t._relativeRequire(e,o,i,u)};return r.toUrl=function(o){return t._config.requireToUrl(e.resolveModule(o))},r.getStats=function(){return t.getLoaderEvents()},r.hasDependencyCycle=function(){return t._hasDependencyCycle},r.config=function(o,i){void 0===i&&(i=!1),t.configure(o,i)},r.__$__nodeRequire=l.global.nodeRequire,r},s.prototype._loadModule=function(e){var t=this;if(!this._modules2[e]&&!this._knownModules2[e]){this._knownModules2[e]=!0;var r=this._moduleIdProvider.getStrModuleId(e),o=this._config.moduleIdToPaths(r);this._env.isNode&&(-1===r.indexOf("/")||/^@[^\/]+\/[^\/]+$/.test(r))&&o.push("node|"+r);var u=-1,f=function(c){if(++u>=o.length)t._onLoadError(e,c);else{var d=o[u],h=t.getRecorder();if(t._config.isBuild()&&"empty:"===d)return t._buildInfoPath[e]=d,t.defineModule(t._moduleIdProvider.getStrModuleId(e),[],null,null,null),void t._onLoad(e);h.record(10,d),t._scriptLoader.load(t,d,(function(){t._config.isBuild()&&(t._buildInfoPath[e]=d),h.record(11,d),t._onLoad(e)}),(function(y){h.record(12,d),f(y)}))}};f(null)}},s.prototype._loadPluginDependency=function(e,t){var r=this;if(!this._modules2[t.id]&&!this._knownModules2[t.id]){this._knownModules2[t.id]=!0;var o=function(i){r.defineModule(r._moduleIdProvider.getStrModuleId(t.id),[],i,null,null)};o.error=function(i){r._config.onError(r._createLoadError(t.id,i))},e.load(t.pluginParam,this._createRequire(E.ROOT),o,this._config.getOptionsLiteral())}},s.prototype._resolve=function(e){var t=this,r=e.dependencies;if(r)for(var o=0,i=r.length;o<i;o++){var u=r[o];if(u!==a.EXPORTS)if(u!==a.MODULE)if(u!==a.REQUIRE){var f=this._modules2[u.id];if(f&&f.isComplete()){if(f.error)return void e.onDependencyError(f.error);e.unresolvedDependenciesCount--}else if(this._hasDependencyPath(u.id,e.id)){this._hasDependencyCycle=!0,console.warn("There is a dependency cycle between '"+this._moduleIdProvider.getStrModuleId(u.id)+"' and '"+this._moduleIdProvider.getStrModuleId(e.id)+"'. The cyclic path follows:");var c=this._findCyclePath(u.id,e.id,0)||[];c.reverse(),c.push(u.id),console.warn(c.map((function(y){return t._moduleIdProvider.getStrModuleId(y)})).join(" => \n")),e.unresolvedDependenciesCount--}else if(this._inverseDependencies2[u.id]=this._inverseDependencies2[u.id]||[],this._inverseDependencies2[u.id].push(e.id),u instanceof n){var d=this._modules2[u.pluginId];if(d&&d.isComplete()){this._loadPluginDependency(d.exports,u);continue}var h=this._inversePluginDependencies2.get(u.pluginId);h||(h=[],this._inversePluginDependencies2.set(u.pluginId,h)),h.push(u),this._loadModule(u.pluginId)}else this._loadModule(u.id)}else e.unresolvedDependenciesCount--;else e.unresolvedDependenciesCount--;else e.exportsPassedIn=!0,e.unresolvedDependenciesCount--}0===e.unresolvedDependenciesCount&&this._onModuleComplete(e)},s.prototype._onModuleComplete=function(e){var t=this,r=this.getRecorder();if(!e.isComplete()){var o=e.dependencies,i=[];if(o)for(var u=0,f=o.length;u<f;u++){var c=o[u];if(c!==a.EXPORTS)if(c!==a.MODULE)if(c!==a.REQUIRE){var d=this._modules2[c.id];i[u]=d?d.exports:null}else i[u]=this._createRequire(e.moduleIdResolver);else i[u]={id:e.strId,config:function(){return t._config.getConfigForModule(e.strId)}};else i[u]=e.exports}e.complete(r,this._config,i,(function(P){return(t._inverseDependencies2[P]||[]).map((function(b){return t._moduleIdProvider.getStrModuleId(b)}))}));var y=this._inverseDependencies2[e.id];if(this._inverseDependencies2[e.id]=null,y)for(u=0,f=y.length;u<f;u++){var _=y[u],m=this._modules2[_];m.unresolvedDependenciesCount--,0===m.unresolvedDependenciesCount&&this._onModuleComplete(m)}var R=this._inversePluginDependencies2.get(e.id);if(R){this._inversePluginDependencies2.delete(e.id);for(u=0,f=R.length;u<f;u++)this._loadPluginDependency(e.exports,R[u])}}},s}();l.ModuleManager=v}(AMDLoader||(AMDLoader={})),function(l){var E=new l.Environment,p=null,g=function(s,e,t){"string"!=typeof s&&(t=e,e=s,s=null),("object"!=typeof e||!Array.isArray(e))&&(t=e,e=null),e||(e=["require","exports","module"]),s?p.defineModule(s,e,t,null,null):p.enqueueDefineAnonymousModule(e,t)};g.amd={jQuery:!0};var a=function(s,e){void 0===e&&(e=!1),p.configure(s,e)},n=function(){if(1===arguments.length){if(arguments[0]instanceof Object&&!Array.isArray(arguments[0]))return void a(arguments[0]);if("string"==typeof arguments[0])return p.synchronousRequire(arguments[0])}if(2!==arguments.length&&3!==arguments.length||!Array.isArray(arguments[0]))throw new Error("Unrecognized require call");p.defineModule(l.Utilities.generateAnonymousModule(),arguments[0],arguments[1],arguments[2],null)};function v(){if(void 0!==l.global.require||"undefined"!=typeof require){var s=l.global.require||require;if("function"==typeof s&&"function"==typeof s.resolve){var e=l.ensureRecordedNodeRequire(p.getRecorder(),s);l.global.nodeRequire=e,n.nodeRequire=e,n.__$__nodeRequire=e}}!E.isNode||E.isElectronRenderer||E.isElectronNodeIntegrationWebWorker?(E.isElectronRenderer||(l.global.define=g),l.global.require=n):(module.exports=n,require=n)}n.config=a,n.getConfig=function(){return p.getConfig().getOptionsLiteral()},n.reset=function(){p=p.reset()},n.getBuildInfo=function(){return p.getBuildInfo()},n.getStats=function(){return p.getLoaderEvents()},n.define=g,l.init=v,("function"!=typeof l.global.define||!l.global.define.amd)&&(p=new l.ModuleManager(E,l.createScriptLoader(E),g,n,l.Utilities.getHighPerformanceTimestamp()),void 0!==l.global.require&&"function"!=typeof l.global.require&&n.config(l.global.require),define=function(){return g.apply(null,arguments)},define.amd=g.amd,"undefined"==typeof doNotInitLoader&&v())}(AMDLoader||(AMDLoader={}));