import{CharacterClassifier}from"../core/characterClassifier.js";export class Uint8Matrix{constructor(rows,cols,defaultValue){const data=new Uint8Array(rows*cols);for(let i=0,len=rows*cols;i<len;i++)data[i]=defaultValue;this._data=data,this.rows=rows,this.cols=cols}get(row,col){return this._data[row*this.cols+col]}set(row,col,value){this._data[row*this.cols+col]=value}}export class StateMachine{constructor(edges){let maxCharCode=0,maxState=0;for(let i=0,len=edges.length;i<len;i++){const[from,chCode,to]=edges[i];chCode>maxCharCode&&(maxCharCode=chCode),from>maxState&&(maxState=from),to>maxState&&(maxState=to)}maxCharCode++,maxState++;const states=new Uint8Matrix(maxState,maxCharCode,0);for(let i=0,len=edges.length;i<len;i++){const[from,chCode,to]=edges[i];states.set(from,chCode,to)}this._states=states,this._maxCharCode=maxCharCode}nextState(currentState,chCode){return chCode<0||chCode>=this._maxCharCode?0:this._states.get(currentState,chCode)}}let _stateMachine=null;function getStateMachine(){return null===_stateMachine&&(_stateMachine=new StateMachine([[1,104,2],[1,72,2],[1,102,6],[1,70,6],[2,116,3],[2,84,3],[3,116,4],[3,84,4],[4,112,5],[4,80,5],[5,115,9],[5,83,9],[5,58,10],[6,105,7],[6,73,7],[7,108,8],[7,76,8],[8,101,9],[8,69,9],[9,58,10],[10,47,11],[11,47,12]])),_stateMachine}let _classifier=null;function getClassifier(){if(null===_classifier){_classifier=new CharacterClassifier(0);const FORCE_TERMINATION_CHARACTERS=" \t<>'\"、。｡､，．：；‘〈「『〔（［｛｢｣｝］）〕』」〉’｀～…";for(let i=0;i<FORCE_TERMINATION_CHARACTERS.length;i++)_classifier.set(FORCE_TERMINATION_CHARACTERS.charCodeAt(i),1);const CANNOT_END_WITH_CHARACTERS=".,;:";for(let i=0;i<CANNOT_END_WITH_CHARACTERS.length;i++)_classifier.set(CANNOT_END_WITH_CHARACTERS.charCodeAt(i),2)}return _classifier}export class LinkComputer{static _createLink(classifier,line,lineNumber,linkBeginIndex,linkEndIndex){let lastIncludedCharIndex=linkEndIndex-1;do{const chCode=line.charCodeAt(lastIncludedCharIndex);if(2!==classifier.get(chCode))break;lastIncludedCharIndex--}while(lastIncludedCharIndex>linkBeginIndex);if(linkBeginIndex>0){const charCodeBeforeLink=line.charCodeAt(linkBeginIndex-1),lastCharCodeInLink=line.charCodeAt(lastIncludedCharIndex);(40===charCodeBeforeLink&&41===lastCharCodeInLink||91===charCodeBeforeLink&&93===lastCharCodeInLink||123===charCodeBeforeLink&&125===lastCharCodeInLink)&&lastIncludedCharIndex--}return{range:{startLineNumber:lineNumber,startColumn:linkBeginIndex+1,endLineNumber:lineNumber,endColumn:lastIncludedCharIndex+2},url:line.substring(linkBeginIndex,lastIncludedCharIndex+1)}}static computeLinks(model,stateMachine=getStateMachine()){const classifier=getClassifier(),result=[];for(let i=1,lineCount=model.getLineCount();i<=lineCount;i++){const line=model.getLineContent(i),len=line.length;let j=0,linkBeginIndex=0,linkBeginChCode=0,state=1,hasOpenParens=!1,hasOpenSquareBracket=!1,inSquareBrackets=!1,hasOpenCurlyBracket=!1;for(;j<len;){let resetStateMachine=!1;const chCode=line.charCodeAt(j);if(13===state){let chClass;switch(chCode){case 40:hasOpenParens=!0,chClass=0;break;case 41:chClass=hasOpenParens?0:1;break;case 91:inSquareBrackets=!0,hasOpenSquareBracket=!0,chClass=0;break;case 93:inSquareBrackets=!1,chClass=hasOpenSquareBracket?0:1;break;case 123:hasOpenCurlyBracket=!0,chClass=0;break;case 125:chClass=hasOpenCurlyBracket?0:1;break;case 39:chClass=39===linkBeginChCode?1:0;break;case 34:chClass=34===linkBeginChCode?1:0;break;case 96:chClass=96===linkBeginChCode?1:0;break;case 42:chClass=42===linkBeginChCode?1:0;break;case 124:chClass=124===linkBeginChCode?1:0;break;case 32:chClass=inSquareBrackets?0:1;break;default:chClass=classifier.get(chCode)}1===chClass&&(result.push(LinkComputer._createLink(classifier,line,i,linkBeginIndex,j)),resetStateMachine=!0)}else if(12===state){let chClass;91===chCode?(hasOpenSquareBracket=!0,chClass=0):chClass=classifier.get(chCode),1===chClass?resetStateMachine=!0:state=13}else state=stateMachine.nextState(state,chCode),0===state&&(resetStateMachine=!0);resetStateMachine&&(state=1,hasOpenParens=!1,hasOpenSquareBracket=!1,hasOpenCurlyBracket=!1,linkBeginIndex=j+1,linkBeginChCode=chCode),j++}13===state&&result.push(LinkComputer._createLink(classifier,line,i,linkBeginIndex,len))}return result}}export function computeLinks(model){return model&&"function"==typeof model.getLineCount&&"function"==typeof model.getLineContent?LinkComputer.computeLinks(model):[]}