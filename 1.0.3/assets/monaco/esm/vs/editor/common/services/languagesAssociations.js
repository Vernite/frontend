import{parse}from"../../../base/common/glob.js";import{Mimes}from"../../../base/common/mime.js";import{Schemas}from"../../../base/common/network.js";import{basename,posix}from"../../../base/common/path.js";import{DataUri}from"../../../base/common/resources.js";import{startsWithUTF8BOM}from"../../../base/common/strings.js";import{PLAINTEXT_LANGUAGE_ID}from"../languages/modesRegistry.js";let registeredAssociations=[],nonUserRegisteredAssociations=[],userRegisteredAssociations=[];export function registerPlatformLanguageAssociation(association,warnOnOverwrite=!1){_registerLanguageAssociation(association,!1,warnOnOverwrite)}function _registerLanguageAssociation(association,userConfigured,warnOnOverwrite){const associationItem=toLanguageAssociationItem(association,userConfigured);registeredAssociations.push(associationItem),associationItem.userConfigured?userRegisteredAssociations.push(associationItem):nonUserRegisteredAssociations.push(associationItem),warnOnOverwrite&&!associationItem.userConfigured&&registeredAssociations.forEach((a=>{a.mime===associationItem.mime||a.userConfigured||(associationItem.extension&&a.extension===associationItem.extension&&console.warn(`Overwriting extension <<${associationItem.extension}>> to now point to mime <<${associationItem.mime}>>`),associationItem.filename&&a.filename===associationItem.filename&&console.warn(`Overwriting filename <<${associationItem.filename}>> to now point to mime <<${associationItem.mime}>>`),associationItem.filepattern&&a.filepattern===associationItem.filepattern&&console.warn(`Overwriting filepattern <<${associationItem.filepattern}>> to now point to mime <<${associationItem.mime}>>`),associationItem.firstline&&a.firstline===associationItem.firstline&&console.warn(`Overwriting firstline <<${associationItem.firstline}>> to now point to mime <<${associationItem.mime}>>`))}))}function toLanguageAssociationItem(association,userConfigured){return{id:association.id,mime:association.mime,filename:association.filename,extension:association.extension,filepattern:association.filepattern,firstline:association.firstline,userConfigured,filenameLowercase:association.filename?association.filename.toLowerCase():void 0,extensionLowercase:association.extension?association.extension.toLowerCase():void 0,filepatternLowercase:association.filepattern?parse(association.filepattern.toLowerCase()):void 0,filepatternOnPath:!!association.filepattern&&association.filepattern.indexOf(posix.sep)>=0}}export function clearPlatformLanguageAssociations(){registeredAssociations=registeredAssociations.filter((a=>a.userConfigured)),nonUserRegisteredAssociations=[]}export function getLanguageIds(resource,firstLine){return getAssociations(resource,firstLine).map((item=>item.id))}function getAssociations(resource,firstLine){let path;if(resource)switch(resource.scheme){case Schemas.file:path=resource.fsPath;break;case Schemas.data:path=DataUri.parseMetaData(resource).get(DataUri.META_DATA_LABEL);break;case Schemas.vscodeNotebookCell:path=void 0;break;default:path=resource.path}if(!path)return[{id:"unknown",mime:Mimes.unknown}];path=path.toLowerCase();const filename=basename(path),configuredLanguage=getAssociationByPath(path,filename,userRegisteredAssociations);if(configuredLanguage)return[configuredLanguage,{id:PLAINTEXT_LANGUAGE_ID,mime:Mimes.text}];const registeredLanguage=getAssociationByPath(path,filename,nonUserRegisteredAssociations);if(registeredLanguage)return[registeredLanguage,{id:PLAINTEXT_LANGUAGE_ID,mime:Mimes.text}];if(firstLine){const firstlineLanguage=getAssociationByFirstline(firstLine);if(firstlineLanguage)return[firstlineLanguage,{id:PLAINTEXT_LANGUAGE_ID,mime:Mimes.text}]}return[{id:"unknown",mime:Mimes.unknown}]}function getAssociationByPath(path,filename,associations){var _a;let filenameMatch,patternMatch,extensionMatch;for(let i=associations.length-1;i>=0;i--){const association=associations[i];if(filename===association.filenameLowercase){filenameMatch=association;break}if(association.filepattern&&(!patternMatch||association.filepattern.length>patternMatch.filepattern.length)){const target=association.filepatternOnPath?path:filename;(null===(_a=association.filepatternLowercase)||void 0===_a?void 0:_a.call(association,target))&&(patternMatch=association)}association.extension&&(!extensionMatch||association.extension.length>extensionMatch.extension.length)&&filename.endsWith(association.extensionLowercase)&&(extensionMatch=association)}return filenameMatch||(patternMatch||(extensionMatch||void 0))}function getAssociationByFirstline(firstLine){if(startsWithUTF8BOM(firstLine)&&(firstLine=firstLine.substr(1)),firstLine.length>0)for(let i=registeredAssociations.length-1;i>=0;i--){const association=registeredAssociations[i];if(!association.firstline)continue;const matches=firstLine.match(association.firstline);if(matches&&matches.length>0)return association}}