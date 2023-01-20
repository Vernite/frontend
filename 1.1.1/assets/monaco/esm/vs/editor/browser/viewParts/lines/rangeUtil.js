import{FloatHorizontalRange}from"../../view/renderingContext.js";export class RangeUtil{static _createRange(){return this._handyReadyRange||(this._handyReadyRange=document.createRange()),this._handyReadyRange}static _detachRange(range,endNode){range.selectNodeContents(endNode)}static _readClientRects(startElement,startOffset,endElement,endOffset,endNode){const range=this._createRange();try{return range.setStart(startElement,startOffset),range.setEnd(endElement,endOffset),range.getClientRects()}catch(e){return null}finally{this._detachRange(range,endNode)}}static _mergeAdjacentRanges(ranges){if(1===ranges.length)return ranges;ranges.sort(FloatHorizontalRange.compare);const result=[];let resultLen=0,prev=ranges[0];for(let i=1,len=ranges.length;i<len;i++){const range=ranges[i];prev.left+prev.width+.9>=range.left?prev.width=Math.max(prev.width,range.left+range.width-prev.left):(result[resultLen++]=prev,prev=range)}return result[resultLen++]=prev,result}static _createHorizontalRangesFromClientRects(clientRects,clientRectDeltaLeft,clientRectScale){if(!clientRects||0===clientRects.length)return null;const result=[];for(let i=0,len=clientRects.length;i<len;i++){const clientRect=clientRects[i];result[i]=new FloatHorizontalRange(Math.max(0,(clientRect.left-clientRectDeltaLeft)/clientRectScale),clientRect.width/clientRectScale)}return this._mergeAdjacentRanges(result)}static readHorizontalRanges(domNode,startChildIndex,startOffset,endChildIndex,endOffset,clientRectDeltaLeft,clientRectScale,endNode){const max=domNode.children.length-1;if(0>max)return null;if((startChildIndex=Math.min(max,Math.max(0,startChildIndex)))===(endChildIndex=Math.min(max,Math.max(0,endChildIndex)))&&startOffset===endOffset&&0===startOffset&&!domNode.children[startChildIndex].firstChild){const clientRects=domNode.children[startChildIndex].getClientRects();return this._createHorizontalRangesFromClientRects(clientRects,clientRectDeltaLeft,clientRectScale)}startChildIndex!==endChildIndex&&endChildIndex>0&&0===endOffset&&(endChildIndex--,endOffset=1073741824);let startElement=domNode.children[startChildIndex].firstChild,endElement=domNode.children[endChildIndex].firstChild;if(startElement&&endElement||(!startElement&&0===startOffset&&startChildIndex>0&&(startElement=domNode.children[startChildIndex-1].firstChild,startOffset=1073741824),!endElement&&0===endOffset&&endChildIndex>0&&(endElement=domNode.children[endChildIndex-1].firstChild,endOffset=1073741824)),!startElement||!endElement)return null;startOffset=Math.min(startElement.textContent.length,Math.max(0,startOffset)),endOffset=Math.min(endElement.textContent.length,Math.max(0,endOffset));const clientRects=this._readClientRects(startElement,startOffset,endElement,endOffset,endNode);return this._createHorizontalRangesFromClientRects(clientRects,clientRectDeltaLeft,clientRectScale)}}