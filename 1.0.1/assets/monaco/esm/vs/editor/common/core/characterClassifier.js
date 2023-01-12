import{toUint8}from"../../../base/common/uint.js";export class CharacterClassifier{constructor(_defaultValue){const defaultValue=toUint8(_defaultValue);this._defaultValue=defaultValue,this._asciiMap=CharacterClassifier._createAsciiMap(defaultValue),this._map=new Map}static _createAsciiMap(defaultValue){const asciiMap=new Uint8Array(256);for(let i=0;i<256;i++)asciiMap[i]=defaultValue;return asciiMap}set(charCode,_value){const value=toUint8(_value);charCode>=0&&charCode<256?this._asciiMap[charCode]=value:this._map.set(charCode,value)}get(charCode){return charCode>=0&&charCode<256?this._asciiMap[charCode]:this._map.get(charCode)||this._defaultValue}}export class CharacterSet{constructor(){this._actual=new CharacterClassifier(0)}add(charCode){this._actual.set(charCode,1)}has(charCode){return 1===this._actual.get(charCode)}}