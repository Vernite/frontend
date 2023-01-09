import{getCharIndex}from"./minimapCharSheet.js";import{toUint8}from"../../../../base/common/uint.js";export class MinimapCharRenderer{constructor(charData,scale){this.scale=scale,this._minimapCharRendererBrand=void 0,this.charDataNormal=MinimapCharRenderer.soften(charData,.8),this.charDataLight=MinimapCharRenderer.soften(charData,50/60)}static soften(input,ratio){const result=new Uint8ClampedArray(input.length);for(let i=0,len=input.length;i<len;i++)result[i]=toUint8(input[i]*ratio);return result}renderChar(target,dx,dy,chCode,color,foregroundAlpha,backgroundColor,backgroundAlpha,fontScale,useLighterFont,force1pxHeight){const charWidth=1*this.scale,charHeight=2*this.scale,renderHeight=force1pxHeight?1:charHeight;if(dx+charWidth>target.width||dy+renderHeight>target.height)return void console.warn("bad render request outside image data");const charData=useLighterFont?this.charDataLight:this.charDataNormal,charIndex=getCharIndex(chCode,fontScale),destWidth=4*target.width,backgroundR=backgroundColor.r,backgroundG=backgroundColor.g,backgroundB=backgroundColor.b,deltaR=color.r-backgroundR,deltaG=color.g-backgroundG,deltaB=color.b-backgroundB,destAlpha=Math.max(foregroundAlpha,backgroundAlpha),dest=target.data;let sourceOffset=charIndex*charWidth*charHeight,row=dy*destWidth+4*dx;for(let y=0;y<renderHeight;y++){let column=row;for(let x=0;x<charWidth;x++){const c=charData[sourceOffset++]/255*(foregroundAlpha/255);dest[column++]=backgroundR+deltaR*c,dest[column++]=backgroundG+deltaG*c,dest[column++]=backgroundB+deltaB*c,dest[column++]=destAlpha}row+=destWidth}}blockRenderChar(target,dx,dy,color,foregroundAlpha,backgroundColor,backgroundAlpha,force1pxHeight){const charWidth=1*this.scale,charHeight=2*this.scale,renderHeight=force1pxHeight?1:charHeight;if(dx+charWidth>target.width||dy+renderHeight>target.height)return void console.warn("bad render request outside image data");const destWidth=4*target.width,c=foregroundAlpha/255*.5,backgroundR=backgroundColor.r,backgroundG=backgroundColor.g,backgroundB=backgroundColor.b,colorR=backgroundR+(color.r-backgroundR)*c,colorG=backgroundG+(color.g-backgroundG)*c,colorB=backgroundB+(color.b-backgroundB)*c,destAlpha=Math.max(foregroundAlpha,backgroundAlpha),dest=target.data;let row=dy*destWidth+4*dx;for(let y=0;y<renderHeight;y++){let column=row;for(let x=0;x<charWidth;x++)dest[column++]=colorR,dest[column++]=colorG,dest[column++]=colorB,dest[column++]=destAlpha;row+=destWidth}}}