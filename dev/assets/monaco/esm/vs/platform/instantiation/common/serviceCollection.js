export class ServiceCollection{constructor(...entries){this._entries=new Map;for(const[id,service]of entries)this.set(id,service)}set(id,instanceOrDescriptor){const result=this._entries.get(id);return this._entries.set(id,instanceOrDescriptor),result}get(id){return this._entries.get(id)}}