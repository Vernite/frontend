import{LcsDiff}from"../../../../base/common/diff/diff.js";import*as strings from"../../../../base/common/strings.js";import{Range}from"../../../common/core/range.js";import{GhostText,GhostTextPart}from"./ghostText.js";export function minimizeInlineCompletion(model,inlineCompletion){if(!inlineCompletion)return inlineCompletion;const valueToReplace=model.getValueInRange(inlineCompletion.range),commonPrefixLen=strings.commonPrefixLength(valueToReplace,inlineCompletion.insertText),startOffset=model.getOffsetAt(inlineCompletion.range.getStartPosition())+commonPrefixLen,start=model.getPositionAt(startOffset),remainingValueToReplace=valueToReplace.substr(commonPrefixLen),commonSuffixLen=strings.commonSuffixLength(remainingValueToReplace,inlineCompletion.insertText),end=model.getPositionAt(Math.max(startOffset,model.getOffsetAt(inlineCompletion.range.getEndPosition())-commonSuffixLen));return{range:Range.fromPositions(start,end),insertText:inlineCompletion.insertText.substr(commonPrefixLen,inlineCompletion.insertText.length-commonPrefixLen-commonSuffixLen),snippetInfo:inlineCompletion.snippetInfo,filterText:inlineCompletion.filterText,additionalTextEdits:inlineCompletion.additionalTextEdits}}export function normalizedInlineCompletionsEquals(a,b){return a===b||!(!a||!b)&&(a.range.equalsRange(b.range)&&a.insertText===b.insertText&&a.command===b.command)}export function inlineCompletionToGhostText(inlineCompletion,textModel,mode,cursorPosition,previewSuffixLength=0){if(inlineCompletion.range.startLineNumber!==inlineCompletion.range.endLineNumber)return;const sourceLine=textModel.getLineContent(inlineCompletion.range.startLineNumber),sourceIndentationLength=strings.getLeadingWhitespace(sourceLine).length;if(inlineCompletion.range.startColumn-1<=sourceIndentationLength){const suggestionAddedIndentationLength=strings.getLeadingWhitespace(inlineCompletion.insertText).length,replacedIndentation=sourceLine.substring(inlineCompletion.range.startColumn-1,sourceIndentationLength),rangeThatDoesNotReplaceIndentation=Range.fromPositions(inlineCompletion.range.getStartPosition().delta(0,replacedIndentation.length),inlineCompletion.range.getEndPosition()),suggestionWithoutIndentationChange=inlineCompletion.insertText.startsWith(replacedIndentation)?inlineCompletion.insertText.substring(replacedIndentation.length):inlineCompletion.insertText.substring(suggestionAddedIndentationLength);inlineCompletion={range:rangeThatDoesNotReplaceIndentation,insertText:suggestionWithoutIndentationChange,command:inlineCompletion.command,snippetInfo:void 0,filterText:inlineCompletion.filterText,additionalTextEdits:inlineCompletion.additionalTextEdits}}const valueToBeReplaced=textModel.getValueInRange(inlineCompletion.range),changes=cachingDiff(valueToBeReplaced,inlineCompletion.insertText);if(!changes)return;const lineNumber=inlineCompletion.range.startLineNumber,parts=new Array;if("prefix"===mode){const filteredChanges=changes.filter((c=>0===c.originalLength));if(filteredChanges.length>1||1===filteredChanges.length&&filteredChanges[0].originalStart!==valueToBeReplaced.length)return}const previewStartInCompletionText=inlineCompletion.insertText.length-previewSuffixLength;for(const c of changes){const insertColumn=inlineCompletion.range.startColumn+c.originalStart+c.originalLength;if("subwordSmart"===mode&&cursorPosition&&cursorPosition.lineNumber===inlineCompletion.range.startLineNumber&&insertColumn<cursorPosition.column)return;if(c.originalLength>0)return;if(0===c.modifiedLength)continue;const modifiedEnd=c.modifiedStart+c.modifiedLength,nonPreviewTextEnd=Math.max(c.modifiedStart,Math.min(modifiedEnd,previewStartInCompletionText)),nonPreviewText=inlineCompletion.insertText.substring(c.modifiedStart,nonPreviewTextEnd),italicText=inlineCompletion.insertText.substring(nonPreviewTextEnd,Math.max(c.modifiedStart,modifiedEnd));if(nonPreviewText.length>0){const lines=strings.splitLines(nonPreviewText);parts.push(new GhostTextPart(insertColumn,lines,!1))}if(italicText.length>0){const lines=strings.splitLines(italicText);parts.push(new GhostTextPart(insertColumn,lines,!0))}}return new GhostText(lineNumber,parts,0)}let lastRequest;function cachingDiff(originalValue,newValue){if((null==lastRequest?void 0:lastRequest.originalValue)===originalValue&&(null==lastRequest?void 0:lastRequest.newValue)===newValue)return null==lastRequest?void 0:lastRequest.changes;{let changes=smartDiff(originalValue,newValue,!0);if(changes){const deletedChars=deletedCharacters(changes);if(deletedChars>0){const newChanges=smartDiff(originalValue,newValue,!1);newChanges&&deletedCharacters(newChanges)<deletedChars&&(changes=newChanges)}}return lastRequest={originalValue,newValue,changes},changes}}function deletedCharacters(changes){let sum=0;for(const c of changes)sum+=Math.max(c.originalLength-c.modifiedLength,0);return sum}function smartDiff(originalValue,newValue,smartBracketMatching){if(originalValue.length>5e3||newValue.length>5e3)return;function getMaxCharCode(val){let maxCharCode=0;for(let i=0,len=val.length;i<len;i++){const charCode=val.charCodeAt(i);charCode>maxCharCode&&(maxCharCode=charCode)}return maxCharCode}const maxCharCode=Math.max(getMaxCharCode(originalValue),getMaxCharCode(newValue));function getUniqueCharCode(id){if(id<0)throw new Error("unexpected");return maxCharCode+id+1}function getElements(source){let level=0,group=0;const characters=new Int32Array(source.length);for(let i=0,len=source.length;i<len;i++)if(smartBracketMatching&&"("===source[i]){const id=100*group+level;characters[i]=getUniqueCharCode(2*id),level++}else if(smartBracketMatching&&")"===source[i]){level=Math.max(level-1,0);const id=100*group+level;characters[i]=getUniqueCharCode(2*id+1),0===level&&group++}else characters[i]=source.charCodeAt(i);return characters}const elements1=getElements(originalValue),elements2=getElements(newValue);return new LcsDiff({getElements:()=>elements1},{getElements:()=>elements2}).ComputeDiff(!1).changes}