import"./overlayWidgets.css";import{createFastDomNode}from"../../../../base/browser/fastDomNode.js";import{PartFingerprints,ViewPart}from"../../view/viewPart.js";export class ViewOverlayWidgets extends ViewPart{constructor(context){super(context);const layoutInfo=this._context.configuration.options.get(133);this._widgets={},this._verticalScrollbarWidth=layoutInfo.verticalScrollbarWidth,this._minimapWidth=layoutInfo.minimap.minimapWidth,this._horizontalScrollbarHeight=layoutInfo.horizontalScrollbarHeight,this._editorHeight=layoutInfo.height,this._editorWidth=layoutInfo.width,this._domNode=createFastDomNode(document.createElement("div")),PartFingerprints.write(this._domNode,4),this._domNode.setClassName("overlayWidgets")}dispose(){super.dispose(),this._widgets={}}getDomNode(){return this._domNode}onConfigurationChanged(e){const layoutInfo=this._context.configuration.options.get(133);return this._verticalScrollbarWidth=layoutInfo.verticalScrollbarWidth,this._minimapWidth=layoutInfo.minimap.minimapWidth,this._horizontalScrollbarHeight=layoutInfo.horizontalScrollbarHeight,this._editorHeight=layoutInfo.height,this._editorWidth=layoutInfo.width,!0}addWidget(widget){const domNode=createFastDomNode(widget.getDomNode());this._widgets[widget.getId()]={widget,preference:null,domNode},domNode.setPosition("absolute"),domNode.setAttribute("widgetId",widget.getId()),this._domNode.appendChild(domNode),this.setShouldRender()}setWidgetPosition(widget,preference){const widgetData=this._widgets[widget.getId()];return widgetData.preference!==preference&&(widgetData.preference=preference,this.setShouldRender(),!0)}removeWidget(widget){const widgetId=widget.getId();if(this._widgets.hasOwnProperty(widgetId)){const domNode=this._widgets[widgetId].domNode.domNode;delete this._widgets[widgetId],domNode.parentNode.removeChild(domNode),this.setShouldRender()}}_renderWidget(widgetData){const domNode=widgetData.domNode;if(null!==widgetData.preference)if(0===widgetData.preference)domNode.setTop(0),domNode.setRight(2*this._verticalScrollbarWidth+this._minimapWidth);else if(1===widgetData.preference){const widgetHeight=domNode.domNode.clientHeight;domNode.setTop(this._editorHeight-widgetHeight-2*this._horizontalScrollbarHeight),domNode.setRight(2*this._verticalScrollbarWidth+this._minimapWidth)}else 2===widgetData.preference&&(domNode.setTop(0),domNode.domNode.style.right="50%");else domNode.setTop("")}prepareRender(ctx){}render(ctx){this._domNode.setWidth(this._editorWidth);const keys=Object.keys(this._widgets);for(let i=0,len=keys.length;i<len;i++){const widgetId=keys[i];this._renderWidget(this._widgets[widgetId])}}}