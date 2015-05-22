jQuery.sap.declare("sap.zen.crosstab.datahandler.JsonDataHandler");jQuery.sap.require("sap.zen.crosstab.TextConstants");jQuery.sap.require("sap.zen.crosstab.utils.Utils");jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");jQuery.sap.require("sap.zen.crosstab.CrosstabCellApi");
sap.zen.crosstab.datahandler.JsonDataHandler=function(c){var d=c.getDimensionHeaderArea();var C=c.getColumnHeaderArea();var r=c.getRowHeaderArea();var D=c.getDataArea();var f=0;var F=0;var t=0;var T=0;var b=false;var a=false;var e=false;var J=null;var o=null;var g=0;var R=0;var h={};var k={};function l(){if(!sap.zen.CrosstabTextCache){sap.zen.CrosstabTextCache={};sap.zen.CrosstabTextCache.filled=false;sap.zen.CrosstabTextCache.oTexts={};sap.zen.CrosstabTextCache.oSortingTextLookupTable={};sap.zen.CrosstabTextCache.defaultProvided=false}var P=c.getPropertyBag();P.addText(sap.zen.crosstab.TextConstants.ROW_TEXT_KEY,"Row");P.addText(sap.zen.crosstab.TextConstants.COL_TEXT_KEY,"Column");P.addText(sap.zen.crosstab.TextConstants.COLWIDTH_ADJUST_TEXT_KEY,"Double Click to adjust Column Width");P.addText(sap.zen.crosstab.TextConstants.MOBILE_MENUITEM_COLWIDTH_ADJUST_TEXT_KEY,"Adjust Column Width");p(P);sap.zen.CrosstabTextCache.defaultProvided=true}function m(i){if(sap.zen.CrosstabTextCache.filled===false){var P=c.getPropertyBag();if(i){P.addText(sap.zen.crosstab.TextConstants.ROW_TEXT_KEY,i.rowtext||"Row");P.addText(sap.zen.crosstab.TextConstants.COL_TEXT_KEY,i.coltext||"Column");P.addText(sap.zen.crosstab.TextConstants.COLWIDTH_ADJUST_TEXT_KEY,i.colwidthtext||"Double Click to adjust Column Width");P.addText(sap.zen.crosstab.TextConstants.MOBILE_MENUITEM_COLWIDTH_ADJUST_TEXT_KEY,i.mobilemenuitemcolwidthtext||"Adjust Column Width");n(i,P)}sap.zen.CrosstabTextCache.filled=true}}function p(P){var S={};S.alttext="Unsorted. Select to sort ascending";S.tooltipidx=0;P.addSortingTextLookup("0",S);S={};S.alttext="Sorted ascending. Select to sort descending";S.tooltipidx=1;P.addSortingTextLookup("1",S);S={};S.alttext="Sorted descending. Select to sort ascending";S.tooltipidx=2;P.addSortingTextLookup("2",S)}function n(j,P){var S=j.sorting;if(!S){p(P)}else{var i=0;var L=parseInt(S.length,10);for(i=0;i<L;i++){var M={};M.alttext=S[i].alttext;M.tooltipidx=S[i].tooltipidx;P.addSortingTextLookup(i+"",M)}}}this.determineBasicAreaData=function(i,j){if(!sap.zen.CrosstabTextCache||(sap.zen.CrosstabTextCache&&!sap.zen.CrosstabTextCache.defaultProvided)){l()}J=i;if(!J.rows){v(J)}else{if(J.selectedaxis){c.setSelectionInfo(J.selectedaxis,J.selectedpos)}else{if(J.singledatacellselection===true){c.setSingleDataCellSelectionInfo(J.datacellrowpos,J.datacellcolpos)}else{c.setSelectionInfo(null,-1)}}if(J.dataselectionmode===undefined){J.dataselectionmode=false}c.setDataSelectionMode(J.dataselectionmode);c.setHighlightingInfo(J.highlighting);c.setSingleDataCellSelection(J.singledatacellselection);if(j||J.changed){m(J.texts);h={};k={};f=J.fixedcolheaders;F=J.fixedrowheaders;if(!J.pixelscrolling){c.setHCutOff(false);c.setVCutOff(false);t=J.totaldatacols;T=J.totaldatarows}else{c.setHCutOff(J.totaldatacols>J.sentdatacols);c.setVCutOff(J.totaldatarows>J.sentdatarows);t=J.sentdatacols;T=J.sentdatarows}if(!f||!F){d.setRowCnt(0);d.setColCnt(0);if(!F){r.setRowCnt(0);r.setColCnt(0);if(f){C.setRowCnt(f);C.setColCnt(t)}}else if(!f){C.setRowCnt(0);C.setColCnt(0);if(F){r.setRowCnt(T);r.setColCnt(F)}}}else{d.setRowCnt(f);d.setColCnt(F);r.setRowCnt(T);r.setColCnt(F);C.setRowCnt(f);C.setColCnt(t)}D.setRowCnt(T);D.setColCnt(t);c.setTotalRows(f+T);c.setTotalCols(F+t);c.setOnSelectCommand(J.onselectcommand);c.getPropertyBag().setSelectionEnabled(J.selectionenabled);c.getPropertyBag().setDisplayExceptions(J.displayexceptions);c.getPropertyBag().setEnableColResize(J.enablecolresize);c.setScrollNotifyCommand(J.scrollnotifier);s(i);var L=new sap.zen.crosstab.CrosstabCellApi(c,F,f,t,T);c.setCellApi(L)}q();if(!(c.getPropertyBag().isMobileMode()||c.getPropertyBag().isTestMobileMode())){if(J.transferdatacommand){c.setTransferDataCommand(J.transferdatacommand)}if(J.callvaluehelpcommand){c.setCallValueHelpCommand(J.callvaluehelpcommand)}if(J.newlinescnt){c.setNewLinesCnt(J.newlinescnt)}if(J.newlinespos){c.setNewLinesPos(J.newlinespos)}}if(J.contextmenucmd){c.getPropertyBag().setContextMenuCommand(J.contextmenucmd);c.createContextMenu()}if(J.headerwidth){c.getPropertyBag().setMaxHeaderWidth(J.headerwidth)}else{c.getPropertyBag().setMaxHeaderWidth(0)}}};function s(j){var L=j.usercolwidths;if(L){for(var i=0;i<L.length;i++){var M=L[i];var N=M.colid;if(isNaN(M.colwidth)){continue}var O=Math.max(0,parseInt(M.colwidth,10));var P=false;if(M.ignore!==undefined){P=M.ignore}if(N==='*'){if(f&&F){C.setColUserWidth(N,O,P);D.setColUserWidth(N,O,P);d.setColUserWidth(N,O,P);r.setColUserWidth(N,O,P)}else{if(!F){C.setColUserWidth(N,O,P)}else if(!f){r.setColUserWidth(N,O,P)}D.setColUserWidth(N,O,P)}}else{if(f&&F){if(N>=F){C.setColUserWidth(N-F,O,P);D.setColUserWidth(N-F,O,P)}else{d.setColUserWidth(N,O,P);r.setColUserWidth(N,O,P)}}else{if(!F){C.setColUserWidth(N,O,P);D.setColUserWidth(N,O,P)}else if(!f){if(N>=F){D.setColUserWidth(N-F,O,P)}else{r.setColUserWidth(N,O,P)}}}}}}}function q(){var i=c.getRenderEngine().getCrossRequestManager();if(J.scrolltoselection&&J.selectedaxis&&J.selectedpos!==undefined){J.rootcause="SDK";if(J.selectedaxis==="ROWS"){i.saveSDKVScrollInfo(J.selectedpos,"SDK")}else if(J.selectedaxis==="COLUMNS"){i.saveSDKHScrollInfo(J.selectedpos,"SDK")}else if(oJsonTabkleControl.selectedaxis==="DATA"){i.saveSDKVScrollInfo(J.datacellrowpos,"SDK");i.saveSDKHScrollInfo(J.datacellcolpos,"SDK")}}if(J.rootcause){i.setRootCause(J.rootcause);if(J.rootcause==="hierarchy"){i.setHierarchyAction(J.rootcause_hierarchy);i.setIsHierarchyDirectionDown(J.rootcause_hierarchy_directiondown)}i.handleRootCause()}if(!(J.scrolltoselection&&J.selectedaxis&&J.selectedpos!==undefined)&&!(J.rootcause)){if(i){if(J.clienthpos!==undefined&&J.clientvpos!==undefined&&J.clienthscrolledtoend!==undefined&&J.clientvscrolledtoend!==undefined){if(J.clienthscrolledtoend===true){J.clienthpos=J.totaldatacols-1}if(J.clientvscrolledtoend===true){J.clientvpos=J.totaldatarows-1}i.setScrollData(parseInt(J.clienthpos,10),J.clienthscrolledtoend,parseInt(J.clientvpos,10),J.clientvscrolledtoend)}}}if(J.clientheaderhpos){i.setHeaderScrollData({"iHPos":parseInt(J.clientheaderhpos,10)})}}this.jsonToDataModel=function(P){if(J.rows){o=P.oCrosstabAreasToBeFilled;g=P.iColOffset;R=P.iRowOffset;u();var L=J.rows;for(var i=0,M=L.length;i<M;i++){var N=L[i].row.rowidx;var O=L[i].row.cells;for(var j=0,Q=O.length;j<Q;j++){var S=O[j].control;var U=S.colidx;w(S,N,U)}}}c.setColHeaderHierarchyLevels(h);c.setRowHeaderHierarchyLevels(k)};function u(){b=o[d.getAreaType()];a=o[r.getAreaType()];e=o[C.getAreaType()]}function v(J){d.setRowCnt(2);d.setColCnt(1);var i=E(d,0,0);i.setText(J.messagetitle);d.insertCell(i,0,0);i=E(d,1,0);i.setText(J.messagetext);d.insertCell(i,1,0)}var w=function(j,i,L){var M=i-1;var N=L-1;if(L>F&&i>f){y(j,M+R,N+g)}else if(b&&L<=F&&i<=f){z(j,M,N)}else if(e&&i<=f&&L>F){B(j,M,N+g)}else if(a&&L<=F&&i>f){A(j,M+R,N)}};function x(i,j){var L=new sap.zen.crosstab.DataCell();L.setArea(D);L.setRow(i);L.setCol(j);return L}var y=function(j,M,i){var L=M-f;var N=i-F;var O=x(L,N);O.setTableRow(M);O.setTableCol(i);H(j,O);if(L%2===1){O.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_ALTERNATING)}D.insertCell(O,L,N)};var z=function(j,M,i){G(j,d,M,i,M,i)};var A=function(j,M,i){var L=M;if(j.axisidx!==undefined){L=j.axisidx+f}G(j,r,M-f,i,L,i)};var B=function(j,M,i){var L=i;if(j.axisidx!==undefined){L=j.axisidx+F}G(j,C,M,i-F,M,L)};function E(i,j,L){var M=new sap.zen.crosstab.HeaderCell();M.setArea(i);M.setRow(j);M.setCol(L);return M}var G=function(j,i,L,M,N,O){var P=E(i,L,M);P.setTableRow(N);P.setTableCol(O);H(j,P);I(j,P,i);if(!J.dataselectionmode||(J.dataselectionmode&&!J.highlighting)){if(i.isColHeaderArea()&&P.getColSpan()===1){P.setSelectable(P.isInnerMember()&&!P.isResult())}else if(i.isRowHeaderArea()&&P.getRowSpan()===1){P.setSelectable(P.isInnerMember()&&!P.isResult())}else{P.setSelectable(false)}}else{if(i.isColHeaderArea()&&P.getColSpan()===1){if(!J.highlighting.rows){P.setSelectable(P.isInnerMember()&&!P.isResult())}else{P.setSelectable(false)}}else if(i.isRowHeaderArea()&&P.getRowSpan()===1){if(!J.highlighting.cols){P.setSelectable(P.isInnerMember()&&!P.isResult())}else{P.setSelectable(false)}}else{P.setSelectable(false)}}i.insertCell(P,L,M)};var H=function(j,i){var L=j._v;if(L){var P=sap.zen.crosstab.utils.Utils.prepareStringForRendering(L);i.setText(P.text);i.setTextHasLineBreaks(P.bHasLineBreaks)}var M=j.exceptionvisualizations;if(M){for(var N in M){if(M.hasOwnProperty(N)){var O=M[N];if(O){sap.zen.crosstab.CellStyleHandler.setExceptionStylesOnCell(i,O.formattype,O.alertlevel)}}}}if(j.isemphasized){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_EMPHASIZED)}if(!(c.getPropertyBag().isMobileMode()||c.getPropertyBag().isTestMobileMode())){if(j.isdataentryenabled){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_DATA_ENTRY_ENABLED);i.setEntryEnabled(true);if(j.unit){i.setUnit(j.unit)}}if(j.hasinvalidvalue){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_INVALID_VALUE)}if(j.hasnewvalue){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_NEW_VALUE)}if(j.islocked){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_LOCKED)}}if(j.isresult){if(i.setResult){i.setResult(j.isresult)}i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_TOTAL)}if(j.passivetype){i.setPassiveCellType(j.passivetype)}};var I=function(j,i,L){if(j.rowspan){i.setRowSpan(j.rowspan)}else{i.setRowSpan(1)}if(j.colspan){i.setColSpan(j.colspan)}else{i.setColSpan(1)}if(j.key){i.setMergeKey(j.key)}if(j.sort){i.setSort(j.sort)}if(j.sorttxtidx){i.setSortTextIndex(parseInt(j.sorttxtidx,10))}if(j.sortaction){i.setSortAction(j.sortaction)}if(typeof(j.level)!="undefined"){i.setLevel(j.level);K(L,i,j.level)}else{i.setLevel(-1)}if(j.drillstate){if(j.drillstate!=="A"){i.setDrillState(j.drillstate)}}if(j.hierarchyaction){i.setHierarchyAction(j.hierarchyaction)}if(j.hierarchytooltip){i.setHierarchyTooltip(j.hierarchytooltip)}if(j.isinnermember){i.setInnerMember(j.isinnermember)}if(i.getRow()%2===1&&i.getRowSpan()===1&&(j.isinnermember||i.getColSpan()+i.getCol()===F)){i.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_ALTERNATING)}};var K=function(i,j,L){if(i.getAreaType()===sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA){var M=j.getRow();if(h[M]!=undefined){if(h[M]<L){h[M]=L}}else{h[M]=L}}else if(i.getAreaType()===sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA){var N=j.getCol();if(k[N]!=undefined){if(k[N]<L){k[N]=L}}else{k[N]=L}}}};