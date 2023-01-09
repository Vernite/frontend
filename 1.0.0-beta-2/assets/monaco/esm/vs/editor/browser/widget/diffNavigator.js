import*as assert from"../../../base/common/assert.js";import{Emitter}from"../../../base/common/event.js";import{Disposable}from"../../../base/common/lifecycle.js";import*as objects from"../../../base/common/objects.js";import{Range}from"../../common/core/range.js";const defaultOptions={followsCaret:!0,ignoreCharChanges:!0,alwaysRevealFirst:!0};export class DiffNavigator extends Disposable{constructor(editor,options={}){super(),this._onDidUpdate=this._register(new Emitter),this._editor=editor,this._options=objects.mixin(options,defaultOptions,!1),this.disposed=!1,this.nextIdx=-1,this.ranges=[],this.ignoreSelectionChange=!1,this.revealFirst=Boolean(this._options.alwaysRevealFirst),this._register(this._editor.onDidDispose((()=>this.dispose()))),this._register(this._editor.onDidUpdateDiff((()=>this._onDiffUpdated()))),this._options.followsCaret&&this._register(this._editor.getModifiedEditor().onDidChangeCursorPosition((e=>{this.ignoreSelectionChange||(this.nextIdx=-1)}))),this._options.alwaysRevealFirst&&this._register(this._editor.getModifiedEditor().onDidChangeModel((e=>{this.revealFirst=!0}))),this._init()}_init(){this._editor.getLineChanges()}_onDiffUpdated(){this._init(),this._compute(this._editor.getLineChanges()),this.revealFirst&&null!==this._editor.getLineChanges()&&(this.revealFirst=!1,this.nextIdx=-1,this.next(1))}_compute(lineChanges){this.ranges=[],lineChanges&&lineChanges.forEach((lineChange=>{!this._options.ignoreCharChanges&&lineChange.charChanges?lineChange.charChanges.forEach((charChange=>{this.ranges.push({rhs:!0,range:new Range(charChange.modifiedStartLineNumber,charChange.modifiedStartColumn,charChange.modifiedEndLineNumber,charChange.modifiedEndColumn)})})):0===lineChange.modifiedEndLineNumber?this.ranges.push({rhs:!0,range:new Range(lineChange.modifiedStartLineNumber,1,lineChange.modifiedStartLineNumber+1,1)}):this.ranges.push({rhs:!0,range:new Range(lineChange.modifiedStartLineNumber,1,lineChange.modifiedEndLineNumber+1,1)})})),this.ranges.sort(((left,right)=>Range.compareRangesUsingStarts(left.range,right.range))),this._onDidUpdate.fire(this)}_initIdx(fwd){let found=!1;const position=this._editor.getPosition();if(position){for(let i=0,len=this.ranges.length;i<len&&!found;i++){const range=this.ranges[i].range;position.isBeforeOrEqual(range.getStartPosition())&&(this.nextIdx=i+(fwd?0:-1),found=!0)}found||(this.nextIdx=fwd?0:this.ranges.length-1),this.nextIdx<0&&(this.nextIdx=this.ranges.length-1)}else this.nextIdx=0}_move(fwd,scrollType){if(assert.ok(!this.disposed,"Illegal State - diff navigator has been disposed"),!this.canNavigate())return;-1===this.nextIdx?this._initIdx(fwd):fwd?(this.nextIdx+=1,this.nextIdx>=this.ranges.length&&(this.nextIdx=0)):(this.nextIdx-=1,this.nextIdx<0&&(this.nextIdx=this.ranges.length-1));const info=this.ranges[this.nextIdx];this.ignoreSelectionChange=!0;try{const pos=info.range.getStartPosition();this._editor.setPosition(pos),this._editor.revealRangeInCenter(info.range,scrollType)}finally{this.ignoreSelectionChange=!1}}canNavigate(){return this.ranges&&this.ranges.length>0}next(scrollType=0){this._move(!0,scrollType)}previous(scrollType=0){this._move(!1,scrollType)}dispose(){super.dispose(),this.ranges=[],this.disposed=!0}}