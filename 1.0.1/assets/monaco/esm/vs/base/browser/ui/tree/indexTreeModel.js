import{TreeError}from"./tree.js";import{splice,tail2}from"../../../common/arrays.js";import{Delayer,MicrotaskDelay}from"../../../common/async.js";import{LcsDiff}from"../../../common/diff/diff.js";import{Emitter,EventBufferer}from"../../../common/event.js";import{Iterable}from"../../../common/iterator.js";export function isFilterResult(obj){return"object"==typeof obj&&"visibility"in obj&&"data"in obj}export function getVisibleState(visibility){switch(visibility){case!0:return 1;case!1:return 0;default:return visibility}}function isCollapsibleStateUpdate(update){return"boolean"==typeof update.collapsible}export class IndexTreeModel{constructor(user,list,rootElement,options={}){this.user=user,this.list=list,this.rootRef=[],this.eventBufferer=new EventBufferer,this._onDidChangeCollapseState=new Emitter,this.onDidChangeCollapseState=this.eventBufferer.wrapEvent(this._onDidChangeCollapseState.event),this._onDidChangeRenderNodeCount=new Emitter,this.onDidChangeRenderNodeCount=this.eventBufferer.wrapEvent(this._onDidChangeRenderNodeCount.event),this._onDidSplice=new Emitter,this.onDidSplice=this._onDidSplice.event,this.refilterDelayer=new Delayer(MicrotaskDelay),this.collapseByDefault=void 0!==options.collapseByDefault&&options.collapseByDefault,this.filter=options.filter,this.autoExpandSingleChildren=void 0!==options.autoExpandSingleChildren&&options.autoExpandSingleChildren,this.root={parent:void 0,element:rootElement,children:[],depth:0,visibleChildrenCount:0,visibleChildIndex:-1,collapsible:!1,collapsed:!1,renderNodeCount:0,visibility:1,visible:!0,filterData:void 0}}splice(location,deleteCount,toInsert=Iterable.empty(),options={}){if(0===location.length)throw new TreeError(this.user,"Invalid tree location");options.diffIdentityProvider?this.spliceSmart(options.diffIdentityProvider,location,deleteCount,toInsert,options):this.spliceSimple(location,deleteCount,toInsert,options)}spliceSmart(identity,location,deleteCount,toInsertIterable,options,recurseLevels){var _a;void 0===toInsertIterable&&(toInsertIterable=Iterable.empty()),void 0===recurseLevels&&(recurseLevels=null!==(_a=options.diffDepth)&&void 0!==_a?_a:0);const{parentNode}=this.getParentNodeWithListIndex(location);if(!parentNode.lastDiffIds)return this.spliceSimple(location,deleteCount,toInsertIterable,options);const toInsert=[...toInsertIterable],index=location[location.length-1],diff=new LcsDiff({getElements:()=>parentNode.lastDiffIds},{getElements:()=>[...parentNode.children.slice(0,index),...toInsert,...parentNode.children.slice(index+deleteCount)].map((e=>identity.getId(e.element).toString()))}).ComputeDiff(!1);if(diff.quitEarly)return parentNode.lastDiffIds=void 0,this.spliceSimple(location,deleteCount,toInsert,options);const locationPrefix=location.slice(0,-1),recurseSplice=(fromOriginal,fromModified,count)=>{if(recurseLevels>0)for(let i=0;i<count;i++)fromOriginal--,fromModified--,this.spliceSmart(identity,[...locationPrefix,fromOriginal,0],Number.MAX_SAFE_INTEGER,toInsert[fromModified].children,options,recurseLevels-1)};let lastStartO=Math.min(parentNode.children.length,index+deleteCount),lastStartM=toInsert.length;for(const change of diff.changes.sort(((a,b)=>b.originalStart-a.originalStart)))recurseSplice(lastStartO,lastStartM,lastStartO-(change.originalStart+change.originalLength)),lastStartO=change.originalStart,lastStartM=change.modifiedStart-index,this.spliceSimple([...locationPrefix,lastStartO],change.originalLength,Iterable.slice(toInsert,lastStartM,lastStartM+change.modifiedLength),options);recurseSplice(lastStartO,lastStartM,lastStartO)}spliceSimple(location,deleteCount,toInsert=Iterable.empty(),{onDidCreateNode,onDidDeleteNode,diffIdentityProvider}){const{parentNode,listIndex,revealed,visible}=this.getParentNodeWithListIndex(location),treeListElementsToInsert=[],nodesToInsertIterator=Iterable.map(toInsert,(el=>this.createTreeNode(el,parentNode,parentNode.visible?1:0,revealed,treeListElementsToInsert,onDidCreateNode))),lastIndex=location[location.length-1],lastHadChildren=parentNode.children.length>0;let visibleChildStartIndex=0;for(let i=lastIndex;i>=0&&i<parentNode.children.length;i--){const child=parentNode.children[i];if(child.visible){visibleChildStartIndex=child.visibleChildIndex;break}}const nodesToInsert=[];let insertedVisibleChildrenCount=0,renderNodeCount=0;for(const child of nodesToInsertIterator)nodesToInsert.push(child),renderNodeCount+=child.renderNodeCount,child.visible&&(child.visibleChildIndex=visibleChildStartIndex+insertedVisibleChildrenCount++);const deletedNodes=splice(parentNode.children,lastIndex,deleteCount,nodesToInsert);diffIdentityProvider?parentNode.lastDiffIds?splice(parentNode.lastDiffIds,lastIndex,deleteCount,nodesToInsert.map((n=>diffIdentityProvider.getId(n.element).toString()))):parentNode.lastDiffIds=parentNode.children.map((n=>diffIdentityProvider.getId(n.element).toString())):parentNode.lastDiffIds=void 0;let deletedVisibleChildrenCount=0;for(const child of deletedNodes)child.visible&&deletedVisibleChildrenCount++;if(0!==deletedVisibleChildrenCount)for(let i=lastIndex+nodesToInsert.length;i<parentNode.children.length;i++){const child=parentNode.children[i];child.visible&&(child.visibleChildIndex-=deletedVisibleChildrenCount)}if(parentNode.visibleChildrenCount+=insertedVisibleChildrenCount-deletedVisibleChildrenCount,revealed&&visible){const visibleDeleteCount=deletedNodes.reduce(((r,node)=>r+(node.visible?node.renderNodeCount:0)),0);this._updateAncestorsRenderNodeCount(parentNode,renderNodeCount-visibleDeleteCount),this.list.splice(listIndex,visibleDeleteCount,treeListElementsToInsert)}if(deletedNodes.length>0&&onDidDeleteNode){const visit=node=>{onDidDeleteNode(node),node.children.forEach(visit)};deletedNodes.forEach(visit)}this._onDidSplice.fire({insertedNodes:nodesToInsert,deletedNodes});const currentlyHasChildren=parentNode.children.length>0;lastHadChildren!==currentlyHasChildren&&this.setCollapsible(location.slice(0,-1),currentlyHasChildren);let node=parentNode;for(;node;){if(2===node.visibility){this.refilterDelayer.trigger((()=>this.refilter()));break}node=node.parent}}rerender(location){if(0===location.length)throw new TreeError(this.user,"Invalid tree location");const{node,listIndex,revealed}=this.getTreeNodeWithListIndex(location);node.visible&&revealed&&this.list.splice(listIndex,1,[node])}has(location){return this.hasTreeNode(location)}getListIndex(location){const{listIndex,visible,revealed}=this.getTreeNodeWithListIndex(location);return visible&&revealed?listIndex:-1}getListRenderCount(location){return this.getTreeNode(location).renderNodeCount}isCollapsible(location){return this.getTreeNode(location).collapsible}setCollapsible(location,collapsible){const node=this.getTreeNode(location);void 0===collapsible&&(collapsible=!node.collapsible);const update={collapsible};return this.eventBufferer.bufferEvents((()=>this._setCollapseState(location,update)))}isCollapsed(location){return this.getTreeNode(location).collapsed}setCollapsed(location,collapsed,recursive){const node=this.getTreeNode(location);void 0===collapsed&&(collapsed=!node.collapsed);const update={collapsed,recursive:recursive||!1};return this.eventBufferer.bufferEvents((()=>this._setCollapseState(location,update)))}_setCollapseState(location,update){const{node,listIndex,revealed}=this.getTreeNodeWithListIndex(location),result=this._setListNodeCollapseState(node,listIndex,revealed,update);if(node!==this.root&&this.autoExpandSingleChildren&&result&&!isCollapsibleStateUpdate(update)&&node.collapsible&&!node.collapsed&&!update.recursive){let onlyVisibleChildIndex=-1;for(let i=0;i<node.children.length;i++){if(node.children[i].visible){if(onlyVisibleChildIndex>-1){onlyVisibleChildIndex=-1;break}onlyVisibleChildIndex=i}}onlyVisibleChildIndex>-1&&this._setCollapseState([...location,onlyVisibleChildIndex],update)}return result}_setListNodeCollapseState(node,listIndex,revealed,update){const result=this._setNodeCollapseState(node,update,!1);if(!revealed||!node.visible||!result)return result;const previousRenderNodeCount=node.renderNodeCount,toInsert=this.updateNodeAfterCollapseChange(node),deleteCount=previousRenderNodeCount-(-1===listIndex?0:1);return this.list.splice(listIndex+1,deleteCount,toInsert.slice(1)),result}_setNodeCollapseState(node,update,deep){let result;if(node===this.root?result=!1:(isCollapsibleStateUpdate(update)?(result=node.collapsible!==update.collapsible,node.collapsible=update.collapsible):node.collapsible?(result=node.collapsed!==update.collapsed,node.collapsed=update.collapsed):result=!1,result&&this._onDidChangeCollapseState.fire({node,deep})),!isCollapsibleStateUpdate(update)&&update.recursive)for(const child of node.children)result=this._setNodeCollapseState(child,update,!0)||result;return result}expandTo(location){this.eventBufferer.bufferEvents((()=>{let node=this.getTreeNode(location);for(;node.parent;)node=node.parent,location=location.slice(0,location.length-1),node.collapsed&&this._setCollapseState(location,{collapsed:!1,recursive:!1})}))}refilter(){const previousRenderNodeCount=this.root.renderNodeCount,toInsert=this.updateNodeAfterFilterChange(this.root);this.list.splice(0,previousRenderNodeCount,toInsert),this.refilterDelayer.cancel()}createTreeNode(treeElement,parent,parentVisibility,revealed,treeListElements,onDidCreateNode){const node={parent,element:treeElement.element,children:[],depth:parent.depth+1,visibleChildrenCount:0,visibleChildIndex:-1,collapsible:"boolean"==typeof treeElement.collapsible?treeElement.collapsible:void 0!==treeElement.collapsed,collapsed:void 0===treeElement.collapsed?this.collapseByDefault:treeElement.collapsed,renderNodeCount:1,visibility:1,visible:!0,filterData:void 0},visibility=this._filterNode(node,parentVisibility);node.visibility=visibility,revealed&&treeListElements.push(node);const childElements=treeElement.children||Iterable.empty(),childRevealed=revealed&&0!==visibility&&!node.collapsed,childNodes=Iterable.map(childElements,(el=>this.createTreeNode(el,node,visibility,childRevealed,treeListElements,onDidCreateNode)));let visibleChildrenCount=0,renderNodeCount=1;for(const child of childNodes)node.children.push(child),renderNodeCount+=child.renderNodeCount,child.visible&&(child.visibleChildIndex=visibleChildrenCount++);return node.collapsible=node.collapsible||node.children.length>0,node.visibleChildrenCount=visibleChildrenCount,node.visible=2===visibility?visibleChildrenCount>0:1===visibility,node.visible?node.collapsed||(node.renderNodeCount=renderNodeCount):(node.renderNodeCount=0,revealed&&treeListElements.pop()),null==onDidCreateNode||onDidCreateNode(node),node}updateNodeAfterCollapseChange(node){const previousRenderNodeCount=node.renderNodeCount,result=[];return this._updateNodeAfterCollapseChange(node,result),this._updateAncestorsRenderNodeCount(node.parent,result.length-previousRenderNodeCount),result}_updateNodeAfterCollapseChange(node,result){if(!1===node.visible)return 0;if(result.push(node),node.renderNodeCount=1,!node.collapsed)for(const child of node.children)node.renderNodeCount+=this._updateNodeAfterCollapseChange(child,result);return this._onDidChangeRenderNodeCount.fire(node),node.renderNodeCount}updateNodeAfterFilterChange(node){const previousRenderNodeCount=node.renderNodeCount,result=[];return this._updateNodeAfterFilterChange(node,node.visible?1:0,result),this._updateAncestorsRenderNodeCount(node.parent,result.length-previousRenderNodeCount),result}_updateNodeAfterFilterChange(node,parentVisibility,result,revealed=!0){let visibility;if(node!==this.root){if(visibility=this._filterNode(node,parentVisibility),0===visibility)return node.visible=!1,node.renderNodeCount=0,!1;revealed&&result.push(node)}const resultStartLength=result.length;node.renderNodeCount=node===this.root?0:1;let hasVisibleDescendants=!1;if(node.collapsed&&0===visibility)node.visibleChildrenCount=0;else{let visibleChildIndex=0;for(const child of node.children)hasVisibleDescendants=this._updateNodeAfterFilterChange(child,visibility,result,revealed&&!node.collapsed)||hasVisibleDescendants,child.visible&&(child.visibleChildIndex=visibleChildIndex++);node.visibleChildrenCount=visibleChildIndex}return node!==this.root&&(node.visible=2===visibility?hasVisibleDescendants:1===visibility,node.visibility=visibility),node.visible?node.collapsed||(node.renderNodeCount+=result.length-resultStartLength):(node.renderNodeCount=0,revealed&&result.pop()),this._onDidChangeRenderNodeCount.fire(node),node.visible}_updateAncestorsRenderNodeCount(node,diff){if(0!==diff)for(;node;)node.renderNodeCount+=diff,this._onDidChangeRenderNodeCount.fire(node),node=node.parent}_filterNode(node,parentVisibility){const result=this.filter?this.filter.filter(node.element,parentVisibility):1;return"boolean"==typeof result?(node.filterData=void 0,result?1:0):isFilterResult(result)?(node.filterData=result.data,getVisibleState(result.visibility)):(node.filterData=void 0,getVisibleState(result))}hasTreeNode(location,node=this.root){if(!location||0===location.length)return!0;const[index,...rest]=location;return!(index<0||index>node.children.length)&&this.hasTreeNode(rest,node.children[index])}getTreeNode(location,node=this.root){if(!location||0===location.length)return node;const[index,...rest]=location;if(index<0||index>node.children.length)throw new TreeError(this.user,"Invalid tree location");return this.getTreeNode(rest,node.children[index])}getTreeNodeWithListIndex(location){if(0===location.length)return{node:this.root,listIndex:-1,revealed:!0,visible:!1};const{parentNode,listIndex,revealed,visible}=this.getParentNodeWithListIndex(location),index=location[location.length-1];if(index<0||index>parentNode.children.length)throw new TreeError(this.user,"Invalid tree location");const node=parentNode.children[index];return{node,listIndex,revealed,visible:visible&&node.visible}}getParentNodeWithListIndex(location,node=this.root,listIndex=0,revealed=!0,visible=!0){const[index,...rest]=location;if(index<0||index>node.children.length)throw new TreeError(this.user,"Invalid tree location");for(let i=0;i<index;i++)listIndex+=node.children[i].renderNodeCount;return revealed=revealed&&!node.collapsed,visible=visible&&node.visible,0===rest.length?{parentNode:node,listIndex,revealed,visible}:this.getParentNodeWithListIndex(rest,node.children[index],listIndex+1,revealed,visible)}getNode(location=[]){return this.getTreeNode(location)}getNodeLocation(node){const location=[];let indexTreeNode=node;for(;indexTreeNode.parent;)location.push(indexTreeNode.parent.children.indexOf(indexTreeNode)),indexTreeNode=indexTreeNode.parent;return location.reverse()}getParentNodeLocation(location){return 0===location.length?void 0:1===location.length?[]:tail2(location)[0]}getFirstElementChild(location){const node=this.getTreeNode(location);if(0!==node.children.length)return node.children[0].element}}