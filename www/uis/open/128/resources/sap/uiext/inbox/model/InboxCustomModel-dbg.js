/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
 
jQuery.sap.declare("sap.uiext.inbox.model.InboxCustomModel");

jQuery.sap.require("sap.ui.model.odata.ODataModel");
jQuery.sap.require("sap.uiext.inbox.model.InboxListBinding");

/*global OData *///declare unusual global vars for JSLint/SAPUI5 validation
 
 sap.ui.model.odata.ODataModel.extend("sap.uiext.inbox.model.InboxCustomModel",{
	 bindList: function(sPath, oContext, oSorter, aFilters, mParameters) {
		 return new sap.uiext.inbox.model.InboxListBinding(this, sPath, oContext, oSorter, aFilters, mParameters);
	 }
 });
 
 