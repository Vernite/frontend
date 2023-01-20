import{Emitter}from"../../../base/common/event.js";import{Iterable}from"../../../base/common/iterator.js";import{Disposable,toDisposable}from"../../../base/common/lifecycle.js";import{LinkedList}from"../../../base/common/linkedList.js";import{validateConstraints}from"../../../base/common/types.js";import{createDecorator}from"../../instantiation/common/instantiation.js";export const ICommandService=createDecorator("commandService");export const CommandsRegistry=new class{constructor(){this._commands=new Map,this._onDidRegisterCommand=new Emitter,this.onDidRegisterCommand=this._onDidRegisterCommand.event}registerCommand(idOrCommand,handler){if(!idOrCommand)throw new Error("invalid command");if("string"==typeof idOrCommand){if(!handler)throw new Error("invalid command");return this.registerCommand({id:idOrCommand,handler})}if(idOrCommand.description){const constraints=[];for(const arg of idOrCommand.description.args)constraints.push(arg.constraint);const actualHandler=idOrCommand.handler;idOrCommand.handler=function(accessor,...args){return validateConstraints(args,constraints),actualHandler(accessor,...args)}}const{id}=idOrCommand;let commands=this._commands.get(id);commands||(commands=new LinkedList,this._commands.set(id,commands));const removeFn=commands.unshift(idOrCommand),ret=toDisposable((()=>{removeFn();const command=this._commands.get(id);(null==command?void 0:command.isEmpty())&&this._commands.delete(id)}));return this._onDidRegisterCommand.fire(id),ret}registerCommandAlias(oldId,newId){return CommandsRegistry.registerCommand(oldId,((accessor,...args)=>accessor.get(ICommandService).executeCommand(newId,...args)))}getCommand(id){const list=this._commands.get(id);if(list&&!list.isEmpty())return Iterable.first(list)}getCommands(){const result=new Map;for(const key of this._commands.keys()){const command=this.getCommand(key);command&&result.set(key,command)}return result}};export const NullCommandService={_serviceBrand:void 0,onWillExecuteCommand:()=>Disposable.None,onDidExecuteCommand:()=>Disposable.None,executeCommand:()=>Promise.resolve(void 0)};CommandsRegistry.registerCommand("noop",(()=>{}));