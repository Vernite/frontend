export function createScopedLineTokens(context,offset){const tokenCount=context.getCount(),tokenIndex=context.findTokenIndexAtOffset(offset),desiredLanguageId=context.getLanguageId(tokenIndex);let lastTokenIndex=tokenIndex;for(;lastTokenIndex+1<tokenCount&&context.getLanguageId(lastTokenIndex+1)===desiredLanguageId;)lastTokenIndex++;let firstTokenIndex=tokenIndex;for(;firstTokenIndex>0&&context.getLanguageId(firstTokenIndex-1)===desiredLanguageId;)firstTokenIndex--;return new ScopedLineTokens(context,desiredLanguageId,firstTokenIndex,lastTokenIndex+1,context.getStartOffset(firstTokenIndex),context.getEndOffset(lastTokenIndex))}export class ScopedLineTokens{constructor(actual,languageId,firstTokenIndex,lastTokenIndex,firstCharOffset,lastCharOffset){this._scopedLineTokensBrand=void 0,this._actual=actual,this.languageId=languageId,this._firstTokenIndex=firstTokenIndex,this._lastTokenIndex=lastTokenIndex,this.firstCharOffset=firstCharOffset,this._lastCharOffset=lastCharOffset}getLineContent(){return this._actual.getLineContent().substring(this.firstCharOffset,this._lastCharOffset)}getActualLineContentBefore(offset){return this._actual.getLineContent().substring(0,this.firstCharOffset+offset)}getTokenCount(){return this._lastTokenIndex-this._firstTokenIndex}findTokenIndexAtOffset(offset){return this._actual.findTokenIndexAtOffset(offset+this.firstCharOffset)-this._firstTokenIndex}getStandardTokenType(tokenIndex){return this._actual.getStandardTokenType(tokenIndex+this._firstTokenIndex)}}export function ignoreBracketsInToken(standardTokenType){return 0!=(3&standardTokenType)}