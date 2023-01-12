import*as DOM from"./dom.js";export function renderText(text,options={}){const element=createElement(options);return element.textContent=text,element}export function renderFormattedText(formattedText,options={}){const element=createElement(options);return _renderFormattedText(element,parseFormattedText(formattedText,!!options.renderCodeSegments),options.actionHandler,options.renderCodeSegments),element}export function createElement(options){const tagName=options.inline?"span":"div",element=document.createElement(tagName);return options.className&&(element.className=options.className),element}class StringStream{constructor(source){this.source=source,this.index=0}eos(){return this.index>=this.source.length}next(){const next=this.peek();return this.advance(),next}peek(){return this.source[this.index]}advance(){this.index++}}function _renderFormattedText(element,treeNode,actionHandler,renderCodeSegments){let child;if(2===treeNode.type)child=document.createTextNode(treeNode.content||"");else if(3===treeNode.type)child=document.createElement("b");else if(4===treeNode.type)child=document.createElement("i");else if(7===treeNode.type&&renderCodeSegments)child=document.createElement("code");else if(5===treeNode.type&&actionHandler){const a=document.createElement("a");actionHandler.disposables.add(DOM.addStandardDisposableListener(a,"click",(event=>{actionHandler.callback(String(treeNode.index),event)}))),child=a}else 8===treeNode.type?child=document.createElement("br"):1===treeNode.type&&(child=element);child&&element!==child&&element.appendChild(child),child&&Array.isArray(treeNode.children)&&treeNode.children.forEach((nodeChild=>{_renderFormattedText(child,nodeChild,actionHandler,renderCodeSegments)}))}function parseFormattedText(content,parseCodeSegments){const root={type:1,children:[]};let actionViewItemIndex=0,current=root;const stack=[],stream=new StringStream(content);for(;!stream.eos();){let next=stream.next();const isEscapedFormatType="\\"===next&&0!==formatTagType(stream.peek(),parseCodeSegments);if(isEscapedFormatType&&(next=stream.next()),!isEscapedFormatType&&isFormatTag(next,parseCodeSegments)&&next===stream.peek()){stream.advance(),2===current.type&&(current=stack.pop());const type=formatTagType(next,parseCodeSegments);if(current.type===type||5===current.type&&6===type)current=stack.pop();else{const newCurrent={type,children:[]};5===type&&(newCurrent.index=actionViewItemIndex,actionViewItemIndex++),current.children.push(newCurrent),stack.push(current),current=newCurrent}}else if("\n"===next)2===current.type&&(current=stack.pop()),current.children.push({type:8});else if(2!==current.type){const textCurrent={type:2,content:next};current.children.push(textCurrent),stack.push(current),current=textCurrent}else current.content+=next}return 2===current.type&&(current=stack.pop()),stack.length,root}function isFormatTag(char,supportCodeSegments){return 0!==formatTagType(char,supportCodeSegments)}function formatTagType(char,supportCodeSegments){switch(char){case"*":return 3;case"_":return 4;case"[":return 5;case"]":return 6;case"`":return supportCodeSegments?7:0;default:return 0}}