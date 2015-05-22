/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.m.ListBaseRenderer");jQuery.sap.require("sap.ui.core.theming.Parameters");sap.m.ListBaseRenderer={};
sap.m.ListBaseRenderer.render=function(r,c){if(!c.getVisible()){return}r.write("<div");r.addClass("sapMList");r.writeControlData(c);r.writeAttribute("tabindex","-1");if(c.getInset()){r.addClass("sapMListInsetBG")}if(c.getWidth()){r.addStyle("width",c.getWidth())}if(c.getBackgroundDesign){r.addClass("sapMListBG"+c.getBackgroundDesign())}this.renderContainerAttributes(r,c);r.writeStyles();r.writeClasses();r.write(">");r.write("<div tabindex='-1'");r.writeAttribute("id",c.getId("before"));r.write("></div>");var h=c.getHeaderText();var H=c.getHeaderToolbar();if(H){H.setDesign(sap.m.ToolbarDesign.Transparent,true);H.addStyleClass("sapMListHdrTBar");r.renderControl(H)}else if(h){r.write("<div class='sapMListHdr'>");r.writeEscaped(h);r.write("</div>")}var i=c.getInfoToolbar();if(i){i.setDesign(sap.m.ToolbarDesign.Info,true);i.addStyleClass("sapMListInfoTBar");r.renderControl(i)}this.renderListStartAttributes(r,c);r.addClass("sapMListUl");r.writeAttribute("tabindex","-1");r.writeAttribute("id",c.getId("listUl"));r.addClass("sapMListShowSeparators"+c.getShowSeparators());r.addClass("sapMListMode"+c.getMode());c.getInset()&&r.addClass("sapMListInset");r.writeClasses();r.writeStyles();r.write(">");this.renderListHeadAttributes(r,c);var I=c.getItems();var R=c.shouldRenderItems();R&&I.forEach(function(o){c._applySettingsToItem(o,true);r.renderControl(o)});if((!R||!I.length)&&c.getShowNoData()){this.renderNoData(r,c)}this.renderListEndAttributes(r,c);if(R&&c._oGrowingDelegate){c._oGrowingDelegate.render(r)}if(c.getFooterText()){r.write("<footer class='sapMListFtr'>");r.writeEscaped(c.getFooterText());r.write("</footer>")}r.write("<div tabindex='-1'");r.writeAttribute("id",c.getId("after"));r.write("></div>");r.write("</div>")};
sap.m.ListBaseRenderer.renderContainerAttributes=function(r,c){};
sap.m.ListBaseRenderer.renderListHeadAttributes=function(r,c){};
sap.m.ListBaseRenderer.renderListStartAttributes=function(r,c){r.write("<ul");c.addNavSection(c.getId("listUl"))};
sap.m.ListBaseRenderer.renderListEndAttributes=function(r,c){r.write("</ul>")};
sap.m.ListBaseRenderer.renderNoData=function(r,c){r.write("<li id='"+c.getId("nodata")+"' class='sapMLIB sapMListNoData sapMLIBTypeInactive'>");r.write("<span id='"+c.getId("nodata-text")+"'>");r.writeEscaped(c.getNoDataText(true));r.write("</span></li>")};