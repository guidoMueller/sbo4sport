// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.suite.ui.smartbusiness.drilldown.Component");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

// new Component
sap.ca.scfld.md.ComponentBase.extend("sap.suite.ui.smartbusiness.drilldown.Component", {
    metadata : sap.ca.scfld.md.ComponentBase.createMetaData("FS", 
            {
        "name" : "Smart Business Generic Drilldown",
        "version" : "1.0.0",
        "library" : "sap.suite.ui.smartbusiness.drilldown",
        "includes" : ["lib/AllLibrary.js"],
        "dependencies" : {
            "libs" : ["sap.m", "sap.ca.ui"],
            "components" : []
        },
        config : {
            resourceBundle : "i18n/i18n.properties",
            titleResource : "SAP Smart Business",
            fullWidth : true
        },
        viewPath : "sap.suite.ui.smartbusiness.drilldown.view",
        fullScreenPageRoutes : {
            // fill the routes to your full screen pages in here.
            "fullscreen" : {
                "pattern" : ":all*:",
                "view" : "Drilldown"
            }
        },
    }),
    /**
     * Initialize the application
     * 
     * @returns {sap.ui.core.Control} the content
     */
    createContent : function() {
        var modulePath = jQuery.sap.getModulePath("sap.suite.ui.smartbusiness.drilldown");
        jQuery.sap.require("sap.ca.ui.utils.Lessifier");
        sap.ca.ui.utils.Lessifier.lessifyCSS("sap.suite.ui.smartbusiness.drilldown", "css/colors.css"); 
    	jQuery.sap.includeStyleSheet(modulePath + "/css/override.css");
        try {
            var oViewData = this.getComponentData().startupParameters;
            oViewData.component = this;
        } catch(e) {
            oViewData = {};
            oViewData.component=this;
            jQuery.sap.log.error("Startup Parameters not found!!");  
        }
        return sap.ui.view({
            viewName : "sap.suite.ui.smartbusiness.drilldown.view.Main",
            type : sap.ui.core.mvc.ViewType.XML,
            viewData : oViewData
        });
    }
});
