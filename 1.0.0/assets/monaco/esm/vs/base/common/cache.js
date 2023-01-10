export class LRUCachedFunction{constructor(fn){this.fn=fn,this.lastCache=void 0,this.lastArgKey=void 0}get(arg){const key=JSON.stringify(arg);return this.lastArgKey!==key&&(this.lastArgKey=key,this.lastCache=this.fn(arg)),this.lastCache}}export class CachedFunction{constructor(fn){this.fn=fn,this._map=new Map}get cachedValues(){return this._map}get(arg){if(this._map.has(arg))return this._map.get(arg);const value=this.fn(arg);return this._map.set(arg,value),value}}