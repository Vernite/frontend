import{Emitter}from"./event.js";import{Disposable}from"./lifecycle.js";export class ScrollState{constructor(_forceIntegerValues,width,scrollWidth,scrollLeft,height,scrollHeight,scrollTop){this._forceIntegerValues=_forceIntegerValues,this._scrollStateBrand=void 0,this._forceIntegerValues&&(width|=0,scrollWidth|=0,scrollLeft|=0,height|=0,scrollHeight|=0,scrollTop|=0),this.rawScrollLeft=scrollLeft,this.rawScrollTop=scrollTop,width<0&&(width=0),scrollLeft+width>scrollWidth&&(scrollLeft=scrollWidth-width),scrollLeft<0&&(scrollLeft=0),height<0&&(height=0),scrollTop+height>scrollHeight&&(scrollTop=scrollHeight-height),scrollTop<0&&(scrollTop=0),this.width=width,this.scrollWidth=scrollWidth,this.scrollLeft=scrollLeft,this.height=height,this.scrollHeight=scrollHeight,this.scrollTop=scrollTop}equals(other){return this.rawScrollLeft===other.rawScrollLeft&&this.rawScrollTop===other.rawScrollTop&&this.width===other.width&&this.scrollWidth===other.scrollWidth&&this.scrollLeft===other.scrollLeft&&this.height===other.height&&this.scrollHeight===other.scrollHeight&&this.scrollTop===other.scrollTop}withScrollDimensions(update,useRawScrollPositions){return new ScrollState(this._forceIntegerValues,void 0!==update.width?update.width:this.width,void 0!==update.scrollWidth?update.scrollWidth:this.scrollWidth,useRawScrollPositions?this.rawScrollLeft:this.scrollLeft,void 0!==update.height?update.height:this.height,void 0!==update.scrollHeight?update.scrollHeight:this.scrollHeight,useRawScrollPositions?this.rawScrollTop:this.scrollTop)}withScrollPosition(update){return new ScrollState(this._forceIntegerValues,this.width,this.scrollWidth,void 0!==update.scrollLeft?update.scrollLeft:this.rawScrollLeft,this.height,this.scrollHeight,void 0!==update.scrollTop?update.scrollTop:this.rawScrollTop)}createScrollEvent(previous,inSmoothScrolling){const widthChanged=this.width!==previous.width,scrollWidthChanged=this.scrollWidth!==previous.scrollWidth,scrollLeftChanged=this.scrollLeft!==previous.scrollLeft,heightChanged=this.height!==previous.height,scrollHeightChanged=this.scrollHeight!==previous.scrollHeight,scrollTopChanged=this.scrollTop!==previous.scrollTop;return{inSmoothScrolling,oldWidth:previous.width,oldScrollWidth:previous.scrollWidth,oldScrollLeft:previous.scrollLeft,width:this.width,scrollWidth:this.scrollWidth,scrollLeft:this.scrollLeft,oldHeight:previous.height,oldScrollHeight:previous.scrollHeight,oldScrollTop:previous.scrollTop,height:this.height,scrollHeight:this.scrollHeight,scrollTop:this.scrollTop,widthChanged,scrollWidthChanged,scrollLeftChanged,heightChanged,scrollHeightChanged,scrollTopChanged}}}export class Scrollable extends Disposable{constructor(options){super(),this._scrollableBrand=void 0,this._onScroll=this._register(new Emitter),this.onScroll=this._onScroll.event,this._smoothScrollDuration=options.smoothScrollDuration,this._scheduleAtNextAnimationFrame=options.scheduleAtNextAnimationFrame,this._state=new ScrollState(options.forceIntegerValues,0,0,0,0,0,0),this._smoothScrolling=null}dispose(){this._smoothScrolling&&(this._smoothScrolling.dispose(),this._smoothScrolling=null),super.dispose()}setSmoothScrollDuration(smoothScrollDuration){this._smoothScrollDuration=smoothScrollDuration}validateScrollPosition(scrollPosition){return this._state.withScrollPosition(scrollPosition)}getScrollDimensions(){return this._state}setScrollDimensions(dimensions,useRawScrollPositions){var _a;const newState=this._state.withScrollDimensions(dimensions,useRawScrollPositions);this._setState(newState,Boolean(this._smoothScrolling)),null===(_a=this._smoothScrolling)||void 0===_a||_a.acceptScrollDimensions(this._state)}getFutureScrollPosition(){return this._smoothScrolling?this._smoothScrolling.to:this._state}getCurrentScrollPosition(){return this._state}setScrollPositionNow(update){const newState=this._state.withScrollPosition(update);this._smoothScrolling&&(this._smoothScrolling.dispose(),this._smoothScrolling=null),this._setState(newState,!1)}setScrollPositionSmooth(update,reuseAnimation){if(0===this._smoothScrollDuration)return this.setScrollPositionNow(update);if(this._smoothScrolling){update={scrollLeft:void 0===update.scrollLeft?this._smoothScrolling.to.scrollLeft:update.scrollLeft,scrollTop:void 0===update.scrollTop?this._smoothScrolling.to.scrollTop:update.scrollTop};const validTarget=this._state.withScrollPosition(update);if(this._smoothScrolling.to.scrollLeft===validTarget.scrollLeft&&this._smoothScrolling.to.scrollTop===validTarget.scrollTop)return;let newSmoothScrolling;newSmoothScrolling=reuseAnimation?new SmoothScrollingOperation(this._smoothScrolling.from,validTarget,this._smoothScrolling.startTime,this._smoothScrolling.duration):this._smoothScrolling.combine(this._state,validTarget,this._smoothScrollDuration),this._smoothScrolling.dispose(),this._smoothScrolling=newSmoothScrolling}else{const validTarget=this._state.withScrollPosition(update);this._smoothScrolling=SmoothScrollingOperation.start(this._state,validTarget,this._smoothScrollDuration)}this._smoothScrolling.animationFrameDisposable=this._scheduleAtNextAnimationFrame((()=>{this._smoothScrolling&&(this._smoothScrolling.animationFrameDisposable=null,this._performSmoothScrolling())}))}_performSmoothScrolling(){if(!this._smoothScrolling)return;const update=this._smoothScrolling.tick(),newState=this._state.withScrollPosition(update);return this._setState(newState,!0),this._smoothScrolling?update.isDone?(this._smoothScrolling.dispose(),void(this._smoothScrolling=null)):void(this._smoothScrolling.animationFrameDisposable=this._scheduleAtNextAnimationFrame((()=>{this._smoothScrolling&&(this._smoothScrolling.animationFrameDisposable=null,this._performSmoothScrolling())}))):void 0}_setState(newState,inSmoothScrolling){const oldState=this._state;oldState.equals(newState)||(this._state=newState,this._onScroll.fire(this._state.createScrollEvent(oldState,inSmoothScrolling)))}}export class SmoothScrollingUpdate{constructor(scrollLeft,scrollTop,isDone){this.scrollLeft=scrollLeft,this.scrollTop=scrollTop,this.isDone=isDone}}function createEaseOutCubic(from,to){const delta=to-from;return function(completion){return from+delta*easeOutCubic(completion)}}function createComposed(a,b,cut){return function(completion){return completion<cut?a(completion/cut):b((completion-cut)/(1-cut))}}export class SmoothScrollingOperation{constructor(from,to,startTime,duration){this.from=from,this.to=to,this.duration=duration,this.startTime=startTime,this.animationFrameDisposable=null,this._initAnimations()}_initAnimations(){this.scrollLeft=this._initAnimation(this.from.scrollLeft,this.to.scrollLeft,this.to.width),this.scrollTop=this._initAnimation(this.from.scrollTop,this.to.scrollTop,this.to.height)}_initAnimation(from,to,viewportSize){if(Math.abs(from-to)>2.5*viewportSize){let stop1,stop2;return from<to?(stop1=from+.75*viewportSize,stop2=to-.75*viewportSize):(stop1=from-.75*viewportSize,stop2=to+.75*viewportSize),createComposed(createEaseOutCubic(from,stop1),createEaseOutCubic(stop2,to),.33)}return createEaseOutCubic(from,to)}dispose(){null!==this.animationFrameDisposable&&(this.animationFrameDisposable.dispose(),this.animationFrameDisposable=null)}acceptScrollDimensions(state){this.to=state.withScrollPosition(this.to),this._initAnimations()}tick(){return this._tick(Date.now())}_tick(now){const completion=(now-this.startTime)/this.duration;if(completion<1){const newScrollLeft=this.scrollLeft(completion),newScrollTop=this.scrollTop(completion);return new SmoothScrollingUpdate(newScrollLeft,newScrollTop,!1)}return new SmoothScrollingUpdate(this.to.scrollLeft,this.to.scrollTop,!0)}combine(from,to,duration){return SmoothScrollingOperation.start(from,to,duration)}static start(from,to,duration){duration+=10;const startTime=Date.now()-10;return new SmoothScrollingOperation(from,to,startTime,duration)}}function easeInCubic(t){return Math.pow(t,3)}function easeOutCubic(t){return 1-easeInCubic(1-t)}