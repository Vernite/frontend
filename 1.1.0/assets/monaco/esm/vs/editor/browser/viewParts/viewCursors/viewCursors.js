import"./viewCursors.css";import{createFastDomNode}from"../../../../base/browser/fastDomNode.js";import{IntervalTimer,TimeoutTimer}from"../../../../base/common/async.js";import{ViewPart}from"../../view/viewPart.js";import{ViewCursor}from"./viewCursor.js";import{TextEditorCursorStyle}from"../../../common/config/editorOptions.js";import{editorCursorBackground,editorCursorForeground}from"../../../common/core/editorColorRegistry.js";import{registerThemingParticipant}from"../../../../platform/theme/common/themeService.js";import{isHighContrast}from"../../../../platform/theme/common/theme.js";export class ViewCursors extends ViewPart{constructor(context){super(context);const options=this._context.configuration.options;this._readOnly=options.get(83),this._cursorBlinking=options.get(22),this._cursorStyle=options.get(24),this._cursorSmoothCaretAnimation=options.get(23),this._selectionIsEmpty=!0,this._isComposingInput=!1,this._isVisible=!1,this._primaryCursor=new ViewCursor(this._context),this._secondaryCursors=[],this._renderData=[],this._domNode=createFastDomNode(document.createElement("div")),this._domNode.setAttribute("role","presentation"),this._domNode.setAttribute("aria-hidden","true"),this._updateDomClassName(),this._domNode.appendChild(this._primaryCursor.getDomNode()),this._startCursorBlinkAnimation=new TimeoutTimer,this._cursorFlatBlinkInterval=new IntervalTimer,this._blinkingEnabled=!1,this._editorHasFocus=!1,this._updateBlinking()}dispose(){super.dispose(),this._startCursorBlinkAnimation.dispose(),this._cursorFlatBlinkInterval.dispose()}getDomNode(){return this._domNode}onCompositionStart(e){return this._isComposingInput=!0,this._updateBlinking(),!0}onCompositionEnd(e){return this._isComposingInput=!1,this._updateBlinking(),!0}onConfigurationChanged(e){const options=this._context.configuration.options;this._readOnly=options.get(83),this._cursorBlinking=options.get(22),this._cursorStyle=options.get(24),this._cursorSmoothCaretAnimation=options.get(23),this._updateBlinking(),this._updateDomClassName(),this._primaryCursor.onConfigurationChanged(e);for(let i=0,len=this._secondaryCursors.length;i<len;i++)this._secondaryCursors[i].onConfigurationChanged(e);return!0}_onCursorPositionChanged(position,secondaryPositions){if(this._primaryCursor.onCursorPositionChanged(position),this._updateBlinking(),this._secondaryCursors.length<secondaryPositions.length){const addCnt=secondaryPositions.length-this._secondaryCursors.length;for(let i=0;i<addCnt;i++){const newCursor=new ViewCursor(this._context);this._domNode.domNode.insertBefore(newCursor.getDomNode().domNode,this._primaryCursor.getDomNode().domNode.nextSibling),this._secondaryCursors.push(newCursor)}}else if(this._secondaryCursors.length>secondaryPositions.length){const removeCnt=this._secondaryCursors.length-secondaryPositions.length;for(let i=0;i<removeCnt;i++)this._domNode.removeChild(this._secondaryCursors[0].getDomNode()),this._secondaryCursors.splice(0,1)}for(let i=0;i<secondaryPositions.length;i++)this._secondaryCursors[i].onCursorPositionChanged(secondaryPositions[i])}onCursorStateChanged(e){const positions=[];for(let i=0,len=e.selections.length;i<len;i++)positions[i]=e.selections[i].getPosition();this._onCursorPositionChanged(positions[0],positions.slice(1));const selectionIsEmpty=e.selections[0].isEmpty();return this._selectionIsEmpty!==selectionIsEmpty&&(this._selectionIsEmpty=selectionIsEmpty,this._updateDomClassName()),!0}onDecorationsChanged(e){return!0}onFlushed(e){return!0}onFocusChanged(e){return this._editorHasFocus=e.isFocused,this._updateBlinking(),!1}onLinesChanged(e){return!0}onLinesDeleted(e){return!0}onLinesInserted(e){return!0}onScrollChanged(e){return!0}onTokensChanged(e){const shouldRender=position=>{for(let i=0,len=e.ranges.length;i<len;i++)if(e.ranges[i].fromLineNumber<=position.lineNumber&&position.lineNumber<=e.ranges[i].toLineNumber)return!0;return!1};if(shouldRender(this._primaryCursor.getPosition()))return!0;for(const secondaryCursor of this._secondaryCursors)if(shouldRender(secondaryCursor.getPosition()))return!0;return!1}onZonesChanged(e){return!0}_getCursorBlinking(){return this._isComposingInput?0:this._editorHasFocus?this._readOnly?5:this._cursorBlinking:0}_updateBlinking(){this._startCursorBlinkAnimation.cancel(),this._cursorFlatBlinkInterval.cancel();const blinkingStyle=this._getCursorBlinking(),isHidden=0===blinkingStyle,isSolid=5===blinkingStyle;isHidden?this._hide():this._show(),this._blinkingEnabled=!1,this._updateDomClassName(),isHidden||isSolid||(1===blinkingStyle?this._cursorFlatBlinkInterval.cancelAndSet((()=>{this._isVisible?this._hide():this._show()}),ViewCursors.BLINK_INTERVAL):this._startCursorBlinkAnimation.setIfNotSet((()=>{this._blinkingEnabled=!0,this._updateDomClassName()}),ViewCursors.BLINK_INTERVAL))}_updateDomClassName(){this._domNode.setClassName(this._getClassName())}_getClassName(){let result="cursors-layer";switch(this._selectionIsEmpty||(result+=" has-selection"),this._cursorStyle){case TextEditorCursorStyle.Line:result+=" cursor-line-style";break;case TextEditorCursorStyle.Block:result+=" cursor-block-style";break;case TextEditorCursorStyle.Underline:result+=" cursor-underline-style";break;case TextEditorCursorStyle.LineThin:result+=" cursor-line-thin-style";break;case TextEditorCursorStyle.BlockOutline:result+=" cursor-block-outline-style";break;case TextEditorCursorStyle.UnderlineThin:result+=" cursor-underline-thin-style";break;default:result+=" cursor-line-style"}if(this._blinkingEnabled)switch(this._getCursorBlinking()){case 1:result+=" cursor-blink";break;case 2:result+=" cursor-smooth";break;case 3:result+=" cursor-phase";break;case 4:result+=" cursor-expand";break;default:result+=" cursor-solid"}else result+=" cursor-solid";return this._cursorSmoothCaretAnimation&&(result+=" cursor-smooth-caret-animation"),result}_show(){this._primaryCursor.show();for(let i=0,len=this._secondaryCursors.length;i<len;i++)this._secondaryCursors[i].show();this._isVisible=!0}_hide(){this._primaryCursor.hide();for(let i=0,len=this._secondaryCursors.length;i<len;i++)this._secondaryCursors[i].hide();this._isVisible=!1}prepareRender(ctx){this._primaryCursor.prepareRender(ctx);for(let i=0,len=this._secondaryCursors.length;i<len;i++)this._secondaryCursors[i].prepareRender(ctx)}render(ctx){const renderData=[];let renderDataLen=0;const primaryRenderData=this._primaryCursor.render(ctx);primaryRenderData&&(renderData[renderDataLen++]=primaryRenderData);for(let i=0,len=this._secondaryCursors.length;i<len;i++){const secondaryRenderData=this._secondaryCursors[i].render(ctx);secondaryRenderData&&(renderData[renderDataLen++]=secondaryRenderData)}this._renderData=renderData}getLastRenderData(){return this._renderData}}ViewCursors.BLINK_INTERVAL=500,registerThemingParticipant(((theme,collector)=>{const caret=theme.getColor(editorCursorForeground);if(caret){let caretBackground=theme.getColor(editorCursorBackground);caretBackground||(caretBackground=caret.opposite()),collector.addRule(`.monaco-editor .inputarea.ime-input { caret-color: ${caret}; }`),collector.addRule(`.monaco-editor .cursors-layer .cursor { background-color: ${caret}; border-color: ${caret}; color: ${caretBackground}; }`),isHighContrast(theme.type)&&collector.addRule(`.monaco-editor .cursors-layer.has-selection .cursor { border-left: 1px solid ${caretBackground}; border-right: 1px solid ${caretBackground}; }`)}}));