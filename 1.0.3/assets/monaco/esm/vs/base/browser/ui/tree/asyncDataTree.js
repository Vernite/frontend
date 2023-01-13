var __awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))((function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):function adopt(value){return value instanceof P?value:new P((function(resolve){resolve(value)}))}(result.value).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())}))};import{ElementsDragAndDropData}from"../list/listView.js";import{ComposedTreeDelegate}from"./abstractTree.js";import{getVisibleState,isFilterResult}from"./indexTreeModel.js";import{CompressibleObjectTree,ObjectTree}from"./objectTree.js";import{TreeError,WeakMapper}from"./tree.js";import{createCancelablePromise,Promises,timeout}from"../../../common/async.js";import{Codicon}from"../../../common/codicons.js";import{isCancellationError,onUnexpectedError}from"../../../common/errors.js";import{Emitter,Event}from"../../../common/event.js";import{Iterable}from"../../../common/iterator.js";import{DisposableStore,dispose}from"../../../common/lifecycle.js";import{isIterable}from"../../../common/types.js";function createAsyncDataTreeNode(props){return Object.assign(Object.assign({},props),{children:[],refreshPromise:void 0,stale:!0,slow:!1,collapsedByDefault:void 0})}function isAncestor(ancestor,descendant){return!!descendant.parent&&(descendant.parent===ancestor||isAncestor(ancestor,descendant.parent))}function intersects(node,other){return node===other||isAncestor(node,other)||isAncestor(other,node)}class AsyncDataTreeNodeWrapper{constructor(node){this.node=node}get element(){return this.node.element.element}get children(){return this.node.children.map((node=>new AsyncDataTreeNodeWrapper(node)))}get depth(){return this.node.depth}get visibleChildrenCount(){return this.node.visibleChildrenCount}get visibleChildIndex(){return this.node.visibleChildIndex}get collapsible(){return this.node.collapsible}get collapsed(){return this.node.collapsed}get visible(){return this.node.visible}get filterData(){return this.node.filterData}}class AsyncDataTreeRenderer{constructor(renderer,nodeMapper,onDidChangeTwistieState){this.renderer=renderer,this.nodeMapper=nodeMapper,this.onDidChangeTwistieState=onDidChangeTwistieState,this.renderedNodes=new Map,this.templateId=renderer.templateId}renderTemplate(container){return{templateData:this.renderer.renderTemplate(container)}}renderElement(node,index,templateData,height){this.renderer.renderElement(this.nodeMapper.map(node),index,templateData.templateData,height)}renderTwistie(element,twistieElement){return element.slow?(twistieElement.classList.add(...Codicon.treeItemLoading.classNamesArray),!0):(twistieElement.classList.remove(...Codicon.treeItemLoading.classNamesArray),!1)}disposeElement(node,index,templateData,height){var _a,_b;null===(_b=(_a=this.renderer).disposeElement)||void 0===_b||_b.call(_a,this.nodeMapper.map(node),index,templateData.templateData,height)}disposeTemplate(templateData){this.renderer.disposeTemplate(templateData.templateData)}dispose(){this.renderedNodes.clear()}}function asTreeEvent(e){return{browserEvent:e.browserEvent,elements:e.elements.map((e=>e.element))}}function asTreeMouseEvent(e){return{browserEvent:e.browserEvent,element:e.element&&e.element.element,target:e.target}}class AsyncDataTreeElementsDragAndDropData extends ElementsDragAndDropData{constructor(data){super(data.elements.map((node=>node.element))),this.data=data}}function asAsyncDataTreeDragAndDropData(data){return data instanceof ElementsDragAndDropData?new AsyncDataTreeElementsDragAndDropData(data):data}class AsyncDataTreeNodeListDragAndDrop{constructor(dnd){this.dnd=dnd}getDragURI(node){return this.dnd.getDragURI(node.element)}getDragLabel(nodes,originalEvent){if(this.dnd.getDragLabel)return this.dnd.getDragLabel(nodes.map((node=>node.element)),originalEvent)}onDragStart(data,originalEvent){var _a,_b;null===(_b=(_a=this.dnd).onDragStart)||void 0===_b||_b.call(_a,asAsyncDataTreeDragAndDropData(data),originalEvent)}onDragOver(data,targetNode,targetIndex,originalEvent,raw=!0){return this.dnd.onDragOver(asAsyncDataTreeDragAndDropData(data),targetNode&&targetNode.element,targetIndex,originalEvent)}drop(data,targetNode,targetIndex,originalEvent){this.dnd.drop(asAsyncDataTreeDragAndDropData(data),targetNode&&targetNode.element,targetIndex,originalEvent)}onDragEnd(originalEvent){var _a,_b;null===(_b=(_a=this.dnd).onDragEnd)||void 0===_b||_b.call(_a,originalEvent)}}function asObjectTreeOptions(options){return options&&Object.assign(Object.assign({},options),{collapseByDefault:!0,identityProvider:options.identityProvider&&{getId:el=>options.identityProvider.getId(el.element)},dnd:options.dnd&&new AsyncDataTreeNodeListDragAndDrop(options.dnd),multipleSelectionController:options.multipleSelectionController&&{isSelectionSingleChangeEvent:e=>options.multipleSelectionController.isSelectionSingleChangeEvent(Object.assign(Object.assign({},e),{element:e.element})),isSelectionRangeChangeEvent:e=>options.multipleSelectionController.isSelectionRangeChangeEvent(Object.assign(Object.assign({},e),{element:e.element}))},accessibilityProvider:options.accessibilityProvider&&Object.assign(Object.assign({},options.accessibilityProvider),{getPosInSet:void 0,getSetSize:void 0,getRole:options.accessibilityProvider.getRole?el=>options.accessibilityProvider.getRole(el.element):()=>"treeitem",isChecked:options.accessibilityProvider.isChecked?e=>{var _a;return!!(null===(_a=options.accessibilityProvider)||void 0===_a?void 0:_a.isChecked(e.element))}:void 0,getAriaLabel:e=>options.accessibilityProvider.getAriaLabel(e.element),getWidgetAriaLabel:()=>options.accessibilityProvider.getWidgetAriaLabel(),getWidgetRole:options.accessibilityProvider.getWidgetRole?()=>options.accessibilityProvider.getWidgetRole():()=>"tree",getAriaLevel:options.accessibilityProvider.getAriaLevel&&(node=>options.accessibilityProvider.getAriaLevel(node.element)),getActiveDescendantId:options.accessibilityProvider.getActiveDescendantId&&(node=>options.accessibilityProvider.getActiveDescendantId(node.element))}),filter:options.filter&&{filter:(e,parentVisibility)=>options.filter.filter(e.element,parentVisibility)},keyboardNavigationLabelProvider:options.keyboardNavigationLabelProvider&&Object.assign(Object.assign({},options.keyboardNavigationLabelProvider),{getKeyboardNavigationLabel:e=>options.keyboardNavigationLabelProvider.getKeyboardNavigationLabel(e.element)}),sorter:void 0,expandOnlyOnTwistieClick:void 0===options.expandOnlyOnTwistieClick?void 0:"function"!=typeof options.expandOnlyOnTwistieClick?options.expandOnlyOnTwistieClick:e=>options.expandOnlyOnTwistieClick(e.element),additionalScrollHeight:options.additionalScrollHeight})}function dfs(node,fn){fn(node),node.children.forEach((child=>dfs(child,fn)))}export class AsyncDataTree{constructor(user,container,delegate,renderers,dataSource,options={}){this.user=user,this.dataSource=dataSource,this.nodes=new Map,this.subTreeRefreshPromises=new Map,this.refreshPromises=new Map,this._onDidRender=new Emitter,this._onDidChangeNodeSlowState=new Emitter,this.nodeMapper=new WeakMapper((node=>new AsyncDataTreeNodeWrapper(node))),this.disposables=new DisposableStore,this.identityProvider=options.identityProvider,this.autoExpandSingleChildren=void 0!==options.autoExpandSingleChildren&&options.autoExpandSingleChildren,this.sorter=options.sorter,this.collapseByDefault=options.collapseByDefault,this.tree=this.createTree(user,container,delegate,renderers,options),this.onDidChangeFindMode=this.tree.onDidChangeFindMode,this.root=createAsyncDataTreeNode({element:void 0,parent:null,hasChildren:!0}),this.identityProvider&&(this.root=Object.assign(Object.assign({},this.root),{id:null})),this.nodes.set(null,this.root),this.tree.onDidChangeCollapseState(this._onDidChangeCollapseState,this,this.disposables)}get onDidChangeFocus(){return Event.map(this.tree.onDidChangeFocus,asTreeEvent)}get onDidChangeSelection(){return Event.map(this.tree.onDidChangeSelection,asTreeEvent)}get onMouseDblClick(){return Event.map(this.tree.onMouseDblClick,asTreeMouseEvent)}get onPointer(){return Event.map(this.tree.onPointer,asTreeMouseEvent)}get onDidFocus(){return this.tree.onDidFocus}get onDidChangeModel(){return this.tree.onDidChangeModel}get onDidChangeCollapseState(){return this.tree.onDidChangeCollapseState}get onDidChangeFindOpenState(){return this.tree.onDidChangeFindOpenState}get onDidDispose(){return this.tree.onDidDispose}createTree(user,container,delegate,renderers,options){const objectTreeDelegate=new ComposedTreeDelegate(delegate),objectTreeRenderers=renderers.map((r=>new AsyncDataTreeRenderer(r,this.nodeMapper,this._onDidChangeNodeSlowState.event))),objectTreeOptions=asObjectTreeOptions(options)||{};return new ObjectTree(user,container,objectTreeDelegate,objectTreeRenderers,objectTreeOptions)}updateOptions(options={}){this.tree.updateOptions(options)}getHTMLElement(){return this.tree.getHTMLElement()}get scrollTop(){return this.tree.scrollTop}set scrollTop(scrollTop){this.tree.scrollTop=scrollTop}domFocus(){this.tree.domFocus()}layout(height,width){this.tree.layout(height,width)}style(styles){this.tree.style(styles)}getInput(){return this.root.element}setInput(input,viewState){return __awaiter(this,void 0,void 0,(function*(){this.refreshPromises.forEach((promise=>promise.cancel())),this.refreshPromises.clear(),this.root.element=input;const viewStateContext=viewState&&{viewState,focus:[],selection:[]};yield this._updateChildren(input,!0,!1,viewStateContext),viewStateContext&&(this.tree.setFocus(viewStateContext.focus),this.tree.setSelection(viewStateContext.selection)),viewState&&"number"==typeof viewState.scrollTop&&(this.scrollTop=viewState.scrollTop)}))}_updateChildren(element=this.root.element,recursive=!0,rerender=!1,viewStateContext,options){return __awaiter(this,void 0,void 0,(function*(){if(void 0===this.root.element)throw new TreeError(this.user,"Tree input not set");this.root.refreshPromise&&(yield this.root.refreshPromise,yield Event.toPromise(this._onDidRender.event));const node=this.getDataNode(element);if(yield this.refreshAndRenderNode(node,recursive,viewStateContext,options),rerender)try{this.tree.rerender(node)}catch(_a){}}))}rerender(element){if(void 0===element||element===this.root.element)return void this.tree.rerender();const node=this.getDataNode(element);this.tree.rerender(node)}getNode(element=this.root.element){const dataNode=this.getDataNode(element),node=this.tree.getNode(dataNode===this.root?null:dataNode);return this.nodeMapper.map(node)}collapse(element,recursive=!1){const node=this.getDataNode(element);return this.tree.collapse(node===this.root?null:node,recursive)}expand(element,recursive=!1){return __awaiter(this,void 0,void 0,(function*(){if(void 0===this.root.element)throw new TreeError(this.user,"Tree input not set");this.root.refreshPromise&&(yield this.root.refreshPromise,yield Event.toPromise(this._onDidRender.event));const node=this.getDataNode(element);if(this.tree.hasElement(node)&&!this.tree.isCollapsible(node))return!1;if(node.refreshPromise&&(yield this.root.refreshPromise,yield Event.toPromise(this._onDidRender.event)),node!==this.root&&!node.refreshPromise&&!this.tree.isCollapsed(node))return!1;const result=this.tree.expand(node===this.root?null:node,recursive);return node.refreshPromise&&(yield this.root.refreshPromise,yield Event.toPromise(this._onDidRender.event)),result}))}setSelection(elements,browserEvent){const nodes=elements.map((e=>this.getDataNode(e)));this.tree.setSelection(nodes,browserEvent)}getSelection(){return this.tree.getSelection().map((n=>n.element))}setFocus(elements,browserEvent){const nodes=elements.map((e=>this.getDataNode(e)));this.tree.setFocus(nodes,browserEvent)}getFocus(){return this.tree.getFocus().map((n=>n.element))}reveal(element,relativeTop){this.tree.reveal(this.getDataNode(element),relativeTop)}getParentElement(element){const node=this.tree.getParentElement(this.getDataNode(element));return node&&node.element}getFirstElementChild(element=this.root.element){const dataNode=this.getDataNode(element),node=this.tree.getFirstElementChild(dataNode===this.root?null:dataNode);return node&&node.element}getDataNode(element){const node=this.nodes.get(element===this.root.element?null:element);if(!node)throw new TreeError(this.user,`Data tree node not found: ${element}`);return node}refreshAndRenderNode(node,recursive,viewStateContext,options){return __awaiter(this,void 0,void 0,(function*(){yield this.refreshNode(node,recursive,viewStateContext),this.render(node,viewStateContext,options)}))}refreshNode(node,recursive,viewStateContext){return __awaiter(this,void 0,void 0,(function*(){let result;if(this.subTreeRefreshPromises.forEach(((refreshPromise,refreshNode)=>{!result&&intersects(refreshNode,node)&&(result=refreshPromise.then((()=>this.refreshNode(node,recursive,viewStateContext))))})),result)return result;if(node!==this.root){if(this.tree.getNode(node).collapsed)return node.hasChildren=!!this.dataSource.hasChildren(node.element),void(node.stale=!0)}return this.doRefreshSubTree(node,recursive,viewStateContext)}))}doRefreshSubTree(node,recursive,viewStateContext){return __awaiter(this,void 0,void 0,(function*(){let done;node.refreshPromise=new Promise((c=>done=c)),this.subTreeRefreshPromises.set(node,node.refreshPromise),node.refreshPromise.finally((()=>{node.refreshPromise=void 0,this.subTreeRefreshPromises.delete(node)}));try{const childrenToRefresh=yield this.doRefreshNode(node,recursive,viewStateContext);node.stale=!1,yield Promises.settled(childrenToRefresh.map((child=>this.doRefreshSubTree(child,recursive,viewStateContext))))}finally{done()}}))}doRefreshNode(node,recursive,viewStateContext){return __awaiter(this,void 0,void 0,(function*(){let childrenPromise;if(node.hasChildren=!!this.dataSource.hasChildren(node.element),node.hasChildren){const children=this.doGetChildren(node);if(isIterable(children))childrenPromise=Promise.resolve(children);else{const slowTimeout=timeout(800);slowTimeout.then((()=>{node.slow=!0,this._onDidChangeNodeSlowState.fire(node)}),(_=>null)),childrenPromise=children.finally((()=>slowTimeout.cancel()))}}else childrenPromise=Promise.resolve(Iterable.empty());try{const children=yield childrenPromise;return this.setChildren(node,children,recursive,viewStateContext)}catch(err){if(node!==this.root&&this.tree.hasElement(node)&&this.tree.collapse(node),isCancellationError(err))return[];throw err}finally{node.slow&&(node.slow=!1,this._onDidChangeNodeSlowState.fire(node))}}))}doGetChildren(node){let result=this.refreshPromises.get(node);if(result)return result;const children=this.dataSource.getChildren(node.element);return isIterable(children)?this.processChildren(children):(result=createCancelablePromise((()=>__awaiter(this,void 0,void 0,(function*(){return this.processChildren(yield children)})))),this.refreshPromises.set(node,result),result.finally((()=>{this.refreshPromises.delete(node)})))}_onDidChangeCollapseState({node,deep}){null!==node.element&&!node.collapsed&&node.element.stale&&(deep?this.collapse(node.element.element):this.refreshAndRenderNode(node.element,!1).catch(onUnexpectedError))}setChildren(node,childrenElementsIterable,recursive,viewStateContext){const childrenElements=[...childrenElementsIterable];if(0===node.children.length&&0===childrenElements.length)return[];const nodesToForget=new Map,childrenTreeNodesById=new Map;for(const child of node.children)if(nodesToForget.set(child.element,child),this.identityProvider){const collapsed=this.tree.isCollapsed(child);childrenTreeNodesById.set(child.id,{node:child,collapsed})}const childrenToRefresh=[],children=childrenElements.map((element=>{const hasChildren=!!this.dataSource.hasChildren(element);if(!this.identityProvider){const asyncDataTreeNode=createAsyncDataTreeNode({element,parent:node,hasChildren});return hasChildren&&this.collapseByDefault&&!this.collapseByDefault(element)&&(asyncDataTreeNode.collapsedByDefault=!1,childrenToRefresh.push(asyncDataTreeNode)),asyncDataTreeNode}const id=this.identityProvider.getId(element).toString(),result=childrenTreeNodesById.get(id);if(result){const asyncDataTreeNode=result.node;return nodesToForget.delete(asyncDataTreeNode.element),this.nodes.delete(asyncDataTreeNode.element),this.nodes.set(element,asyncDataTreeNode),asyncDataTreeNode.element=element,asyncDataTreeNode.hasChildren=hasChildren,recursive?result.collapsed?(asyncDataTreeNode.children.forEach((node=>dfs(node,(node=>this.nodes.delete(node.element))))),asyncDataTreeNode.children.splice(0,asyncDataTreeNode.children.length),asyncDataTreeNode.stale=!0):childrenToRefresh.push(asyncDataTreeNode):hasChildren&&this.collapseByDefault&&!this.collapseByDefault(element)&&(asyncDataTreeNode.collapsedByDefault=!1,childrenToRefresh.push(asyncDataTreeNode)),asyncDataTreeNode}const childAsyncDataTreeNode=createAsyncDataTreeNode({element,parent:node,id,hasChildren});return viewStateContext&&viewStateContext.viewState.focus&&viewStateContext.viewState.focus.indexOf(id)>-1&&viewStateContext.focus.push(childAsyncDataTreeNode),viewStateContext&&viewStateContext.viewState.selection&&viewStateContext.viewState.selection.indexOf(id)>-1&&viewStateContext.selection.push(childAsyncDataTreeNode),viewStateContext&&viewStateContext.viewState.expanded&&viewStateContext.viewState.expanded.indexOf(id)>-1?childrenToRefresh.push(childAsyncDataTreeNode):hasChildren&&this.collapseByDefault&&!this.collapseByDefault(element)&&(childAsyncDataTreeNode.collapsedByDefault=!1,childrenToRefresh.push(childAsyncDataTreeNode)),childAsyncDataTreeNode}));for(const node of nodesToForget.values())dfs(node,(node=>this.nodes.delete(node.element)));for(const child of children)this.nodes.set(child.element,child);return node.children.splice(0,node.children.length,...children),node!==this.root&&this.autoExpandSingleChildren&&1===children.length&&0===childrenToRefresh.length&&(children[0].collapsedByDefault=!1,childrenToRefresh.push(children[0])),childrenToRefresh}render(node,viewStateContext,options){const children=node.children.map((node=>this.asTreeElement(node,viewStateContext))),objectTreeOptions=options&&Object.assign(Object.assign({},options),{diffIdentityProvider:options.diffIdentityProvider&&{getId:node=>options.diffIdentityProvider.getId(node.element)}});this.tree.setChildren(node===this.root?null:node,children,objectTreeOptions),node!==this.root&&this.tree.setCollapsible(node,node.hasChildren),this._onDidRender.fire()}asTreeElement(node,viewStateContext){if(node.stale)return{element:node,collapsible:node.hasChildren,collapsed:!0};let collapsed;return collapsed=!(viewStateContext&&viewStateContext.viewState.expanded&&node.id&&viewStateContext.viewState.expanded.indexOf(node.id)>-1)&&node.collapsedByDefault,node.collapsedByDefault=void 0,{element:node,children:node.hasChildren?Iterable.map(node.children,(child=>this.asTreeElement(child,viewStateContext))):[],collapsible:node.hasChildren,collapsed}}processChildren(children){return this.sorter&&(children=[...children].sort(this.sorter.compare.bind(this.sorter))),children}dispose(){this.disposables.dispose()}}class CompressibleAsyncDataTreeNodeWrapper{constructor(node){this.node=node}get element(){return{elements:this.node.element.elements.map((e=>e.element)),incompressible:this.node.element.incompressible}}get children(){return this.node.children.map((node=>new CompressibleAsyncDataTreeNodeWrapper(node)))}get depth(){return this.node.depth}get visibleChildrenCount(){return this.node.visibleChildrenCount}get visibleChildIndex(){return this.node.visibleChildIndex}get collapsible(){return this.node.collapsible}get collapsed(){return this.node.collapsed}get visible(){return this.node.visible}get filterData(){return this.node.filterData}}class CompressibleAsyncDataTreeRenderer{constructor(renderer,nodeMapper,compressibleNodeMapperProvider,onDidChangeTwistieState){this.renderer=renderer,this.nodeMapper=nodeMapper,this.compressibleNodeMapperProvider=compressibleNodeMapperProvider,this.onDidChangeTwistieState=onDidChangeTwistieState,this.renderedNodes=new Map,this.disposables=[],this.templateId=renderer.templateId}renderTemplate(container){return{templateData:this.renderer.renderTemplate(container)}}renderElement(node,index,templateData,height){this.renderer.renderElement(this.nodeMapper.map(node),index,templateData.templateData,height)}renderCompressedElements(node,index,templateData,height){this.renderer.renderCompressedElements(this.compressibleNodeMapperProvider().map(node),index,templateData.templateData,height)}renderTwistie(element,twistieElement){return element.slow?(twistieElement.classList.add(...Codicon.treeItemLoading.classNamesArray),!0):(twistieElement.classList.remove(...Codicon.treeItemLoading.classNamesArray),!1)}disposeElement(node,index,templateData,height){var _a,_b;null===(_b=(_a=this.renderer).disposeElement)||void 0===_b||_b.call(_a,this.nodeMapper.map(node),index,templateData.templateData,height)}disposeCompressedElements(node,index,templateData,height){var _a,_b;null===(_b=(_a=this.renderer).disposeCompressedElements)||void 0===_b||_b.call(_a,this.compressibleNodeMapperProvider().map(node),index,templateData.templateData,height)}disposeTemplate(templateData){this.renderer.disposeTemplate(templateData.templateData)}dispose(){this.renderedNodes.clear(),this.disposables=dispose(this.disposables)}}function asCompressibleObjectTreeOptions(options){const objectTreeOptions=options&&asObjectTreeOptions(options);return objectTreeOptions&&Object.assign(Object.assign({},objectTreeOptions),{keyboardNavigationLabelProvider:objectTreeOptions.keyboardNavigationLabelProvider&&Object.assign(Object.assign({},objectTreeOptions.keyboardNavigationLabelProvider),{getCompressedNodeKeyboardNavigationLabel:els=>options.keyboardNavigationLabelProvider.getCompressedNodeKeyboardNavigationLabel(els.map((e=>e.element)))})})}export class CompressibleAsyncDataTree extends AsyncDataTree{constructor(user,container,virtualDelegate,compressionDelegate,renderers,dataSource,options={}){super(user,container,virtualDelegate,renderers,dataSource,options),this.compressionDelegate=compressionDelegate,this.compressibleNodeMapper=new WeakMapper((node=>new CompressibleAsyncDataTreeNodeWrapper(node))),this.filter=options.filter}createTree(user,container,delegate,renderers,options){const objectTreeDelegate=new ComposedTreeDelegate(delegate),objectTreeRenderers=renderers.map((r=>new CompressibleAsyncDataTreeRenderer(r,this.nodeMapper,(()=>this.compressibleNodeMapper),this._onDidChangeNodeSlowState.event))),objectTreeOptions=asCompressibleObjectTreeOptions(options)||{};return new CompressibleObjectTree(user,container,objectTreeDelegate,objectTreeRenderers,objectTreeOptions)}asTreeElement(node,viewStateContext){return Object.assign({incompressible:this.compressionDelegate.isIncompressible(node.element)},super.asTreeElement(node,viewStateContext))}updateOptions(options={}){this.tree.updateOptions(options)}render(node,viewStateContext){if(!this.identityProvider)return super.render(node,viewStateContext);const getId=element=>this.identityProvider.getId(element).toString(),getUncompressedIds=nodes=>{const result=new Set;for(const node of nodes){const compressedNode=this.tree.getCompressedTreeNode(node===this.root?null:node);if(compressedNode.element)for(const node of compressedNode.element.elements)result.add(getId(node.element))}return result},oldSelection=getUncompressedIds(this.tree.getSelection()),oldFocus=getUncompressedIds(this.tree.getFocus());super.render(node,viewStateContext);const selection=this.getSelection();let didChangeSelection=!1;const focus=this.getFocus();let didChangeFocus=!1;const visit=node=>{const compressedNode=node.element;if(compressedNode)for(let i=0;i<compressedNode.elements.length;i++){const id=getId(compressedNode.elements[i].element),element=compressedNode.elements[compressedNode.elements.length-1].element;oldSelection.has(id)&&-1===selection.indexOf(element)&&(selection.push(element),didChangeSelection=!0),oldFocus.has(id)&&-1===focus.indexOf(element)&&(focus.push(element),didChangeFocus=!0)}node.children.forEach(visit)};visit(this.tree.getCompressedTreeNode(node===this.root?null:node)),didChangeSelection&&this.setSelection(selection),didChangeFocus&&this.setFocus(focus)}processChildren(children){return this.filter&&(children=Iterable.filter(children,(e=>{const visibility=getVisibility(this.filter.filter(e,1));if(2===visibility)throw new Error("Recursive tree visibility not supported in async data compressed trees");return 1===visibility}))),super.processChildren(children)}}function getVisibility(filterResult){return"boolean"==typeof filterResult?filterResult?1:0:isFilterResult(filterResult)?getVisibleState(filterResult.visibility):getVisibleState(filterResult)}