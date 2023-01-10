import{PageCoordinates}from"../editorDom.js";import{PartFingerprints}from"../view/viewPart.js";import{ViewLine}from"../viewParts/lines/viewLine.js";import{Position}from"../../common/core/position.js";import{Range as EditorRange}from"../../common/core/range.js";import{CursorColumns}from"../../common/core/cursorColumns.js";import*as dom from"../../../base/browser/dom.js";import{AtomicTabMoveOperations}from"../../common/cursor/cursorAtomicMoveOperations.js";class UnknownHitTestResult{constructor(hitTarget=null){this.hitTarget=hitTarget,this.type=0}}class ContentHitTestResult{constructor(position,spanNode,injectedText){this.position=position,this.spanNode=spanNode,this.injectedText=injectedText,this.type=1}}var HitTestResult;!function(HitTestResult){HitTestResult.createFromDOMInfo=function createFromDOMInfo(ctx,spanNode,offset){const position=ctx.getPositionFromDOMInfo(spanNode,offset);return position?new ContentHitTestResult(position,spanNode,null):new UnknownHitTestResult(spanNode)}}(HitTestResult||(HitTestResult={}));export class PointerHandlerLastRenderData{constructor(lastViewCursorsRenderData,lastTextareaPosition){this.lastViewCursorsRenderData=lastViewCursorsRenderData,this.lastTextareaPosition=lastTextareaPosition}}export class MouseTarget{static _deduceRage(position,range=null){return!range&&position?new EditorRange(position.lineNumber,position.column,position.lineNumber,position.column):null!=range?range:null}static createUnknown(element,mouseColumn,position){return{type:0,element,mouseColumn,position,range:this._deduceRage(position)}}static createTextarea(element,mouseColumn){return{type:1,element,mouseColumn,position:null,range:null}}static createMargin(type,element,mouseColumn,position,range,detail){return{type,element,mouseColumn,position,range,detail}}static createViewZone(type,element,mouseColumn,position,detail){return{type,element,mouseColumn,position,range:this._deduceRage(position),detail}}static createContentText(element,mouseColumn,position,range,detail){return{type:6,element,mouseColumn,position,range:this._deduceRage(position,range),detail}}static createContentEmpty(element,mouseColumn,position,detail){return{type:7,element,mouseColumn,position,range:this._deduceRage(position),detail}}static createContentWidget(element,mouseColumn,detail){return{type:9,element,mouseColumn,position:null,range:null,detail}}static createScrollbar(element,mouseColumn,position){return{type:11,element,mouseColumn,position,range:this._deduceRage(position)}}static createOverlayWidget(element,mouseColumn,detail){return{type:12,element,mouseColumn,position:null,range:null,detail}}static createOutsideEditor(mouseColumn,position){return{type:13,element:null,mouseColumn,position,range:this._deduceRage(position)}}static _typeToString(type){return 1===type?"TEXTAREA":2===type?"GUTTER_GLYPH_MARGIN":3===type?"GUTTER_LINE_NUMBERS":4===type?"GUTTER_LINE_DECORATIONS":5===type?"GUTTER_VIEW_ZONE":6===type?"CONTENT_TEXT":7===type?"CONTENT_EMPTY":8===type?"CONTENT_VIEW_ZONE":9===type?"CONTENT_WIDGET":10===type?"OVERVIEW_RULER":11===type?"SCROLLBAR":12===type?"OVERLAY_WIDGET":"UNKNOWN"}static toString(target){return this._typeToString(target.type)+": "+target.position+" - "+target.range+" - "+JSON.stringify(target.detail)}}class ElementPath{static isTextArea(path){return 2===path.length&&3===path[0]&&6===path[1]}static isChildOfViewLines(path){return path.length>=4&&3===path[0]&&7===path[3]}static isStrictChildOfViewLines(path){return path.length>4&&3===path[0]&&7===path[3]}static isChildOfScrollableElement(path){return path.length>=2&&3===path[0]&&5===path[1]}static isChildOfMinimap(path){return path.length>=2&&3===path[0]&&8===path[1]}static isChildOfContentWidgets(path){return path.length>=4&&3===path[0]&&1===path[3]}static isChildOfOverflowingContentWidgets(path){return path.length>=1&&2===path[0]}static isChildOfOverlayWidgets(path){return path.length>=2&&3===path[0]&&4===path[1]}}export class HitTestContext{constructor(context,viewHelper,lastRenderData){this.viewModel=context.viewModel;const options=context.configuration.options;this.layoutInfo=options.get(133),this.viewDomNode=viewHelper.viewDomNode,this.lineHeight=options.get(61),this.stickyTabStops=options.get(106),this.typicalHalfwidthCharacterWidth=options.get(46).typicalHalfwidthCharacterWidth,this.lastRenderData=lastRenderData,this._context=context,this._viewHelper=viewHelper}getZoneAtCoord(mouseVerticalOffset){return HitTestContext.getZoneAtCoord(this._context,mouseVerticalOffset)}static getZoneAtCoord(context,mouseVerticalOffset){const viewZoneWhitespace=context.viewLayout.getWhitespaceAtVerticalOffset(mouseVerticalOffset);if(viewZoneWhitespace){const viewZoneMiddle=viewZoneWhitespace.verticalOffset+viewZoneWhitespace.height/2,lineCount=context.viewModel.getLineCount();let position,positionBefore=null,positionAfter=null;return viewZoneWhitespace.afterLineNumber!==lineCount&&(positionAfter=new Position(viewZoneWhitespace.afterLineNumber+1,1)),viewZoneWhitespace.afterLineNumber>0&&(positionBefore=new Position(viewZoneWhitespace.afterLineNumber,context.viewModel.getLineMaxColumn(viewZoneWhitespace.afterLineNumber))),position=null===positionAfter?positionBefore:null===positionBefore?positionAfter:mouseVerticalOffset<viewZoneMiddle?positionBefore:positionAfter,{viewZoneId:viewZoneWhitespace.id,afterLineNumber:viewZoneWhitespace.afterLineNumber,positionBefore,positionAfter,position}}return null}getFullLineRangeAtCoord(mouseVerticalOffset){if(this._context.viewLayout.isAfterLines(mouseVerticalOffset)){const lineNumber=this._context.viewModel.getLineCount(),maxLineColumn=this._context.viewModel.getLineMaxColumn(lineNumber);return{range:new EditorRange(lineNumber,maxLineColumn,lineNumber,maxLineColumn),isAfterLines:!0}}const lineNumber=this._context.viewLayout.getLineNumberAtVerticalOffset(mouseVerticalOffset),maxLineColumn=this._context.viewModel.getLineMaxColumn(lineNumber);return{range:new EditorRange(lineNumber,1,lineNumber,maxLineColumn),isAfterLines:!1}}getLineNumberAtVerticalOffset(mouseVerticalOffset){return this._context.viewLayout.getLineNumberAtVerticalOffset(mouseVerticalOffset)}isAfterLines(mouseVerticalOffset){return this._context.viewLayout.isAfterLines(mouseVerticalOffset)}isInTopPadding(mouseVerticalOffset){return this._context.viewLayout.isInTopPadding(mouseVerticalOffset)}isInBottomPadding(mouseVerticalOffset){return this._context.viewLayout.isInBottomPadding(mouseVerticalOffset)}getVerticalOffsetForLineNumber(lineNumber){return this._context.viewLayout.getVerticalOffsetForLineNumber(lineNumber)}findAttribute(element,attr){return HitTestContext._findAttribute(element,attr,this._viewHelper.viewDomNode)}static _findAttribute(element,attr,stopAt){for(;element&&element!==document.body;){if(element.hasAttribute&&element.hasAttribute(attr))return element.getAttribute(attr);if(element===stopAt)return null;element=element.parentNode}return null}getLineWidth(lineNumber){return this._viewHelper.getLineWidth(lineNumber)}visibleRangeForPosition(lineNumber,column){return this._viewHelper.visibleRangeForPosition(lineNumber,column)}getPositionFromDOMInfo(spanNode,offset){return this._viewHelper.getPositionFromDOMInfo(spanNode,offset)}getCurrentScrollTop(){return this._context.viewLayout.getCurrentScrollTop()}getCurrentScrollLeft(){return this._context.viewLayout.getCurrentScrollLeft()}}class BareHitTestRequest{constructor(ctx,editorPos,pos,relativePos){this.editorPos=editorPos,this.pos=pos,this.relativePos=relativePos,this.mouseVerticalOffset=Math.max(0,ctx.getCurrentScrollTop()+this.relativePos.y),this.mouseContentHorizontalOffset=ctx.getCurrentScrollLeft()+this.relativePos.x-ctx.layoutInfo.contentLeft,this.isInMarginArea=this.relativePos.x<ctx.layoutInfo.contentLeft&&this.relativePos.x>=ctx.layoutInfo.glyphMarginLeft,this.isInContentArea=!this.isInMarginArea,this.mouseColumn=Math.max(0,MouseTargetFactory._getMouseColumn(this.mouseContentHorizontalOffset,ctx.typicalHalfwidthCharacterWidth))}}class HitTestRequest extends BareHitTestRequest{constructor(ctx,editorPos,pos,relativePos,target){super(ctx,editorPos,pos,relativePos),this._ctx=ctx,target?(this.target=target,this.targetPath=PartFingerprints.collect(target,ctx.viewDomNode)):(this.target=null,this.targetPath=new Uint8Array(0))}toString(){return`pos(${this.pos.x},${this.pos.y}), editorPos(${this.editorPos.x},${this.editorPos.y}), relativePos(${this.relativePos.x},${this.relativePos.y}), mouseVerticalOffset: ${this.mouseVerticalOffset}, mouseContentHorizontalOffset: ${this.mouseContentHorizontalOffset}\n\ttarget: ${this.target?this.target.outerHTML:null}`}_getMouseColumn(position=null){return position&&position.column<this._ctx.viewModel.getLineMaxColumn(position.lineNumber)?CursorColumns.visibleColumnFromColumn(this._ctx.viewModel.getLineContent(position.lineNumber),position.column,this._ctx.viewModel.model.getOptions().tabSize)+1:this.mouseColumn}fulfillUnknown(position=null){return MouseTarget.createUnknown(this.target,this._getMouseColumn(position),position)}fulfillTextarea(){return MouseTarget.createTextarea(this.target,this._getMouseColumn())}fulfillMargin(type,position,range,detail){return MouseTarget.createMargin(type,this.target,this._getMouseColumn(position),position,range,detail)}fulfillViewZone(type,position,detail){return MouseTarget.createViewZone(type,this.target,this._getMouseColumn(position),position,detail)}fulfillContentText(position,range,detail){return MouseTarget.createContentText(this.target,this._getMouseColumn(position),position,range,detail)}fulfillContentEmpty(position,detail){return MouseTarget.createContentEmpty(this.target,this._getMouseColumn(position),position,detail)}fulfillContentWidget(detail){return MouseTarget.createContentWidget(this.target,this._getMouseColumn(),detail)}fulfillScrollbar(position){return MouseTarget.createScrollbar(this.target,this._getMouseColumn(position),position)}fulfillOverlayWidget(detail){return MouseTarget.createOverlayWidget(this.target,this._getMouseColumn(),detail)}withTarget(target){return new HitTestRequest(this._ctx,this.editorPos,this.pos,this.relativePos,target)}}const EMPTY_CONTENT_AFTER_LINES={isAfterLines:!0};function createEmptyContentDataInLines(horizontalDistanceToText){return{isAfterLines:!1,horizontalDistanceToText}}export class MouseTargetFactory{constructor(context,viewHelper){this._context=context,this._viewHelper=viewHelper}mouseTargetIsWidget(e){const t=e.target,path=PartFingerprints.collect(t,this._viewHelper.viewDomNode);return!(!ElementPath.isChildOfContentWidgets(path)&&!ElementPath.isChildOfOverflowingContentWidgets(path))||!!ElementPath.isChildOfOverlayWidgets(path)}createMouseTarget(lastRenderData,editorPos,pos,relativePos,target){const ctx=new HitTestContext(this._context,this._viewHelper,lastRenderData),request=new HitTestRequest(ctx,editorPos,pos,relativePos,target);try{return MouseTargetFactory._createMouseTarget(ctx,request,!1)}catch(err){return request.fulfillUnknown()}}static _createMouseTarget(ctx,request,domHitTestExecuted){if(null===request.target){if(domHitTestExecuted)return request.fulfillUnknown();const hitTestResult=MouseTargetFactory._doHitTest(ctx,request);return 1===hitTestResult.type?MouseTargetFactory.createMouseTargetFromHitTestPosition(ctx,request,hitTestResult.spanNode,hitTestResult.position,hitTestResult.injectedText):this._createMouseTarget(ctx,request.withTarget(hitTestResult.hitTarget),!0)}const resolvedRequest=request;let result=null;return result=result||MouseTargetFactory._hitTestContentWidget(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestOverlayWidget(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestMinimap(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestScrollbarSlider(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestViewZone(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestMargin(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestViewCursor(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestTextArea(ctx,resolvedRequest),result=result||MouseTargetFactory._hitTestViewLines(ctx,resolvedRequest,domHitTestExecuted),result=result||MouseTargetFactory._hitTestScrollbar(ctx,resolvedRequest),result||request.fulfillUnknown()}static _hitTestContentWidget(ctx,request){if(ElementPath.isChildOfContentWidgets(request.targetPath)||ElementPath.isChildOfOverflowingContentWidgets(request.targetPath)){const widgetId=ctx.findAttribute(request.target,"widgetId");return widgetId?request.fulfillContentWidget(widgetId):request.fulfillUnknown()}return null}static _hitTestOverlayWidget(ctx,request){if(ElementPath.isChildOfOverlayWidgets(request.targetPath)){const widgetId=ctx.findAttribute(request.target,"widgetId");return widgetId?request.fulfillOverlayWidget(widgetId):request.fulfillUnknown()}return null}static _hitTestViewCursor(ctx,request){if(request.target){const lastViewCursorsRenderData=ctx.lastRenderData.lastViewCursorsRenderData;for(const d of lastViewCursorsRenderData)if(request.target===d.domNode)return request.fulfillContentText(d.position,null,{mightBeForeignElement:!1,injectedText:null})}if(request.isInContentArea){const lastViewCursorsRenderData=ctx.lastRenderData.lastViewCursorsRenderData,mouseContentHorizontalOffset=request.mouseContentHorizontalOffset,mouseVerticalOffset=request.mouseVerticalOffset;for(const d of lastViewCursorsRenderData){if(mouseContentHorizontalOffset<d.contentLeft)continue;if(mouseContentHorizontalOffset>d.contentLeft+d.width)continue;const cursorVerticalOffset=ctx.getVerticalOffsetForLineNumber(d.position.lineNumber);if(cursorVerticalOffset<=mouseVerticalOffset&&mouseVerticalOffset<=cursorVerticalOffset+d.height)return request.fulfillContentText(d.position,null,{mightBeForeignElement:!1,injectedText:null})}}return null}static _hitTestViewZone(ctx,request){const viewZoneData=ctx.getZoneAtCoord(request.mouseVerticalOffset);if(viewZoneData){const mouseTargetType=request.isInContentArea?8:5;return request.fulfillViewZone(mouseTargetType,viewZoneData.position,viewZoneData)}return null}static _hitTestTextArea(ctx,request){return ElementPath.isTextArea(request.targetPath)?ctx.lastRenderData.lastTextareaPosition?request.fulfillContentText(ctx.lastRenderData.lastTextareaPosition,null,{mightBeForeignElement:!1,injectedText:null}):request.fulfillTextarea():null}static _hitTestMargin(ctx,request){if(request.isInMarginArea){const res=ctx.getFullLineRangeAtCoord(request.mouseVerticalOffset),pos=res.range.getStartPosition();let offset=Math.abs(request.relativePos.x);const detail={isAfterLines:res.isAfterLines,glyphMarginLeft:ctx.layoutInfo.glyphMarginLeft,glyphMarginWidth:ctx.layoutInfo.glyphMarginWidth,lineNumbersWidth:ctx.layoutInfo.lineNumbersWidth,offsetX:offset};return offset-=ctx.layoutInfo.glyphMarginLeft,offset<=ctx.layoutInfo.glyphMarginWidth?request.fulfillMargin(2,pos,res.range,detail):(offset-=ctx.layoutInfo.glyphMarginWidth,offset<=ctx.layoutInfo.lineNumbersWidth?request.fulfillMargin(3,pos,res.range,detail):(offset-=ctx.layoutInfo.lineNumbersWidth,request.fulfillMargin(4,pos,res.range,detail)))}return null}static _hitTestViewLines(ctx,request,domHitTestExecuted){if(!ElementPath.isChildOfViewLines(request.targetPath))return null;if(ctx.isInTopPadding(request.mouseVerticalOffset))return request.fulfillContentEmpty(new Position(1,1),EMPTY_CONTENT_AFTER_LINES);if(ctx.isAfterLines(request.mouseVerticalOffset)||ctx.isInBottomPadding(request.mouseVerticalOffset)){const lineCount=ctx.viewModel.getLineCount(),maxLineColumn=ctx.viewModel.getLineMaxColumn(lineCount);return request.fulfillContentEmpty(new Position(lineCount,maxLineColumn),EMPTY_CONTENT_AFTER_LINES)}if(domHitTestExecuted){if(ElementPath.isStrictChildOfViewLines(request.targetPath)){const lineNumber=ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset);if(0===ctx.viewModel.getLineLength(lineNumber)){const lineWidth=ctx.getLineWidth(lineNumber),detail=createEmptyContentDataInLines(request.mouseContentHorizontalOffset-lineWidth);return request.fulfillContentEmpty(new Position(lineNumber,1),detail)}const lineWidth=ctx.getLineWidth(lineNumber);if(request.mouseContentHorizontalOffset>=lineWidth){const detail=createEmptyContentDataInLines(request.mouseContentHorizontalOffset-lineWidth),pos=new Position(lineNumber,ctx.viewModel.getLineMaxColumn(lineNumber));return request.fulfillContentEmpty(pos,detail)}}return request.fulfillUnknown()}const hitTestResult=MouseTargetFactory._doHitTest(ctx,request);return 1===hitTestResult.type?MouseTargetFactory.createMouseTargetFromHitTestPosition(ctx,request,hitTestResult.spanNode,hitTestResult.position,hitTestResult.injectedText):this._createMouseTarget(ctx,request.withTarget(hitTestResult.hitTarget),!0)}static _hitTestMinimap(ctx,request){if(ElementPath.isChildOfMinimap(request.targetPath)){const possibleLineNumber=ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset),maxColumn=ctx.viewModel.getLineMaxColumn(possibleLineNumber);return request.fulfillScrollbar(new Position(possibleLineNumber,maxColumn))}return null}static _hitTestScrollbarSlider(ctx,request){if(ElementPath.isChildOfScrollableElement(request.targetPath)&&request.target&&1===request.target.nodeType){const className=request.target.className;if(className&&/\b(slider|scrollbar)\b/.test(className)){const possibleLineNumber=ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset),maxColumn=ctx.viewModel.getLineMaxColumn(possibleLineNumber);return request.fulfillScrollbar(new Position(possibleLineNumber,maxColumn))}}return null}static _hitTestScrollbar(ctx,request){if(ElementPath.isChildOfScrollableElement(request.targetPath)){const possibleLineNumber=ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset),maxColumn=ctx.viewModel.getLineMaxColumn(possibleLineNumber);return request.fulfillScrollbar(new Position(possibleLineNumber,maxColumn))}return null}getMouseColumn(relativePos){const options=this._context.configuration.options,layoutInfo=options.get(133),mouseContentHorizontalOffset=this._context.viewLayout.getCurrentScrollLeft()+relativePos.x-layoutInfo.contentLeft;return MouseTargetFactory._getMouseColumn(mouseContentHorizontalOffset,options.get(46).typicalHalfwidthCharacterWidth)}static _getMouseColumn(mouseContentHorizontalOffset,typicalHalfwidthCharacterWidth){if(mouseContentHorizontalOffset<0)return 1;return Math.round(mouseContentHorizontalOffset/typicalHalfwidthCharacterWidth)+1}static createMouseTargetFromHitTestPosition(ctx,request,spanNode,pos,injectedText){const lineNumber=pos.lineNumber,column=pos.column,lineWidth=ctx.getLineWidth(lineNumber);if(request.mouseContentHorizontalOffset>lineWidth){const detail=createEmptyContentDataInLines(request.mouseContentHorizontalOffset-lineWidth);return request.fulfillContentEmpty(pos,detail)}const visibleRange=ctx.visibleRangeForPosition(lineNumber,column);if(!visibleRange)return request.fulfillUnknown(pos);const columnHorizontalOffset=visibleRange.left;if(request.mouseContentHorizontalOffset===columnHorizontalOffset)return request.fulfillContentText(pos,null,{mightBeForeignElement:!!injectedText,injectedText});const points=[];if(points.push({offset:visibleRange.left,column}),column>1){const visibleRange=ctx.visibleRangeForPosition(lineNumber,column-1);visibleRange&&points.push({offset:visibleRange.left,column:column-1})}if(column<ctx.viewModel.getLineMaxColumn(lineNumber)){const visibleRange=ctx.visibleRangeForPosition(lineNumber,column+1);visibleRange&&points.push({offset:visibleRange.left,column:column+1})}points.sort(((a,b)=>a.offset-b.offset));const mouseCoordinates=request.pos.toClientCoordinates(),spanNodeClientRect=spanNode.getBoundingClientRect(),mouseIsOverSpanNode=spanNodeClientRect.left<=mouseCoordinates.clientX&&mouseCoordinates.clientX<=spanNodeClientRect.right;for(let i=1;i<points.length;i++){const prev=points[i-1],curr=points[i];if(prev.offset<=request.mouseContentHorizontalOffset&&request.mouseContentHorizontalOffset<=curr.offset){const rng=new EditorRange(lineNumber,prev.column,lineNumber,curr.column),prevDelta=Math.abs(prev.offset-request.mouseContentHorizontalOffset),nextDelta=Math.abs(curr.offset-request.mouseContentHorizontalOffset),resultPos=new Position(lineNumber,prevDelta<nextDelta?prev.column:curr.column);return request.fulfillContentText(resultPos,rng,{mightBeForeignElement:!mouseIsOverSpanNode||!!injectedText,injectedText})}}return request.fulfillContentText(pos,null,{mightBeForeignElement:!mouseIsOverSpanNode||!!injectedText,injectedText})}static _doHitTestWithCaretRangeFromPoint(ctx,request){const lineNumber=ctx.getLineNumberAtVerticalOffset(request.mouseVerticalOffset),lineCenteredVerticalOffset=ctx.getVerticalOffsetForLineNumber(lineNumber)+Math.floor(ctx.lineHeight/2);let adjustedPageY=request.pos.y+(lineCenteredVerticalOffset-request.mouseVerticalOffset);adjustedPageY<=request.editorPos.y&&(adjustedPageY=request.editorPos.y+1),adjustedPageY>=request.editorPos.y+request.editorPos.height&&(adjustedPageY=request.editorPos.y+request.editorPos.height-1);const adjustedPage=new PageCoordinates(request.pos.x,adjustedPageY),r=this._actualDoHitTestWithCaretRangeFromPoint(ctx,adjustedPage.toClientCoordinates());return 1===r.type?r:this._actualDoHitTestWithCaretRangeFromPoint(ctx,request.pos.toClientCoordinates())}static _actualDoHitTestWithCaretRangeFromPoint(ctx,coords){const shadowRoot=dom.getShadowRoot(ctx.viewDomNode);let range;if(range=shadowRoot?void 0===shadowRoot.caretRangeFromPoint?shadowCaretRangeFromPoint(shadowRoot,coords.clientX,coords.clientY):shadowRoot.caretRangeFromPoint(coords.clientX,coords.clientY):document.caretRangeFromPoint(coords.clientX,coords.clientY),!range||!range.startContainer)return new UnknownHitTestResult;const startContainer=range.startContainer;if(startContainer.nodeType===startContainer.TEXT_NODE){const parent1=startContainer.parentNode,parent2=parent1?parent1.parentNode:null,parent3=parent2?parent2.parentNode:null;return(parent3&&parent3.nodeType===parent3.ELEMENT_NODE?parent3.className:null)===ViewLine.CLASS_NAME?HitTestResult.createFromDOMInfo(ctx,parent1,range.startOffset):new UnknownHitTestResult(startContainer.parentNode)}if(startContainer.nodeType===startContainer.ELEMENT_NODE){const parent1=startContainer.parentNode,parent2=parent1?parent1.parentNode:null;return(parent2&&parent2.nodeType===parent2.ELEMENT_NODE?parent2.className:null)===ViewLine.CLASS_NAME?HitTestResult.createFromDOMInfo(ctx,startContainer,startContainer.textContent.length):new UnknownHitTestResult(startContainer)}return new UnknownHitTestResult}static _doHitTestWithCaretPositionFromPoint(ctx,coords){const hitResult=document.caretPositionFromPoint(coords.clientX,coords.clientY);if(hitResult.offsetNode.nodeType===hitResult.offsetNode.TEXT_NODE){const parent1=hitResult.offsetNode.parentNode,parent2=parent1?parent1.parentNode:null,parent3=parent2?parent2.parentNode:null;return(parent3&&parent3.nodeType===parent3.ELEMENT_NODE?parent3.className:null)===ViewLine.CLASS_NAME?HitTestResult.createFromDOMInfo(ctx,hitResult.offsetNode.parentNode,hitResult.offset):new UnknownHitTestResult(hitResult.offsetNode.parentNode)}if(hitResult.offsetNode.nodeType===hitResult.offsetNode.ELEMENT_NODE){const parent1=hitResult.offsetNode.parentNode,parent1ClassName=parent1&&parent1.nodeType===parent1.ELEMENT_NODE?parent1.className:null,parent2=parent1?parent1.parentNode:null,parent2ClassName=parent2&&parent2.nodeType===parent2.ELEMENT_NODE?parent2.className:null;if(parent1ClassName===ViewLine.CLASS_NAME){const tokenSpan=hitResult.offsetNode.childNodes[Math.min(hitResult.offset,hitResult.offsetNode.childNodes.length-1)];if(tokenSpan)return HitTestResult.createFromDOMInfo(ctx,tokenSpan,0)}else if(parent2ClassName===ViewLine.CLASS_NAME)return HitTestResult.createFromDOMInfo(ctx,hitResult.offsetNode,0)}return new UnknownHitTestResult(hitResult.offsetNode)}static _snapToSoftTabBoundary(position,viewModel){const lineContent=viewModel.getLineContent(position.lineNumber),{tabSize}=viewModel.model.getOptions(),newPosition=AtomicTabMoveOperations.atomicPosition(lineContent,position.column-1,tabSize,2);return-1!==newPosition?new Position(position.lineNumber,newPosition+1):position}static _doHitTest(ctx,request){let result=new UnknownHitTestResult;if("function"==typeof document.caretRangeFromPoint?result=this._doHitTestWithCaretRangeFromPoint(ctx,request):document.caretPositionFromPoint&&(result=this._doHitTestWithCaretPositionFromPoint(ctx,request.pos.toClientCoordinates())),1===result.type){const injectedText=ctx.viewModel.getInjectedTextAt(result.position),normalizedPosition=ctx.viewModel.normalizePosition(result.position,2);!injectedText&&normalizedPosition.equals(result.position)||(result=new ContentHitTestResult(normalizedPosition,result.spanNode,injectedText))}return 1===result.type&&ctx.stickyTabStops&&(result=new ContentHitTestResult(this._snapToSoftTabBoundary(result.position,ctx.viewModel),result.spanNode,result.injectedText)),result}}export function shadowCaretRangeFromPoint(shadowRoot,x,y){const range=document.createRange();let el=shadowRoot.elementFromPoint(x,y);if(null!==el){for(;el&&el.firstChild&&el.firstChild.nodeType!==el.firstChild.TEXT_NODE&&el.lastChild&&el.lastChild.firstChild;)el=el.lastChild;const rect=el.getBoundingClientRect(),font=window.getComputedStyle(el,null).getPropertyValue("font"),text=el.innerText;let step,pixelCursor=rect.left,offset=0;if(x>rect.left+rect.width)offset=text.length;else{const charWidthReader=CharWidthReader.getInstance();for(let i=0;i<text.length+1;i++){if(step=charWidthReader.getCharWidth(text.charAt(i),font)/2,pixelCursor+=step,x<pixelCursor){offset=i;break}pixelCursor+=step}}range.setStart(el.firstChild,offset),range.setEnd(el.firstChild,offset)}return range}class CharWidthReader{constructor(){this._cache={},this._canvas=document.createElement("canvas")}static getInstance(){return CharWidthReader._INSTANCE||(CharWidthReader._INSTANCE=new CharWidthReader),CharWidthReader._INSTANCE}getCharWidth(char,font){const cacheKey=char+font;if(this._cache[cacheKey])return this._cache[cacheKey];const context=this._canvas.getContext("2d");context.font=font;const width=context.measureText(char).width;return this._cache[cacheKey]=width,width}}CharWidthReader._INSTANCE=null;