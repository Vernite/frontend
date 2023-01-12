import{asCSSPropertyValue,asCSSUrl}from"../../../base/browser/dom.js";import{Emitter}from"../../../base/common/event.js";import{getIconRegistry}from"../common/iconRegistry.js";import{ThemeIcon}from"../common/themeService.js";export function getIconsStyleSheet(themeService){const onDidChangeEmmiter=new Emitter,iconRegistry=getIconRegistry();return iconRegistry.onDidChange((()=>onDidChangeEmmiter.fire())),null==themeService||themeService.onDidProductIconThemeChange((()=>onDidChangeEmmiter.fire())),{onDidChange:onDidChangeEmmiter.event,getCSS(){const productIconTheme=themeService?themeService.getProductIconTheme():new UnthemedProductIconTheme,usedFontIds={},formatIconRule=contribution=>{const definition=productIconTheme.getIcon(contribution);if(!definition)return;const fontContribution=definition.font;return fontContribution?(usedFontIds[fontContribution.id]=fontContribution.definition,`.codicon-${contribution.id}:before { content: '${definition.fontCharacter}'; font-family: ${asCSSPropertyValue(fontContribution.id)}; }`):`.codicon-${contribution.id}:before { content: '${definition.fontCharacter}'; }`},rules=[];for(const contribution of iconRegistry.getIcons()){const rule=formatIconRule(contribution);rule&&rules.push(rule)}for(const id in usedFontIds){const definition=usedFontIds[id],fontWeight=definition.weight?`font-weight: ${definition.weight};`:"",fontStyle=definition.style?`font-style: ${definition.style};`:"",src=definition.src.map((l=>`${asCSSUrl(l.location)} format('${l.format}')`)).join(", ");rules.push(`@font-face { src: ${src}; font-family: ${asCSSPropertyValue(id)};${fontWeight}${fontStyle} font-display: block; }`)}return rules.join("\n")}}}export class UnthemedProductIconTheme{getIcon(contribution){const iconRegistry=getIconRegistry();let definition=contribution.defaults;for(;ThemeIcon.isThemeIcon(definition);){const c=iconRegistry.getIcon(definition.id);if(!c)return;definition=c.defaults}return definition}}