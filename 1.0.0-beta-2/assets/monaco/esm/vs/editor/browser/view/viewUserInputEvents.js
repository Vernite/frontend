export class ViewUserInputEvents{constructor(coordinatesConverter){this.onKeyDown=null,this.onKeyUp=null,this.onContextMenu=null,this.onMouseMove=null,this.onMouseLeave=null,this.onMouseDown=null,this.onMouseUp=null,this.onMouseDrag=null,this.onMouseDrop=null,this.onMouseDropCanceled=null,this.onMouseWheel=null,this._coordinatesConverter=coordinatesConverter}emitKeyDown(e){var _a;null===(_a=this.onKeyDown)||void 0===_a||_a.call(this,e)}emitKeyUp(e){var _a;null===(_a=this.onKeyUp)||void 0===_a||_a.call(this,e)}emitContextMenu(e){var _a;null===(_a=this.onContextMenu)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseMove(e){var _a;null===(_a=this.onMouseMove)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseLeave(e){var _a;null===(_a=this.onMouseLeave)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseDown(e){var _a;null===(_a=this.onMouseDown)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseUp(e){var _a;null===(_a=this.onMouseUp)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseDrag(e){var _a;null===(_a=this.onMouseDrag)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseDrop(e){var _a;null===(_a=this.onMouseDrop)||void 0===_a||_a.call(this,this._convertViewToModelMouseEvent(e))}emitMouseDropCanceled(){var _a;null===(_a=this.onMouseDropCanceled)||void 0===_a||_a.call(this)}emitMouseWheel(e){var _a;null===(_a=this.onMouseWheel)||void 0===_a||_a.call(this,e)}_convertViewToModelMouseEvent(e){return e.target?{event:e.event,target:this._convertViewToModelMouseTarget(e.target)}:e}_convertViewToModelMouseTarget(target){return ViewUserInputEvents.convertViewToModelMouseTarget(target,this._coordinatesConverter)}static convertViewToModelMouseTarget(target,coordinatesConverter){const result=Object.assign({},target);return result.position&&(result.position=coordinatesConverter.convertViewPositionToModelPosition(result.position)),result.range&&(result.range=coordinatesConverter.convertViewRangeToModelRange(result.range)),result}}