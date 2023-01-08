import{CachedFunction}from"../../../../base/common/cache.js";import{BugIndicatingError}from"../../../../base/common/errors.js";export class LanguageBracketsConfiguration{constructor(languageId,config){let brackets;this.languageId=languageId,brackets=config.colorizedBracketPairs?filterValidBrackets(config.colorizedBracketPairs.map((b=>[b[0],b[1]]))):config.brackets?filterValidBrackets(config.brackets.map((b=>[b[0],b[1]])).filter((p=>!("<"===p[0]&&">"===p[1])))):[];const openingBracketInfos=new CachedFunction((bracket=>{const closing=new Set;return{info:new OpeningBracketKind(this,bracket,closing),closing}})),closingBracketInfos=new CachedFunction((bracket=>{const opening=new Set;return{info:new ClosingBracketKind(this,bracket,opening),opening}}));for(const[open,close]of brackets){const opening=openingBracketInfos.get(open),closing=closingBracketInfos.get(close);opening.closing.add(closing.info),closing.opening.add(opening.info)}this._openingBrackets=new Map([...openingBracketInfos.cachedValues].map((([k,v])=>[k,v.info]))),this._closingBrackets=new Map([...closingBracketInfos.cachedValues].map((([k,v])=>[k,v.info])))}get openingBrackets(){return[...this._openingBrackets.values()]}get closingBrackets(){return[...this._closingBrackets.values()]}getOpeningBracketInfo(bracketText){return this._openingBrackets.get(bracketText)}getClosingBracketInfo(bracketText){return this._closingBrackets.get(bracketText)}getBracketInfo(bracketText){return this.getOpeningBracketInfo(bracketText)||this.getClosingBracketInfo(bracketText)}}function filterValidBrackets(bracketPairs){return bracketPairs.filter((([open,close])=>""!==open&&""!==close))}export class BracketKindBase{constructor(config,bracketText){this.config=config,this.bracketText=bracketText}get languageId(){return this.config.languageId}}export class OpeningBracketKind extends BracketKindBase{constructor(config,bracketText,openedBrackets){super(config,bracketText),this.openedBrackets=openedBrackets,this.isOpeningBracket=!0}}export class ClosingBracketKind extends BracketKindBase{constructor(config,bracketText,closedBrackets){super(config,bracketText),this.closedBrackets=closedBrackets,this.isOpeningBracket=!1}closes(other){if(other.languageId===this.languageId&&other.config!==this.config)throw new BugIndicatingError("Brackets from different language configuration cannot be used.");return this.closedBrackets.has(other)}getClosedBrackets(){return[...this.closedBrackets]}}