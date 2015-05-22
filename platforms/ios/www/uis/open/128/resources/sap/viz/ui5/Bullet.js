/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.Bullet");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.core.BaseChart");sap.viz.ui5.core.BaseChart.extend("sap.viz.ui5.Bullet",{metadata:{library:"sap.viz",aggregations:{"general":{type:"sap.viz.ui5.types.RootContainer",multiple:false},"interaction":{type:"sap.viz.ui5.types.controller.Interaction",multiple:false},"title":{type:"sap.viz.ui5.types.Title",multiple:false},"toolTip":{type:"sap.viz.ui5.types.Tooltip",multiple:false},"xyContainer":{type:"sap.viz.ui5.types.XYContainer",multiple:false},"yAxis":{type:"sap.viz.ui5.types.Axis",multiple:false},"background":{type:"sap.viz.ui5.types.Background",multiple:false},"plotArea":{type:"sap.viz.ui5.types.Bullet",multiple:false},"xAxis2":{type:"sap.viz.ui5.types.Axis",multiple:false},"yAxis2":{type:"sap.viz.ui5.types.Axis",multiple:false}},events:{"selectData":{},"deselectData":{},"showTooltip":{deprecated:true},"hideTooltip":{deprecated:true},"initialized":{}}}});sap.viz.ui5.Bullet.M_EVENTS={'selectData':'selectData','deselectData':'deselectData','showTooltip':'showTooltip','hideTooltip':'hideTooltip','initialized':'initialized'};
sap.viz.ui5.Bullet.prototype.getVIZChartType=function(){return"viz/bullet"};
sap.viz.ui5.Bullet.prototype.getGeneral=function(){return this._getOrCreate("general")};
sap.viz.ui5.Bullet.prototype.getInteraction=function(){return this._getOrCreate("interaction")};
sap.viz.ui5.Bullet.prototype.getTitle=function(){return this._getOrCreate("title")};
sap.viz.ui5.Bullet.prototype.getToolTip=function(){return this._getOrCreate("toolTip")};
sap.viz.ui5.Bullet.prototype.getXyContainer=function(){return this._getOrCreate("xyContainer")};
sap.viz.ui5.Bullet.prototype.getYAxis=function(){return this._getOrCreate("yAxis")};
sap.viz.ui5.Bullet.prototype.getBackground=function(){return this._getOrCreate("background")};
sap.viz.ui5.Bullet.prototype.getPlotArea=function(){return this._getOrCreate("plotArea")};
sap.viz.ui5.Bullet.prototype.getXAxis2=function(){return this._getOrCreate("xAxis2")};
sap.viz.ui5.Bullet.prototype.getYAxis2=function(){return this._getOrCreate("yAxis2")};
sap.viz.ui5.Bullet.prototype.attachSelectData=function(d,h,l){return this._attachVIZEvent("selectData",d,h,l)};
sap.viz.ui5.Bullet.prototype.detachSelectData=function(h,l){return this._detachVIZEvent("selectData",h,l)};
sap.viz.ui5.Bullet.prototype.attachDeselectData=function(d,h,l){return this._attachVIZEvent("deselectData",d,h,l)};
sap.viz.ui5.Bullet.prototype.detachDeselectData=function(h,l){return this._detachVIZEvent("deselectData",h,l)};
sap.viz.ui5.Bullet.prototype.attachShowTooltip=function(d,h,l){return this._attachVIZEvent("showTooltip",d,h,l)};
sap.viz.ui5.Bullet.prototype.detachShowTooltip=function(h,l){return this._detachVIZEvent("showTooltip",h,l)};
sap.viz.ui5.Bullet.prototype.attachHideTooltip=function(d,h,l){return this._attachVIZEvent("hideTooltip",d,h,l)};
sap.viz.ui5.Bullet.prototype.detachHideTooltip=function(h,l){return this._detachVIZEvent("hideTooltip",h,l)};
sap.viz.ui5.Bullet.prototype.attachInitialized=function(d,h,l){return this._attachVIZEvent("initialized",d,h,l)};
sap.viz.ui5.Bullet.prototype.detachInitialized=function(h,l){return this._detachVIZEvent("initialized",h,l)};
