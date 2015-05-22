/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.types.Tooltip");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Tooltip",{metadata:{library:"sap.viz",properties:{"preRender":{type:"any",group:"",defaultValue:null},"postRender":{type:"any",group:"",defaultValue:null},"visible":{type:"boolean",group:"",defaultValue:true},"drawingEffect":{type:"sap.viz.ui5.types.Tooltip_drawingEffect",group:"",defaultValue:sap.viz.ui5.types.Tooltip_drawingEffect.normal,deprecated:true},"formatString":{type:"any[][]",group:"",defaultValue:[[null]]},"layinChart":{type:"boolean",group:"",defaultValue:true}},aggregations:{"background":{type:"sap.viz.ui5.types.Tooltip_background",multiple:false},"footerLabel":{type:"sap.viz.ui5.types.Tooltip_footerLabel",multiple:false,deprecated:true},"separationLine":{type:"sap.viz.ui5.types.Tooltip_separationLine",multiple:false,deprecated:true},"bodyDimensionLabel":{type:"sap.viz.ui5.types.Tooltip_bodyDimensionLabel",multiple:false,deprecated:true},"bodyDimensionValue":{type:"sap.viz.ui5.types.Tooltip_bodyDimensionValue",multiple:false,deprecated:true},"bodyMeasureLabel":{type:"sap.viz.ui5.types.Tooltip_bodyMeasureLabel",multiple:false,deprecated:true},"bodyMeasureValue":{type:"sap.viz.ui5.types.Tooltip_bodyMeasureValue",multiple:false,deprecated:true},"closeButton":{type:"sap.viz.ui5.types.Tooltip_closeButton",multiple:false,deprecated:true}}}});
sap.viz.ui5.types.Tooltip.prototype.getBackground=function(){return this._getOrCreate("background")};
sap.viz.ui5.types.Tooltip.prototype.getFooterLabel=function(){return this._getOrCreate("footerLabel")};
sap.viz.ui5.types.Tooltip.prototype.getSeparationLine=function(){return this._getOrCreate("separationLine")};
sap.viz.ui5.types.Tooltip.prototype.getBodyDimensionLabel=function(){return this._getOrCreate("bodyDimensionLabel")};
sap.viz.ui5.types.Tooltip.prototype.getBodyDimensionValue=function(){return this._getOrCreate("bodyDimensionValue")};
sap.viz.ui5.types.Tooltip.prototype.getBodyMeasureLabel=function(){return this._getOrCreate("bodyMeasureLabel")};
sap.viz.ui5.types.Tooltip.prototype.getBodyMeasureValue=function(){return this._getOrCreate("bodyMeasureValue")};
sap.viz.ui5.types.Tooltip.prototype.getCloseButton=function(){return this._getOrCreate("closeButton")}
