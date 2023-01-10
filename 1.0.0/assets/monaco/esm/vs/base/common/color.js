function roundFloat(number,decimalPoints){const decimal=Math.pow(10,decimalPoints);return Math.round(number*decimal)/decimal}export class RGBA{constructor(r,g,b,a=1){this._rgbaBrand=void 0,this.r=0|Math.min(255,Math.max(0,r)),this.g=0|Math.min(255,Math.max(0,g)),this.b=0|Math.min(255,Math.max(0,b)),this.a=roundFloat(Math.max(Math.min(1,a),0),3)}static equals(a,b){return a.r===b.r&&a.g===b.g&&a.b===b.b&&a.a===b.a}}export class HSLA{constructor(h,s,l,a){this._hslaBrand=void 0,this.h=0|Math.max(Math.min(360,h),0),this.s=roundFloat(Math.max(Math.min(1,s),0),3),this.l=roundFloat(Math.max(Math.min(1,l),0),3),this.a=roundFloat(Math.max(Math.min(1,a),0),3)}static equals(a,b){return a.h===b.h&&a.s===b.s&&a.l===b.l&&a.a===b.a}static fromRGBA(rgba){const r=rgba.r/255,g=rgba.g/255,b=rgba.b/255,a=rgba.a,max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0;const l=(min+max)/2,chroma=max-min;if(chroma>0){switch(s=Math.min(l<=.5?chroma/(2*l):chroma/(2-2*l),1),max){case r:h=(g-b)/chroma+(g<b?6:0);break;case g:h=(b-r)/chroma+2;break;case b:h=(r-g)/chroma+4}h*=60,h=Math.round(h)}return new HSLA(h,s,l,a)}static _hue2rgb(p,q,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?p+6*(q-p)*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p}static toRGBA(hsla){const h=hsla.h/360,{s,l,a}=hsla;let r,g,b;if(0===s)r=g=b=l;else{const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;r=HSLA._hue2rgb(p,q,h+1/3),g=HSLA._hue2rgb(p,q,h),b=HSLA._hue2rgb(p,q,h-1/3)}return new RGBA(Math.round(255*r),Math.round(255*g),Math.round(255*b),a)}}export class HSVA{constructor(h,s,v,a){this._hsvaBrand=void 0,this.h=0|Math.max(Math.min(360,h),0),this.s=roundFloat(Math.max(Math.min(1,s),0),3),this.v=roundFloat(Math.max(Math.min(1,v),0),3),this.a=roundFloat(Math.max(Math.min(1,a),0),3)}static equals(a,b){return a.h===b.h&&a.s===b.s&&a.v===b.v&&a.a===b.a}static fromRGBA(rgba){const r=rgba.r/255,g=rgba.g/255,b=rgba.b/255,cmax=Math.max(r,g,b),delta=cmax-Math.min(r,g,b),s=0===cmax?0:delta/cmax;let m;return m=0===delta?0:cmax===r?((g-b)/delta%6+6)%6:cmax===g?(b-r)/delta+2:(r-g)/delta+4,new HSVA(Math.round(60*m),s,cmax,rgba.a)}static toRGBA(hsva){const{h,s,v,a}=hsva,c=v*s,x=c*(1-Math.abs(h/60%2-1)),m=v-c;let[r,g,b]=[0,0,0];return h<60?(r=c,g=x):h<120?(r=x,g=c):h<180?(g=c,b=x):h<240?(g=x,b=c):h<300?(r=x,b=c):h<=360&&(r=c,b=x),r=Math.round(255*(r+m)),g=Math.round(255*(g+m)),b=Math.round(255*(b+m)),new RGBA(r,g,b,a)}}export class Color{constructor(arg){if(!arg)throw new Error("Color needs a value");if(arg instanceof RGBA)this.rgba=arg;else if(arg instanceof HSLA)this._hsla=arg,this.rgba=HSLA.toRGBA(arg);else{if(!(arg instanceof HSVA))throw new Error("Invalid color ctor argument");this._hsva=arg,this.rgba=HSVA.toRGBA(arg)}}static fromHex(hex){return Color.Format.CSS.parseHex(hex)||Color.red}get hsla(){return this._hsla?this._hsla:HSLA.fromRGBA(this.rgba)}get hsva(){return this._hsva?this._hsva:HSVA.fromRGBA(this.rgba)}equals(other){return!!other&&RGBA.equals(this.rgba,other.rgba)&&HSLA.equals(this.hsla,other.hsla)&&HSVA.equals(this.hsva,other.hsva)}getRelativeLuminance(){return roundFloat(.2126*Color._relativeLuminanceForComponent(this.rgba.r)+.7152*Color._relativeLuminanceForComponent(this.rgba.g)+.0722*Color._relativeLuminanceForComponent(this.rgba.b),4)}static _relativeLuminanceForComponent(color){const c=color/255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)}isLighter(){return(299*this.rgba.r+587*this.rgba.g+114*this.rgba.b)/1e3>=128}isLighterThan(another){return this.getRelativeLuminance()>another.getRelativeLuminance()}isDarkerThan(another){return this.getRelativeLuminance()<another.getRelativeLuminance()}lighten(factor){return new Color(new HSLA(this.hsla.h,this.hsla.s,this.hsla.l+this.hsla.l*factor,this.hsla.a))}darken(factor){return new Color(new HSLA(this.hsla.h,this.hsla.s,this.hsla.l-this.hsla.l*factor,this.hsla.a))}transparent(factor){const{r,g,b,a}=this.rgba;return new Color(new RGBA(r,g,b,a*factor))}isTransparent(){return 0===this.rgba.a}isOpaque(){return 1===this.rgba.a}opposite(){return new Color(new RGBA(255-this.rgba.r,255-this.rgba.g,255-this.rgba.b,this.rgba.a))}toString(){return this._toString||(this._toString=Color.Format.CSS.format(this)),this._toString}static getLighterColor(of,relative,factor){if(of.isLighterThan(relative))return of;factor=factor||.5;const lum1=of.getRelativeLuminance(),lum2=relative.getRelativeLuminance();return factor=factor*(lum2-lum1)/lum2,of.lighten(factor)}static getDarkerColor(of,relative,factor){if(of.isDarkerThan(relative))return of;factor=factor||.5;const lum1=of.getRelativeLuminance();return factor=factor*(lum1-relative.getRelativeLuminance())/lum1,of.darken(factor)}}Color.white=new Color(new RGBA(255,255,255,1)),Color.black=new Color(new RGBA(0,0,0,1)),Color.red=new Color(new RGBA(255,0,0,1)),Color.blue=new Color(new RGBA(0,0,255,1)),Color.green=new Color(new RGBA(0,255,0,1)),Color.cyan=new Color(new RGBA(0,255,255,1)),Color.lightgrey=new Color(new RGBA(211,211,211,1)),Color.transparent=new Color(new RGBA(0,0,0,0)),function(Color){let Format;!function(Format){let CSS;!function(CSS){function _toTwoDigitHex(n){const r=n.toString(16);return 2!==r.length?"0"+r:r}function _parseHexDigit(charCode){switch(charCode){case 48:return 0;case 49:return 1;case 50:return 2;case 51:return 3;case 52:return 4;case 53:return 5;case 54:return 6;case 55:return 7;case 56:return 8;case 57:return 9;case 97:case 65:return 10;case 98:case 66:return 11;case 99:case 67:return 12;case 100:case 68:return 13;case 101:case 69:return 14;case 102:case 70:return 15}return 0}CSS.formatRGB=function formatRGB(color){return 1===color.rgba.a?`rgb(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b})`:Color.Format.CSS.formatRGBA(color)},CSS.formatRGBA=function formatRGBA(color){return`rgba(${color.rgba.r}, ${color.rgba.g}, ${color.rgba.b}, ${+color.rgba.a.toFixed(2)})`},CSS.formatHSL=function formatHSL(color){return 1===color.hsla.a?`hsl(${color.hsla.h}, ${(100*color.hsla.s).toFixed(2)}%, ${(100*color.hsla.l).toFixed(2)}%)`:Color.Format.CSS.formatHSLA(color)},CSS.formatHSLA=function formatHSLA(color){return`hsla(${color.hsla.h}, ${(100*color.hsla.s).toFixed(2)}%, ${(100*color.hsla.l).toFixed(2)}%, ${color.hsla.a.toFixed(2)})`},CSS.formatHex=function formatHex(color){return`#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}`},CSS.formatHexA=function formatHexA(color,compact=!1){return compact&&1===color.rgba.a?Color.Format.CSS.formatHex(color):`#${_toTwoDigitHex(color.rgba.r)}${_toTwoDigitHex(color.rgba.g)}${_toTwoDigitHex(color.rgba.b)}${_toTwoDigitHex(Math.round(255*color.rgba.a))}`},CSS.format=function format(color){return color.isOpaque()?Color.Format.CSS.formatHex(color):Color.Format.CSS.formatRGBA(color)},CSS.parseHex=function parseHex(hex){const length=hex.length;if(0===length)return null;if(35!==hex.charCodeAt(0))return null;if(7===length){const r=16*_parseHexDigit(hex.charCodeAt(1))+_parseHexDigit(hex.charCodeAt(2)),g=16*_parseHexDigit(hex.charCodeAt(3))+_parseHexDigit(hex.charCodeAt(4)),b=16*_parseHexDigit(hex.charCodeAt(5))+_parseHexDigit(hex.charCodeAt(6));return new Color(new RGBA(r,g,b,1))}if(9===length){const r=16*_parseHexDigit(hex.charCodeAt(1))+_parseHexDigit(hex.charCodeAt(2)),g=16*_parseHexDigit(hex.charCodeAt(3))+_parseHexDigit(hex.charCodeAt(4)),b=16*_parseHexDigit(hex.charCodeAt(5))+_parseHexDigit(hex.charCodeAt(6)),a=16*_parseHexDigit(hex.charCodeAt(7))+_parseHexDigit(hex.charCodeAt(8));return new Color(new RGBA(r,g,b,a/255))}if(4===length){const r=_parseHexDigit(hex.charCodeAt(1)),g=_parseHexDigit(hex.charCodeAt(2)),b=_parseHexDigit(hex.charCodeAt(3));return new Color(new RGBA(16*r+r,16*g+g,16*b+b))}if(5===length){const r=_parseHexDigit(hex.charCodeAt(1)),g=_parseHexDigit(hex.charCodeAt(2)),b=_parseHexDigit(hex.charCodeAt(3)),a=_parseHexDigit(hex.charCodeAt(4));return new Color(new RGBA(16*r+r,16*g+g,16*b+b,(16*a+a)/255))}return null}}(CSS=Format.CSS||(Format.CSS={}))}(Format=Color.Format||(Color.Format={}))}(Color||(Color={}));