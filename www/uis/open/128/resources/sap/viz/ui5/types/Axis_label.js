/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.viz.ui5.types.Axis_label");jQuery.sap.require("sap.viz.library");jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Axis_label",{metadata:{library:"sap.viz",properties:{"visible":{type:"boolean",group:"",defaultValue:true},"numberFormat":{type:"string",group:"",defaultValue:'',deprecated:true},"formatString":{type:"any",group:"",defaultValue:null},"unitFormatType":{type:"sap.viz.ui5.types.Axis_label_unitFormatType",group:"",defaultValue:sap.viz.ui5.types.Axis_label_unitFormatType.FinancialUnits},"hideSubLevels":{type:"boolean",group:"",defaultValue:false}}}});
