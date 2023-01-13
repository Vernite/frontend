import*as dom from"../../../../base/browser/dom.js";import{createFastDomNode}from"../../../../base/browser/fastDomNode.js";import{PartFingerprints,ViewPart}from"../../view/viewPart.js";class Coordinate{constructor(top,left){this._coordinateBrand=void 0,this.top=top,this.left=left}}export class ViewContentWidgets extends ViewPart{constructor(context,viewDomNode){super(context),this._viewDomNode=viewDomNode,this._widgets={},this.domNode=createFastDomNode(document.createElement("div")),PartFingerprints.write(this.domNode,1),this.domNode.setClassName("contentWidgets"),this.domNode.setPosition("absolute"),this.domNode.setTop(0),this.overflowingContentWidgetsDomNode=createFastDomNode(document.createElement("div")),PartFingerprints.write(this.overflowingContentWidgetsDomNode,2),this.overflowingContentWidgetsDomNode.setClassName("overflowingContentWidgets")}dispose(){super.dispose(),this._widgets={}}onConfigurationChanged(e){const keys=Object.keys(this._widgets);for(const widgetId of keys)this._widgets[widgetId].onConfigurationChanged(e);return!0}onDecorationsChanged(e){return!0}onFlushed(e){return!0}onLineMappingChanged(e){const keys=Object.keys(this._widgets);for(const widgetId of keys)this._widgets[widgetId].onLineMappingChanged(e);return!0}onLinesChanged(e){return!0}onLinesDeleted(e){return!0}onLinesInserted(e){return!0}onScrollChanged(e){return!0}onZonesChanged(e){return!0}addWidget(_widget){const myWidget=new Widget(this._context,this._viewDomNode,_widget);this._widgets[myWidget.id]=myWidget,myWidget.allowEditorOverflow?this.overflowingContentWidgetsDomNode.appendChild(myWidget.domNode):this.domNode.appendChild(myWidget.domNode),this.setShouldRender()}setWidgetPosition(widget,range,preference,affinity){this._widgets[widget.getId()].setPosition(range,preference,affinity),this.setShouldRender()}removeWidget(widget){const widgetId=widget.getId();if(this._widgets.hasOwnProperty(widgetId)){const myWidget=this._widgets[widgetId];delete this._widgets[widgetId];const domNode=myWidget.domNode.domNode;domNode.parentNode.removeChild(domNode),domNode.removeAttribute("monaco-visible-content-widget"),this.setShouldRender()}}shouldSuppressMouseDownOnWidget(widgetId){return!!this._widgets.hasOwnProperty(widgetId)&&this._widgets[widgetId].suppressMouseDown}onBeforeRender(viewportData){const keys=Object.keys(this._widgets);for(const widgetId of keys)this._widgets[widgetId].onBeforeRender(viewportData)}prepareRender(ctx){const keys=Object.keys(this._widgets);for(const widgetId of keys)this._widgets[widgetId].prepareRender(ctx)}render(ctx){const keys=Object.keys(this._widgets);for(const widgetId of keys)this._widgets[widgetId].render(ctx)}}class Widget{constructor(context,viewDomNode,actual){this._context=context,this._viewDomNode=viewDomNode,this._actual=actual,this.domNode=createFastDomNode(this._actual.getDomNode()),this.id=this._actual.getId(),this.allowEditorOverflow=this._actual.allowEditorOverflow||!1,this.suppressMouseDown=this._actual.suppressMouseDown||!1;const options=this._context.configuration.options,layoutInfo=options.get(133);this._fixedOverflowWidgets=options.get(38),this._contentWidth=layoutInfo.contentWidth,this._contentLeft=layoutInfo.contentLeft,this._lineHeight=options.get(61),this._range=null,this._viewRange=null,this._affinity=null,this._preference=[],this._cachedDomNodeOffsetWidth=-1,this._cachedDomNodeOffsetHeight=-1,this._maxWidth=this._getMaxWidth(),this._isVisible=!1,this._renderData=null,this.domNode.setPosition(this._fixedOverflowWidgets&&this.allowEditorOverflow?"fixed":"absolute"),this.domNode.setDisplay("none"),this.domNode.setVisibility("hidden"),this.domNode.setAttribute("widgetId",this.id),this.domNode.setMaxWidth(this._maxWidth)}onConfigurationChanged(e){const options=this._context.configuration.options;if(this._lineHeight=options.get(61),e.hasChanged(133)){const layoutInfo=options.get(133);this._contentLeft=layoutInfo.contentLeft,this._contentWidth=layoutInfo.contentWidth,this._maxWidth=this._getMaxWidth()}}onLineMappingChanged(e){this._setPosition(this._range,this._affinity)}_setPosition(range,affinity){var _a;if(this._range=range,this._viewRange=null,this._affinity=affinity,this._range){const validModelRange=this._context.viewModel.model.validateRange(this._range);(this._context.viewModel.coordinatesConverter.modelPositionIsVisible(validModelRange.getStartPosition())||this._context.viewModel.coordinatesConverter.modelPositionIsVisible(validModelRange.getEndPosition()))&&(this._viewRange=this._context.viewModel.coordinatesConverter.convertModelRangeToViewRange(validModelRange,null!==(_a=this._affinity)&&void 0!==_a?_a:void 0))}}_getMaxWidth(){return this.allowEditorOverflow?window.innerWidth||document.documentElement.offsetWidth||document.body.offsetWidth:this._contentWidth}setPosition(range,preference,affinity){this._setPosition(range,affinity),this._preference=preference,this._viewRange&&this._preference&&this._preference.length>0?this.domNode.setDisplay("block"):this.domNode.setDisplay("none"),this._cachedDomNodeOffsetWidth=-1,this._cachedDomNodeOffsetHeight=-1}_layoutBoxInViewport(topLeft,bottomLeft,width,height,ctx){const aboveLineTop=topLeft.top,heightAboveLine=aboveLineTop,underLineTop=bottomLeft.top+this._lineHeight,aboveTop=aboveLineTop-height,fitsAbove=heightAboveLine>=height,belowTop=underLineTop,fitsBelow=ctx.viewportHeight-underLineTop>=height;let actualAboveLeft=topLeft.left,actualBelowLeft=bottomLeft.left;return actualAboveLeft+width>ctx.scrollLeft+ctx.viewportWidth&&(actualAboveLeft=ctx.scrollLeft+ctx.viewportWidth-width),actualBelowLeft+width>ctx.scrollLeft+ctx.viewportWidth&&(actualBelowLeft=ctx.scrollLeft+ctx.viewportWidth-width),actualAboveLeft<ctx.scrollLeft&&(actualAboveLeft=ctx.scrollLeft),actualBelowLeft<ctx.scrollLeft&&(actualBelowLeft=ctx.scrollLeft),{fitsAbove,aboveTop,aboveLeft:actualAboveLeft,fitsBelow,belowTop,belowLeft:actualBelowLeft}}_layoutHorizontalSegmentInPage(windowSize,domNodePosition,left,width){const MIN_LIMIT=Math.max(0,domNodePosition.left-width),MAX_LIMIT=Math.min(domNodePosition.left+domNodePosition.width+width,windowSize.width);let absoluteLeft=domNodePosition.left+left-dom.StandardWindow.scrollX;if(absoluteLeft+width>MAX_LIMIT){const delta=absoluteLeft-(MAX_LIMIT-width);absoluteLeft-=delta,left-=delta}if(absoluteLeft<MIN_LIMIT){const delta=absoluteLeft-MIN_LIMIT;absoluteLeft-=delta,left-=delta}return[left,absoluteLeft]}_layoutBoxInPage(topLeft,bottomLeft,width,height,ctx){const aboveTop=topLeft.top-height,belowTop=bottomLeft.top+this._lineHeight,domNodePosition=dom.getDomNodePagePosition(this._viewDomNode.domNode),absoluteAboveTop=domNodePosition.top+aboveTop-dom.StandardWindow.scrollY,absoluteBelowTop=domNodePosition.top+belowTop-dom.StandardWindow.scrollY,windowSize=dom.getClientArea(document.body),[aboveLeft,absoluteAboveLeft]=this._layoutHorizontalSegmentInPage(windowSize,domNodePosition,topLeft.left-ctx.scrollLeft+this._contentLeft,width),[belowLeft,absoluteBelowLeft]=this._layoutHorizontalSegmentInPage(windowSize,domNodePosition,bottomLeft.left-ctx.scrollLeft+this._contentLeft,width),fitsAbove=absoluteAboveTop>=22,fitsBelow=absoluteBelowTop+height<=windowSize.height-22;return this._fixedOverflowWidgets?{fitsAbove,aboveTop:Math.max(absoluteAboveTop,22),aboveLeft:absoluteAboveLeft,fitsBelow,belowTop:absoluteBelowTop,belowLeft:absoluteBelowLeft}:{fitsAbove,aboveTop,aboveLeft,fitsBelow,belowTop,belowLeft}}_prepareRenderWidgetAtExactPositionOverflowing(topLeft){return new Coordinate(topLeft.top,topLeft.left+this._contentLeft)}_getTopAndBottomLeft(ctx){if(!this._viewRange)return[null,null];const visibleRangesForRange=ctx.linesVisibleRangesForRange(this._viewRange,!1);if(!visibleRangesForRange||0===visibleRangesForRange.length)return[null,null];let firstLine=visibleRangesForRange[0],lastLine=visibleRangesForRange[0];for(const visibleRangesForLine of visibleRangesForRange)visibleRangesForLine.lineNumber<firstLine.lineNumber&&(firstLine=visibleRangesForLine),visibleRangesForLine.lineNumber>lastLine.lineNumber&&(lastLine=visibleRangesForLine);let firstLineMinLeft=1073741824;for(const visibleRange of firstLine.ranges)visibleRange.left<firstLineMinLeft&&(firstLineMinLeft=visibleRange.left);let lastLineMinLeft=1073741824;for(const visibleRange of lastLine.ranges)visibleRange.left<lastLineMinLeft&&(lastLineMinLeft=visibleRange.left);const topForPosition=ctx.getVerticalOffsetForLineNumber(firstLine.lineNumber)-ctx.scrollTop,topLeft=new Coordinate(topForPosition,firstLineMinLeft),topForBottomLine=ctx.getVerticalOffsetForLineNumber(lastLine.lineNumber)-ctx.scrollTop;return[topLeft,new Coordinate(topForBottomLine,lastLineMinLeft)]}_prepareRenderWidget(ctx){if(!this._preference||0===this._preference.length)return null;const[topLeft,bottomLeft]=this._getTopAndBottomLeft(ctx);if(!topLeft||!bottomLeft)return null;if(-1===this._cachedDomNodeOffsetWidth||-1===this._cachedDomNodeOffsetHeight){let preferredDimensions=null;if("function"==typeof this._actual.beforeRender&&(preferredDimensions=safeInvoke(this._actual.beforeRender,this._actual)),preferredDimensions)this._cachedDomNodeOffsetWidth=preferredDimensions.width,this._cachedDomNodeOffsetHeight=preferredDimensions.height;else{const clientRect=this.domNode.domNode.getBoundingClientRect();this._cachedDomNodeOffsetWidth=Math.round(clientRect.width),this._cachedDomNodeOffsetHeight=Math.round(clientRect.height)}}let placement;placement=this.allowEditorOverflow?this._layoutBoxInPage(topLeft,bottomLeft,this._cachedDomNodeOffsetWidth,this._cachedDomNodeOffsetHeight,ctx):this._layoutBoxInViewport(topLeft,bottomLeft,this._cachedDomNodeOffsetWidth,this._cachedDomNodeOffsetHeight,ctx);for(let pass=1;pass<=2;pass++)for(const pref of this._preference)if(1===pref){if(!placement)return null;if(2===pass||placement.fitsAbove)return{coordinate:new Coordinate(placement.aboveTop,placement.aboveLeft),position:1}}else{if(2!==pref)return this.allowEditorOverflow?{coordinate:this._prepareRenderWidgetAtExactPositionOverflowing(topLeft),position:0}:{coordinate:topLeft,position:0};if(!placement)return null;if(2===pass||placement.fitsBelow)return{coordinate:new Coordinate(placement.belowTop,placement.belowLeft),position:2}}return null}onBeforeRender(viewportData){this._viewRange&&this._preference&&(this._viewRange.endLineNumber<viewportData.startLineNumber||this._viewRange.startLineNumber>viewportData.endLineNumber||this.domNode.setMaxWidth(this._maxWidth))}prepareRender(ctx){this._renderData=this._prepareRenderWidget(ctx)}render(ctx){if(!this._renderData)return this._isVisible&&(this.domNode.removeAttribute("monaco-visible-content-widget"),this._isVisible=!1,this.domNode.setVisibility("hidden")),void("function"==typeof this._actual.afterRender&&safeInvoke(this._actual.afterRender,this._actual,null));this.allowEditorOverflow?(this.domNode.setTop(this._renderData.coordinate.top),this.domNode.setLeft(this._renderData.coordinate.left)):(this.domNode.setTop(this._renderData.coordinate.top+ctx.scrollTop-ctx.bigNumbersDelta),this.domNode.setLeft(this._renderData.coordinate.left)),this._isVisible||(this.domNode.setVisibility("inherit"),this.domNode.setAttribute("monaco-visible-content-widget","true"),this._isVisible=!0),"function"==typeof this._actual.afterRender&&safeInvoke(this._actual.afterRender,this._actual,this._renderData.position)}}function safeInvoke(fn,thisArg,...args){try{return fn.call(thisArg,...args)}catch(_a){return null}}