/*!
* SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
*/
jQuery.sap.declare("sap.suite.ui.smartbusiness.designtime.drilldown.Configuration");
jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
jQuery.sap.require("sap.ca.scfld.md.app.Application");

sap.ca.scfld.md.ConfigurationBase.extend("sap.suite.ui.smartbusiness.designtime.drilldown.Configuration", {
	oServiceParams: {
		serviceList: [{
			name: "smart_business_runtime_services",
			masterCollection: "EVALUATIONS",
			serviceUrl: "/sap/hba/r/sb/core/odata/modeler/SMART_BUSINESS.xsodata",
			isDefault: true,
			mockedDataSource: "/ddaconfig/model/metadata.xml"
		}]
	},

	getHanaSystem : function() {
        var hashObj = hasher || window.hasher; 
        var hashArr = hashObj.getHashAsArray();
        if(hashArr && hashArr.length && hashArr[0]) {
               var hashParameters = hashArr[0].substr(hashArr[0].indexOf("?") + 1).split("&");
               for(var i=0,l=hashParameters.length; i<l; i++) {
                     if(hashParameters[i] && (hashParameters[i].indexOf("sap-system") != -1)) {
                            return hashParameters[i].split("=")[1]; 
                     }
               }
        }
        return "";
	},
	
	getServiceParams : function() {
		if(sap.ushell && sap.ushell.Container) {
			var serviceUrl = this.oServiceParams.serviceList[0].serviceUrl;
	        this.oServiceParams.serviceList[0].serviceUrl = sap.ushell.Container.getService("URLParsing").addSystemToServiceUrl(serviceUrl, this.getHanaSystem());
		}
        return this.oServiceParams;
	},

	/**
	 * @inherit
	 */
	getServiceList : function() {
		return this.getServiceParams().serviceList;
	},

	getMasterKeyAttributes : function() {
		//return the key attribute of your master list item
		return ["ID", "IS_ACTIVE"];
	},
	getExcludedQueryStringParameters : function() {
	    return ["sap-client","sap-language"];
	}
});
