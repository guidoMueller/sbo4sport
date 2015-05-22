/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
*/
sap.ui.controller("sap.suite.ui.smartbusiness.designtime.drilldown.Main", {

	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");				
		sap.ca.scfld.md.Startup.init('sap.suite.ui.smartbusiness.designtime.drilldown', this);
	}
});