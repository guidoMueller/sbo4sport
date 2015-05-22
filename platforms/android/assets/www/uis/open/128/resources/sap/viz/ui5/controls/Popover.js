/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.controls.Popover");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.controls.common.BaseControl");sap.viz.ui5.controls.common.BaseControl.extend("sap.viz.ui5.controls.Popover",{metadata:{publicMethods:["connect"],library:"sap.viz",properties:{"customDataControl":{type:"any",group:"",defaultValue:null},"actionItems":{type:"object[]",group:"",defaultValue:null},"formatString":{type:"any",group:"",defaultValue:null}}}});jQuery.sap.require("sap.viz.ui5.controls.libs.sap-viz-controls");jQuery.sap.declare("sap.viz.ui5.controls.Popover");
sap.viz.ui5.controls.Popover.prototype.init=function(){sap.viz.ui5.controls.common.BaseControl.prototype.init.apply(this,arguments);this._Popover=undefined;this._uid=undefined};
sap.viz.ui5.controls.Popover.prototype.exit=function(){sap.viz.ui5.controls.common.BaseControl.prototype.exit.apply(this,arguments);this._Popover=undefined;this._uid=undefined};
sap.viz.ui5.controls.Popover.prototype.connect=function(u){this._uid=u;if(!this._Popover){this._createPopover()}this._Popover.connect(u)};
sap.viz.ui5.controls.Popover.prototype.setFormatString=function(s){this.setProperty("formatString",s);if(this._Popover){this._Popover.setFormatString(s)}else{this._createPopover()}return this};
sap.viz.ui5.controls.Popover.prototype.setCustomDataControl=function(c){this.setProperty('customDataControl',c);if(this._Popover){this._Popover.setCustomDataControl(c)}else{this._createPopover()}return this};
sap.viz.ui5.controls.Popover.prototype.setActionItems=function(a){this.setProperty('actionItems',a);if(this._Popover){this._Popover.setActionItems(a)}else{this._createPopover()}return this};
sap.viz.ui5.controls.Popover.prototype._createPopover=function(){this._Popover=new sap.viz.controls.popover.PopOver({actionItems:this.getActionItems(),customDataControl:this.getCustomDataControl(),formatString:this.getFormatString()})};
