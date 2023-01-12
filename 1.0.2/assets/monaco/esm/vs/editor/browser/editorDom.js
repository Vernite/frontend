import*as dom from"../../base/browser/dom.js";import{GlobalPointerMoveMonitor}from"../../base/browser/globalPointerMoveMonitor.js";import{StandardMouseEvent}from"../../base/browser/mouseEvent.js";import{RunOnceScheduler}from"../../base/common/async.js";import{Disposable}from"../../base/common/lifecycle.js";import{asCssVariableName}from"../../platform/theme/common/colorRegistry.js";export class PageCoordinates{constructor(x,y){this.x=x,this.y=y,this._pageCoordinatesBrand=void 0}toClientCoordinates(){return new ClientCoordinates(this.x-dom.StandardWindow.scrollX,this.y-dom.StandardWindow.scrollY)}}export class ClientCoordinates{constructor(clientX,clientY){this.clientX=clientX,this.clientY=clientY,this._clientCoordinatesBrand=void 0}toPageCoordinates(){return new PageCoordinates(this.clientX+dom.StandardWindow.scrollX,this.clientY+dom.StandardWindow.scrollY)}}export class EditorPagePosition{constructor(x,y,width,height){this.x=x,this.y=y,this.width=width,this.height=height,this._editorPagePositionBrand=void 0}}export class CoordinatesRelativeToEditor{constructor(x,y){this.x=x,this.y=y,this._positionRelativeToEditorBrand=void 0}}export function createEditorPagePosition(editorViewDomNode){const editorPos=dom.getDomNodePagePosition(editorViewDomNode);return new EditorPagePosition(editorPos.left,editorPos.top,editorPos.width,editorPos.height)}export function createCoordinatesRelativeToEditor(editorViewDomNode,editorPagePosition,pos){const scaleX=editorPagePosition.width/editorViewDomNode.offsetWidth,scaleY=editorPagePosition.height/editorViewDomNode.offsetHeight,relativeX=(pos.x-editorPagePosition.x)/scaleX,relativeY=(pos.y-editorPagePosition.y)/scaleY;return new CoordinatesRelativeToEditor(relativeX,relativeY)}export class EditorMouseEvent extends StandardMouseEvent{constructor(e,isFromPointerCapture,editorViewDomNode){super(e),this._editorMouseEventBrand=void 0,this.isFromPointerCapture=isFromPointerCapture,this.pos=new PageCoordinates(this.posx,this.posy),this.editorPos=createEditorPagePosition(editorViewDomNode),this.relativePos=createCoordinatesRelativeToEditor(editorViewDomNode,this.editorPos,this.pos)}}export class EditorMouseEventFactory{constructor(editorViewDomNode){this._editorViewDomNode=editorViewDomNode}_create(e){return new EditorMouseEvent(e,!1,this._editorViewDomNode)}onContextMenu(target,callback){return dom.addDisposableListener(target,"contextmenu",(e=>{callback(this._create(e))}))}onMouseUp(target,callback){return dom.addDisposableListener(target,"mouseup",(e=>{callback(this._create(e))}))}onMouseDown(target,callback){return dom.addDisposableListener(target,dom.EventType.MOUSE_DOWN,(e=>{callback(this._create(e))}))}onPointerDown(target,callback){return dom.addDisposableListener(target,dom.EventType.POINTER_DOWN,(e=>{callback(this._create(e),e.pointerId)}))}onMouseLeave(target,callback){return dom.addDisposableListener(target,dom.EventType.MOUSE_LEAVE,(e=>{callback(this._create(e))}))}onMouseMove(target,callback){return dom.addDisposableListener(target,"mousemove",(e=>callback(this._create(e))))}}export class EditorPointerEventFactory{constructor(editorViewDomNode){this._editorViewDomNode=editorViewDomNode}_create(e){return new EditorMouseEvent(e,!1,this._editorViewDomNode)}onPointerUp(target,callback){return dom.addDisposableListener(target,"pointerup",(e=>{callback(this._create(e))}))}onPointerDown(target,callback){return dom.addDisposableListener(target,dom.EventType.POINTER_DOWN,(e=>{callback(this._create(e),e.pointerId)}))}onPointerLeave(target,callback){return dom.addDisposableListener(target,dom.EventType.POINTER_LEAVE,(e=>{callback(this._create(e))}))}onPointerMove(target,callback){return dom.addDisposableListener(target,"pointermove",(e=>callback(this._create(e))))}}export class GlobalEditorPointerMoveMonitor extends Disposable{constructor(editorViewDomNode){super(),this._editorViewDomNode=editorViewDomNode,this._globalPointerMoveMonitor=this._register(new GlobalPointerMoveMonitor),this._keydownListener=null}startMonitoring(initialElement,pointerId,initialButtons,pointerMoveCallback,onStopCallback){this._keydownListener=dom.addStandardDisposableListener(document,"keydown",(e=>{e.toKeybinding().isModifierKey()||this._globalPointerMoveMonitor.stopMonitoring(!0,e.browserEvent)}),!0),this._globalPointerMoveMonitor.startMonitoring(initialElement,pointerId,initialButtons,(e=>{pointerMoveCallback(new EditorMouseEvent(e,!0,this._editorViewDomNode))}),(e=>{this._keydownListener.dispose(),onStopCallback(e)}))}stopMonitoring(){this._globalPointerMoveMonitor.stopMonitoring(!0)}}export class DynamicCssRules{constructor(_editor){this._editor=_editor,this._instanceId=++DynamicCssRules._idPool,this._counter=0,this._rules=new Map,this._garbageCollectionScheduler=new RunOnceScheduler((()=>this.garbageCollect()),1e3)}createClassNameRef(options){const rule=this.getOrCreateRule(options);return rule.increaseRefCount(),{className:rule.className,dispose:()=>{rule.decreaseRefCount(),this._garbageCollectionScheduler.schedule()}}}getOrCreateRule(properties){const key=this.computeUniqueKey(properties);let existingRule=this._rules.get(key);if(!existingRule){const counter=this._counter++;existingRule=new RefCountedCssRule(key,`dyn-rule-${this._instanceId}-${counter}`,dom.isInShadowDOM(this._editor.getContainerDomNode())?this._editor.getContainerDomNode():void 0,properties),this._rules.set(key,existingRule)}return existingRule}computeUniqueKey(properties){return JSON.stringify(properties)}garbageCollect(){for(const rule of this._rules.values())rule.hasReferences()||(this._rules.delete(rule.key),rule.dispose())}}DynamicCssRules._idPool=0;class RefCountedCssRule{constructor(key,className,_containerElement,properties){this.key=key,this.className=className,this.properties=properties,this._referenceCount=0,this._styleElement=dom.createStyleSheet(_containerElement),this._styleElement.textContent=this.getCssText(this.className,this.properties)}getCssText(className,properties){let str=`.${className} {`;for(const prop in properties){const value=properties[prop];let cssValue;cssValue="object"==typeof value?`var(${asCssVariableName(value.id)})`:value;str+=`\n\t${camelToDashes(prop)}: ${cssValue};`}return str+="\n}",str}dispose(){this._styleElement.remove()}increaseRefCount(){this._referenceCount++}decreaseRefCount(){this._referenceCount--}hasReferences(){return this._referenceCount>0}}function camelToDashes(str){return str.replace(/(^[A-Z])/,(([first])=>first.toLowerCase())).replace(/([A-Z])/g,(([letter])=>`-${letter.toLowerCase()}`))}