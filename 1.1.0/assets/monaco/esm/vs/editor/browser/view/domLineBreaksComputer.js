var _a;import{createStringBuilder}from"../../common/core/stringBuilder.js";import*as strings from"../../../base/common/strings.js";import{applyFontInfo}from"../config/domFontInfo.js";import{LineInjectedText}from"../../common/textModelEvents.js";import{ModelLineProjectionData}from"../../common/modelLineProjectionData.js";const ttPolicy=null===(_a=window.trustedTypes)||void 0===_a?void 0:_a.createPolicy("domLineBreaksComputer",{createHTML:value=>value});export class DOMLineBreaksComputerFactory{static create(){return new DOMLineBreaksComputerFactory}constructor(){}createLineBreaksComputer(fontInfo,tabSize,wrappingColumn,wrappingIndent){const requests=[],injectedTexts=[];return{addRequest:(lineText,injectedText,previousLineBreakData)=>{requests.push(lineText),injectedTexts.push(injectedText)},finalize:()=>createLineBreaks(requests,fontInfo,tabSize,wrappingColumn,wrappingIndent,injectedTexts)}}}function createLineBreaks(requests,fontInfo,tabSize,firstLineBreakColumn,wrappingIndent,injectedTextsPerLine){var _a;function createEmptyLineBreakWithPossiblyInjectedText(requestIdx){const injectedTexts=injectedTextsPerLine[requestIdx];if(injectedTexts){const lineText=LineInjectedText.applyInjectedText(requests[requestIdx],injectedTexts),injectionOptions=injectedTexts.map((t=>t.options)),injectionOffsets=injectedTexts.map((text=>text.column-1));return new ModelLineProjectionData(injectionOffsets,injectionOptions,[lineText.length],[],0)}return null}if(-1===firstLineBreakColumn){const result=[];for(let i=0,len=requests.length;i<len;i++)result[i]=createEmptyLineBreakWithPossiblyInjectedText(i);return result}const overallWidth=Math.round(firstLineBreakColumn*fontInfo.typicalHalfwidthCharacterWidth),additionalIndent=3===wrappingIndent?2:2===wrappingIndent?1:0,additionalIndentSize=Math.round(tabSize*additionalIndent),additionalIndentLength=Math.ceil(fontInfo.spaceWidth*additionalIndentSize),containerDomNode=document.createElement("div");applyFontInfo(containerDomNode,fontInfo);const sb=createStringBuilder(1e4),firstNonWhitespaceIndices=[],wrappedTextIndentLengths=[],renderLineContents=[],allCharOffsets=[],allVisibleColumns=[];for(let i=0;i<requests.length;i++){const lineContent=LineInjectedText.applyInjectedText(requests[i],injectedTextsPerLine[i]);let firstNonWhitespaceIndex=0,wrappedTextIndentLength=0,width=overallWidth;if(0!==wrappingIndent)if(firstNonWhitespaceIndex=strings.firstNonWhitespaceIndex(lineContent),-1===firstNonWhitespaceIndex)firstNonWhitespaceIndex=0;else{for(let i=0;i<firstNonWhitespaceIndex;i++){wrappedTextIndentLength+=9===lineContent.charCodeAt(i)?tabSize-wrappedTextIndentLength%tabSize:1}const indentWidth=Math.ceil(fontInfo.spaceWidth*wrappedTextIndentLength);indentWidth+fontInfo.typicalFullwidthCharacterWidth>overallWidth?(firstNonWhitespaceIndex=0,wrappedTextIndentLength=0):width=overallWidth-indentWidth}const renderLineContent=lineContent.substr(firstNonWhitespaceIndex),tmp=renderLine(renderLineContent,wrappedTextIndentLength,tabSize,width,sb,additionalIndentLength);firstNonWhitespaceIndices[i]=firstNonWhitespaceIndex,wrappedTextIndentLengths[i]=wrappedTextIndentLength,renderLineContents[i]=renderLineContent,allCharOffsets[i]=tmp[0],allVisibleColumns[i]=tmp[1]}const html=sb.build(),trustedhtml=null!==(_a=null==ttPolicy?void 0:ttPolicy.createHTML(html))&&void 0!==_a?_a:html;containerDomNode.innerHTML=trustedhtml,containerDomNode.style.position="absolute",containerDomNode.style.top="10000",containerDomNode.style.wordWrap="break-word",document.body.appendChild(containerDomNode);const range=document.createRange(),lineDomNodes=Array.prototype.slice.call(containerDomNode.children,0),result=[];for(let i=0;i<requests.length;i++){const breakOffsets=readLineBreaks(range,lineDomNodes[i],renderLineContents[i],allCharOffsets[i]);if(null===breakOffsets){result[i]=createEmptyLineBreakWithPossiblyInjectedText(i);continue}const firstNonWhitespaceIndex=firstNonWhitespaceIndices[i],wrappedTextIndentLength=wrappedTextIndentLengths[i]+additionalIndentSize,visibleColumns=allVisibleColumns[i],breakOffsetsVisibleColumn=[];for(let j=0,len=breakOffsets.length;j<len;j++)breakOffsetsVisibleColumn[j]=visibleColumns[breakOffsets[j]];if(0!==firstNonWhitespaceIndex)for(let j=0,len=breakOffsets.length;j<len;j++)breakOffsets[j]+=firstNonWhitespaceIndex;let injectionOptions,injectionOffsets;const curInjectedTexts=injectedTextsPerLine[i];curInjectedTexts?(injectionOptions=curInjectedTexts.map((t=>t.options)),injectionOffsets=curInjectedTexts.map((text=>text.column-1))):(injectionOptions=null,injectionOffsets=null),result[i]=new ModelLineProjectionData(injectionOffsets,injectionOptions,breakOffsets,breakOffsetsVisibleColumn,wrappedTextIndentLength)}return document.body.removeChild(containerDomNode),result}function renderLine(lineContent,initialVisibleColumn,tabSize,width,sb,wrappingIndentLength){if(0!==wrappingIndentLength){const hangingOffset=String(wrappingIndentLength);sb.appendASCIIString('<div style="text-indent: -'),sb.appendASCIIString(hangingOffset),sb.appendASCIIString("px; padding-left: "),sb.appendASCIIString(hangingOffset),sb.appendASCIIString("px; box-sizing: border-box; width:")}else sb.appendASCIIString('<div style="width:');sb.appendASCIIString(String(width)),sb.appendASCIIString('px;">');const len=lineContent.length;let visibleColumn=initialVisibleColumn,charOffset=0;const charOffsets=[],visibleColumns=[];let nextCharCode=0<len?lineContent.charCodeAt(0):0;sb.appendASCIIString("<span>");for(let charIndex=0;charIndex<len;charIndex++){0!==charIndex&&charIndex%16384==0&&sb.appendASCIIString("</span><span>"),charOffsets[charIndex]=charOffset,visibleColumns[charIndex]=visibleColumn;const charCode=nextCharCode;nextCharCode=charIndex+1<len?lineContent.charCodeAt(charIndex+1):0;let producedCharacters=1,charWidth=1;switch(charCode){case 9:producedCharacters=tabSize-visibleColumn%tabSize,charWidth=producedCharacters;for(let space=1;space<=producedCharacters;space++)space<producedCharacters?sb.write1(160):sb.appendASCII(32);break;case 32:32===nextCharCode?sb.write1(160):sb.appendASCII(32);break;case 60:sb.appendASCIIString("&lt;");break;case 62:sb.appendASCIIString("&gt;");break;case 38:sb.appendASCIIString("&amp;");break;case 0:sb.appendASCIIString("&#00;");break;case 65279:case 8232:case 8233:case 133:sb.write1(65533);break;default:strings.isFullWidthCharacter(charCode)&&charWidth++,charCode<32?sb.write1(9216+charCode):sb.write1(charCode)}charOffset+=producedCharacters,visibleColumn+=charWidth}return sb.appendASCIIString("</span>"),charOffsets[lineContent.length]=charOffset,visibleColumns[lineContent.length]=visibleColumn,sb.appendASCIIString("</div>"),[charOffsets,visibleColumns]}function readLineBreaks(range,lineDomNode,lineContent,charOffsets){if(lineContent.length<=1)return null;const spans=Array.prototype.slice.call(lineDomNode.children,0),breakOffsets=[];try{discoverBreaks(range,spans,charOffsets,0,null,lineContent.length-1,null,breakOffsets)}catch(err){return console.log(err),null}return 0===breakOffsets.length?null:(breakOffsets.push(lineContent.length),breakOffsets)}function discoverBreaks(range,spans,charOffsets,low,lowRects,high,highRects,result){if(low===high)return;if(lowRects=lowRects||readClientRect(range,spans,charOffsets[low],charOffsets[low+1]),highRects=highRects||readClientRect(range,spans,charOffsets[high],charOffsets[high+1]),Math.abs(lowRects[0].top-highRects[0].top)<=.1)return;if(low+1===high)return void result.push(high);const mid=low+(high-low)/2|0,midRects=readClientRect(range,spans,charOffsets[mid],charOffsets[mid+1]);discoverBreaks(range,spans,charOffsets,low,lowRects,mid,midRects,result),discoverBreaks(range,spans,charOffsets,mid,midRects,high,highRects,result)}function readClientRect(range,spans,startOffset,endOffset){return range.setStart(spans[startOffset/16384|0].firstChild,startOffset%16384),range.setEnd(spans[endOffset/16384|0].firstChild,endOffset%16384),range.getClientRects()}