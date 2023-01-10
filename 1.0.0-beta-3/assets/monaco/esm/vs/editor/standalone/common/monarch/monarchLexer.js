var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import*as languages from"../../../common/languages.js";import{NullState,nullTokenizeEncoded,nullTokenize}from"../../../common/languages/nullTokenize.js";import*as monarchCommon from"./monarchCommon.js";import{IConfigurationService}from"../../../../platform/configuration/common/configuration.js";const CACHE_STACK_DEPTH=5;class MonarchStackElementFactory{constructor(maxCacheDepth){this._maxCacheDepth=maxCacheDepth,this._entries=Object.create(null)}static create(parent,state){return this._INSTANCE.create(parent,state)}create(parent,state){if(null!==parent&&parent.depth>=this._maxCacheDepth)return new MonarchStackElement(parent,state);let stackElementId=MonarchStackElement.getStackElementId(parent);stackElementId.length>0&&(stackElementId+="|"),stackElementId+=state;let result=this._entries[stackElementId];return result||(result=new MonarchStackElement(parent,state),this._entries[stackElementId]=result,result)}}MonarchStackElementFactory._INSTANCE=new MonarchStackElementFactory(5);class MonarchStackElement{constructor(parent,state){this.parent=parent,this.state=state,this.depth=(this.parent?this.parent.depth:0)+1}static getStackElementId(element){let result="";for(;null!==element;)result.length>0&&(result+="|"),result+=element.state,element=element.parent;return result}static _equals(a,b){for(;null!==a&&null!==b;){if(a===b)return!0;if(a.state!==b.state)return!1;a=a.parent,b=b.parent}return null===a&&null===b}equals(other){return MonarchStackElement._equals(this,other)}push(state){return MonarchStackElementFactory.create(this,state)}pop(){return this.parent}popall(){let result=this;for(;result.parent;)result=result.parent;return result}switchTo(state){return MonarchStackElementFactory.create(this.parent,state)}}class EmbeddedLanguageData{constructor(languageId,state){this.languageId=languageId,this.state=state}equals(other){return this.languageId===other.languageId&&this.state.equals(other.state)}clone(){return this.state.clone()===this.state?this:new EmbeddedLanguageData(this.languageId,this.state)}}class MonarchLineStateFactory{constructor(maxCacheDepth){this._maxCacheDepth=maxCacheDepth,this._entries=Object.create(null)}static create(stack,embeddedLanguageData){return this._INSTANCE.create(stack,embeddedLanguageData)}create(stack,embeddedLanguageData){if(null!==embeddedLanguageData)return new MonarchLineState(stack,embeddedLanguageData);if(null!==stack&&stack.depth>=this._maxCacheDepth)return new MonarchLineState(stack,embeddedLanguageData);const stackElementId=MonarchStackElement.getStackElementId(stack);let result=this._entries[stackElementId];return result||(result=new MonarchLineState(stack,null),this._entries[stackElementId]=result,result)}}MonarchLineStateFactory._INSTANCE=new MonarchLineStateFactory(5);class MonarchLineState{constructor(stack,embeddedLanguageData){this.stack=stack,this.embeddedLanguageData=embeddedLanguageData}clone(){return(this.embeddedLanguageData?this.embeddedLanguageData.clone():null)===this.embeddedLanguageData?this:MonarchLineStateFactory.create(this.stack,this.embeddedLanguageData)}equals(other){return other instanceof MonarchLineState&&(!!this.stack.equals(other.stack)&&(null===this.embeddedLanguageData&&null===other.embeddedLanguageData||null!==this.embeddedLanguageData&&null!==other.embeddedLanguageData&&this.embeddedLanguageData.equals(other.embeddedLanguageData)))}}class MonarchClassicTokensCollector{constructor(){this._tokens=[],this._languageId=null,this._lastTokenType=null,this._lastTokenLanguage=null}enterLanguage(languageId){this._languageId=languageId}emit(startOffset,type){this._lastTokenType===type&&this._lastTokenLanguage===this._languageId||(this._lastTokenType=type,this._lastTokenLanguage=this._languageId,this._tokens.push(new languages.Token(startOffset,type,this._languageId)))}nestedLanguageTokenize(embeddedLanguageLine,hasEOL,embeddedLanguageData,offsetDelta){const nestedLanguageId=embeddedLanguageData.languageId,embeddedModeState=embeddedLanguageData.state,nestedLanguageTokenizationSupport=languages.TokenizationRegistry.get(nestedLanguageId);if(!nestedLanguageTokenizationSupport)return this.enterLanguage(nestedLanguageId),this.emit(offsetDelta,""),embeddedModeState;const nestedResult=nestedLanguageTokenizationSupport.tokenize(embeddedLanguageLine,hasEOL,embeddedModeState);if(0!==offsetDelta)for(const token of nestedResult.tokens)this._tokens.push(new languages.Token(token.offset+offsetDelta,token.type,token.language));else this._tokens=this._tokens.concat(nestedResult.tokens);return this._lastTokenType=null,this._lastTokenLanguage=null,this._languageId=null,nestedResult.endState}finalize(endState){return new languages.TokenizationResult(this._tokens,endState)}}class MonarchModernTokensCollector{constructor(languageService,theme){this._languageService=languageService,this._theme=theme,this._prependTokens=null,this._tokens=[],this._currentLanguageId=0,this._lastTokenMetadata=0}enterLanguage(languageId){this._currentLanguageId=this._languageService.languageIdCodec.encodeLanguageId(languageId)}emit(startOffset,type){const metadata=this._theme.match(this._currentLanguageId,type);this._lastTokenMetadata!==metadata&&(this._lastTokenMetadata=metadata,this._tokens.push(startOffset),this._tokens.push(metadata))}static _merge(a,b,c){const aLen=null!==a?a.length:0,bLen=b.length,cLen=null!==c?c.length:0;if(0===aLen&&0===bLen&&0===cLen)return new Uint32Array(0);if(0===aLen&&0===bLen)return c;if(0===bLen&&0===cLen)return a;const result=new Uint32Array(aLen+bLen+cLen);null!==a&&result.set(a);for(let i=0;i<bLen;i++)result[aLen+i]=b[i];return null!==c&&result.set(c,aLen+bLen),result}nestedLanguageTokenize(embeddedLanguageLine,hasEOL,embeddedLanguageData,offsetDelta){const nestedLanguageId=embeddedLanguageData.languageId,embeddedModeState=embeddedLanguageData.state,nestedLanguageTokenizationSupport=languages.TokenizationRegistry.get(nestedLanguageId);if(!nestedLanguageTokenizationSupport)return this.enterLanguage(nestedLanguageId),this.emit(offsetDelta,""),embeddedModeState;const nestedResult=nestedLanguageTokenizationSupport.tokenizeEncoded(embeddedLanguageLine,hasEOL,embeddedModeState);if(0!==offsetDelta)for(let i=0,len=nestedResult.tokens.length;i<len;i+=2)nestedResult.tokens[i]+=offsetDelta;return this._prependTokens=MonarchModernTokensCollector._merge(this._prependTokens,this._tokens,nestedResult.tokens),this._tokens=[],this._currentLanguageId=0,this._lastTokenMetadata=0,nestedResult.endState}finalize(endState){return new languages.EncodedTokenizationResult(MonarchModernTokensCollector._merge(this._prependTokens,this._tokens,null),endState)}}let MonarchTokenizer=class MonarchTokenizer{constructor(languageService,standaloneThemeService,languageId,lexer,_configurationService){this._configurationService=_configurationService,this._languageService=languageService,this._standaloneThemeService=standaloneThemeService,this._languageId=languageId,this._lexer=lexer,this._embeddedLanguages=Object.create(null),this.embeddedLoaded=Promise.resolve(void 0);let emitting=!1;this._tokenizationRegistryListener=languages.TokenizationRegistry.onDidChange((e=>{if(emitting)return;let isOneOfMyEmbeddedModes=!1;for(let i=0,len=e.changedLanguages.length;i<len;i++){const language=e.changedLanguages[i];if(this._embeddedLanguages[language]){isOneOfMyEmbeddedModes=!0;break}}isOneOfMyEmbeddedModes&&(emitting=!0,languages.TokenizationRegistry.fire([this._languageId]),emitting=!1)})),this._maxTokenizationLineLength=this._configurationService.getValue("editor.maxTokenizationLineLength",{overrideIdentifier:this._languageId}),this._configurationService.onDidChangeConfiguration((e=>{e.affectsConfiguration("editor.maxTokenizationLineLength")&&(this._maxTokenizationLineLength=this._configurationService.getValue("editor.maxTokenizationLineLength",{overrideIdentifier:this._languageId}))}))}dispose(){this._tokenizationRegistryListener.dispose()}getLoadStatus(){const promises=[];for(const nestedLanguageId in this._embeddedLanguages){const tokenizationSupport=languages.TokenizationRegistry.get(nestedLanguageId);if(tokenizationSupport){if(tokenizationSupport instanceof MonarchTokenizer){const nestedModeStatus=tokenizationSupport.getLoadStatus();!1===nestedModeStatus.loaded&&promises.push(nestedModeStatus.promise)}}else languages.TokenizationRegistry.isResolved(nestedLanguageId)||promises.push(languages.TokenizationRegistry.getOrCreate(nestedLanguageId))}return 0===promises.length?{loaded:!0}:{loaded:!1,promise:Promise.all(promises).then((_=>{}))}}getInitialState(){const rootState=MonarchStackElementFactory.create(null,this._lexer.start);return MonarchLineStateFactory.create(rootState,null)}tokenize(line,hasEOL,lineState){if(line.length>=this._maxTokenizationLineLength)return nullTokenize(this._languageId,lineState);const tokensCollector=new MonarchClassicTokensCollector,endLineState=this._tokenize(line,hasEOL,lineState,tokensCollector);return tokensCollector.finalize(endLineState)}tokenizeEncoded(line,hasEOL,lineState){if(line.length>=this._maxTokenizationLineLength)return nullTokenizeEncoded(this._languageService.languageIdCodec.encodeLanguageId(this._languageId),lineState);const tokensCollector=new MonarchModernTokensCollector(this._languageService,this._standaloneThemeService.getColorTheme().tokenTheme),endLineState=this._tokenize(line,hasEOL,lineState,tokensCollector);return tokensCollector.finalize(endLineState)}_tokenize(line,hasEOL,lineState,collector){return lineState.embeddedLanguageData?this._nestedTokenize(line,hasEOL,lineState,0,collector):this._myTokenize(line,hasEOL,lineState,0,collector)}_findLeavingNestedLanguageOffset(line,state){let rules=this._lexer.tokenizer[state.stack.state];if(!rules&&(rules=monarchCommon.findRules(this._lexer,state.stack.state),!rules))throw monarchCommon.createError(this._lexer,"tokenizer state is not defined: "+state.stack.state);let popOffset=-1,hasEmbeddedPopRule=!1;for(const rule of rules){if(!monarchCommon.isIAction(rule.action)||"@pop"!==rule.action.nextEmbedded)continue;hasEmbeddedPopRule=!0;let regex=rule.regex;const regexSource=rule.regex.source;if("^(?:"===regexSource.substr(0,4)&&")"===regexSource.substr(regexSource.length-1,1)){const flags=(regex.ignoreCase?"i":"")+(regex.unicode?"u":"");regex=new RegExp(regexSource.substr(4,regexSource.length-5),flags)}const result=line.search(regex);-1===result||0!==result&&rule.matchOnlyAtLineStart||(-1===popOffset||result<popOffset)&&(popOffset=result)}if(!hasEmbeddedPopRule)throw monarchCommon.createError(this._lexer,'no rule containing nextEmbedded: "@pop" in tokenizer embedded state: '+state.stack.state);return popOffset}_nestedTokenize(line,hasEOL,lineState,offsetDelta,tokensCollector){const popOffset=this._findLeavingNestedLanguageOffset(line,lineState);if(-1===popOffset){const nestedEndState=tokensCollector.nestedLanguageTokenize(line,hasEOL,lineState.embeddedLanguageData,offsetDelta);return MonarchLineStateFactory.create(lineState.stack,new EmbeddedLanguageData(lineState.embeddedLanguageData.languageId,nestedEndState))}const nestedLanguageLine=line.substring(0,popOffset);nestedLanguageLine.length>0&&tokensCollector.nestedLanguageTokenize(nestedLanguageLine,!1,lineState.embeddedLanguageData,offsetDelta);const restOfTheLine=line.substring(popOffset);return this._myTokenize(restOfTheLine,hasEOL,lineState,offsetDelta+popOffset,tokensCollector)}_safeRuleName(rule){return rule?rule.name:"(unknown)"}_myTokenize(lineWithoutLF,hasEOL,lineState,offsetDelta,tokensCollector){tokensCollector.enterLanguage(this._languageId);const lineWithoutLFLength=lineWithoutLF.length,line=hasEOL&&this._lexer.includeLF?lineWithoutLF+"\n":lineWithoutLF,lineLength=line.length;let embeddedLanguageData=lineState.embeddedLanguageData,stack=lineState.stack,pos=0,groupMatching=null,forceEvaluation=!0;for(;forceEvaluation||pos<lineLength;){const pos0=pos,stackLen0=stack.depth,groupLen0=groupMatching?groupMatching.groups.length:0,state=stack.state;let matches=null,matched=null,action=null,rule=null,enteringEmbeddedLanguage=null;if(groupMatching){matches=groupMatching.matches;const groupEntry=groupMatching.groups.shift();matched=groupEntry.matched,action=groupEntry.action,rule=groupMatching.rule,0===groupMatching.groups.length&&(groupMatching=null)}else{if(!forceEvaluation&&pos>=lineLength)break;forceEvaluation=!1;let rules=this._lexer.tokenizer[state];if(!rules&&(rules=monarchCommon.findRules(this._lexer,state),!rules))throw monarchCommon.createError(this._lexer,"tokenizer state is not defined: "+state);const restOfLine=line.substr(pos);for(const rule of rules)if((0===pos||!rule.matchOnlyAtLineStart)&&(matches=restOfLine.match(rule.regex),matches)){matched=matches[0],action=rule.action;break}}if(matches||(matches=[""],matched=""),action||(pos<lineLength&&(matches=[line.charAt(pos)],matched=matches[0]),action=this._lexer.defaultToken),null===matched)break;for(pos+=matched.length;monarchCommon.isFuzzyAction(action)&&monarchCommon.isIAction(action)&&action.test;)action=action.test(matched,matches,state,pos===lineLength);let result=null;if("string"==typeof action||Array.isArray(action))result=action;else if(action.group)result=action.group;else if(null!==action.token&&void 0!==action.token){if(result=action.tokenSubst?monarchCommon.substituteMatches(this._lexer,action.token,matched,matches,state):action.token,action.nextEmbedded)if("@pop"===action.nextEmbedded){if(!embeddedLanguageData)throw monarchCommon.createError(this._lexer,"cannot pop embedded language if not inside one");embeddedLanguageData=null}else{if(embeddedLanguageData)throw monarchCommon.createError(this._lexer,"cannot enter embedded language from within an embedded language");enteringEmbeddedLanguage=monarchCommon.substituteMatches(this._lexer,action.nextEmbedded,matched,matches,state)}if(action.goBack&&(pos=Math.max(0,pos-action.goBack)),action.switchTo&&"string"==typeof action.switchTo){let nextState=monarchCommon.substituteMatches(this._lexer,action.switchTo,matched,matches,state);if("@"===nextState[0]&&(nextState=nextState.substr(1)),!monarchCommon.findRules(this._lexer,nextState))throw monarchCommon.createError(this._lexer,"trying to switch to a state '"+nextState+"' that is undefined in rule: "+this._safeRuleName(rule));stack=stack.switchTo(nextState)}else{if(action.transform&&"function"==typeof action.transform)throw monarchCommon.createError(this._lexer,"action.transform not supported");if(action.next)if("@push"===action.next){if(stack.depth>=this._lexer.maxStack)throw monarchCommon.createError(this._lexer,"maximum tokenizer stack size reached: ["+stack.state+","+stack.parent.state+",...]");stack=stack.push(state)}else if("@pop"===action.next){if(stack.depth<=1)throw monarchCommon.createError(this._lexer,"trying to pop an empty stack in rule: "+this._safeRuleName(rule));stack=stack.pop()}else if("@popall"===action.next)stack=stack.popall();else{let nextState=monarchCommon.substituteMatches(this._lexer,action.next,matched,matches,state);if("@"===nextState[0]&&(nextState=nextState.substr(1)),!monarchCommon.findRules(this._lexer,nextState))throw monarchCommon.createError(this._lexer,"trying to set a next state '"+nextState+"' that is undefined in rule: "+this._safeRuleName(rule));stack=stack.push(nextState)}}action.log&&"string"==typeof action.log&&monarchCommon.log(this._lexer,this._lexer.languageId+": "+monarchCommon.substituteMatches(this._lexer,action.log,matched,matches,state))}if(null===result)throw monarchCommon.createError(this._lexer,"lexer rule has no well-defined action in rule: "+this._safeRuleName(rule));const computeNewStateForEmbeddedLanguage=enteringEmbeddedLanguage=>{const languageId=this._languageService.getLanguageIdByLanguageName(enteringEmbeddedLanguage)||this._languageService.getLanguageIdByMimeType(enteringEmbeddedLanguage)||enteringEmbeddedLanguage,embeddedLanguageData=this._getNestedEmbeddedLanguageData(languageId);if(pos<lineLength){const restOfLine=lineWithoutLF.substr(pos);return this._nestedTokenize(restOfLine,hasEOL,MonarchLineStateFactory.create(stack,embeddedLanguageData),offsetDelta+pos,tokensCollector)}return MonarchLineStateFactory.create(stack,embeddedLanguageData)};if(Array.isArray(result)){if(groupMatching&&groupMatching.groups.length>0)throw monarchCommon.createError(this._lexer,"groups cannot be nested: "+this._safeRuleName(rule));if(matches.length!==result.length+1)throw monarchCommon.createError(this._lexer,"matched number of groups does not match the number of actions in rule: "+this._safeRuleName(rule));let totalLen=0;for(let i=1;i<matches.length;i++)totalLen+=matches[i].length;if(totalLen!==matched.length)throw monarchCommon.createError(this._lexer,"with groups, all characters should be matched in consecutive groups in rule: "+this._safeRuleName(rule));groupMatching={rule,matches,groups:[]};for(let i=0;i<result.length;i++)groupMatching.groups[i]={action:result[i],matched:matches[i+1]};pos-=matched.length}else{{if("@rematch"===result&&(pos-=matched.length,matched="",matches=null,result="",null!==enteringEmbeddedLanguage))return computeNewStateForEmbeddedLanguage(enteringEmbeddedLanguage);if(0===matched.length){if(0===lineLength||stackLen0!==stack.depth||state!==stack.state||(groupMatching?groupMatching.groups.length:0)!==groupLen0)continue;throw monarchCommon.createError(this._lexer,"no progress in tokenizer in rule: "+this._safeRuleName(rule))}let tokenType=null;if(monarchCommon.isString(result)&&0===result.indexOf("@brackets")){const rest=result.substr("@brackets".length),bracket=findBracket(this._lexer,matched);if(!bracket)throw monarchCommon.createError(this._lexer,"@brackets token returned but no bracket defined as: "+matched);tokenType=monarchCommon.sanitize(bracket.token+rest)}else{const token=""===result?"":result+this._lexer.tokenPostfix;tokenType=monarchCommon.sanitize(token)}pos0<lineWithoutLFLength&&tokensCollector.emit(pos0+offsetDelta,tokenType)}if(null!==enteringEmbeddedLanguage)return computeNewStateForEmbeddedLanguage(enteringEmbeddedLanguage)}}return MonarchLineStateFactory.create(stack,embeddedLanguageData)}_getNestedEmbeddedLanguageData(languageId){if(!this._languageService.isRegisteredLanguageId(languageId))return new EmbeddedLanguageData(languageId,NullState);languageId!==this._languageId&&(languages.TokenizationRegistry.getOrCreate(languageId),this._embeddedLanguages[languageId]=!0);const tokenizationSupport=languages.TokenizationRegistry.get(languageId);return new EmbeddedLanguageData(languageId,tokenizationSupport?tokenizationSupport.getInitialState():NullState)}};MonarchTokenizer=__decorate([__param(4,IConfigurationService)],MonarchTokenizer);export{MonarchTokenizer};function findBracket(lexer,matched){if(!matched)return null;matched=monarchCommon.fixCase(lexer,matched);const brackets=lexer.brackets;for(const bracket of brackets){if(bracket.open===matched)return{token:bracket.token,bracketType:1};if(bracket.close===matched)return{token:bracket.token,bracketType:-1}}return null}