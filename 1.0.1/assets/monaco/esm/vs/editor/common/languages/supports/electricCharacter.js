import{distinct}from"../../../../base/common/arrays.js";import{ignoreBracketsInToken}from"../supports.js";import{BracketsUtils}from"./richEditBrackets.js";export class BracketElectricCharacterSupport{constructor(richEditBrackets){this._richEditBrackets=richEditBrackets}getElectricCharacters(){const result=[];if(this._richEditBrackets)for(const bracket of this._richEditBrackets.brackets)for(const close of bracket.close){const lastChar=close.charAt(close.length-1);result.push(lastChar)}return distinct(result)}onElectricCharacter(character,context,column){if(!this._richEditBrackets||0===this._richEditBrackets.brackets.length)return null;const tokenIndex=context.findTokenIndexAtOffset(column-1);if(ignoreBracketsInToken(context.getStandardTokenType(tokenIndex)))return null;const reversedBracketRegex=this._richEditBrackets.reversedRegex,text=context.getLineContent().substring(0,column-1)+character,r=BracketsUtils.findPrevBracketInRange(reversedBracketRegex,1,text,0,text.length);if(!r)return null;const bracketText=text.substring(r.startColumn-1,r.endColumn-1).toLowerCase();if(this._richEditBrackets.textIsOpenBracket[bracketText])return null;const textBeforeBracket=context.getActualLineContentBefore(r.startColumn-1);return/^\s*$/.test(textBeforeBracket)?{matchOpenBracket:bracketText}:null}}