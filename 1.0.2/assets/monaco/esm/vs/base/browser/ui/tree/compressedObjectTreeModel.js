import{ObjectTreeModel}from"./objectTreeModel.js";import{TreeError,WeakMapper}from"./tree.js";import{Event}from"../../../common/event.js";import{Iterable}from"../../../common/iterator.js";function noCompress(element){return{element:{elements:[element.element],incompressible:element.incompressible||!1},children:Iterable.map(Iterable.from(element.children),noCompress),collapsible:element.collapsible,collapsed:element.collapsed}}export function compress(element){const elements=[element.element],incompressible=element.incompressible||!1;let childrenIterator,children;for(;[children,childrenIterator]=Iterable.consume(Iterable.from(element.children),2),1===children.length&&!children[0].incompressible;)element=children[0],elements.push(element.element);return{element:{elements,incompressible},children:Iterable.map(Iterable.concat(children,childrenIterator),compress),collapsible:element.collapsible,collapsed:element.collapsed}}function _decompress(element,index=0){let children;return children=index<element.element.elements.length-1?[_decompress(element,index+1)]:Iterable.map(Iterable.from(element.children),(el=>_decompress(el,0))),0===index&&element.element.incompressible?{element:element.element.elements[index],children,incompressible:!0,collapsible:element.collapsible,collapsed:element.collapsed}:{element:element.element.elements[index],children,collapsible:element.collapsible,collapsed:element.collapsed}}export function decompress(element){return _decompress(element,0)}function splice(treeElement,element,children){return treeElement.element===element?Object.assign(Object.assign({},treeElement),{children}):Object.assign(Object.assign({},treeElement),{children:Iterable.map(Iterable.from(treeElement.children),(e=>splice(e,element,children)))})}const wrapIdentityProvider=base=>({getId:node=>node.elements.map((e=>base.getId(e).toString())).join("\0")});export class CompressedObjectTreeModel{constructor(user,list,options={}){this.user=user,this.rootRef=null,this.nodes=new Map,this.model=new ObjectTreeModel(user,list,options),this.enabled=void 0===options.compressionEnabled||options.compressionEnabled,this.identityProvider=options.identityProvider}get onDidSplice(){return this.model.onDidSplice}get onDidChangeCollapseState(){return this.model.onDidChangeCollapseState}get onDidChangeRenderNodeCount(){return this.model.onDidChangeRenderNodeCount}setChildren(element,children=Iterable.empty(),options){const diffIdentityProvider=options.diffIdentityProvider&&(base=options.diffIdentityProvider,{getId:node=>node.elements.map((e=>base.getId(e).toString())).join("\0")});var base;if(null===element){const compressedChildren=Iterable.map(children,this.enabled?compress:noCompress);return void this._setChildren(null,compressedChildren,{diffIdentityProvider,diffDepth:1/0})}const compressedNode=this.nodes.get(element);if(!compressedNode)throw new Error("Unknown compressed tree node");const node=this.model.getNode(compressedNode),compressedParentNode=this.model.getParentNodeLocation(compressedNode),parent=this.model.getNode(compressedParentNode),splicedElement=splice(decompress(node),element,children),recompressedElement=(this.enabled?compress:noCompress)(splicedElement),parentChildren=parent.children.map((child=>child===node?recompressedElement:child));this._setChildren(parent.element,parentChildren,{diffIdentityProvider,diffDepth:node.depth-parent.depth})}setCompressionEnabled(enabled){if(enabled===this.enabled)return;this.enabled=enabled;const rootChildren=this.model.getNode().children,decompressedRootChildren=Iterable.map(rootChildren,decompress),recompressedRootChildren=Iterable.map(decompressedRootChildren,enabled?compress:noCompress);this._setChildren(null,recompressedRootChildren,{diffIdentityProvider:this.identityProvider,diffDepth:1/0})}_setChildren(node,children,options){const insertedElements=new Set;this.model.setChildren(node,children,Object.assign(Object.assign({},options),{onDidCreateNode:node=>{for(const element of node.element.elements)insertedElements.add(element),this.nodes.set(element,node.element)},onDidDeleteNode:node=>{for(const element of node.element.elements)insertedElements.has(element)||this.nodes.delete(element)}}))}has(element){return this.nodes.has(element)}getListIndex(location){const node=this.getCompressedNode(location);return this.model.getListIndex(node)}getListRenderCount(location){const node=this.getCompressedNode(location);return this.model.getListRenderCount(node)}getNode(location){if(void 0===location)return this.model.getNode();const node=this.getCompressedNode(location);return this.model.getNode(node)}getNodeLocation(node){const compressedNode=this.model.getNodeLocation(node);return null===compressedNode?null:compressedNode.elements[compressedNode.elements.length-1]}getParentNodeLocation(location){const compressedNode=this.getCompressedNode(location),parentNode=this.model.getParentNodeLocation(compressedNode);return null===parentNode?null:parentNode.elements[parentNode.elements.length-1]}getFirstElementChild(location){const compressedNode=this.getCompressedNode(location);return this.model.getFirstElementChild(compressedNode)}isCollapsible(location){const compressedNode=this.getCompressedNode(location);return this.model.isCollapsible(compressedNode)}setCollapsible(location,collapsible){const compressedNode=this.getCompressedNode(location);return this.model.setCollapsible(compressedNode,collapsible)}isCollapsed(location){const compressedNode=this.getCompressedNode(location);return this.model.isCollapsed(compressedNode)}setCollapsed(location,collapsed,recursive){const compressedNode=this.getCompressedNode(location);return this.model.setCollapsed(compressedNode,collapsed,recursive)}expandTo(location){const compressedNode=this.getCompressedNode(location);this.model.expandTo(compressedNode)}rerender(location){const compressedNode=this.getCompressedNode(location);this.model.rerender(compressedNode)}refilter(){this.model.refilter()}getCompressedNode(element){if(null===element)return null;const node=this.nodes.get(element);if(!node)throw new TreeError(this.user,`Tree element not found: ${element}`);return node}}export const DefaultElementMapper=elements=>elements[elements.length-1];class CompressedTreeNodeWrapper{constructor(unwrapper,node){this.unwrapper=unwrapper,this.node=node}get element(){return null===this.node.element?null:this.unwrapper(this.node.element)}get children(){return this.node.children.map((node=>new CompressedTreeNodeWrapper(this.unwrapper,node)))}get depth(){return this.node.depth}get visibleChildrenCount(){return this.node.visibleChildrenCount}get visibleChildIndex(){return this.node.visibleChildIndex}get collapsible(){return this.node.collapsible}get collapsed(){return this.node.collapsed}get visible(){return this.node.visible}get filterData(){return this.node.filterData}}function mapList(nodeMapper,list){return{splice(start,deleteCount,toInsert){list.splice(start,deleteCount,toInsert.map((node=>nodeMapper.map(node))))},updateElementHeight(index,height){list.updateElementHeight(index,height)}}}function mapOptions(compressedNodeUnwrapper,options){return Object.assign(Object.assign({},options),{identityProvider:options.identityProvider&&{getId:node=>options.identityProvider.getId(compressedNodeUnwrapper(node))},sorter:options.sorter&&{compare:(node,otherNode)=>options.sorter.compare(node.elements[0],otherNode.elements[0])},filter:options.filter&&{filter:(node,parentVisibility)=>options.filter.filter(compressedNodeUnwrapper(node),parentVisibility)}})}export class CompressibleObjectTreeModel{constructor(user,list,options={}){this.rootRef=null,this.elementMapper=options.elementMapper||DefaultElementMapper;const compressedNodeUnwrapper=node=>this.elementMapper(node.elements);this.nodeMapper=new WeakMapper((node=>new CompressedTreeNodeWrapper(compressedNodeUnwrapper,node))),this.model=new CompressedObjectTreeModel(user,mapList(this.nodeMapper,list),mapOptions(compressedNodeUnwrapper,options))}get onDidSplice(){return Event.map(this.model.onDidSplice,(({insertedNodes,deletedNodes})=>({insertedNodes:insertedNodes.map((node=>this.nodeMapper.map(node))),deletedNodes:deletedNodes.map((node=>this.nodeMapper.map(node)))})))}get onDidChangeCollapseState(){return Event.map(this.model.onDidChangeCollapseState,(({node,deep})=>({node:this.nodeMapper.map(node),deep})))}get onDidChangeRenderNodeCount(){return Event.map(this.model.onDidChangeRenderNodeCount,(node=>this.nodeMapper.map(node)))}setChildren(element,children=Iterable.empty(),options={}){this.model.setChildren(element,children,options)}setCompressionEnabled(enabled){this.model.setCompressionEnabled(enabled)}has(location){return this.model.has(location)}getListIndex(location){return this.model.getListIndex(location)}getListRenderCount(location){return this.model.getListRenderCount(location)}getNode(location){return this.nodeMapper.map(this.model.getNode(location))}getNodeLocation(node){return node.element}getParentNodeLocation(location){return this.model.getParentNodeLocation(location)}getFirstElementChild(location){const result=this.model.getFirstElementChild(location);return null==result?result:this.elementMapper(result.elements)}isCollapsible(location){return this.model.isCollapsible(location)}setCollapsible(location,collapsed){return this.model.setCollapsible(location,collapsed)}isCollapsed(location){return this.model.isCollapsed(location)}setCollapsed(location,collapsed,recursive){return this.model.setCollapsed(location,collapsed,recursive)}expandTo(location){return this.model.expandTo(location)}rerender(location){return this.model.rerender(location)}refilter(){return this.model.refilter()}getCompressedTreeNode(location=null){return this.model.getNode(location)}}