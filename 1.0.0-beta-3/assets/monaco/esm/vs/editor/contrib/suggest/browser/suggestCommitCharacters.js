import{isNonEmptyArray}from"../../../../base/common/arrays.js";import{DisposableStore}from"../../../../base/common/lifecycle.js";import{CharacterSet}from"../../../common/core/characterClassifier.js";export class CommitCharacterController{constructor(editor,widget,accept){this._disposables=new DisposableStore,this._disposables.add(widget.onDidShow((()=>this._onItem(widget.getFocusedItem())))),this._disposables.add(widget.onDidFocus(this._onItem,this)),this._disposables.add(widget.onDidHide(this.reset,this)),this._disposables.add(editor.onWillType((text=>{if(this._active&&!widget.isFrozen()){const ch=text.charCodeAt(text.length-1);this._active.acceptCharacters.has(ch)&&editor.getOption(0)&&accept(this._active.item)}})))}_onItem(selected){if(!selected||!isNonEmptyArray(selected.item.completion.commitCharacters))return void this.reset();if(this._active&&this._active.item.item===selected.item)return;const acceptCharacters=new CharacterSet;for(const ch of selected.item.completion.commitCharacters)ch.length>0&&acceptCharacters.add(ch.charCodeAt(0));this._active={acceptCharacters,item:selected}}reset(){this._active=void 0}dispose(){this._disposables.dispose()}}