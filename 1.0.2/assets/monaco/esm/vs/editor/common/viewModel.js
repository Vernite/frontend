import*as strings from"../../base/common/strings.js";import{Range}from"./core/range.js";export class Viewport{constructor(top,left,width,height){this._viewportBrand=void 0,this.top=0|top,this.left=0|left,this.width=0|width,this.height=0|height}}export class MinimapLinesRenderingData{constructor(tabSize,data){this.tabSize=tabSize,this.data=data}}export class ViewLineData{constructor(content,continuesWithWrappedLine,minColumn,maxColumn,startVisibleColumn,tokens,inlineDecorations){this._viewLineDataBrand=void 0,this.content=content,this.continuesWithWrappedLine=continuesWithWrappedLine,this.minColumn=minColumn,this.maxColumn=maxColumn,this.startVisibleColumn=startVisibleColumn,this.tokens=tokens,this.inlineDecorations=inlineDecorations}}export class ViewLineRenderingData{constructor(minColumn,maxColumn,content,continuesWithWrappedLine,mightContainRTL,mightContainNonBasicASCII,tokens,inlineDecorations,tabSize,startVisibleColumn){this.minColumn=minColumn,this.maxColumn=maxColumn,this.content=content,this.continuesWithWrappedLine=continuesWithWrappedLine,this.isBasicASCII=ViewLineRenderingData.isBasicASCII(content,mightContainNonBasicASCII),this.containsRTL=ViewLineRenderingData.containsRTL(content,this.isBasicASCII,mightContainRTL),this.tokens=tokens,this.inlineDecorations=inlineDecorations,this.tabSize=tabSize,this.startVisibleColumn=startVisibleColumn}static isBasicASCII(lineContent,mightContainNonBasicASCII){return!mightContainNonBasicASCII||strings.isBasicASCII(lineContent)}static containsRTL(lineContent,isBasicASCII,mightContainRTL){return!(isBasicASCII||!mightContainRTL)&&strings.containsRTL(lineContent)}}export class InlineDecoration{constructor(range,inlineClassName,type){this.range=range,this.inlineClassName=inlineClassName,this.type=type}}export class SingleLineInlineDecoration{constructor(startOffset,endOffset,inlineClassName,inlineClassNameAffectsLetterSpacing){this.startOffset=startOffset,this.endOffset=endOffset,this.inlineClassName=inlineClassName,this.inlineClassNameAffectsLetterSpacing=inlineClassNameAffectsLetterSpacing}toInlineDecoration(lineNumber){return new InlineDecoration(new Range(lineNumber,this.startOffset+1,lineNumber,this.endOffset+1),this.inlineClassName,this.inlineClassNameAffectsLetterSpacing?3:0)}}export class ViewModelDecoration{constructor(range,options){this._viewModelDecorationBrand=void 0,this.range=range,this.options=options}}export class OverviewRulerDecorationsGroup{constructor(color,zIndex,data){this.color=color,this.zIndex=zIndex,this.data=data}static cmp(a,b){return a.zIndex===b.zIndex?a.color<b.color?-1:a.color>b.color?1:0:a.zIndex-b.zIndex}}