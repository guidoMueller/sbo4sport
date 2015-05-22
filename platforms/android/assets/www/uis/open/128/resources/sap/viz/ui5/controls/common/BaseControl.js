/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.controls.common.BaseControl");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.ui.core.Control");sap.ui.core.Control.extend("sap.viz.ui5.controls.common.BaseControl",{metadata:{library:"sap.viz",properties:{"uiConfig":{type:"object",group:"Misc",defaultValue:null},"width":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:'640px'},"height":{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:'480px'}}}});
sap.viz.ui5.controls.common.BaseControl.prototype.init=function(){this._app$=null;this._uiConfig=null;this._controls={};this._requestedLoad=null;this._handlers={'resize':null};this._theme=null;this._locale=null;this._resourceLoaded=false;sap.viz._initializeVIZContainer(jQuery.proxy(function(s){this._resourceLoaded=s;this.invalidate()},this))};
sap.viz.ui5.controls.common.BaseControl.prototype.exit=function(){this._app$=null;this._deregister();for(var k in this._controls){this._controls[k].destroy()}};
sap.viz.ui5.controls.common.BaseControl.prototype.onBeforeRendering=function(){this._deregister()};
sap.viz.ui5.controls.common.BaseControl.prototype.onAfterRendering=function(){this._render()};
sap.viz.ui5.controls.common.BaseControl.prototype.onThemeChanged=function(){if(this.getDomRef()&&this._theme!==sap.ui.getCore().getConfiguration().getTheme()){this._render()}};
sap.viz.ui5.controls.common.BaseControl.prototype.onLocalizationChanged=function(){if(this.getDomRef()&&this._locale!==sap.ui.getCore().getConfiguration().getLocale()){this._render()}};
sap.viz.ui5.controls.common.BaseControl.prototype.getUiConfig=function(){return this._uiConfig};
sap.viz.ui5.controls.common.BaseControl.prototype.setUiConfig=function(u){if(this._app$){return}this._mergeConfig(u)};
sap.viz.ui5.controls.common.BaseControl.prototype.save=function(){var j={};for(var k in this._controls){j[k]=this._controls[k].save()}return j};
sap.viz.ui5.controls.common.BaseControl.prototype.load=function(j){for(var k in j){if(this._controls[k]){this._controls[k].load(j[k])}else{this._requestedLoad=j}}};
sap.viz.ui5.controls.common.BaseControl.prototype._render=function(){if(this._resourceLoaded){this._theme=sap.ui.getCore().getConfiguration().getTheme();this._locale=sap.ui.getCore().getConfiguration().getLocale();if(!this._app$){this._app$=jQuery(document.createElement('div')).appendTo(this.getDomRef()).addClass('ui5-viz-controls-app');jQuery(this._app$).attr("data-sap-ui-preserve",true);this._createChildren();this._validateSize()}else{this._app$.appendTo(this.getDomRef());this._validateSize();this._updateChildren()}this._register()}};
sap.viz.ui5.controls.common.BaseControl.prototype._createChildren=function(){};
sap.viz.ui5.controls.common.BaseControl.prototype._updateChildren=function(){};
sap.viz.ui5.controls.common.BaseControl.prototype._mergeConfig=function(u){this._uiConfig=u};
sap.viz.ui5.controls.common.BaseControl.prototype._deregister=function(){if(this._handlers.resize){sap.ui.core.ResizeHandler.deregister(this._handlers.resize)}this._handlers.resize=null};
sap.viz.ui5.controls.common.BaseControl.prototype._register=function(){this._handlers.resize=sap.ui.core.ResizeHandler.register(this.getDomRef(),jQuery.proxy(this._validateSize,this))};
sap.viz.ui5.controls.common.BaseControl.prototype._validateSize=function(){};
sap.viz.ui5.controls.common.BaseControl.prototype._registerControl=function(k,c){this._controls[k]=c;if(this._requestedLoad&&this._requestedLoad[k]){c.load(this._requestedLoad[k]);delete this._requestedLoad[k]}};
