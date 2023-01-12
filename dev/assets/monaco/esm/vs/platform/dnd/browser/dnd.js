import{DataTransfers}from"../../../base/browser/dnd.js";import{parse}from"../../../base/common/marshalling.js";import{URI}from"../../../base/common/uri.js";import{extractSelection}from"../../opener/common/opener.js";import{Registry}from"../../registry/common/platform.js";export const CodeDataTransfers={EDITORS:"CodeEditors",FILES:"CodeFiles"};export function extractEditorsDropData(e){var _a;const editors=[];if(e.dataTransfer&&e.dataTransfer.types.length>0){const rawEditorsData=e.dataTransfer.getData(CodeDataTransfers.EDITORS);if(rawEditorsData)try{editors.push(...parse(rawEditorsData))}catch(error){}else try{const rawResourcesData=e.dataTransfer.getData(DataTransfers.RESOURCES);editors.push(...createDraggedEditorInputFromRawResourcesData(rawResourcesData))}catch(error){}if(null===(_a=e.dataTransfer)||void 0===_a?void 0:_a.files)for(let i=0;i<e.dataTransfer.files.length;i++){const file=e.dataTransfer.files[i];if(file&&file.path)try{editors.push({resource:URI.file(file.path),isExternal:!0,allowWorkspaceOpen:!0})}catch(error){}}const rawCodeFiles=e.dataTransfer.getData(CodeDataTransfers.FILES);if(rawCodeFiles)try{const codeFiles=JSON.parse(rawCodeFiles);for(const codeFile of codeFiles)editors.push({resource:URI.file(codeFile),isExternal:!0,allowWorkspaceOpen:!0})}catch(error){}const contributions=Registry.as(Extensions.DragAndDropContribution).getAll();for(const contribution of contributions){const data=e.dataTransfer.getData(contribution.dataFormatKey);if(data)try{editors.push(...contribution.getEditorInputs(data))}catch(error){}}}return editors}export function createDraggedEditorInputFromRawResourcesData(rawResourcesData){const editors=[];if(rawResourcesData){const resourcesRaw=JSON.parse(rawResourcesData);for(const resourceRaw of resourcesRaw)if(resourceRaw.indexOf(":")>0){const{selection,uri}=extractSelection(URI.parse(resourceRaw));editors.push({resource:uri,options:{selection}})}}return editors}class DragAndDropContributionRegistry{constructor(){this._contributions=new Map}getAll(){return this._contributions.values()}}export const Extensions={DragAndDropContribution:"workbench.contributions.dragAndDrop"};Registry.add(Extensions.DragAndDropContribution,new DragAndDropContributionRegistry);