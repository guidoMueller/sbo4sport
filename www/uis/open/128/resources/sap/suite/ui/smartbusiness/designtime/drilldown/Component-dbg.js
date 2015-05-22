/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.drilldown.Component");
jQuery.sap.require("sap.suite.ui.smartbusiness.designtime.drilldown.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ComponentBase");

sap.ca.scfld.md.ComponentBase.extend("sap.suite.ui.smartbusiness.designtime.drilldown.Component", {
		metadata : sap.ca.scfld.md.ComponentBase.createMetaData("MD", {
			"name" : "Master Detail Sample",
			"version" : "1.1.0-SNAPSHOT",
			"library" : "sap.suite.ui.smartbusiness.designtime.drilldown",
			"includes" : ["css/style.css","../../lib/Util.js","../../lib/DrilldownModel.js","../../lib/DrilldownWriteService.js","../../lib/ListPersona.js",
			              "../../lib/DrilldownSaveService.js"],
				"dependencies" : {
				"libs" : ["sap.m"],
			"components" : []
			},
			"config" : {
				"resourceBundle" : "i18n/i18n.properties",
				"titleResource" : "SHELL_TITLE",
				"icon" : "sap-icon://Fiori5/F0819",
				"favIcon" : "../../../../../../../resources/sap/ca/ui/themes/base/img/favicon/F0819_Edit_Drill_Down_Confs.ico",
				"homeScreenIconPhone" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0819_Edit_DrillDown_Configs/57_iPhone_Desktop_Launch.png",
				"homeScreenIconPhone@2" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0819_Edit_DrillDown_Configs/114_iPhone-Retina_Web_Clip.png",
				"homeScreenIconTablet" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0819_Edit_DrillDown_Configs/72_iPad_Desktop_Launch.png",
				"homeScreenIconTablet@2" : "../../../../../../../resources/sap/ca/ui/themes/base/img/launchicon/F0819_Edit_DrillDown_Configs/144_iPad_Retina_Web_Clip.png",
				"startupImage320x460" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
				"startupImage640x920" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
				"startupImage640x1096" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
				"startupImage768x1004" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
				"startupImage748x1024" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/748_x_1024.png",
				"startupImage1536x2008" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
				"startupImage1496x2048" : "../../../../../../../resources/sap/ca/ui/themes/base/img/splashscreen/1496_x_2048.png"
		},
		viewPath : "sap.suite.ui.smartbusiness.designtime.drilldown.view",
		
		// masterPageRoutes : {
		// // fill the routes to your master pages in here. The application will start with a navigation to route "master"
		// leading to master screen S2.
		// // If this is not desired please define your own route "master"
		// },
		// detailPageRoutes : {
		//		"S3" : {
		//			"pattern" : "toS5",
		//			"view" : "S5",
		//		}
		// },
		fullScreenPageRoutes : [
			//fill the routes to your full screen pages in here.
			{
				"pattern" : "configureChart/{evaluationId}/{viewId}",
				"view" : "configureNewView",
				"name": "configureChart"
			},
			{
				"pattern" : "configurator/{evaluationId}/{viewId}",
				"view" : "configurator",
				"name": "configurator"
			}
		]
	}),
	
	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent : function() {

		var oViewData = {
			component : this
		};
		if(jQuery.browser.msie) {
			if(jQuery.browser.fVersion == "9") {

				jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("sap.suite.ui.smartbusiness.designtime.drilldown/css")+"/ie9.css");
			}
		}
		return sap.ui.view({
			viewName : "sap.suite.ui.smartbusiness.designtime.drilldown.Main",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
	}
});

