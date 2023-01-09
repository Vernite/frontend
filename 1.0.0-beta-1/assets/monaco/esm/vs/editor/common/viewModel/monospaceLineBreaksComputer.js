import*as strings from"../../../base/common/strings.js";import{CharacterClassifier}from"../core/characterClassifier.js";import{LineInjectedText}from"../textModelEvents.js";import{ModelLineProjectionData}from"../modelLineProjectionData.js";export class MonospaceLineBreaksComputerFactory{constructor(breakBeforeChars,breakAfterChars){this.classifier=new WrappingCharacterClassifier(breakBeforeChars,breakAfterChars)}static create(options){return new MonospaceLineBreaksComputerFactory(options.get(122),options.get(121))}createLineBreaksComputer(fontInfo,tabSize,wrappingColumn,wrappingIndent){const requests=[],injectedTexts=[],previousBreakingData=[];return{addRequest:(lineText,injectedText,previousLineBreakData)=>{requests.push(lineText),injectedTexts.push(injectedText),previousBreakingData.push(previousLineBreakData)},finalize:()=>{const columnsForFullWidthChar=fontInfo.typicalFullwidthCharacterWidth/fontInfo.typicalHalfwidthCharacterWidth,result=[];for(let i=0,len=requests.length;i<len;i++){const injectedText=injectedTexts[i],previousLineBreakData=previousBreakingData[i];!previousLineBreakData||previousLineBreakData.injectionOptions||injectedText?result[i]=createLineBreaks(this.classifier,requests[i],injectedText,tabSize,wrappingColumn,columnsForFullWidthChar,wrappingIndent):result[i]=createLineBreaksFromPreviousLineBreaks(this.classifier,previousLineBreakData,requests[i],tabSize,wrappingColumn,columnsForFullWidthChar,wrappingIndent)}return arrPool1.length=0,arrPool2.length=0,result}}}}class WrappingCharacterClassifier extends CharacterClassifier{constructor(BREAK_BEFORE,BREAK_AFTER){super(0);for(let i=0;i<BREAK_BEFORE.length;i++)this.set(BREAK_BEFORE.charCodeAt(i),1);for(let i=0;i<BREAK_AFTER.length;i++)this.set(BREAK_AFTER.charCodeAt(i),2)}get(charCode){return charCode>=0&&charCode<256?this._asciiMap[charCode]:charCode>=12352&&charCode<=12543||charCode>=13312&&charCode<=19903||charCode>=19968&&charCode<=40959?3:this._map.get(charCode)||this._defaultValue}}let arrPool1=[],arrPool2=[];function createLineBreaksFromPreviousLineBreaks(classifier,previousBreakingData,lineText,tabSize,firstLineBreakColumn,columnsForFullWidthChar,wrappingIndent){if(-1===firstLineBreakColumn)return null;const len=lineText.length;if(len<=1)return null;const prevBreakingOffsets=previousBreakingData.breakOffsets,prevBreakingOffsetsVisibleColumn=previousBreakingData.breakOffsetsVisibleColumn,wrappedTextIndentLength=computeWrappedTextIndentLength(lineText,tabSize,firstLineBreakColumn,columnsForFullWidthChar,wrappingIndent),wrappedLineBreakColumn=firstLineBreakColumn-wrappedTextIndentLength,breakingOffsets=arrPool1,breakingOffsetsVisibleColumn=arrPool2;let breakingOffsetsCount=0,lastBreakingOffset=0,lastBreakingOffsetVisibleColumn=0,breakingColumn=firstLineBreakColumn;const prevLen=prevBreakingOffsets.length;let prevIndex=0;if(prevIndex>=0){let bestDistance=Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex]-breakingColumn);for(;prevIndex+1<prevLen;){const distance=Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex+1]-breakingColumn);if(distance>=bestDistance)break;bestDistance=distance,prevIndex++}}for(;prevIndex<prevLen;){let prevBreakOffset=prevIndex<0?0:prevBreakingOffsets[prevIndex],prevBreakOffsetVisibleColumn=prevIndex<0?0:prevBreakingOffsetsVisibleColumn[prevIndex];lastBreakingOffset>prevBreakOffset&&(prevBreakOffset=lastBreakingOffset,prevBreakOffsetVisibleColumn=lastBreakingOffsetVisibleColumn);let breakOffset=0,breakOffsetVisibleColumn=0,forcedBreakOffset=0,forcedBreakOffsetVisibleColumn=0;if(prevBreakOffsetVisibleColumn<=breakingColumn){let visibleColumn=prevBreakOffsetVisibleColumn,prevCharCode=0===prevBreakOffset?0:lineText.charCodeAt(prevBreakOffset-1),prevCharCodeClass=0===prevBreakOffset?0:classifier.get(prevCharCode),entireLineFits=!0;for(let i=prevBreakOffset;i<len;i++){const charStartOffset=i,charCode=lineText.charCodeAt(i);let charCodeClass,charWidth;if(strings.isHighSurrogate(charCode)?(i++,charCodeClass=0,charWidth=2):(charCodeClass=classifier.get(charCode),charWidth=computeCharWidth(charCode,visibleColumn,tabSize,columnsForFullWidthChar)),charStartOffset>lastBreakingOffset&&canBreak(prevCharCode,prevCharCodeClass,charCode,charCodeClass)&&(breakOffset=charStartOffset,breakOffsetVisibleColumn=visibleColumn),visibleColumn+=charWidth,visibleColumn>breakingColumn){charStartOffset>lastBreakingOffset?(forcedBreakOffset=charStartOffset,forcedBreakOffsetVisibleColumn=visibleColumn-charWidth):(forcedBreakOffset=i+1,forcedBreakOffsetVisibleColumn=visibleColumn),visibleColumn-breakOffsetVisibleColumn>wrappedLineBreakColumn&&(breakOffset=0),entireLineFits=!1;break}prevCharCode=charCode,prevCharCodeClass=charCodeClass}if(entireLineFits){breakingOffsetsCount>0&&(breakingOffsets[breakingOffsetsCount]=prevBreakingOffsets[prevBreakingOffsets.length-1],breakingOffsetsVisibleColumn[breakingOffsetsCount]=prevBreakingOffsetsVisibleColumn[prevBreakingOffsets.length-1],breakingOffsetsCount++);break}}if(0===breakOffset){let visibleColumn=prevBreakOffsetVisibleColumn,charCode=lineText.charCodeAt(prevBreakOffset),charCodeClass=classifier.get(charCode),hitATabCharacter=!1;for(let i=prevBreakOffset-1;i>=lastBreakingOffset;i--){const charStartOffset=i+1,prevCharCode=lineText.charCodeAt(i);if(9===prevCharCode){hitATabCharacter=!0;break}let prevCharCodeClass,prevCharWidth;if(strings.isLowSurrogate(prevCharCode)?(i--,prevCharCodeClass=0,prevCharWidth=2):(prevCharCodeClass=classifier.get(prevCharCode),prevCharWidth=strings.isFullWidthCharacter(prevCharCode)?columnsForFullWidthChar:1),visibleColumn<=breakingColumn){if(0===forcedBreakOffset&&(forcedBreakOffset=charStartOffset,forcedBreakOffsetVisibleColumn=visibleColumn),visibleColumn<=breakingColumn-wrappedLineBreakColumn)break;if(canBreak(prevCharCode,prevCharCodeClass,charCode,charCodeClass)){breakOffset=charStartOffset,breakOffsetVisibleColumn=visibleColumn;break}}visibleColumn-=prevCharWidth,charCode=prevCharCode,charCodeClass=prevCharCodeClass}if(0!==breakOffset){const remainingWidthOfNextLine=wrappedLineBreakColumn-(forcedBreakOffsetVisibleColumn-breakOffsetVisibleColumn);if(remainingWidthOfNextLine<=tabSize){const charCodeAtForcedBreakOffset=lineText.charCodeAt(forcedBreakOffset);let charWidth;charWidth=strings.isHighSurrogate(charCodeAtForcedBreakOffset)?2:computeCharWidth(charCodeAtForcedBreakOffset,forcedBreakOffsetVisibleColumn,tabSize,columnsForFullWidthChar),remainingWidthOfNextLine-charWidth<0&&(breakOffset=0)}}if(hitATabCharacter){prevIndex--;continue}}if(0===breakOffset&&(breakOffset=forcedBreakOffset,breakOffsetVisibleColumn=forcedBreakOffsetVisibleColumn),breakOffset<=lastBreakingOffset){const charCode=lineText.charCodeAt(lastBreakingOffset);strings.isHighSurrogate(charCode)?(breakOffset=lastBreakingOffset+2,breakOffsetVisibleColumn=lastBreakingOffsetVisibleColumn+2):(breakOffset=lastBreakingOffset+1,breakOffsetVisibleColumn=lastBreakingOffsetVisibleColumn+computeCharWidth(charCode,lastBreakingOffsetVisibleColumn,tabSize,columnsForFullWidthChar))}for(lastBreakingOffset=breakOffset,breakingOffsets[breakingOffsetsCount]=breakOffset,lastBreakingOffsetVisibleColumn=breakOffsetVisibleColumn,breakingOffsetsVisibleColumn[breakingOffsetsCount]=breakOffsetVisibleColumn,breakingOffsetsCount++,breakingColumn=breakOffsetVisibleColumn+wrappedLineBreakColumn;prevIndex<0||prevIndex<prevLen&&prevBreakingOffsetsVisibleColumn[prevIndex]<breakOffsetVisibleColumn;)prevIndex++;let bestDistance=Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex]-breakingColumn);for(;prevIndex+1<prevLen;){const distance=Math.abs(prevBreakingOffsetsVisibleColumn[prevIndex+1]-breakingColumn);if(distance>=bestDistance)break;bestDistance=distance,prevIndex++}}return 0===breakingOffsetsCount?null:(breakingOffsets.length=breakingOffsetsCount,breakingOffsetsVisibleColumn.length=breakingOffsetsCount,arrPool1=previousBreakingData.breakOffsets,arrPool2=previousBreakingData.breakOffsetsVisibleColumn,previousBreakingData.breakOffsets=breakingOffsets,previousBreakingData.breakOffsetsVisibleColumn=breakingOffsetsVisibleColumn,previousBreakingData.wrappedTextIndentLength=wrappedTextIndentLength,previousBreakingData)}function createLineBreaks(classifier,_lineText,injectedTexts,tabSize,firstLineBreakColumn,columnsForFullWidthChar,wrappingIndent){const lineText=LineInjectedText.applyInjectedText(_lineText,injectedTexts);let injectionOptions,injectionOffsets;if(injectedTexts&&injectedTexts.length>0?(injectionOptions=injectedTexts.map((t=>t.options)),injectionOffsets=injectedTexts.map((text=>text.column-1))):(injectionOptions=null,injectionOffsets=null),-1===firstLineBreakColumn)return injectionOptions?new ModelLineProjectionData(injectionOffsets,injectionOptions,[lineText.length],[],0):null;const len=lineText.length;if(len<=1)return injectionOptions?new ModelLineProjectionData(injectionOffsets,injectionOptions,[lineText.length],[],0):null;const wrappedTextIndentLength=computeWrappedTextIndentLength(lineText,tabSize,firstLineBreakColumn,columnsForFullWidthChar,wrappingIndent),wrappedLineBreakColumn=firstLineBreakColumn-wrappedTextIndentLength,breakingOffsets=[],breakingOffsetsVisibleColumn=[];let breakingOffsetsCount=0,breakOffset=0,breakOffsetVisibleColumn=0,breakingColumn=firstLineBreakColumn,prevCharCode=lineText.charCodeAt(0),prevCharCodeClass=classifier.get(prevCharCode),visibleColumn=computeCharWidth(prevCharCode,0,tabSize,columnsForFullWidthChar),startOffset=1;strings.isHighSurrogate(prevCharCode)&&(visibleColumn+=1,prevCharCode=lineText.charCodeAt(1),prevCharCodeClass=classifier.get(prevCharCode),startOffset++);for(let i=startOffset;i<len;i++){const charStartOffset=i,charCode=lineText.charCodeAt(i);let charCodeClass,charWidth;strings.isHighSurrogate(charCode)?(i++,charCodeClass=0,charWidth=2):(charCodeClass=classifier.get(charCode),charWidth=computeCharWidth(charCode,visibleColumn,tabSize,columnsForFullWidthChar)),canBreak(prevCharCode,prevCharCodeClass,charCode,charCodeClass)&&(breakOffset=charStartOffset,breakOffsetVisibleColumn=visibleColumn),visibleColumn+=charWidth,visibleColumn>breakingColumn&&((0===breakOffset||visibleColumn-breakOffsetVisibleColumn>wrappedLineBreakColumn)&&(breakOffset=charStartOffset,breakOffsetVisibleColumn=visibleColumn-charWidth),breakingOffsets[breakingOffsetsCount]=breakOffset,breakingOffsetsVisibleColumn[breakingOffsetsCount]=breakOffsetVisibleColumn,breakingOffsetsCount++,breakingColumn=breakOffsetVisibleColumn+wrappedLineBreakColumn,breakOffset=0),prevCharCode=charCode,prevCharCodeClass=charCodeClass}return 0!==breakingOffsetsCount||injectedTexts&&0!==injectedTexts.length?(breakingOffsets[breakingOffsetsCount]=len,breakingOffsetsVisibleColumn[breakingOffsetsCount]=visibleColumn,new ModelLineProjectionData(injectionOffsets,injectionOptions,breakingOffsets,breakingOffsetsVisibleColumn,wrappedTextIndentLength)):null}function computeCharWidth(charCode,visibleColumn,tabSize,columnsForFullWidthChar){return 9===charCode?tabSize-visibleColumn%tabSize:strings.isFullWidthCharacter(charCode)||charCode<32?columnsForFullWidthChar:1}function tabCharacterWidth(visibleColumn,tabSize){return tabSize-visibleColumn%tabSize}function canBreak(prevCharCode,prevCharCodeClass,charCode,charCodeClass){return 32!==charCode&&(2===prevCharCodeClass&&2!==charCodeClass||1!==prevCharCodeClass&&1===charCodeClass||3===prevCharCodeClass&&2!==charCodeClass||3===charCodeClass&&1!==prevCharCodeClass)}function computeWrappedTextIndentLength(lineText,tabSize,firstLineBreakColumn,columnsForFullWidthChar,wrappingIndent){let wrappedTextIndentLength=0;if(0!==wrappingIndent){const firstNonWhitespaceIndex=strings.firstNonWhitespaceIndex(lineText);if(-1!==firstNonWhitespaceIndex){for(let i=0;i<firstNonWhitespaceIndex;i++){wrappedTextIndentLength+=9===lineText.charCodeAt(i)?tabCharacterWidth(wrappedTextIndentLength,tabSize):1}const numberOfAdditionalTabs=3===wrappingIndent?2:2===wrappingIndent?1:0;for(let i=0;i<numberOfAdditionalTabs;i++){wrappedTextIndentLength+=tabCharacterWidth(wrappedTextIndentLength,tabSize)}wrappedTextIndentLength+columnsForFullWidthChar>firstLineBreakColumn&&(wrappedTextIndentLength=0)}}return wrappedTextIndentLength}