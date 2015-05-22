jQuery.sap.declare("sap.suite.ui.smartbusiness.lib.formatters");

sap.suite = sap.suite || {};
sap.suite.smartbusiness = sap.suite.smartbusiness || {};

sap.suite.smartbusiness.formatters = {
		getBundleText : function(oController, iText, iPlaceholder1, iPlaceholder2) {
			var oBundle;

			if (oController === undefined) {
				var oApplicationFacade = sap.ca.scfld.md.app.Application.getImpl().oConfiguration.oApplicationFacade;
				oBundle = oApplicationFacade.getResourceBundle();
			} else {
				oBundle = oController.oApplicationFacade.getResourceBundle();
			}

			var sText = oBundle.getText(iText, [iPlaceholder1, iPlaceholder2]);
			return sText;
		},
		
		kpiStatus : function(state) {
			return (state ? sap.suite.smartbusiness.formatters.getBundleText(undefined, "STATUS", sap.suite.smartbusiness.formatters.getBundleText(undefined, "STATUS_ACTIVE")) : sap.suite.smartbusiness.formatters.getBundleText(undefined, "STATUS", sap.suite.smartbusiness.formatters.getBundleText(undefined, "STATUS_DRAFT")));
		},
		kpiStatusText : function(state) {
			return (state ? sap.suite.smartbusiness.formatters.getBundleText(undefined, "STATUS_ACTIVE") : sap.suite.smartbusiness.formatters.getBundleText(undefined, "STATUS_DRAFT"));
		},
		kpiStatusState : function(state) {
			return (state ? sap.ui.core.ValueState.Success : sap.ui.core.ValueState.None);
		},
		kpiOwner : function(owner) {
			if(owner)
				return sap.suite.smartbusiness.formatters.getBundleText(undefined, "ADDED_BY", owner);
			return;
		},
		kpiOwnerInOH : function(owner) {
			if(owner)
				return sap.suite.smartbusiness.formatters.getBundleText(undefined, "OWNER", owner);
			return;
		},
		kpiID : function(id, type) {
			if(id) {
				if(type && type == "KPI") {
					return sap.suite.smartbusiness.formatters.getBundleText(undefined, "KPI", id);
				}
				else {
					return sap.suite.smartbusiness.formatters.getBundleText(undefined, ("OPI: " + id));
				}
			}
			return;
		},
		kpiIDInOH : function(id, type) {
			if(id) {
				if(type && type == "KPI") {
					return sap.suite.smartbusiness.formatters.getBundleText(undefined, "KPI", id);
				}
				else {
					return sap.suite.smartbusiness.formatters.getBundleText(undefined, ("OPI: " + id));
				}
			}
			return;
		},
		evalStatus : function(status) {
			try {
				if(status)
					return "Success";
				return "None";
			} catch (e) {
				return;
			}
		},
};

