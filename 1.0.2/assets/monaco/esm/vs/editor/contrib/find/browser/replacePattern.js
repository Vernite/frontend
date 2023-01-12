import{buildReplaceStringWithCasePreserved}from"../../../../base/common/search.js";class StaticValueReplacePattern{constructor(staticValue){this.staticValue=staticValue,this.kind=0}}class DynamicPiecesReplacePattern{constructor(pieces){this.pieces=pieces,this.kind=1}}export class ReplacePattern{constructor(pieces){pieces&&0!==pieces.length?1===pieces.length&&null!==pieces[0].staticValue?this._state=new StaticValueReplacePattern(pieces[0].staticValue):this._state=new DynamicPiecesReplacePattern(pieces):this._state=new StaticValueReplacePattern("")}static fromStaticValue(value){return new ReplacePattern([ReplacePiece.staticValue(value)])}get hasReplacementPatterns(){return 1===this._state.kind}buildReplaceString(matches,preserveCase){if(0===this._state.kind)return preserveCase?buildReplaceStringWithCasePreserved(matches,this._state.staticValue):this._state.staticValue;let result="";for(let i=0,len=this._state.pieces.length;i<len;i++){const piece=this._state.pieces[i];if(null!==piece.staticValue){result+=piece.staticValue;continue}let match=ReplacePattern._substitute(piece.matchIndex,matches);if(null!==piece.caseOps&&piece.caseOps.length>0){const repl=[],lenOps=piece.caseOps.length;let opIdx=0;for(let idx=0,len=match.length;idx<len;idx++){if(opIdx>=lenOps){repl.push(match.slice(idx));break}switch(piece.caseOps[opIdx]){case"U":repl.push(match[idx].toUpperCase());break;case"u":repl.push(match[idx].toUpperCase()),opIdx++;break;case"L":repl.push(match[idx].toLowerCase());break;case"l":repl.push(match[idx].toLowerCase()),opIdx++;break;default:repl.push(match[idx])}}match=repl.join("")}result+=match}return result}static _substitute(matchIndex,matches){if(null===matches)return"";if(0===matchIndex)return matches[0];let remainder="";for(;matchIndex>0;){if(matchIndex<matches.length){return(matches[matchIndex]||"")+remainder}remainder=String(matchIndex%10)+remainder,matchIndex=Math.floor(matchIndex/10)}return"$"+remainder}}export class ReplacePiece{constructor(staticValue,matchIndex,caseOps){this.staticValue=staticValue,this.matchIndex=matchIndex,caseOps&&0!==caseOps.length?this.caseOps=caseOps.slice(0):this.caseOps=null}static staticValue(value){return new ReplacePiece(value,-1,null)}static caseOps(index,caseOps){return new ReplacePiece(null,index,caseOps)}}class ReplacePieceBuilder{constructor(source){this._source=source,this._lastCharIndex=0,this._result=[],this._resultLen=0,this._currentStaticPiece=""}emitUnchanged(toCharIndex){this._emitStatic(this._source.substring(this._lastCharIndex,toCharIndex)),this._lastCharIndex=toCharIndex}emitStatic(value,toCharIndex){this._emitStatic(value),this._lastCharIndex=toCharIndex}_emitStatic(value){0!==value.length&&(this._currentStaticPiece+=value)}emitMatchIndex(index,toCharIndex,caseOps){0!==this._currentStaticPiece.length&&(this._result[this._resultLen++]=ReplacePiece.staticValue(this._currentStaticPiece),this._currentStaticPiece=""),this._result[this._resultLen++]=ReplacePiece.caseOps(index,caseOps),this._lastCharIndex=toCharIndex}finalize(){return this.emitUnchanged(this._source.length),0!==this._currentStaticPiece.length&&(this._result[this._resultLen++]=ReplacePiece.staticValue(this._currentStaticPiece),this._currentStaticPiece=""),new ReplacePattern(this._result)}}export function parseReplaceString(replaceString){if(!replaceString||0===replaceString.length)return new ReplacePattern(null);const caseOps=[],result=new ReplacePieceBuilder(replaceString);for(let i=0,len=replaceString.length;i<len;i++){const chCode=replaceString.charCodeAt(i);if(92!==chCode){if(36===chCode){if(i++,i>=len)break;const nextChCode=replaceString.charCodeAt(i);if(36===nextChCode){result.emitUnchanged(i-1),result.emitStatic("$",i+1);continue}if(48===nextChCode||38===nextChCode){result.emitUnchanged(i-1),result.emitMatchIndex(0,i+1,caseOps),caseOps.length=0;continue}if(49<=nextChCode&&nextChCode<=57){let matchIndex=nextChCode-48;if(i+1<len){const nextNextChCode=replaceString.charCodeAt(i+1);if(48<=nextNextChCode&&nextNextChCode<=57){i++,matchIndex=10*matchIndex+(nextNextChCode-48),result.emitUnchanged(i-2),result.emitMatchIndex(matchIndex,i+1,caseOps),caseOps.length=0;continue}}result.emitUnchanged(i-1),result.emitMatchIndex(matchIndex,i+1,caseOps),caseOps.length=0;continue}}}else{if(i++,i>=len)break;const nextChCode=replaceString.charCodeAt(i);switch(nextChCode){case 92:result.emitUnchanged(i-1),result.emitStatic("\\",i+1);break;case 110:result.emitUnchanged(i-1),result.emitStatic("\n",i+1);break;case 116:result.emitUnchanged(i-1),result.emitStatic("\t",i+1);break;case 117:case 85:case 108:case 76:result.emitUnchanged(i-1),result.emitStatic("",i+1),caseOps.push(String.fromCharCode(nextChCode))}}}return result.finalize()}