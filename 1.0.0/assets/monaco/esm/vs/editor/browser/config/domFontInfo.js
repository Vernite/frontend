import{FastDomNode}from"../../../base/browser/fastDomNode.js";export function applyFontInfo(domNode,fontInfo){domNode instanceof FastDomNode?(domNode.setFontFamily(fontInfo.getMassagedFontFamily()),domNode.setFontWeight(fontInfo.fontWeight),domNode.setFontSize(fontInfo.fontSize),domNode.setFontFeatureSettings(fontInfo.fontFeatureSettings),domNode.setLineHeight(fontInfo.lineHeight),domNode.setLetterSpacing(fontInfo.letterSpacing)):(domNode.style.fontFamily=fontInfo.getMassagedFontFamily(),domNode.style.fontWeight=fontInfo.fontWeight,domNode.style.fontSize=fontInfo.fontSize+"px",domNode.style.fontFeatureSettings=fontInfo.fontFeatureSettings,domNode.style.lineHeight=fontInfo.lineHeight+"px",domNode.style.letterSpacing=fontInfo.letterSpacing+"px")}