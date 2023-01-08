import"./decorations.css";import{DynamicViewOverlay}from"../../view/dynamicViewOverlay.js";import{Range}from"../../../common/core/range.js";import{HorizontalRange}from"../../view/renderingContext.js";export class DecorationsOverlay extends DynamicViewOverlay{constructor(context){super(),this._context=context;const options=this._context.configuration.options;this._lineHeight=options.get(61),this._typicalHalfwidthCharacterWidth=options.get(46).typicalHalfwidthCharacterWidth,this._renderResult=null,this._context.addEventHandler(this)}dispose(){this._context.removeEventHandler(this),this._renderResult=null,super.dispose()}onConfigurationChanged(e){const options=this._context.configuration.options;return this._lineHeight=options.get(61),this._typicalHalfwidthCharacterWidth=options.get(46).typicalHalfwidthCharacterWidth,!0}onDecorationsChanged(e){return!0}onFlushed(e){return!0}onLinesChanged(e){return!0}onLinesDeleted(e){return!0}onLinesInserted(e){return!0}onScrollChanged(e){return e.scrollTopChanged||e.scrollWidthChanged}onZonesChanged(e){return!0}prepareRender(ctx){const _decorations=ctx.getDecorationsInViewport();let decorations=[],decorationsLen=0;for(let i=0,len=_decorations.length;i<len;i++){const d=_decorations[i];d.options.className&&(decorations[decorationsLen++]=d)}decorations=decorations.sort(((a,b)=>{if(a.options.zIndex<b.options.zIndex)return-1;if(a.options.zIndex>b.options.zIndex)return 1;const aClassName=a.options.className,bClassName=b.options.className;return aClassName<bClassName?-1:aClassName>bClassName?1:Range.compareRangesUsingStarts(a.range,b.range)}));const visibleStartLineNumber=ctx.visibleRange.startLineNumber,visibleEndLineNumber=ctx.visibleRange.endLineNumber,output=[];for(let lineNumber=visibleStartLineNumber;lineNumber<=visibleEndLineNumber;lineNumber++){output[lineNumber-visibleStartLineNumber]=""}this._renderWholeLineDecorations(ctx,decorations,output),this._renderNormalDecorations(ctx,decorations,output),this._renderResult=output}_renderWholeLineDecorations(ctx,decorations,output){const lineHeight=String(this._lineHeight),visibleStartLineNumber=ctx.visibleRange.startLineNumber,visibleEndLineNumber=ctx.visibleRange.endLineNumber;for(let i=0,lenI=decorations.length;i<lenI;i++){const d=decorations[i];if(!d.options.isWholeLine)continue;const decorationOutput='<div class="cdr '+d.options.className+'" style="left:0;width:100%;height:'+lineHeight+'px;"></div>',startLineNumber=Math.max(d.range.startLineNumber,visibleStartLineNumber),endLineNumber=Math.min(d.range.endLineNumber,visibleEndLineNumber);for(let j=startLineNumber;j<=endLineNumber;j++){output[j-visibleStartLineNumber]+=decorationOutput}}}_renderNormalDecorations(ctx,decorations,output){const lineHeight=String(this._lineHeight),visibleStartLineNumber=ctx.visibleRange.startLineNumber;let prevClassName=null,prevShowIfCollapsed=!1,prevRange=null;for(let i=0,lenI=decorations.length;i<lenI;i++){const d=decorations[i];if(d.options.isWholeLine)continue;const className=d.options.className,showIfCollapsed=Boolean(d.options.showIfCollapsed);let range=d.range;showIfCollapsed&&1===range.endColumn&&range.endLineNumber!==range.startLineNumber&&(range=new Range(range.startLineNumber,range.startColumn,range.endLineNumber-1,this._context.viewModel.getLineMaxColumn(range.endLineNumber-1))),prevClassName===className&&prevShowIfCollapsed===showIfCollapsed&&Range.areIntersectingOrTouching(prevRange,range)?prevRange=Range.plusRange(prevRange,range):(null!==prevClassName&&this._renderNormalDecoration(ctx,prevRange,prevClassName,prevShowIfCollapsed,lineHeight,visibleStartLineNumber,output),prevClassName=className,prevShowIfCollapsed=showIfCollapsed,prevRange=range)}null!==prevClassName&&this._renderNormalDecoration(ctx,prevRange,prevClassName,prevShowIfCollapsed,lineHeight,visibleStartLineNumber,output)}_renderNormalDecoration(ctx,range,className,showIfCollapsed,lineHeight,visibleStartLineNumber,output){const linesVisibleRanges=ctx.linesVisibleRangesForRange(range,"findMatch"===className);if(linesVisibleRanges)for(let j=0,lenJ=linesVisibleRanges.length;j<lenJ;j++){const lineVisibleRanges=linesVisibleRanges[j];if(lineVisibleRanges.outsideRenderedLine)continue;const lineIndex=lineVisibleRanges.lineNumber-visibleStartLineNumber;if(showIfCollapsed&&1===lineVisibleRanges.ranges.length){const singleVisibleRange=lineVisibleRanges.ranges[0];if(singleVisibleRange.width<this._typicalHalfwidthCharacterWidth){const center=Math.round(singleVisibleRange.left+singleVisibleRange.width/2),left=Math.max(0,Math.round(center-this._typicalHalfwidthCharacterWidth/2));lineVisibleRanges.ranges[0]=new HorizontalRange(left,this._typicalHalfwidthCharacterWidth)}}for(let k=0,lenK=lineVisibleRanges.ranges.length;k<lenK;k++){const visibleRange=lineVisibleRanges.ranges[k],decorationOutput='<div class="cdr '+className+'" style="left:'+String(visibleRange.left)+"px;width:"+String(visibleRange.width)+"px;height:"+lineHeight+'px;"></div>';output[lineIndex]+=decorationOutput}}}render(startLineNumber,lineNumber){if(!this._renderResult)return"";const lineIndex=lineNumber-startLineNumber;return lineIndex<0||lineIndex>=this._renderResult.length?"":this._renderResult[lineIndex]}}