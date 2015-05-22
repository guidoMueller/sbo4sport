/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.declare("sap.ui.unified.DateRange");jQuery.sap.require("sap.ui.unified.library");jQuery.sap.require("sap.ui.core.Element");sap.ui.core.Element.extend("sap.ui.unified.DateRange",{metadata:{library:"sap.ui.unified",properties:{"startDate":{type:"object",group:"Misc",defaultValue:null},"endDate":{type:"object",group:"Misc",defaultValue:null}}}});
sap.ui.unified.DateRange.prototype.setStartDate=function(d){this.setProperty("startDate",d)};
sap.ui.unified.DateRange.prototype.setEndDate=function(d){this.setProperty("endDate",d)};
