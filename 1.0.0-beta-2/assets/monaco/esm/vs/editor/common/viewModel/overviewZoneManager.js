export class ColorZone{constructor(from,to,colorId){this._colorZoneBrand=void 0,this.from=0|from,this.to=0|to,this.colorId=0|colorId}static compare(a,b){return a.colorId===b.colorId?a.from===b.from?a.to-b.to:a.from-b.from:a.colorId-b.colorId}}export class OverviewRulerZone{constructor(startLineNumber,endLineNumber,heightInLines,color){this._overviewRulerZoneBrand=void 0,this.startLineNumber=startLineNumber,this.endLineNumber=endLineNumber,this.heightInLines=heightInLines,this.color=color,this._colorZone=null}static compare(a,b){return a.color===b.color?a.startLineNumber===b.startLineNumber?a.heightInLines===b.heightInLines?a.endLineNumber-b.endLineNumber:a.heightInLines-b.heightInLines:a.startLineNumber-b.startLineNumber:a.color<b.color?-1:1}setColorZone(colorZone){this._colorZone=colorZone}getColorZones(){return this._colorZone}}export class OverviewZoneManager{constructor(getVerticalOffsetForLine){this._getVerticalOffsetForLine=getVerticalOffsetForLine,this._zones=[],this._colorZonesInvalid=!1,this._lineHeight=0,this._domWidth=0,this._domHeight=0,this._outerHeight=0,this._pixelRatio=1,this._lastAssignedId=0,this._color2Id=Object.create(null),this._id2Color=[]}getId2Color(){return this._id2Color}setZones(newZones){this._zones=newZones,this._zones.sort(OverviewRulerZone.compare)}setLineHeight(lineHeight){return this._lineHeight!==lineHeight&&(this._lineHeight=lineHeight,this._colorZonesInvalid=!0,!0)}setPixelRatio(pixelRatio){this._pixelRatio=pixelRatio,this._colorZonesInvalid=!0}getDOMWidth(){return this._domWidth}getCanvasWidth(){return this._domWidth*this._pixelRatio}setDOMWidth(width){return this._domWidth!==width&&(this._domWidth=width,this._colorZonesInvalid=!0,!0)}getDOMHeight(){return this._domHeight}getCanvasHeight(){return this._domHeight*this._pixelRatio}setDOMHeight(height){return this._domHeight!==height&&(this._domHeight=height,this._colorZonesInvalid=!0,!0)}getOuterHeight(){return this._outerHeight}setOuterHeight(outerHeight){return this._outerHeight!==outerHeight&&(this._outerHeight=outerHeight,this._colorZonesInvalid=!0,!0)}resolveColorZones(){const colorZonesInvalid=this._colorZonesInvalid,lineHeight=Math.floor(this._lineHeight),totalHeight=Math.floor(this.getCanvasHeight()),heightRatio=totalHeight/Math.floor(this._outerHeight),halfMinimumHeight=Math.floor(4*this._pixelRatio/2),allColorZones=[];for(let i=0,len=this._zones.length;i<len;i++){const zone=this._zones[i];if(!colorZonesInvalid){const colorZone=zone.getColorZones();if(colorZone){allColorZones.push(colorZone);continue}}const offset1=this._getVerticalOffsetForLine(zone.startLineNumber),offset2=0===zone.heightInLines?this._getVerticalOffsetForLine(zone.endLineNumber)+lineHeight:offset1+zone.heightInLines*lineHeight,y1=Math.floor(heightRatio*offset1),y2=Math.floor(heightRatio*offset2);let ycenter=Math.floor((y1+y2)/2),halfHeight=y2-ycenter;halfHeight<halfMinimumHeight&&(halfHeight=halfMinimumHeight),ycenter-halfHeight<0&&(ycenter=halfHeight),ycenter+halfHeight>totalHeight&&(ycenter=totalHeight-halfHeight);const color=zone.color;let colorId=this._color2Id[color];colorId||(colorId=++this._lastAssignedId,this._color2Id[color]=colorId,this._id2Color[colorId]=color);const colorZone=new ColorZone(ycenter-halfHeight,ycenter+halfHeight,colorId);zone.setColorZone(colorZone),allColorZones.push(colorZone)}return this._colorZonesInvalid=!1,allColorZones.sort(ColorZone.compare),allColorZones}}