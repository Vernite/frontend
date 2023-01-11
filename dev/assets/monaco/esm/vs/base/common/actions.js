var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{Emitter}from"./event.js";import{Disposable}from"./lifecycle.js";import*as nls from"../../nls.js";export class Action extends Disposable{constructor(id,label="",cssClass="",enabled=!0,actionCallback){super(),this._onDidChange=this._register(new Emitter),this.onDidChange=this._onDidChange.event,this._enabled=!0,this._id=id,this._label=label,this._cssClass=cssClass,this._enabled=enabled,this._actionCallback=actionCallback}get id(){return this._id}get label(){return this._label}set label(value){this._setLabel(value)}_setLabel(value){this._label!==value&&(this._label=value,this._onDidChange.fire({label:value}))}get tooltip(){return this._tooltip||""}set tooltip(value){this._setTooltip(value)}_setTooltip(value){this._tooltip!==value&&(this._tooltip=value,this._onDidChange.fire({tooltip:value}))}get class(){return this._cssClass}set class(value){this._setClass(value)}_setClass(value){this._cssClass!==value&&(this._cssClass=value,this._onDidChange.fire({class:value}))}get enabled(){return this._enabled}set enabled(value){this._setEnabled(value)}_setEnabled(value){this._enabled!==value&&(this._enabled=value,this._onDidChange.fire({enabled:value}))}get checked(){return this._checked}set checked(value){this._setChecked(value)}_setChecked(value){this._checked!==value&&(this._checked=value,this._onDidChange.fire({checked:value}))}run(event,data){return __awaiter(this,void 0,void 0,(function*(){this._actionCallback&&(yield this._actionCallback(event))}))}}export class ActionRunner extends Disposable{constructor(){super(...arguments),this._onBeforeRun=this._register(new Emitter),this.onBeforeRun=this._onBeforeRun.event,this._onDidRun=this._register(new Emitter),this.onDidRun=this._onDidRun.event}run(action,context){return __awaiter(this,void 0,void 0,(function*(){if(!action.enabled)return;let error;this._onBeforeRun.fire({action});try{yield this.runAction(action,context)}catch(e){error=e}this._onDidRun.fire({action,error})}))}runAction(action,context){return __awaiter(this,void 0,void 0,(function*(){yield action.run(context)}))}}export class Separator extends Action{constructor(label){super(Separator.ID,label,label?"separator text":"separator"),this.checked=!1,this.enabled=!1}}Separator.ID="vs.actions.separator";export class SubmenuAction{constructor(id,label,actions,cssClass){this.tooltip="",this.enabled=!0,this.checked=void 0,this.id=id,this.label=label,this.class=cssClass,this._actions=actions}get actions(){return this._actions}dispose(){}run(){return __awaiter(this,void 0,void 0,(function*(){}))}}export class EmptySubmenuAction extends Action{constructor(){super(EmptySubmenuAction.ID,nls.localize("submenu.empty","(empty)"),void 0,!1)}}EmptySubmenuAction.ID="vs.actions.empty";export function toAction(props){var _a,_b;return{id:props.id,label:props.label,class:void 0,enabled:null===(_a=props.enabled)||void 0===_a||_a,checked:null!==(_b=props.checked)&&void 0!==_b&&_b,run:()=>__awaiter(this,void 0,void 0,(function*(){return props.run()})),tooltip:props.label,dispose:()=>{}}}