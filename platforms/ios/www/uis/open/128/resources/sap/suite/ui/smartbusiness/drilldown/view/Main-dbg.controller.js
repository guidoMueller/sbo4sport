sap.ui.controller("sap.suite.ui.smartbusiness.drilldown.view.Main", {
    onInit : function() {
        jQuery.sap.require("sap.ca.scfld.md.Startup");
        sap.ca.scfld.md.Startup.init('sap.suite.ui.smartbusiness.drilldown', this);
    }
});