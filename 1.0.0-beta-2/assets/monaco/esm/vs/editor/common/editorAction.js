export class InternalEditorAction{constructor(id,label,alias,precondition,run,contextKeyService){this.id=id,this.label=label,this.alias=alias,this._precondition=precondition,this._run=run,this._contextKeyService=contextKeyService}isSupported(){return this._contextKeyService.contextMatchesRules(this._precondition)}run(){return this.isSupported()?this._run():Promise.resolve(void 0)}}