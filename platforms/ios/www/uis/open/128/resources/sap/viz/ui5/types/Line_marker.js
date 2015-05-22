/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.types.Line_marker");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Line_marker",{metadata:{library:"sap.viz",properties:{"visible":{type:"boolean",group:"",defaultValue:true},"shape":{type:"sap.viz.ui5.types.Line_marker_shape",group:"",defaultValue:sap.viz.ui5.types.Line_marker_shape.circle},"size":{type:"int",group:"",defaultValue:6},"number":{type:"int",group:"",defaultValue:null,deprecated:true}}}});
