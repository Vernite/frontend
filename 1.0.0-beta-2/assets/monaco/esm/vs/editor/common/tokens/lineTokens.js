import{TokenMetadata}from"../encodedTokenAttributes.js";export class LineTokens{constructor(tokens,text,decoder){this._lineTokensBrand=void 0,this._tokens=tokens,this._tokensCount=this._tokens.length>>>1,this._text=text,this._languageIdCodec=decoder}static createEmpty(lineContent,decoder){const defaultMetadata=LineTokens.defaultTokenMetadata,tokens=new Uint32Array(2);return tokens[0]=lineContent.length,tokens[1]=defaultMetadata,new LineTokens(tokens,lineContent,decoder)}equals(other){return other instanceof LineTokens&&this.slicedEquals(other,0,this._tokensCount)}slicedEquals(other,sliceFromTokenIndex,sliceTokenCount){if(this._text!==other._text)return!1;if(this._tokensCount!==other._tokensCount)return!1;const from=sliceFromTokenIndex<<1,to=from+(sliceTokenCount<<1);for(let i=from;i<to;i++)if(this._tokens[i]!==other._tokens[i])return!1;return!0}getLineContent(){return this._text}getCount(){return this._tokensCount}getStartOffset(tokenIndex){return tokenIndex>0?this._tokens[tokenIndex-1<<1]:0}getMetadata(tokenIndex){return this._tokens[1+(tokenIndex<<1)]}getLanguageId(tokenIndex){const metadata=this._tokens[1+(tokenIndex<<1)],languageId=TokenMetadata.getLanguageId(metadata);return this._languageIdCodec.decodeLanguageId(languageId)}getStandardTokenType(tokenIndex){const metadata=this._tokens[1+(tokenIndex<<1)];return TokenMetadata.getTokenType(metadata)}getForeground(tokenIndex){const metadata=this._tokens[1+(tokenIndex<<1)];return TokenMetadata.getForeground(metadata)}getClassName(tokenIndex){const metadata=this._tokens[1+(tokenIndex<<1)];return TokenMetadata.getClassNameFromMetadata(metadata)}getInlineStyle(tokenIndex,colorMap){const metadata=this._tokens[1+(tokenIndex<<1)];return TokenMetadata.getInlineStyleFromMetadata(metadata,colorMap)}getPresentation(tokenIndex){const metadata=this._tokens[1+(tokenIndex<<1)];return TokenMetadata.getPresentationFromMetadata(metadata)}getEndOffset(tokenIndex){return this._tokens[tokenIndex<<1]}findTokenIndexAtOffset(offset){return LineTokens.findIndexInTokensArray(this._tokens,offset)}inflate(){return this}sliceAndInflate(startOffset,endOffset,deltaOffset){return new SliceLineTokens(this,startOffset,endOffset,deltaOffset)}static convertToEndOffset(tokens,lineTextLength){const lastTokenIndex=(tokens.length>>>1)-1;for(let tokenIndex=0;tokenIndex<lastTokenIndex;tokenIndex++)tokens[tokenIndex<<1]=tokens[tokenIndex+1<<1];tokens[lastTokenIndex<<1]=lineTextLength}static findIndexInTokensArray(tokens,desiredIndex){if(tokens.length<=2)return 0;let low=0,high=(tokens.length>>>1)-1;for(;low<high;){const mid=low+Math.floor((high-low)/2),endOffset=tokens[mid<<1];if(endOffset===desiredIndex)return mid+1;endOffset<desiredIndex?low=mid+1:endOffset>desiredIndex&&(high=mid)}return low}withInserted(insertTokens){if(0===insertTokens.length)return this;let nextOriginalTokenIdx=0,nextInsertTokenIdx=0,text="";const newTokens=new Array;let originalEndOffset=0;for(;;){const nextOriginalTokenEndOffset=nextOriginalTokenIdx<this._tokensCount?this._tokens[nextOriginalTokenIdx<<1]:-1,nextInsertToken=nextInsertTokenIdx<insertTokens.length?insertTokens[nextInsertTokenIdx]:null;if(-1!==nextOriginalTokenEndOffset&&(null===nextInsertToken||nextOriginalTokenEndOffset<=nextInsertToken.offset)){text+=this._text.substring(originalEndOffset,nextOriginalTokenEndOffset);const metadata=this._tokens[1+(nextOriginalTokenIdx<<1)];newTokens.push(text.length,metadata),nextOriginalTokenIdx++,originalEndOffset=nextOriginalTokenEndOffset}else{if(!nextInsertToken)break;if(nextInsertToken.offset>originalEndOffset){text+=this._text.substring(originalEndOffset,nextInsertToken.offset);const metadata=this._tokens[1+(nextOriginalTokenIdx<<1)];newTokens.push(text.length,metadata),originalEndOffset=nextInsertToken.offset}text+=nextInsertToken.text,newTokens.push(text.length,nextInsertToken.tokenMetadata),nextInsertTokenIdx++}}return new LineTokens(new Uint32Array(newTokens),text,this._languageIdCodec)}}LineTokens.defaultTokenMetadata=33587200;class SliceLineTokens{constructor(source,startOffset,endOffset,deltaOffset){this._source=source,this._startOffset=startOffset,this._endOffset=endOffset,this._deltaOffset=deltaOffset,this._firstTokenIndex=source.findTokenIndexAtOffset(startOffset),this._tokensCount=0;for(let i=this._firstTokenIndex,len=source.getCount();i<len;i++){if(source.getStartOffset(i)>=endOffset)break;this._tokensCount++}}getMetadata(tokenIndex){return this._source.getMetadata(this._firstTokenIndex+tokenIndex)}getLanguageId(tokenIndex){return this._source.getLanguageId(this._firstTokenIndex+tokenIndex)}getLineContent(){return this._source.getLineContent().substring(this._startOffset,this._endOffset)}equals(other){return other instanceof SliceLineTokens&&(this._startOffset===other._startOffset&&this._endOffset===other._endOffset&&this._deltaOffset===other._deltaOffset&&this._source.slicedEquals(other._source,this._firstTokenIndex,this._tokensCount))}getCount(){return this._tokensCount}getForeground(tokenIndex){return this._source.getForeground(this._firstTokenIndex+tokenIndex)}getEndOffset(tokenIndex){const tokenEndOffset=this._source.getEndOffset(this._firstTokenIndex+tokenIndex);return Math.min(this._endOffset,tokenEndOffset)-this._startOffset+this._deltaOffset}getClassName(tokenIndex){return this._source.getClassName(this._firstTokenIndex+tokenIndex)}getInlineStyle(tokenIndex,colorMap){return this._source.getInlineStyle(this._firstTokenIndex+tokenIndex,colorMap)}getPresentation(tokenIndex){return this._source.getPresentation(this._firstTokenIndex+tokenIndex)}findTokenIndexAtOffset(offset){return this._source.findTokenIndexAtOffset(offset+this._startOffset-this._deltaOffset)-this._firstTokenIndex}}