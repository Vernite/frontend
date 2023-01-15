import{CoreNavigationCommands}from"../coreCommands.js";import{Position}from"../../common/core/position.js";import*as platform from"../../../base/common/platform.js";export class ViewController{constructor(configuration,viewModel,userInputEvents,commandDelegate){this.configuration=configuration,this.viewModel=viewModel,this.userInputEvents=userInputEvents,this.commandDelegate=commandDelegate}paste(text,pasteOnNewLine,multicursorText,mode){this.commandDelegate.paste(text,pasteOnNewLine,multicursorText,mode)}type(text){this.commandDelegate.type(text)}compositionType(text,replacePrevCharCnt,replaceNextCharCnt,positionDelta){this.commandDelegate.compositionType(text,replacePrevCharCnt,replaceNextCharCnt,positionDelta)}compositionStart(){this.commandDelegate.startComposition()}compositionEnd(){this.commandDelegate.endComposition()}cut(){this.commandDelegate.cut()}setSelection(modelSelection){CoreNavigationCommands.SetSelection.runCoreEditorCommand(this.viewModel,{source:"keyboard",selection:modelSelection})}_validateViewColumn(viewPosition){const minColumn=this.viewModel.getLineMinColumn(viewPosition.lineNumber);return viewPosition.column<minColumn?new Position(viewPosition.lineNumber,minColumn):viewPosition}_hasMulticursorModifier(data){switch(this.configuration.options.get(72)){case"altKey":return data.altKey;case"ctrlKey":return data.ctrlKey;case"metaKey":return data.metaKey;default:return!1}}_hasNonMulticursorModifier(data){switch(this.configuration.options.get(72)){case"altKey":return data.ctrlKey||data.metaKey;case"ctrlKey":return data.altKey||data.metaKey;case"metaKey":return data.ctrlKey||data.altKey;default:return!1}}dispatchMouse(data){const options=this.configuration.options,selectionClipboardIsOn=platform.isLinux&&options.get(98),columnSelection=options.get(18);data.middleButton&&!selectionClipboardIsOn?this._columnSelect(data.position,data.mouseColumn,data.inSelectionMode):data.startedOnLineNumbers?this._hasMulticursorModifier(data)?data.inSelectionMode?this._lastCursorLineSelect(data.position):this._createCursor(data.position,!0):data.inSelectionMode?this._lineSelectDrag(data.position):this._lineSelect(data.position):data.mouseDownCount>=4?this._selectAll():3===data.mouseDownCount?this._hasMulticursorModifier(data)?data.inSelectionMode?this._lastCursorLineSelectDrag(data.position):this._lastCursorLineSelect(data.position):data.inSelectionMode?this._lineSelectDrag(data.position):this._lineSelect(data.position):2===data.mouseDownCount?data.onInjectedText||(this._hasMulticursorModifier(data)?this._lastCursorWordSelect(data.position):data.inSelectionMode?this._wordSelectDrag(data.position):this._wordSelect(data.position)):this._hasMulticursorModifier(data)?this._hasNonMulticursorModifier(data)||(data.shiftKey?this._columnSelect(data.position,data.mouseColumn,!0):data.inSelectionMode?this._lastCursorMoveToSelect(data.position):this._createCursor(data.position,!1)):data.inSelectionMode?data.altKey||columnSelection?this._columnSelect(data.position,data.mouseColumn,!0):this._moveToSelect(data.position):this.moveTo(data.position)}_usualArgs(viewPosition){return viewPosition=this._validateViewColumn(viewPosition),{source:"mouse",position:this._convertViewToModelPosition(viewPosition),viewPosition}}moveTo(viewPosition){CoreNavigationCommands.MoveTo.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_moveToSelect(viewPosition){CoreNavigationCommands.MoveToSelect.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_columnSelect(viewPosition,mouseColumn,doColumnSelect){viewPosition=this._validateViewColumn(viewPosition),CoreNavigationCommands.ColumnSelect.runCoreEditorCommand(this.viewModel,{source:"mouse",position:this._convertViewToModelPosition(viewPosition),viewPosition,mouseColumn,doColumnSelect})}_createCursor(viewPosition,wholeLine){viewPosition=this._validateViewColumn(viewPosition),CoreNavigationCommands.CreateCursor.runCoreEditorCommand(this.viewModel,{source:"mouse",position:this._convertViewToModelPosition(viewPosition),viewPosition,wholeLine})}_lastCursorMoveToSelect(viewPosition){CoreNavigationCommands.LastCursorMoveToSelect.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_wordSelect(viewPosition){CoreNavigationCommands.WordSelect.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_wordSelectDrag(viewPosition){CoreNavigationCommands.WordSelectDrag.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_lastCursorWordSelect(viewPosition){CoreNavigationCommands.LastCursorWordSelect.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_lineSelect(viewPosition){CoreNavigationCommands.LineSelect.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_lineSelectDrag(viewPosition){CoreNavigationCommands.LineSelectDrag.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_lastCursorLineSelect(viewPosition){CoreNavigationCommands.LastCursorLineSelect.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_lastCursorLineSelectDrag(viewPosition){CoreNavigationCommands.LastCursorLineSelectDrag.runCoreEditorCommand(this.viewModel,this._usualArgs(viewPosition))}_selectAll(){CoreNavigationCommands.SelectAll.runCoreEditorCommand(this.viewModel,{source:"mouse"})}_convertViewToModelPosition(viewPosition){return this.viewModel.coordinatesConverter.convertViewPositionToModelPosition(viewPosition)}emitKeyDown(e){this.userInputEvents.emitKeyDown(e)}emitKeyUp(e){this.userInputEvents.emitKeyUp(e)}emitContextMenu(e){this.userInputEvents.emitContextMenu(e)}emitMouseMove(e){this.userInputEvents.emitMouseMove(e)}emitMouseLeave(e){this.userInputEvents.emitMouseLeave(e)}emitMouseUp(e){this.userInputEvents.emitMouseUp(e)}emitMouseDown(e){this.userInputEvents.emitMouseDown(e)}emitMouseDrag(e){this.userInputEvents.emitMouseDrag(e)}emitMouseDrop(e){this.userInputEvents.emitMouseDrop(e)}emitMouseDropCanceled(){this.userInputEvents.emitMouseDropCanceled()}emitMouseWheel(e){this.userInputEvents.emitMouseWheel(e)}}