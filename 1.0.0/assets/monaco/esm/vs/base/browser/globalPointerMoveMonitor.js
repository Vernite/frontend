import*as dom from"./dom.js";import{DisposableStore,toDisposable}from"../common/lifecycle.js";export class GlobalPointerMoveMonitor{constructor(){this._hooks=new DisposableStore,this._pointerMoveCallback=null,this._onStopCallback=null}dispose(){this.stopMonitoring(!1),this._hooks.dispose()}stopMonitoring(invokeStopCallback,browserEvent){if(!this.isMonitoring())return;this._hooks.clear(),this._pointerMoveCallback=null;const onStopCallback=this._onStopCallback;this._onStopCallback=null,invokeStopCallback&&onStopCallback&&onStopCallback(browserEvent)}isMonitoring(){return!!this._pointerMoveCallback}startMonitoring(initialElement,pointerId,initialButtons,pointerMoveCallback,onStopCallback){this.isMonitoring()&&this.stopMonitoring(!1),this._pointerMoveCallback=pointerMoveCallback,this._onStopCallback=onStopCallback;let eventSource=initialElement;try{initialElement.setPointerCapture(pointerId),this._hooks.add(toDisposable((()=>{initialElement.releasePointerCapture(pointerId)})))}catch(err){eventSource=window}this._hooks.add(dom.addDisposableListener(eventSource,dom.EventType.POINTER_MOVE,(e=>{e.buttons===initialButtons?(e.preventDefault(),this._pointerMoveCallback(e)):this.stopMonitoring(!0)}))),this._hooks.add(dom.addDisposableListener(eventSource,dom.EventType.POINTER_UP,(e=>this.stopMonitoring(!0))))}}