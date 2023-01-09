import{SingleCursorState}from"../cursorCommon.js";import{Position}from"../core/position.js";import{Range}from"../core/range.js";export class ColumnSelection{static columnSelect(config,model,fromLineNumber,fromVisibleColumn,toLineNumber,toVisibleColumn){const lineCount=Math.abs(toLineNumber-fromLineNumber)+1,reversed=fromLineNumber>toLineNumber,isRTL=fromVisibleColumn>toVisibleColumn,isLTR=fromVisibleColumn<toVisibleColumn,result=[];for(let i=0;i<lineCount;i++){const lineNumber=fromLineNumber+(reversed?-i:i),startColumn=config.columnFromVisibleColumn(model,lineNumber,fromVisibleColumn),endColumn=config.columnFromVisibleColumn(model,lineNumber,toVisibleColumn),visibleStartColumn=config.visibleColumnFromColumn(model,new Position(lineNumber,startColumn)),visibleEndColumn=config.visibleColumnFromColumn(model,new Position(lineNumber,endColumn));if(isLTR){if(visibleStartColumn>toVisibleColumn)continue;if(visibleEndColumn<fromVisibleColumn)continue}if(isRTL){if(visibleEndColumn>fromVisibleColumn)continue;if(visibleStartColumn<toVisibleColumn)continue}result.push(new SingleCursorState(new Range(lineNumber,startColumn,lineNumber,startColumn),0,new Position(lineNumber,endColumn),0))}if(0===result.length)for(let i=0;i<lineCount;i++){const lineNumber=fromLineNumber+(reversed?-i:i),maxColumn=model.getLineMaxColumn(lineNumber);result.push(new SingleCursorState(new Range(lineNumber,maxColumn,lineNumber,maxColumn),0,new Position(lineNumber,maxColumn),0))}return{viewStates:result,reversed,fromLineNumber,fromVisualColumn:fromVisibleColumn,toLineNumber,toVisualColumn:toVisibleColumn}}static columnSelectLeft(config,model,prevColumnSelectData){let toViewVisualColumn=prevColumnSelectData.toViewVisualColumn;return toViewVisualColumn>0&&toViewVisualColumn--,ColumnSelection.columnSelect(config,model,prevColumnSelectData.fromViewLineNumber,prevColumnSelectData.fromViewVisualColumn,prevColumnSelectData.toViewLineNumber,toViewVisualColumn)}static columnSelectRight(config,model,prevColumnSelectData){let maxVisualViewColumn=0;const minViewLineNumber=Math.min(prevColumnSelectData.fromViewLineNumber,prevColumnSelectData.toViewLineNumber),maxViewLineNumber=Math.max(prevColumnSelectData.fromViewLineNumber,prevColumnSelectData.toViewLineNumber);for(let lineNumber=minViewLineNumber;lineNumber<=maxViewLineNumber;lineNumber++){const lineMaxViewColumn=model.getLineMaxColumn(lineNumber),lineMaxVisualViewColumn=config.visibleColumnFromColumn(model,new Position(lineNumber,lineMaxViewColumn));maxVisualViewColumn=Math.max(maxVisualViewColumn,lineMaxVisualViewColumn)}let toViewVisualColumn=prevColumnSelectData.toViewVisualColumn;return toViewVisualColumn<maxVisualViewColumn&&toViewVisualColumn++,this.columnSelect(config,model,prevColumnSelectData.fromViewLineNumber,prevColumnSelectData.fromViewVisualColumn,prevColumnSelectData.toViewLineNumber,toViewVisualColumn)}static columnSelectUp(config,model,prevColumnSelectData,isPaged){const linesCount=isPaged?config.pageSize:1,toViewLineNumber=Math.max(1,prevColumnSelectData.toViewLineNumber-linesCount);return this.columnSelect(config,model,prevColumnSelectData.fromViewLineNumber,prevColumnSelectData.fromViewVisualColumn,toViewLineNumber,prevColumnSelectData.toViewVisualColumn)}static columnSelectDown(config,model,prevColumnSelectData,isPaged){const linesCount=isPaged?config.pageSize:1,toViewLineNumber=Math.min(model.getLineCount(),prevColumnSelectData.toViewLineNumber+linesCount);return this.columnSelect(config,model,prevColumnSelectData.fromViewLineNumber,prevColumnSelectData.fromViewVisualColumn,toViewLineNumber,prevColumnSelectData.toViewVisualColumn)}}