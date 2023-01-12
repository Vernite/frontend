var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{IContextKeyService,RawContextKey}from"../../../../platform/contextkey/common/contextkey.js";let SuggestAlternatives=class SuggestAlternatives{constructor(_editor,contextKeyService){this._editor=_editor,this._index=0,this._ckOtherSuggestions=SuggestAlternatives.OtherSuggestions.bindTo(contextKeyService)}dispose(){this.reset()}reset(){var _a;this._ckOtherSuggestions.reset(),null===(_a=this._listener)||void 0===_a||_a.dispose(),this._model=void 0,this._acceptNext=void 0,this._ignore=!1}set({model,index},acceptNext){if(0===model.items.length)return void this.reset();SuggestAlternatives._moveIndex(!0,model,index)!==index?(this._acceptNext=acceptNext,this._model=model,this._index=index,this._listener=this._editor.onDidChangeCursorPosition((()=>{this._ignore||this.reset()})),this._ckOtherSuggestions.set(!0)):this.reset()}static _moveIndex(fwd,model,index){let newIndex=index;for(;newIndex=(newIndex+model.items.length+(fwd?1:-1))%model.items.length,newIndex!==index&&model.items[newIndex].completion.additionalTextEdits;);return newIndex}next(){this._move(!0)}prev(){this._move(!1)}_move(fwd){if(this._model)try{this._ignore=!0,this._index=SuggestAlternatives._moveIndex(fwd,this._model,this._index),this._acceptNext({index:this._index,item:this._model.items[this._index],model:this._model})}finally{this._ignore=!1}}};SuggestAlternatives.OtherSuggestions=new RawContextKey("hasOtherSuggestions",!1),SuggestAlternatives=__decorate([__param(1,IContextKeyService)],SuggestAlternatives);export{SuggestAlternatives};