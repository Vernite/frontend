import*as browser from"../../../../base/browser/browser.js";import{createFastDomNode}from"../../../../base/browser/fastDomNode.js";import*as platform from"../../../../base/common/platform.js";import{RangeUtil}from"./rangeUtil.js";import{FloatHorizontalRange,VisibleRanges}from"../../view/renderingContext.js";import{LineDecoration}from"../../../common/viewLayout/lineDecorations.js";import{RenderLineInput,renderViewLine,LineRange,DomPosition}from"../../../common/viewLayout/viewLineRenderer.js";import{isHighContrast}from"../../../../platform/theme/common/theme.js";import{EditorFontLigatures}from"../../../common/config/editorOptions.js";const canUseFastRenderedViewLine=!!platform.isNative||!(platform.isLinux||browser.isFirefox||browser.isSafari);let monospaceAssumptionsAreValid=!0;export class DomReadingContext{constructor(domNode,endNode){this._domNode=domNode,this._clientRectDeltaLeft=0,this._clientRectScale=1,this._clientRectRead=!1,this.endNode=endNode}readClientRect(){if(!this._clientRectRead){this._clientRectRead=!0;const rect=this._domNode.getBoundingClientRect();this._clientRectDeltaLeft=rect.left,this._clientRectScale=rect.width/this._domNode.offsetWidth}}get clientRectDeltaLeft(){return this._clientRectRead||this.readClientRect(),this._clientRectDeltaLeft}get clientRectScale(){return this._clientRectRead||this.readClientRect(),this._clientRectScale}}export class ViewLineOptions{constructor(config,themeType){this.themeType=themeType;const options=config.options,fontInfo=options.get(46);this.renderWhitespace=options.get(90),this.renderControlCharacters=options.get(85),this.spaceWidth=fontInfo.spaceWidth,this.middotWidth=fontInfo.middotWidth,this.wsmiddotWidth=fontInfo.wsmiddotWidth,this.useMonospaceOptimizations=fontInfo.isMonospace&&!options.get(29),this.canUseHalfwidthRightwardsArrow=fontInfo.canUseHalfwidthRightwardsArrow,this.lineHeight=options.get(61),this.stopRenderingLineAfter=options.get(107),this.fontLigatures=options.get(47)}equals(other){return this.themeType===other.themeType&&this.renderWhitespace===other.renderWhitespace&&this.renderControlCharacters===other.renderControlCharacters&&this.spaceWidth===other.spaceWidth&&this.middotWidth===other.middotWidth&&this.wsmiddotWidth===other.wsmiddotWidth&&this.useMonospaceOptimizations===other.useMonospaceOptimizations&&this.canUseHalfwidthRightwardsArrow===other.canUseHalfwidthRightwardsArrow&&this.lineHeight===other.lineHeight&&this.stopRenderingLineAfter===other.stopRenderingLineAfter&&this.fontLigatures===other.fontLigatures}}export class ViewLine{constructor(options){this._options=options,this._isMaybeInvalid=!0,this._renderedViewLine=null}getDomNode(){return this._renderedViewLine&&this._renderedViewLine.domNode?this._renderedViewLine.domNode.domNode:null}setDomNode(domNode){if(!this._renderedViewLine)throw new Error("I have no rendered view line to set the dom node to...");this._renderedViewLine.domNode=createFastDomNode(domNode)}onContentChanged(){this._isMaybeInvalid=!0}onTokensChanged(){this._isMaybeInvalid=!0}onDecorationsChanged(){this._isMaybeInvalid=!0}onOptionsChanged(newOptions){this._isMaybeInvalid=!0,this._options=newOptions}onSelectionChanged(){return!(!isHighContrast(this._options.themeType)&&"selection"!==this._options.renderWhitespace)&&(this._isMaybeInvalid=!0,!0)}renderLine(lineNumber,deltaTop,viewportData,sb){if(!1===this._isMaybeInvalid)return!1;this._isMaybeInvalid=!1;const lineData=viewportData.getViewLineRenderingData(lineNumber),options=this._options,actualInlineDecorations=LineDecoration.filter(lineData.inlineDecorations,lineNumber,lineData.minColumn,lineData.maxColumn);let selectionsOnLine=null;if(isHighContrast(options.themeType)||"selection"===this._options.renderWhitespace){const selections=viewportData.selections;for(const selection of selections){if(selection.endLineNumber<lineNumber||selection.startLineNumber>lineNumber)continue;const startColumn=selection.startLineNumber===lineNumber?selection.startColumn:lineData.minColumn,endColumn=selection.endLineNumber===lineNumber?selection.endColumn:lineData.maxColumn;startColumn<endColumn&&(isHighContrast(options.themeType)||"selection"!==this._options.renderWhitespace?actualInlineDecorations.push(new LineDecoration(startColumn,endColumn,"inline-selected-text",0)):(selectionsOnLine||(selectionsOnLine=[]),selectionsOnLine.push(new LineRange(startColumn-1,endColumn-1))))}}const renderLineInput=new RenderLineInput(options.useMonospaceOptimizations,options.canUseHalfwidthRightwardsArrow,lineData.content,lineData.continuesWithWrappedLine,lineData.isBasicASCII,lineData.containsRTL,lineData.minColumn-1,lineData.tokens,actualInlineDecorations,lineData.tabSize,lineData.startVisibleColumn,options.spaceWidth,options.middotWidth,options.wsmiddotWidth,options.stopRenderingLineAfter,options.renderWhitespace,options.renderControlCharacters,options.fontLigatures!==EditorFontLigatures.OFF,selectionsOnLine);if(this._renderedViewLine&&this._renderedViewLine.input.equals(renderLineInput))return!1;sb.appendASCIIString('<div style="top:'),sb.appendASCIIString(String(deltaTop)),sb.appendASCIIString("px;height:"),sb.appendASCIIString(String(this._options.lineHeight)),sb.appendASCIIString('px;" class="'),sb.appendASCIIString(ViewLine.CLASS_NAME),sb.appendASCIIString('">');const output=renderViewLine(renderLineInput,sb);sb.appendASCIIString("</div>");let renderedViewLine=null;return monospaceAssumptionsAreValid&&canUseFastRenderedViewLine&&lineData.isBasicASCII&&options.useMonospaceOptimizations&&0===output.containsForeignElements&&lineData.content.length<300&&renderLineInput.lineTokens.getCount()<100&&(renderedViewLine=new FastRenderedViewLine(this._renderedViewLine?this._renderedViewLine.domNode:null,renderLineInput,output.characterMapping)),renderedViewLine||(renderedViewLine=createRenderedLine(this._renderedViewLine?this._renderedViewLine.domNode:null,renderLineInput,output.characterMapping,output.containsRTL,output.containsForeignElements)),this._renderedViewLine=renderedViewLine,!0}layoutLine(lineNumber,deltaTop){this._renderedViewLine&&this._renderedViewLine.domNode&&(this._renderedViewLine.domNode.setTop(deltaTop),this._renderedViewLine.domNode.setHeight(this._options.lineHeight))}getWidth(){return this._renderedViewLine?this._renderedViewLine.getWidth():0}getWidthIsFast(){return!this._renderedViewLine||this._renderedViewLine.getWidthIsFast()}needsMonospaceFontCheck(){return!!this._renderedViewLine&&this._renderedViewLine instanceof FastRenderedViewLine}monospaceAssumptionsAreValid(){return this._renderedViewLine&&this._renderedViewLine instanceof FastRenderedViewLine?this._renderedViewLine.monospaceAssumptionsAreValid():monospaceAssumptionsAreValid}onMonospaceAssumptionsInvalidated(){this._renderedViewLine&&this._renderedViewLine instanceof FastRenderedViewLine&&(this._renderedViewLine=this._renderedViewLine.toSlowRenderedLine())}getVisibleRangesForRange(lineNumber,startColumn,endColumn,context){if(!this._renderedViewLine)return null;startColumn=Math.min(this._renderedViewLine.input.lineContent.length+1,Math.max(1,startColumn)),endColumn=Math.min(this._renderedViewLine.input.lineContent.length+1,Math.max(1,endColumn));const stopRenderingLineAfter=this._renderedViewLine.input.stopRenderingLineAfter;let outsideRenderedLine=!1;-1!==stopRenderingLineAfter&&startColumn>stopRenderingLineAfter+1&&endColumn>stopRenderingLineAfter+1&&(outsideRenderedLine=!0),-1!==stopRenderingLineAfter&&startColumn>stopRenderingLineAfter+1&&(startColumn=stopRenderingLineAfter+1),-1!==stopRenderingLineAfter&&endColumn>stopRenderingLineAfter+1&&(endColumn=stopRenderingLineAfter+1);const horizontalRanges=this._renderedViewLine.getVisibleRangesForRange(lineNumber,startColumn,endColumn,context);return horizontalRanges&&horizontalRanges.length>0?new VisibleRanges(outsideRenderedLine,horizontalRanges):null}getColumnOfNodeOffset(lineNumber,spanNode,offset){return this._renderedViewLine?this._renderedViewLine.getColumnOfNodeOffset(lineNumber,spanNode,offset):1}}ViewLine.CLASS_NAME="view-line";class FastRenderedViewLine{constructor(domNode,renderLineInput,characterMapping){this.domNode=domNode,this.input=renderLineInput,this._characterMapping=characterMapping,this._charWidth=renderLineInput.spaceWidth}getWidth(){return Math.round(this._getCharPosition(this._characterMapping.length))}getWidthIsFast(){return!0}monospaceAssumptionsAreValid(){if(!this.domNode)return monospaceAssumptionsAreValid;const expectedWidth=this.getWidth(),actualWidth=this.domNode.domNode.firstChild.offsetWidth;return Math.abs(expectedWidth-actualWidth)>=2&&(console.warn("monospace assumptions have been violated, therefore disabling monospace optimizations!"),monospaceAssumptionsAreValid=!1),monospaceAssumptionsAreValid}toSlowRenderedLine(){return createRenderedLine(this.domNode,this.input,this._characterMapping,!1,0)}getVisibleRangesForRange(lineNumber,startColumn,endColumn,context){const startPosition=this._getCharPosition(startColumn),endPosition=this._getCharPosition(endColumn);return[new FloatHorizontalRange(startPosition,endPosition-startPosition)]}_getCharPosition(column){const horizontalOffset=this._characterMapping.getHorizontalOffset(column);return this._charWidth*horizontalOffset}getColumnOfNodeOffset(lineNumber,spanNode,offset){const spanNodeTextContentLength=spanNode.textContent.length;let spanIndex=-1;for(;spanNode;)spanNode=spanNode.previousSibling,spanIndex++;return this._characterMapping.getColumn(new DomPosition(spanIndex,offset),spanNodeTextContentLength)}}class RenderedViewLine{constructor(domNode,renderLineInput,characterMapping,containsRTL,containsForeignElements){if(this.domNode=domNode,this.input=renderLineInput,this._characterMapping=characterMapping,this._isWhitespaceOnly=/^\s*$/.test(renderLineInput.lineContent),this._containsForeignElements=containsForeignElements,this._cachedWidth=-1,this._pixelOffsetCache=null,!containsRTL||0===this._characterMapping.length){this._pixelOffsetCache=new Float32Array(Math.max(2,this._characterMapping.length+1));for(let column=0,len=this._characterMapping.length;column<=len;column++)this._pixelOffsetCache[column]=-1}}_getReadingTarget(myDomNode){return myDomNode.domNode.firstChild}getWidth(){return this.domNode?(-1===this._cachedWidth&&(this._cachedWidth=this._getReadingTarget(this.domNode).offsetWidth),this._cachedWidth):0}getWidthIsFast(){return-1!==this._cachedWidth}getVisibleRangesForRange(lineNumber,startColumn,endColumn,context){if(!this.domNode)return null;if(null!==this._pixelOffsetCache){const startOffset=this._readPixelOffset(this.domNode,lineNumber,startColumn,context);if(-1===startOffset)return null;const endOffset=this._readPixelOffset(this.domNode,lineNumber,endColumn,context);return-1===endOffset?null:[new FloatHorizontalRange(startOffset,endOffset-startOffset)]}return this._readVisibleRangesForRange(this.domNode,lineNumber,startColumn,endColumn,context)}_readVisibleRangesForRange(domNode,lineNumber,startColumn,endColumn,context){if(startColumn===endColumn){const pixelOffset=this._readPixelOffset(domNode,lineNumber,startColumn,context);return-1===pixelOffset?null:[new FloatHorizontalRange(pixelOffset,0)]}return this._readRawVisibleRangesForRange(domNode,startColumn,endColumn,context)}_readPixelOffset(domNode,lineNumber,column,context){if(0===this._characterMapping.length){if(0===this._containsForeignElements)return 0;if(2===this._containsForeignElements)return 0;if(1===this._containsForeignElements)return this.getWidth();const readingTarget=this._getReadingTarget(domNode);return readingTarget.firstChild?readingTarget.firstChild.offsetWidth:0}if(null!==this._pixelOffsetCache){const cachedPixelOffset=this._pixelOffsetCache[column];if(-1!==cachedPixelOffset)return cachedPixelOffset;const result=this._actualReadPixelOffset(domNode,lineNumber,column,context);return this._pixelOffsetCache[column]=result,result}return this._actualReadPixelOffset(domNode,lineNumber,column,context)}_actualReadPixelOffset(domNode,lineNumber,column,context){if(0===this._characterMapping.length){const r=RangeUtil.readHorizontalRanges(this._getReadingTarget(domNode),0,0,0,0,context.clientRectDeltaLeft,context.clientRectScale,context.endNode);return r&&0!==r.length?r[0].left:-1}if(column===this._characterMapping.length&&this._isWhitespaceOnly&&0===this._containsForeignElements)return this.getWidth();const domPosition=this._characterMapping.getDomPosition(column),r=RangeUtil.readHorizontalRanges(this._getReadingTarget(domNode),domPosition.partIndex,domPosition.charIndex,domPosition.partIndex,domPosition.charIndex,context.clientRectDeltaLeft,context.clientRectScale,context.endNode);if(!r||0===r.length)return-1;const result=r[0].left;if(this.input.isBasicASCII){const horizontalOffset=this._characterMapping.getHorizontalOffset(column),expectedResult=Math.round(this.input.spaceWidth*horizontalOffset);if(Math.abs(expectedResult-result)<=1)return expectedResult}return result}_readRawVisibleRangesForRange(domNode,startColumn,endColumn,context){if(1===startColumn&&endColumn===this._characterMapping.length)return[new FloatHorizontalRange(0,this.getWidth())];const startDomPosition=this._characterMapping.getDomPosition(startColumn),endDomPosition=this._characterMapping.getDomPosition(endColumn);return RangeUtil.readHorizontalRanges(this._getReadingTarget(domNode),startDomPosition.partIndex,startDomPosition.charIndex,endDomPosition.partIndex,endDomPosition.charIndex,context.clientRectDeltaLeft,context.clientRectScale,context.endNode)}getColumnOfNodeOffset(lineNumber,spanNode,offset){const spanNodeTextContentLength=spanNode.textContent.length;let spanIndex=-1;for(;spanNode;)spanNode=spanNode.previousSibling,spanIndex++;return this._characterMapping.getColumn(new DomPosition(spanIndex,offset),spanNodeTextContentLength)}}class WebKitRenderedViewLine extends RenderedViewLine{_readVisibleRangesForRange(domNode,lineNumber,startColumn,endColumn,context){const output=super._readVisibleRangesForRange(domNode,lineNumber,startColumn,endColumn,context);if(!output||0===output.length||startColumn===endColumn||1===startColumn&&endColumn===this._characterMapping.length)return output;if(!this.input.containsRTL){const endPixelOffset=this._readPixelOffset(domNode,lineNumber,endColumn,context);if(-1!==endPixelOffset){const lastRange=output[output.length-1];lastRange.left<endPixelOffset&&(lastRange.width=endPixelOffset-lastRange.left)}}return output}}const createRenderedLine=browser.isWebKit?createWebKitRenderedLine:createNormalRenderedLine;function createWebKitRenderedLine(domNode,renderLineInput,characterMapping,containsRTL,containsForeignElements){return new WebKitRenderedViewLine(domNode,renderLineInput,characterMapping,containsRTL,containsForeignElements)}function createNormalRenderedLine(domNode,renderLineInput,characterMapping,containsRTL,containsForeignElements){return new RenderedViewLine(domNode,renderLineInput,characterMapping,containsRTL,containsForeignElements)}