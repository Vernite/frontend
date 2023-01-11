export class EditorSettingMigration{constructor(key,migrate){this.key=key,this.migrate=migrate}apply(options){const value=EditorSettingMigration._read(options,this.key);this.migrate(value,(key=>EditorSettingMigration._read(options,key)),((key,value)=>EditorSettingMigration._write(options,key,value)))}static _read(source,key){if(void 0===source)return;const firstDotIndex=key.indexOf(".");if(firstDotIndex>=0){const firstSegment=key.substring(0,firstDotIndex);return this._read(source[firstSegment],key.substring(firstDotIndex+1))}return source[key]}static _write(target,key,value){const firstDotIndex=key.indexOf(".");if(firstDotIndex>=0){const firstSegment=key.substring(0,firstDotIndex);return target[firstSegment]=target[firstSegment]||{},void this._write(target[firstSegment],key.substring(firstDotIndex+1),value)}target[key]=value}}function registerEditorSettingMigration(key,migrate){EditorSettingMigration.items.push(new EditorSettingMigration(key,migrate))}function registerSimpleEditorSettingMigration(key,values){registerEditorSettingMigration(key,((value,read,write)=>{if(void 0!==value)for(const[oldValue,newValue]of values)if(value===oldValue)return void write(key,newValue)}))}EditorSettingMigration.items=[];export function migrateOptions(options){EditorSettingMigration.items.forEach((migration=>migration.apply(options)))}registerSimpleEditorSettingMigration("wordWrap",[[!0,"on"],[!1,"off"]]),registerSimpleEditorSettingMigration("lineNumbers",[[!0,"on"],[!1,"off"]]),registerSimpleEditorSettingMigration("cursorBlinking",[["visible","solid"]]),registerSimpleEditorSettingMigration("renderWhitespace",[[!0,"boundary"],[!1,"none"]]),registerSimpleEditorSettingMigration("renderLineHighlight",[[!0,"line"],[!1,"none"]]),registerSimpleEditorSettingMigration("acceptSuggestionOnEnter",[[!0,"on"],[!1,"off"]]),registerSimpleEditorSettingMigration("tabCompletion",[[!1,"off"],[!0,"onlySnippets"]]),registerSimpleEditorSettingMigration("hover",[[!0,{enabled:!0}],[!1,{enabled:!1}]]),registerSimpleEditorSettingMigration("parameterHints",[[!0,{enabled:!0}],[!1,{enabled:!1}]]),registerSimpleEditorSettingMigration("autoIndent",[[!1,"advanced"],[!0,"full"]]),registerSimpleEditorSettingMigration("matchBrackets",[[!0,"always"],[!1,"never"]]),registerEditorSettingMigration("autoClosingBrackets",((value,read,write)=>{!1===value&&(write("autoClosingBrackets","never"),void 0===read("autoClosingQuotes")&&write("autoClosingQuotes","never"),void 0===read("autoSurround")&&write("autoSurround","never"))})),registerEditorSettingMigration("renderIndentGuides",((value,read,write)=>{void 0!==value&&(write("renderIndentGuides",void 0),void 0===read("guides.indentation")&&write("guides.indentation",!!value))})),registerEditorSettingMigration("highlightActiveIndentGuide",((value,read,write)=>{void 0!==value&&(write("highlightActiveIndentGuide",void 0),void 0===read("guides.highlightActiveIndentation")&&write("guides.highlightActiveIndentation",!!value))}));const suggestFilteredTypesMapping={method:"showMethods",function:"showFunctions",constructor:"showConstructors",deprecated:"showDeprecated",field:"showFields",variable:"showVariables",class:"showClasses",struct:"showStructs",interface:"showInterfaces",module:"showModules",property:"showProperties",event:"showEvents",operator:"showOperators",unit:"showUnits",value:"showValues",constant:"showConstants",enum:"showEnums",enumMember:"showEnumMembers",keyword:"showKeywords",text:"showWords",color:"showColors",file:"showFiles",reference:"showReferences",folder:"showFolders",typeParameter:"showTypeParameters",snippet:"showSnippets"};registerEditorSettingMigration("suggest.filteredTypes",((value,read,write)=>{if(value&&"object"==typeof value){for(const entry of Object.entries(suggestFilteredTypesMapping)){!1===value[entry[0]]&&void 0===read(`suggest.${entry[1]}`)&&write(`suggest.${entry[1]}`,!1)}write("suggest.filteredTypes",void 0)}})),registerEditorSettingMigration("quickSuggestions",((input,read,write)=>{if("boolean"==typeof input){const value=input?"on":"off";write("quickSuggestions",{comments:value,strings:value,other:value})}}));