var __decorate=this&&this.__decorate||function(decorators,target,key,desc){var d,c=arguments.length,r=c<3?target:null===desc?desc=Object.getOwnPropertyDescriptor(target,key):desc;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(decorators,target,key,desc);else for(var i=decorators.length-1;i>=0;i--)(d=decorators[i])&&(r=(c<3?d(r):c>3?d(target,key,r):d(target,key))||r);return c>3&&r&&Object.defineProperty(target,key,r),r},__param=this&&this.__param||function(paramIndex,decorator){return function(target,key){decorator(target,key,paramIndex)}};import{createCancelablePromise,Delayer,RunOnceScheduler}from"../../../../base/common/async.js";import{onUnexpectedError}from"../../../../base/common/errors.js";import{KeyChord}from"../../../../base/common/keyCodes.js";import{Disposable,DisposableStore}from"../../../../base/common/lifecycle.js";import{escapeRegExpCharacters}from"../../../../base/common/strings.js";import*as types from"../../../../base/common/types.js";import"./folding.css";import{StableEditorScrollState}from"../../../browser/stableEditorScroll.js";import{EditorAction,registerEditorAction,registerEditorContribution,registerInstantiatedEditorAction}from"../../../browser/editorExtensions.js";import{EditorContextKeys}from"../../../common/editorContextKeys.js";import{FoldingRangeKind}from"../../../common/languages.js";import{ILanguageConfigurationService}from"../../../common/languages/languageConfigurationRegistry.js";import{FoldingModel,getNextFoldLine,getParentFoldLine,getPreviousFoldLine,setCollapseStateAtLevel,setCollapseStateForMatchingLines,setCollapseStateForRest,setCollapseStateForType,setCollapseStateLevelsDown,setCollapseStateLevelsUp,setCollapseStateUp,toggleCollapseState}from"./foldingModel.js";import{HiddenRangeModel}from"./hiddenRangeModel.js";import{IndentRangeProvider}from"./indentRangeProvider.js";import*as nls from"../../../../nls.js";import{IContextKeyService,RawContextKey}from"../../../../platform/contextkey/common/contextkey.js";import{editorSelectionBackground,iconForeground,registerColor,transparent}from"../../../../platform/theme/common/colorRegistry.js";import{registerThemingParticipant,ThemeIcon}from"../../../../platform/theme/common/themeService.js";import{foldingCollapsedIcon,FoldingDecorationProvider,foldingExpandedIcon,foldingManualCollapsedIcon,foldingManualExpandedIcon}from"./foldingDecorations.js";import{FoldingRegions}from"./foldingRanges.js";import{SyntaxRangeProvider}from"./syntaxRangeProvider.js";import{INotificationService}from"../../../../platform/notification/common/notification.js";import Severity from"../../../../base/common/severity.js";import{ILanguageFeatureDebounceService}from"../../../common/services/languageFeatureDebounce.js";import{StopWatch}from"../../../../base/common/stopwatch.js";import{ILanguageFeaturesService}from"../../../common/services/languageFeatures.js";const CONTEXT_FOLDING_ENABLED=new RawContextKey("foldingEnabled",!1);let FoldingController=class FoldingController extends Disposable{constructor(editor,contextKeyService,languageConfigurationService,notificationService,languageFeatureDebounceService,languageFeaturesService){super(),this.contextKeyService=contextKeyService,this.languageConfigurationService=languageConfigurationService,this.languageFeaturesService=languageFeaturesService,this._tooManyRegionsNotified=!1,this.localToDispose=this._register(new DisposableStore),this.editor=editor;const options=this.editor.getOptions();this._isEnabled=options.get(39),this._useFoldingProviders="indentation"!==options.get(40),this._unfoldOnClickAfterEndOfLine=options.get(44),this._restoringViewState=!1,this._currentModelHasFoldedImports=!1,this._foldingImportsByDefault=options.get(42),this._maxFoldingRegions=options.get(43),this.updateDebounceInfo=languageFeatureDebounceService.for(languageFeaturesService.foldingRangeProvider,"Folding",{min:200}),this.foldingModel=null,this.hiddenRangeModel=null,this.rangeProvider=null,this.foldingRegionPromise=null,this.foldingModelPromise=null,this.updateScheduler=null,this.cursorChangedScheduler=null,this.mouseDownInfo=null,this.foldingDecorationProvider=new FoldingDecorationProvider(editor),this.foldingDecorationProvider.showFoldingControls=options.get(101),this.foldingDecorationProvider.showFoldingHighlights=options.get(41),this.foldingEnabled=CONTEXT_FOLDING_ENABLED.bindTo(this.contextKeyService),this.foldingEnabled.set(this._isEnabled),this._notifyTooManyRegions=maxFoldingRegions=>{this._tooManyRegionsNotified||(notificationService.notify({severity:Severity.Warning,sticky:!0,message:nls.localize("maximum fold ranges","The number of foldable regions is limited to a maximum of {0}. Increase configuration option ['Folding Maximum Regions'](command:workbench.action.openSettings?[\"editor.foldingMaximumRegions\"]) to enable more.",maxFoldingRegions)}),this._tooManyRegionsNotified=!0)},this._register(this.editor.onDidChangeModel((()=>this.onModelChanged()))),this._register(this.editor.onDidChangeConfiguration((e=>{if(e.hasChanged(39)&&(this._isEnabled=this.editor.getOptions().get(39),this.foldingEnabled.set(this._isEnabled),this.onModelChanged()),e.hasChanged(43)&&(this._maxFoldingRegions=this.editor.getOptions().get(43),this._tooManyRegionsNotified=!1,this.onModelChanged()),e.hasChanged(101)||e.hasChanged(41)){const options=this.editor.getOptions();this.foldingDecorationProvider.showFoldingControls=options.get(101),this.foldingDecorationProvider.showFoldingHighlights=options.get(41),this.triggerFoldingModelChanged()}e.hasChanged(40)&&(this._useFoldingProviders="indentation"!==this.editor.getOptions().get(40),this.onFoldingStrategyChanged()),e.hasChanged(44)&&(this._unfoldOnClickAfterEndOfLine=this.editor.getOptions().get(44)),e.hasChanged(42)&&(this._foldingImportsByDefault=this.editor.getOptions().get(42))}))),this.onModelChanged()}static get(editor){return editor.getContribution(FoldingController.ID)}saveViewState(){const model=this.editor.getModel();if(!model||!this._isEnabled||model.isTooLargeForTokenization())return{};if(this.foldingModel){const collapsedRegions=this.foldingModel.getMemento(),provider=this.rangeProvider?this.rangeProvider.id:void 0;return{collapsedRegions,lineCount:model.getLineCount(),provider,foldedImports:this._currentModelHasFoldedImports}}}restoreViewState(state){const model=this.editor.getModel();if(model&&this._isEnabled&&!model.isTooLargeForTokenization()&&this.hiddenRangeModel&&state&&state.lineCount===model.getLineCount()&&(this._currentModelHasFoldedImports=!!state.foldedImports,state.collapsedRegions&&state.collapsedRegions.length>0&&this.foldingModel)){this._restoringViewState=!0;try{this.foldingModel.applyMemento(state.collapsedRegions)}finally{this._restoringViewState=!1}}}onModelChanged(){this.localToDispose.clear();const model=this.editor.getModel();this._isEnabled&&model&&!model.isTooLargeForTokenization()&&(this._currentModelHasFoldedImports=!1,this.foldingModel=new FoldingModel(model,this.foldingDecorationProvider),this.localToDispose.add(this.foldingModel),this.hiddenRangeModel=new HiddenRangeModel(this.foldingModel),this.localToDispose.add(this.hiddenRangeModel),this.localToDispose.add(this.hiddenRangeModel.onDidChange((hr=>this.onHiddenRangesChanges(hr)))),this.updateScheduler=new Delayer(this.updateDebounceInfo.get(model)),this.cursorChangedScheduler=new RunOnceScheduler((()=>this.revealCursor()),200),this.localToDispose.add(this.cursorChangedScheduler),this.localToDispose.add(this.languageFeaturesService.foldingRangeProvider.onDidChange((()=>this.onFoldingStrategyChanged()))),this.localToDispose.add(this.editor.onDidChangeModelLanguageConfiguration((()=>this.onFoldingStrategyChanged()))),this.localToDispose.add(this.editor.onDidChangeModelContent((e=>this.onDidChangeModelContent(e)))),this.localToDispose.add(this.editor.onDidChangeCursorPosition((()=>this.onCursorPositionChanged()))),this.localToDispose.add(this.editor.onMouseDown((e=>this.onEditorMouseDown(e)))),this.localToDispose.add(this.editor.onMouseUp((e=>this.onEditorMouseUp(e)))),this.localToDispose.add({dispose:()=>{this.foldingRegionPromise&&(this.foldingRegionPromise.cancel(),this.foldingRegionPromise=null),this.updateScheduler&&this.updateScheduler.cancel(),this.updateScheduler=null,this.foldingModel=null,this.foldingModelPromise=null,this.hiddenRangeModel=null,this.cursorChangedScheduler=null,this.rangeProvider&&this.rangeProvider.dispose(),this.rangeProvider=null}}),this.triggerFoldingModelChanged())}onFoldingStrategyChanged(){this.rangeProvider&&this.rangeProvider.dispose(),this.rangeProvider=null,this.triggerFoldingModelChanged()}getRangeProvider(editorModel){if(this.rangeProvider)return this.rangeProvider;if(this.rangeProvider=new IndentRangeProvider(editorModel,this.languageConfigurationService,this._maxFoldingRegions),this._useFoldingProviders&&this.foldingModel){const foldingProviders=this.languageFeaturesService.foldingRangeProvider.ordered(this.foldingModel.textModel);foldingProviders.length>0&&(this.rangeProvider=new SyntaxRangeProvider(editorModel,foldingProviders,(()=>this.triggerFoldingModelChanged()),this._maxFoldingRegions))}return this.rangeProvider}getFoldingModel(){return this.foldingModelPromise}onDidChangeModelContent(e){var _a;null===(_a=this.hiddenRangeModel)||void 0===_a||_a.notifyChangeModelContent(e),this.triggerFoldingModelChanged()}triggerFoldingModelChanged(){this.updateScheduler&&(this.foldingRegionPromise&&(this.foldingRegionPromise.cancel(),this.foldingRegionPromise=null),this.foldingModelPromise=this.updateScheduler.trigger((()=>{const foldingModel=this.foldingModel;if(!foldingModel)return null;const sw=new StopWatch(!0),provider=this.getRangeProvider(foldingModel.textModel),foldingRegionPromise=this.foldingRegionPromise=createCancelablePromise((token=>provider.compute(token,this._notifyTooManyRegions)));return foldingRegionPromise.then((foldingRanges=>{if(foldingRanges&&foldingRegionPromise===this.foldingRegionPromise){let scrollState;if(this._foldingImportsByDefault&&!this._currentModelHasFoldedImports){const hasChanges=foldingRanges.setCollapsedAllOfType(FoldingRangeKind.Imports.value,!0);hasChanges&&(scrollState=StableEditorScrollState.capture(this.editor),this._currentModelHasFoldedImports=hasChanges)}const selections=this.editor.getSelections(),selectionLineNumbers=selections?selections.map((s=>s.startLineNumber)):[];foldingModel.update(foldingRanges,selectionLineNumbers),null==scrollState||scrollState.restore(this.editor);const newValue=this.updateDebounceInfo.update(foldingModel.textModel,sw.elapsed());this.updateScheduler&&(this.updateScheduler.defaultDelay=newValue)}return foldingModel}))})).then(void 0,(err=>(onUnexpectedError(err),null))))}onHiddenRangesChanges(hiddenRanges){if(this.hiddenRangeModel&&hiddenRanges.length&&!this._restoringViewState){const selections=this.editor.getSelections();selections&&this.hiddenRangeModel.adjustSelections(selections)&&this.editor.setSelections(selections)}this.editor.setHiddenAreas(hiddenRanges)}onCursorPositionChanged(){this.hiddenRangeModel&&this.hiddenRangeModel.hasRanges()&&this.cursorChangedScheduler.schedule()}revealCursor(){const foldingModel=this.getFoldingModel();foldingModel&&foldingModel.then((foldingModel=>{if(foldingModel){const selections=this.editor.getSelections();if(selections&&selections.length>0){const toToggle=[];for(const selection of selections){const lineNumber=selection.selectionStartLineNumber;this.hiddenRangeModel&&this.hiddenRangeModel.isHidden(lineNumber)&&toToggle.push(...foldingModel.getAllRegionsAtLine(lineNumber,(r=>r.isCollapsed&&lineNumber>r.startLineNumber)))}toToggle.length&&(foldingModel.toggleCollapseState(toToggle),this.reveal(selections[0].getPosition()))}}})).then(void 0,onUnexpectedError)}onEditorMouseDown(e){if(this.mouseDownInfo=null,!this.hiddenRangeModel||!e.target||!e.target.range)return;if(!e.event.leftButton&&!e.event.middleButton)return;const range=e.target.range;let iconClicked=!1;switch(e.target.type){case 4:{const data=e.target.detail,offsetLeftInGutter=e.target.element.offsetLeft;if(data.offsetX-offsetLeftInGutter<5)return;iconClicked=!0;break}case 7:if(this._unfoldOnClickAfterEndOfLine&&this.hiddenRangeModel.hasRanges()){if(!e.target.detail.isAfterLines)break}return;case 6:if(this.hiddenRangeModel.hasRanges()){const model=this.editor.getModel();if(model&&range.startColumn===model.getLineMaxColumn(range.startLineNumber))break}return;default:return}this.mouseDownInfo={lineNumber:range.startLineNumber,iconClicked}}onEditorMouseUp(e){const foldingModel=this.foldingModel;if(!foldingModel||!this.mouseDownInfo||!e.target)return;const lineNumber=this.mouseDownInfo.lineNumber,iconClicked=this.mouseDownInfo.iconClicked,range=e.target.range;if(!range||range.startLineNumber!==lineNumber)return;if(iconClicked){if(4!==e.target.type)return}else{const model=this.editor.getModel();if(!model||range.startColumn!==model.getLineMaxColumn(lineNumber))return}const region=foldingModel.getRegionAtLine(lineNumber);if(region&&region.startLineNumber===lineNumber){const isCollapsed=region.isCollapsed;if(iconClicked||isCollapsed){let toToggle=[];if(e.event.altKey){const filter=otherRegion=>!otherRegion.containedBy(region)&&!region.containedBy(otherRegion),toMaybeToggle=foldingModel.getRegionsInside(null,filter);for(const r of toMaybeToggle)r.isCollapsed&&toToggle.push(r);0===toToggle.length&&(toToggle=toMaybeToggle)}else{const recursive=e.event.middleButton||e.event.shiftKey;if(recursive)for(const r of foldingModel.getRegionsInside(region))r.isCollapsed===isCollapsed&&toToggle.push(r);!isCollapsed&&recursive&&0!==toToggle.length||toToggle.push(region)}foldingModel.toggleCollapseState(toToggle),this.reveal({lineNumber,column:1})}}}reveal(position){this.editor.revealPositionInCenterIfOutsideViewport(position,0)}};FoldingController.ID="editor.contrib.folding",FoldingController=__decorate([__param(1,IContextKeyService),__param(2,ILanguageConfigurationService),__param(3,INotificationService),__param(4,ILanguageFeatureDebounceService),__param(5,ILanguageFeaturesService)],FoldingController);export{FoldingController};class FoldingAction extends EditorAction{runEditorCommand(accessor,editor,args){const languageConfigurationService=accessor.get(ILanguageConfigurationService),foldingController=FoldingController.get(editor);if(!foldingController)return;const foldingModelPromise=foldingController.getFoldingModel();return foldingModelPromise?(this.reportTelemetry(accessor,editor),foldingModelPromise.then((foldingModel=>{if(foldingModel){this.invoke(foldingController,foldingModel,editor,args,languageConfigurationService);const selection=editor.getSelection();selection&&foldingController.reveal(selection.getStartPosition())}}))):void 0}getSelectedLines(editor){const selections=editor.getSelections();return selections?selections.map((s=>s.startLineNumber)):[]}getLineNumbers(args,editor){return args&&args.selectionLines?args.selectionLines.map((l=>l+1)):this.getSelectedLines(editor)}run(_accessor,_editor){}}function foldingArgumentsConstraint(args){if(!types.isUndefined(args)){if(!types.isObject(args))return!1;const foldingArgs=args;if(!types.isUndefined(foldingArgs.levels)&&!types.isNumber(foldingArgs.levels))return!1;if(!types.isUndefined(foldingArgs.direction)&&!types.isString(foldingArgs.direction))return!1;if(!(types.isUndefined(foldingArgs.selectionLines)||types.isArray(foldingArgs.selectionLines)&&foldingArgs.selectionLines.every(types.isNumber)))return!1}return!0}class UnfoldAction extends FoldingAction{constructor(){super({id:"editor.unfold",label:nls.localize("unfoldAction.label","Unfold"),alias:"Unfold",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:3161,mac:{primary:2649},weight:100},description:{description:"Unfold the content in the editor",args:[{name:"Unfold editor argument",description:"Property-value pairs that can be passed through this argument:\n\t\t\t\t\t\t* 'levels': Number of levels to unfold. If not set, defaults to 1.\n\t\t\t\t\t\t* 'direction': If 'up', unfold given number of levels up otherwise unfolds down.\n\t\t\t\t\t\t* 'selectionLines': Array of the start lines (0-based) of the editor selections to apply the unfold action to. If not set, the active selection(s) will be used.\n\t\t\t\t\t\t",constraint:foldingArgumentsConstraint,schema:{type:"object",properties:{levels:{type:"number",default:1},direction:{type:"string",enum:["up","down"],default:"down"},selectionLines:{type:"array",items:{type:"number"}}}}}]}})}invoke(_foldingController,foldingModel,editor,args){const levels=args&&args.levels||1,lineNumbers=this.getLineNumbers(args,editor);args&&"up"===args.direction?setCollapseStateLevelsUp(foldingModel,!1,levels,lineNumbers):setCollapseStateLevelsDown(foldingModel,!1,levels,lineNumbers)}}class UnFoldRecursivelyAction extends FoldingAction{constructor(){super({id:"editor.unfoldRecursively",label:nls.localize("unFoldRecursivelyAction.label","Unfold Recursively"),alias:"Unfold Recursively",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2137),weight:100}})}invoke(_foldingController,foldingModel,editor,_args){setCollapseStateLevelsDown(foldingModel,!1,Number.MAX_VALUE,this.getSelectedLines(editor))}}class FoldAction extends FoldingAction{constructor(){super({id:"editor.fold",label:nls.localize("foldAction.label","Fold"),alias:"Fold",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:3159,mac:{primary:2647},weight:100},description:{description:"Fold the content in the editor",args:[{name:"Fold editor argument",description:"Property-value pairs that can be passed through this argument:\n\t\t\t\t\t\t\t* 'levels': Number of levels to fold.\n\t\t\t\t\t\t\t* 'direction': If 'up', folds given number of levels up otherwise folds down.\n\t\t\t\t\t\t\t* 'selectionLines': Array of the start lines (0-based) of the editor selections to apply the fold action to. If not set, the active selection(s) will be used.\n\t\t\t\t\t\t\tIf no levels or direction is set, folds the region at the locations or if already collapsed, the first uncollapsed parent instead.\n\t\t\t\t\t\t",constraint:foldingArgumentsConstraint,schema:{type:"object",properties:{levels:{type:"number"},direction:{type:"string",enum:["up","down"]},selectionLines:{type:"array",items:{type:"number"}}}}}]}})}invoke(_foldingController,foldingModel,editor,args){const lineNumbers=this.getLineNumbers(args,editor),levels=args&&args.levels,direction=args&&args.direction;"number"!=typeof levels&&"string"!=typeof direction?setCollapseStateUp(foldingModel,!0,lineNumbers):"up"===direction?setCollapseStateLevelsUp(foldingModel,!0,levels||1,lineNumbers):setCollapseStateLevelsDown(foldingModel,!0,levels||1,lineNumbers)}}class ToggleFoldAction extends FoldingAction{constructor(){super({id:"editor.toggleFold",label:nls.localize("toggleFoldAction.label","Toggle Fold"),alias:"Toggle Fold",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2090),weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);toggleCollapseState(foldingModel,1,selectedLines)}}class FoldRecursivelyAction extends FoldingAction{constructor(){super({id:"editor.foldRecursively",label:nls.localize("foldRecursivelyAction.label","Fold Recursively"),alias:"Fold Recursively",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2135),weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);setCollapseStateLevelsDown(foldingModel,!0,Number.MAX_VALUE,selectedLines)}}class FoldAllBlockCommentsAction extends FoldingAction{constructor(){super({id:"editor.foldAllBlockComments",label:nls.localize("foldAllBlockComments.label","Fold All Block Comments"),alias:"Fold All Block Comments",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2133),weight:100}})}invoke(_foldingController,foldingModel,editor,args,languageConfigurationService){if(foldingModel.regions.hasTypes())setCollapseStateForType(foldingModel,FoldingRangeKind.Comment.value,!0);else{const editorModel=editor.getModel();if(!editorModel)return;const comments=languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).comments;if(comments&&comments.blockCommentStartToken){const regExp=new RegExp("^\\s*"+escapeRegExpCharacters(comments.blockCommentStartToken));setCollapseStateForMatchingLines(foldingModel,regExp,!0)}}}}class FoldAllRegionsAction extends FoldingAction{constructor(){super({id:"editor.foldAllMarkerRegions",label:nls.localize("foldAllMarkerRegions.label","Fold All Regions"),alias:"Fold All Regions",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2077),weight:100}})}invoke(_foldingController,foldingModel,editor,args,languageConfigurationService){if(foldingModel.regions.hasTypes())setCollapseStateForType(foldingModel,FoldingRangeKind.Region.value,!0);else{const editorModel=editor.getModel();if(!editorModel)return;const foldingRules=languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).foldingRules;if(foldingRules&&foldingRules.markers&&foldingRules.markers.start){const regExp=new RegExp(foldingRules.markers.start);setCollapseStateForMatchingLines(foldingModel,regExp,!0)}}}}class UnfoldAllRegionsAction extends FoldingAction{constructor(){super({id:"editor.unfoldAllMarkerRegions",label:nls.localize("unfoldAllMarkerRegions.label","Unfold All Regions"),alias:"Unfold All Regions",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2078),weight:100}})}invoke(_foldingController,foldingModel,editor,args,languageConfigurationService){if(foldingModel.regions.hasTypes())setCollapseStateForType(foldingModel,FoldingRangeKind.Region.value,!1);else{const editorModel=editor.getModel();if(!editorModel)return;const foldingRules=languageConfigurationService.getLanguageConfiguration(editorModel.getLanguageId()).foldingRules;if(foldingRules&&foldingRules.markers&&foldingRules.markers.start){const regExp=new RegExp(foldingRules.markers.start);setCollapseStateForMatchingLines(foldingModel,regExp,!1)}}}}class FoldAllRegionsExceptAction extends FoldingAction{constructor(){super({id:"editor.foldAllExcept",label:nls.localize("foldAllExcept.label","Fold All Regions Except Selected"),alias:"Fold All Regions Except Selected",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2131),weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);setCollapseStateForRest(foldingModel,!0,selectedLines)}}class UnfoldAllRegionsExceptAction extends FoldingAction{constructor(){super({id:"editor.unfoldAllExcept",label:nls.localize("unfoldAllExcept.label","Unfold All Regions Except Selected"),alias:"Unfold All Regions Except Selected",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2129),weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);setCollapseStateForRest(foldingModel,!1,selectedLines)}}class FoldAllAction extends FoldingAction{constructor(){super({id:"editor.foldAll",label:nls.localize("foldAllAction.label","Fold All"),alias:"Fold All",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2069),weight:100}})}invoke(_foldingController,foldingModel,_editor){setCollapseStateLevelsDown(foldingModel,!0)}}class UnfoldAllAction extends FoldingAction{constructor(){super({id:"editor.unfoldAll",label:nls.localize("unfoldAllAction.label","Unfold All"),alias:"Unfold All",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2088),weight:100}})}invoke(_foldingController,foldingModel,_editor){setCollapseStateLevelsDown(foldingModel,!1)}}class FoldLevelAction extends FoldingAction{getFoldingLevel(){return parseInt(this.id.substr(FoldLevelAction.ID_PREFIX.length))}invoke(_foldingController,foldingModel,editor){setCollapseStateAtLevel(foldingModel,this.getFoldingLevel(),!0,this.getSelectedLines(editor))}}FoldLevelAction.ID_PREFIX="editor.foldLevel",FoldLevelAction.ID=level=>FoldLevelAction.ID_PREFIX+level;class GotoParentFoldAction extends FoldingAction{constructor(){super({id:"editor.gotoParentFold",label:nls.localize("gotoParentFold.label","Go to Parent Fold"),alias:"Go to Parent Fold",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);if(selectedLines.length>0){const startLineNumber=getParentFoldLine(selectedLines[0],foldingModel);null!==startLineNumber&&editor.setSelection({startLineNumber,startColumn:1,endLineNumber:startLineNumber,endColumn:1})}}}class GotoPreviousFoldAction extends FoldingAction{constructor(){super({id:"editor.gotoPreviousFold",label:nls.localize("gotoPreviousFold.label","Go to Previous Folding Range"),alias:"Go to Previous Folding Range",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);if(selectedLines.length>0){const startLineNumber=getPreviousFoldLine(selectedLines[0],foldingModel);null!==startLineNumber&&editor.setSelection({startLineNumber,startColumn:1,endLineNumber:startLineNumber,endColumn:1})}}}class GotoNextFoldAction extends FoldingAction{constructor(){super({id:"editor.gotoNextFold",label:nls.localize("gotoNextFold.label","Go to Next Folding Range"),alias:"Go to Next Folding Range",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,weight:100}})}invoke(_foldingController,foldingModel,editor){const selectedLines=this.getSelectedLines(editor);if(selectedLines.length>0){const startLineNumber=getNextFoldLine(selectedLines[0],foldingModel);null!==startLineNumber&&editor.setSelection({startLineNumber,startColumn:1,endLineNumber:startLineNumber,endColumn:1})}}}class FoldRangeFromSelectionAction extends FoldingAction{constructor(){super({id:"editor.createFoldingRangeFromSelection",label:nls.localize("createManualFoldRange.label","Create Manual Folding Range from Selection"),alias:"Create Folding Range from Selection",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2130),weight:100}})}invoke(_foldingController,foldingModel,editor){var _a;const collapseRanges=[],selections=editor.getSelections();if(selections){for(const selection of selections){let endLineNumber=selection.endLineNumber;1===selection.endColumn&&--endLineNumber,endLineNumber>selection.startLineNumber&&(collapseRanges.push({startLineNumber:selection.startLineNumber,endLineNumber,type:void 0,isCollapsed:!0,source:1}),editor.setSelection({startLineNumber:selection.startLineNumber,startColumn:1,endLineNumber:selection.startLineNumber,endColumn:1}))}if(collapseRanges.length>0){collapseRanges.sort(((a,b)=>a.startLineNumber-b.startLineNumber));const newRanges=FoldingRegions.sanitizeAndMerge(foldingModel.regions,collapseRanges,null===(_a=editor.getModel())||void 0===_a?void 0:_a.getLineCount());foldingModel.updatePost(FoldingRegions.fromFoldRanges(newRanges))}}}}class RemoveFoldRangeFromSelectionAction extends FoldingAction{constructor(){super({id:"editor.removeManualFoldingRanges",label:nls.localize("removeManualFoldingRanges.label","Remove Manual Folding Ranges"),alias:"Remove Manual Folding Ranges",precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2132),weight:100}})}invoke(foldingController,foldingModel,editor){const selections=editor.getSelections();if(selections){const ranges=[];for(const selection of selections){const{startLineNumber,endLineNumber}=selection;ranges.push(endLineNumber>=startLineNumber?{startLineNumber,endLineNumber}:{endLineNumber,startLineNumber})}foldingModel.removeManualRanges(ranges),foldingController.triggerFoldingModelChanged()}}}registerEditorContribution(FoldingController.ID,FoldingController),registerEditorAction(UnfoldAction),registerEditorAction(UnFoldRecursivelyAction),registerEditorAction(FoldAction),registerEditorAction(FoldRecursivelyAction),registerEditorAction(FoldAllAction),registerEditorAction(UnfoldAllAction),registerEditorAction(FoldAllBlockCommentsAction),registerEditorAction(FoldAllRegionsAction),registerEditorAction(UnfoldAllRegionsAction),registerEditorAction(FoldAllRegionsExceptAction),registerEditorAction(UnfoldAllRegionsExceptAction),registerEditorAction(ToggleFoldAction),registerEditorAction(GotoParentFoldAction),registerEditorAction(GotoPreviousFoldAction),registerEditorAction(GotoNextFoldAction),registerEditorAction(FoldRangeFromSelectionAction),registerEditorAction(RemoveFoldRangeFromSelectionAction);for(let i=1;i<=7;i++)registerInstantiatedEditorAction(new FoldLevelAction({id:FoldLevelAction.ID(i),label:nls.localize("foldLevelAction.label","Fold Level {0}",i),alias:`Fold Level ${i}`,precondition:CONTEXT_FOLDING_ENABLED,kbOpts:{kbExpr:EditorContextKeys.editorTextFocus,primary:KeyChord(2089,2048|21+i),weight:100}}));export const foldBackgroundBackground=registerColor("editor.foldBackground",{light:transparent(editorSelectionBackground,.3),dark:transparent(editorSelectionBackground,.3),hcDark:null,hcLight:null},nls.localize("foldBackgroundBackground","Background color behind folded ranges. The color must not be opaque so as not to hide underlying decorations."),!0);export const editorFoldForeground=registerColor("editorGutter.foldingControlForeground",{dark:iconForeground,light:iconForeground,hcDark:iconForeground,hcLight:iconForeground},nls.localize("editorGutter.foldingControlForeground","Color of the folding control in the editor gutter."));registerThemingParticipant(((theme,collector)=>{const foldBackground=theme.getColor(foldBackgroundBackground);foldBackground&&collector.addRule(`.monaco-editor .folded-background { background-color: ${foldBackground}; }`);const editorFoldColor=theme.getColor(editorFoldForeground);editorFoldColor&&collector.addRule(`\n\t\t.monaco-editor .cldr${ThemeIcon.asCSSSelector(foldingExpandedIcon)},\n\t\t.monaco-editor .cldr${ThemeIcon.asCSSSelector(foldingCollapsedIcon)},\n\t\t.monaco-editor .cldr${ThemeIcon.asCSSSelector(foldingManualExpandedIcon)},\n\t\t.monaco-editor .cldr${ThemeIcon.asCSSSelector(foldingManualCollapsedIcon)} {\n\t\t\tcolor: ${editorFoldColor} !important;\n\t\t}\n\t\t`)}));