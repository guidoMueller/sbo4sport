// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.renderers.fiori2.search.container.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.renderers.fiori2.search.container.Component", {

	metadata : {

		version : "1.24.5",

		library : "sap.ushell.renderers.fiori2.search.container",

		includes : [ ],

		dependencies : {
			libs : [ "sap.m" ],
			components : []
		},
        config: {
//            "title": "Fiori Sandbox Default App",
            //"resourceBundle" : "i18n/i18n.properties",
            //"titleResource" : "shellTitle",
//            "icon" : "sap-icon://Fiori2/F0429"
        }
	},

	createContent : function() {
//		return sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.App");
		return sap.ui.view({
            id : "searchContainerApp",
//            tooltip: "{i18n>searchHistoryScreen_tooltip}",
            viewName : "sap.ushell.renderers.fiori2.search.container.App",
            type : sap.ui.core.mvc.ViewType.JS
        });
	}
});
