import{Range}from"../../../common/core/range.js";import{MinimapPosition,OverviewRulerLane}from"../../../common/model.js";import{ModelDecorationOptions}from"../../../common/model/textModel.js";import{minimapFindMatch,overviewRulerFindMatchForeground}from"../../../../platform/theme/common/colorRegistry.js";import{themeColorFromId}from"../../../../platform/theme/common/themeService.js";export class FindDecorations{constructor(editor){this._editor=editor,this._decorations=[],this._overviewRulerApproximateDecorations=[],this._findScopeDecorationIds=[],this._rangeHighlightDecorationId=null,this._highlightedDecorationId=null,this._startPosition=this._editor.getPosition()}dispose(){this._editor.removeDecorations(this._allDecorations()),this._decorations=[],this._overviewRulerApproximateDecorations=[],this._findScopeDecorationIds=[],this._rangeHighlightDecorationId=null,this._highlightedDecorationId=null}reset(){this._decorations=[],this._overviewRulerApproximateDecorations=[],this._findScopeDecorationIds=[],this._rangeHighlightDecorationId=null,this._highlightedDecorationId=null}getCount(){return this._decorations.length}getFindScope(){return this._findScopeDecorationIds[0]?this._editor.getModel().getDecorationRange(this._findScopeDecorationIds[0]):null}getFindScopes(){if(this._findScopeDecorationIds.length){const scopes=this._findScopeDecorationIds.map((findScopeDecorationId=>this._editor.getModel().getDecorationRange(findScopeDecorationId))).filter((element=>!!element));if(scopes.length)return scopes}return null}getStartPosition(){return this._startPosition}setStartPosition(newStartPosition){this._startPosition=newStartPosition,this.setCurrentFindMatch(null)}_getDecorationIndex(decorationId){const index=this._decorations.indexOf(decorationId);return index>=0?index+1:1}getCurrentMatchesPosition(desiredRange){const candidates=this._editor.getModel().getDecorationsInRange(desiredRange);for(const candidate of candidates){const candidateOpts=candidate.options;if(candidateOpts===FindDecorations._FIND_MATCH_DECORATION||candidateOpts===FindDecorations._CURRENT_FIND_MATCH_DECORATION)return this._getDecorationIndex(candidate.id)}return 0}setCurrentFindMatch(nextMatch){let newCurrentDecorationId=null,matchPosition=0;if(nextMatch)for(let i=0,len=this._decorations.length;i<len;i++){const range=this._editor.getModel().getDecorationRange(this._decorations[i]);if(nextMatch.equalsRange(range)){newCurrentDecorationId=this._decorations[i],matchPosition=i+1;break}}return null===this._highlightedDecorationId&&null===newCurrentDecorationId||this._editor.changeDecorations((changeAccessor=>{if(null!==this._highlightedDecorationId&&(changeAccessor.changeDecorationOptions(this._highlightedDecorationId,FindDecorations._FIND_MATCH_DECORATION),this._highlightedDecorationId=null),null!==newCurrentDecorationId&&(this._highlightedDecorationId=newCurrentDecorationId,changeAccessor.changeDecorationOptions(this._highlightedDecorationId,FindDecorations._CURRENT_FIND_MATCH_DECORATION)),null!==this._rangeHighlightDecorationId&&(changeAccessor.removeDecoration(this._rangeHighlightDecorationId),this._rangeHighlightDecorationId=null),null!==newCurrentDecorationId){let rng=this._editor.getModel().getDecorationRange(newCurrentDecorationId);if(rng.startLineNumber!==rng.endLineNumber&&1===rng.endColumn){const lineBeforeEnd=rng.endLineNumber-1,lineBeforeEndMaxColumn=this._editor.getModel().getLineMaxColumn(lineBeforeEnd);rng=new Range(rng.startLineNumber,rng.startColumn,lineBeforeEnd,lineBeforeEndMaxColumn)}this._rangeHighlightDecorationId=changeAccessor.addDecoration(rng,FindDecorations._RANGE_HIGHLIGHT_DECORATION)}})),matchPosition}set(findMatches,findScopes){this._editor.changeDecorations((accessor=>{let findMatchesOptions=FindDecorations._FIND_MATCH_DECORATION;const newOverviewRulerApproximateDecorations=[];if(findMatches.length>1e3){findMatchesOptions=FindDecorations._FIND_MATCH_NO_OVERVIEW_DECORATION;const lineCount=this._editor.getModel().getLineCount(),approxPixelsPerLine=this._editor.getLayoutInfo().height/lineCount,mergeLinesDelta=Math.max(2,Math.ceil(3/approxPixelsPerLine));let prevStartLineNumber=findMatches[0].range.startLineNumber,prevEndLineNumber=findMatches[0].range.endLineNumber;for(let i=1,len=findMatches.length;i<len;i++){const range=findMatches[i].range;prevEndLineNumber+mergeLinesDelta>=range.startLineNumber?range.endLineNumber>prevEndLineNumber&&(prevEndLineNumber=range.endLineNumber):(newOverviewRulerApproximateDecorations.push({range:new Range(prevStartLineNumber,1,prevEndLineNumber,1),options:FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION}),prevStartLineNumber=range.startLineNumber,prevEndLineNumber=range.endLineNumber)}newOverviewRulerApproximateDecorations.push({range:new Range(prevStartLineNumber,1,prevEndLineNumber,1),options:FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION})}const newFindMatchesDecorations=new Array(findMatches.length);for(let i=0,len=findMatches.length;i<len;i++)newFindMatchesDecorations[i]={range:findMatches[i].range,options:findMatchesOptions};this._decorations=accessor.deltaDecorations(this._decorations,newFindMatchesDecorations),this._overviewRulerApproximateDecorations=accessor.deltaDecorations(this._overviewRulerApproximateDecorations,newOverviewRulerApproximateDecorations),this._rangeHighlightDecorationId&&(accessor.removeDecoration(this._rangeHighlightDecorationId),this._rangeHighlightDecorationId=null),this._findScopeDecorationIds.length&&(this._findScopeDecorationIds.forEach((findScopeDecorationId=>accessor.removeDecoration(findScopeDecorationId))),this._findScopeDecorationIds=[]),(null==findScopes?void 0:findScopes.length)&&(this._findScopeDecorationIds=findScopes.map((findScope=>accessor.addDecoration(findScope,FindDecorations._FIND_SCOPE_DECORATION))))}))}matchBeforePosition(position){if(0===this._decorations.length)return null;for(let i=this._decorations.length-1;i>=0;i--){const decorationId=this._decorations[i],r=this._editor.getModel().getDecorationRange(decorationId);if(r&&!(r.endLineNumber>position.lineNumber)){if(r.endLineNumber<position.lineNumber)return r;if(!(r.endColumn>position.column))return r}}return this._editor.getModel().getDecorationRange(this._decorations[this._decorations.length-1])}matchAfterPosition(position){if(0===this._decorations.length)return null;for(let i=0,len=this._decorations.length;i<len;i++){const decorationId=this._decorations[i],r=this._editor.getModel().getDecorationRange(decorationId);if(r&&!(r.startLineNumber<position.lineNumber)){if(r.startLineNumber>position.lineNumber)return r;if(!(r.startColumn<position.column))return r}}return this._editor.getModel().getDecorationRange(this._decorations[0])}_allDecorations(){let result=[];return result=result.concat(this._decorations),result=result.concat(this._overviewRulerApproximateDecorations),this._findScopeDecorationIds.length&&result.push(...this._findScopeDecorationIds),this._rangeHighlightDecorationId&&result.push(this._rangeHighlightDecorationId),result}}FindDecorations._CURRENT_FIND_MATCH_DECORATION=ModelDecorationOptions.register({description:"current-find-match",stickiness:1,zIndex:13,className:"currentFindMatch",showIfCollapsed:!0,overviewRuler:{color:themeColorFromId(overviewRulerFindMatchForeground),position:OverviewRulerLane.Center},minimap:{color:themeColorFromId(minimapFindMatch),position:MinimapPosition.Inline}}),FindDecorations._FIND_MATCH_DECORATION=ModelDecorationOptions.register({description:"find-match",stickiness:1,zIndex:10,className:"findMatch",showIfCollapsed:!0,overviewRuler:{color:themeColorFromId(overviewRulerFindMatchForeground),position:OverviewRulerLane.Center},minimap:{color:themeColorFromId(minimapFindMatch),position:MinimapPosition.Inline}}),FindDecorations._FIND_MATCH_NO_OVERVIEW_DECORATION=ModelDecorationOptions.register({description:"find-match-no-overview",stickiness:1,className:"findMatch",showIfCollapsed:!0}),FindDecorations._FIND_MATCH_ONLY_OVERVIEW_DECORATION=ModelDecorationOptions.register({description:"find-match-only-overview",stickiness:1,overviewRuler:{color:themeColorFromId(overviewRulerFindMatchForeground),position:OverviewRulerLane.Center}}),FindDecorations._RANGE_HIGHLIGHT_DECORATION=ModelDecorationOptions.register({description:"find-range-highlight",stickiness:1,className:"rangeHighlight",isWholeLine:!0}),FindDecorations._FIND_SCOPE_DECORATION=ModelDecorationOptions.register({description:"find-scope",className:"findScope",isWholeLine:!0});