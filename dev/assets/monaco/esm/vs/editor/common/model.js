import{equals}from"../../base/common/objects.js";export var OverviewRulerLane;!function(OverviewRulerLane){OverviewRulerLane[OverviewRulerLane.Left=1]="Left",OverviewRulerLane[OverviewRulerLane.Center=2]="Center",OverviewRulerLane[OverviewRulerLane.Right=4]="Right",OverviewRulerLane[OverviewRulerLane.Full=7]="Full"}(OverviewRulerLane||(OverviewRulerLane={}));export var MinimapPosition;!function(MinimapPosition){MinimapPosition[MinimapPosition.Inline=1]="Inline",MinimapPosition[MinimapPosition.Gutter=2]="Gutter"}(MinimapPosition||(MinimapPosition={}));export var InjectedTextCursorStops;!function(InjectedTextCursorStops){InjectedTextCursorStops[InjectedTextCursorStops.Both=0]="Both",InjectedTextCursorStops[InjectedTextCursorStops.Right=1]="Right",InjectedTextCursorStops[InjectedTextCursorStops.Left=2]="Left",InjectedTextCursorStops[InjectedTextCursorStops.None=3]="None"}(InjectedTextCursorStops||(InjectedTextCursorStops={}));export class TextModelResolvedOptions{constructor(src){this._textModelResolvedOptionsBrand=void 0,this.tabSize=Math.max(1,0|src.tabSize),this.indentSize=0|src.tabSize,this.insertSpaces=Boolean(src.insertSpaces),this.defaultEOL=0|src.defaultEOL,this.trimAutoWhitespace=Boolean(src.trimAutoWhitespace),this.bracketPairColorizationOptions=src.bracketPairColorizationOptions}equals(other){return this.tabSize===other.tabSize&&this.indentSize===other.indentSize&&this.insertSpaces===other.insertSpaces&&this.defaultEOL===other.defaultEOL&&this.trimAutoWhitespace===other.trimAutoWhitespace&&equals(this.bracketPairColorizationOptions,other.bracketPairColorizationOptions)}createChangeEvent(newOpts){return{tabSize:this.tabSize!==newOpts.tabSize,indentSize:this.indentSize!==newOpts.indentSize,insertSpaces:this.insertSpaces!==newOpts.insertSpaces,trimAutoWhitespace:this.trimAutoWhitespace!==newOpts.trimAutoWhitespace}}}export class FindMatch{constructor(range,matches){this._findMatchBrand=void 0,this.range=range,this.matches=matches}}export function isITextSnapshot(obj){return obj&&"function"==typeof obj.read}export class ValidAnnotatedEditOperation{constructor(identifier,range,text,forceMoveMarkers,isAutoWhitespaceEdit,_isTracked){this.identifier=identifier,this.range=range,this.text=text,this.forceMoveMarkers=forceMoveMarkers,this.isAutoWhitespaceEdit=isAutoWhitespaceEdit,this._isTracked=_isTracked}}export class SearchData{constructor(regex,wordSeparators,simpleSearch){this.regex=regex,this.wordSeparators=wordSeparators,this.simpleSearch=simpleSearch}}export class ApplyEditsResult{constructor(reverseEdits,changes,trimAutoWhitespaceLineNumbers){this.reverseEdits=reverseEdits,this.changes=changes,this.trimAutoWhitespaceLineNumbers=trimAutoWhitespaceLineNumbers}}export function shouldSynchronizeModel(model){return!model.isTooLargeForSyncing()&&!model.isForSimpleWidget}