sap.ui.controller("sap.suite.ui.smartbusiness.designtime.workspace.Main", {

	onInit : function() {
		jQuery.sap.require("sap.ca.scfld.md.Startup");
		sap.ca.scfld.md.Startup.init('sap.suite.ui.smartbusiness.designtime.workspace', this);
	},

	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * 
	 * @memberOf MainXML
	 */
	onExit : function() {
		//exit cleanup code here
	}

});