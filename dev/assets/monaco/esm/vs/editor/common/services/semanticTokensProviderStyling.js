var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{TokenMetadata}from"../encodedTokenAttributes.js";import{IThemeService}from"../../../platform/theme/common/themeService.js";import{ILogService,LogLevel}from"../../../platform/log/common/log.js";import{SparseMultilineTokens}from"../tokens/sparseMultilineTokens.js";import{ILanguageService}from"../languages/language.js";let SemanticTokensProviderStyling=class SemanticTokensProviderStyling{constructor(_legend,_themeService,_languageService,_logService){this._legend=_legend,this._themeService=_themeService,this._languageService=_languageService,this._logService=_logService,this._hasWarnedOverlappingTokens=!1,this._hasWarnedInvalidLengthTokens=!1,this._hasWarnedInvalidEditStart=!1,this._hashTable=new HashTable}getMetadata(tokenTypeIndex,tokenModifierSet,languageId){const encodedLanguageId=this._languageService.languageIdCodec.encodeLanguageId(languageId),entry=this._hashTable.get(tokenTypeIndex,tokenModifierSet,encodedLanguageId);let metadata;if(entry)metadata=entry.metadata,this._logService.getLevel()===LogLevel.Trace&&this._logService.trace(`SemanticTokensProviderStyling [CACHED] ${tokenTypeIndex} / ${tokenModifierSet}: foreground ${TokenMetadata.getForeground(metadata)}, fontStyle ${TokenMetadata.getFontStyle(metadata).toString(2)}`);else{let tokenType=this._legend.tokenTypes[tokenTypeIndex];const tokenModifiers=[];if(tokenType){let modifierSet=tokenModifierSet;for(let modifierIndex=0;modifierSet>0&&modifierIndex<this._legend.tokenModifiers.length;modifierIndex++)1&modifierSet&&tokenModifiers.push(this._legend.tokenModifiers[modifierIndex]),modifierSet>>=1;modifierSet>0&&this._logService.getLevel()===LogLevel.Trace&&(this._logService.trace(`SemanticTokensProviderStyling: unknown token modifier index: ${tokenModifierSet.toString(2)} for legend: ${JSON.stringify(this._legend.tokenModifiers)}`),tokenModifiers.push("not-in-legend"));const tokenStyle=this._themeService.getColorTheme().getTokenStyleMetadata(tokenType,tokenModifiers,languageId);if(void 0===tokenStyle)metadata=2147483647;else{if(metadata=0,void 0!==tokenStyle.italic){metadata|=1|(tokenStyle.italic?1:0)<<11}if(void 0!==tokenStyle.bold){metadata|=2|(tokenStyle.bold?2:0)<<11}if(void 0!==tokenStyle.underline){metadata|=4|(tokenStyle.underline?4:0)<<11}if(void 0!==tokenStyle.strikethrough){metadata|=8|(tokenStyle.strikethrough?8:0)<<11}if(tokenStyle.foreground){metadata|=16|tokenStyle.foreground<<15}0===metadata&&(metadata=2147483647)}}else this._logService.getLevel()===LogLevel.Trace&&this._logService.trace(`SemanticTokensProviderStyling: unknown token type index: ${tokenTypeIndex} for legend: ${JSON.stringify(this._legend.tokenTypes)}`),metadata=2147483647,tokenType="not-in-legend";this._hashTable.add(tokenTypeIndex,tokenModifierSet,encodedLanguageId,metadata),this._logService.getLevel()===LogLevel.Trace&&this._logService.trace(`SemanticTokensProviderStyling ${tokenTypeIndex} (${tokenType}) / ${tokenModifierSet} (${tokenModifiers.join(" ")}): foreground ${TokenMetadata.getForeground(metadata)}, fontStyle ${TokenMetadata.getFontStyle(metadata).toString(2)}`)}return metadata}warnOverlappingSemanticTokens(lineNumber,startColumn){this._hasWarnedOverlappingTokens||(this._hasWarnedOverlappingTokens=!0,console.warn(`Overlapping semantic tokens detected at lineNumber ${lineNumber}, column ${startColumn}`))}warnInvalidLengthSemanticTokens(lineNumber,startColumn){this._hasWarnedInvalidLengthTokens||(this._hasWarnedInvalidLengthTokens=!0,console.warn(`Semantic token with invalid length detected at lineNumber ${lineNumber}, column ${startColumn}`))}warnInvalidEditStart(previousResultId,resultId,editIndex,editStart,maxExpectedStart){this._hasWarnedInvalidEditStart||(this._hasWarnedInvalidEditStart=!0,console.warn(`Invalid semantic tokens edit detected (previousResultId: ${previousResultId}, resultId: ${resultId}) at edit #${editIndex}: The provided start offset ${editStart} is outside the previous data (length ${maxExpectedStart}).`))}};SemanticTokensProviderStyling=__decorate([__param(1,IThemeService),__param(2,ILanguageService),__param(3,ILogService)],SemanticTokensProviderStyling);export{SemanticTokensProviderStyling};export function toMultilineTokens2(tokens,styling,languageId){const srcData=tokens.data,tokenCount=tokens.data.length/5|0,tokensPerArea=Math.max(Math.ceil(tokenCount/1024),400),result=[];let tokenIndex=0,lastLineNumber=1,lastStartCharacter=0;for(;tokenIndex<tokenCount;){const tokenStartIndex=tokenIndex;let tokenEndIndex=Math.min(tokenStartIndex+tokensPerArea,tokenCount);if(tokenEndIndex<tokenCount){let smallTokenEndIndex=tokenEndIndex;for(;smallTokenEndIndex-1>tokenStartIndex&&0===srcData[5*smallTokenEndIndex];)smallTokenEndIndex--;if(smallTokenEndIndex-1===tokenStartIndex){let bigTokenEndIndex=tokenEndIndex;for(;bigTokenEndIndex+1<tokenCount&&0===srcData[5*bigTokenEndIndex];)bigTokenEndIndex++;tokenEndIndex=bigTokenEndIndex}else tokenEndIndex=smallTokenEndIndex}let destData=new Uint32Array(4*(tokenEndIndex-tokenStartIndex)),destOffset=0,areaLine=0,prevLineNumber=0,prevEndCharacter=0;for(;tokenIndex<tokenEndIndex;){const srcOffset=5*tokenIndex,deltaLine=srcData[srcOffset],deltaCharacter=srcData[srcOffset+1],lineNumber=lastLineNumber+deltaLine|0,startCharacter=0===deltaLine?lastStartCharacter+deltaCharacter|0:deltaCharacter,endCharacter=startCharacter+srcData[srcOffset+2]|0,tokenTypeIndex=srcData[srcOffset+3],tokenModifierSet=srcData[srcOffset+4];if(endCharacter<=startCharacter)styling.warnInvalidLengthSemanticTokens(lineNumber,startCharacter+1);else if(prevLineNumber===lineNumber&&prevEndCharacter>startCharacter)styling.warnOverlappingSemanticTokens(lineNumber,startCharacter+1);else{const metadata=styling.getMetadata(tokenTypeIndex,tokenModifierSet,languageId);2147483647!==metadata&&(0===areaLine&&(areaLine=lineNumber),destData[destOffset]=lineNumber-areaLine,destData[destOffset+1]=startCharacter,destData[destOffset+2]=endCharacter,destData[destOffset+3]=metadata,destOffset+=4,prevLineNumber=lineNumber,prevEndCharacter=endCharacter)}lastLineNumber=lineNumber,lastStartCharacter=startCharacter,tokenIndex++}destOffset!==destData.length&&(destData=destData.subarray(0,destOffset));const tokens=SparseMultilineTokens.create(areaLine,destData);result.push(tokens)}return result}class HashTableEntry{constructor(tokenTypeIndex,tokenModifierSet,languageId,metadata){this.tokenTypeIndex=tokenTypeIndex,this.tokenModifierSet=tokenModifierSet,this.languageId=languageId,this.metadata=metadata,this.next=null}}class HashTable{constructor(){this._elementsCount=0,this._currentLengthIndex=0,this._currentLength=HashTable._SIZES[this._currentLengthIndex],this._growCount=Math.round(this._currentLengthIndex+1<HashTable._SIZES.length?2/3*this._currentLength:0),this._elements=[],HashTable._nullOutEntries(this._elements,this._currentLength)}static _nullOutEntries(entries,length){for(let i=0;i<length;i++)entries[i]=null}_hash2(n1,n2){return(n1<<5)-n1+n2|0}_hashFunc(tokenTypeIndex,tokenModifierSet,languageId){return this._hash2(this._hash2(tokenTypeIndex,tokenModifierSet),languageId)%this._currentLength}get(tokenTypeIndex,tokenModifierSet,languageId){const hash=this._hashFunc(tokenTypeIndex,tokenModifierSet,languageId);let p=this._elements[hash];for(;p;){if(p.tokenTypeIndex===tokenTypeIndex&&p.tokenModifierSet===tokenModifierSet&&p.languageId===languageId)return p;p=p.next}return null}add(tokenTypeIndex,tokenModifierSet,languageId,metadata){if(this._elementsCount++,0!==this._growCount&&this._elementsCount>=this._growCount){const oldElements=this._elements;this._currentLengthIndex++,this._currentLength=HashTable._SIZES[this._currentLengthIndex],this._growCount=Math.round(this._currentLengthIndex+1<HashTable._SIZES.length?2/3*this._currentLength:0),this._elements=[],HashTable._nullOutEntries(this._elements,this._currentLength);for(const first of oldElements){let p=first;for(;p;){const oldNext=p.next;p.next=null,this._add(p),p=oldNext}}}this._add(new HashTableEntry(tokenTypeIndex,tokenModifierSet,languageId,metadata))}_add(element){const hash=this._hashFunc(element.tokenTypeIndex,element.tokenModifierSet,element.languageId);element.next=this._elements[hash],this._elements[hash]=element}}HashTable._SIZES=[3,7,13,31,61,127,251,509,1021,2039,4093,8191,16381,32749,65521,131071,262139,524287,1048573,2097143];