/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.types.controller.Interaction_selectability");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.controller.Interaction_selectability",{metadata:{library:"sap.viz",properties:{"mode":{type:"sap.viz.ui5.types.controller.Interaction_selectability_mode",group:"",defaultValue:sap.viz.ui5.types.controller.Interaction_selectability_mode.inclusive},"axisLabelSelection":{type:"boolean",group:"",defaultValue:true},"legendSelection":{type:"boolean",group:"",defaultValue:true},"plotLassoSelection":{type:"boolean",group:"",defaultValue:true},"plotStdSelection":{type:"boolean",group:"",defaultValue:true},"lassoWithCtrlKey":{type:"boolean",group:"",defaultValue:false,deprecated:true},"dataPointsCacheable":{type:"boolean",group:"",defaultValue:true,deprecated:true}}}});
