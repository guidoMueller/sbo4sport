/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class new facetFilter
 * @name  newFacetFilter
 * @description Holds the available filters
 * @memberOf sap.apf.ui.reuse.view
 * 
 */
sap.ui.jsview("sap.apf.ui.reuse.view.facetFilter", {
	getControllerName : function() {
		return "sap.apf.ui.reuse.controller.facetFilter";
	},
	createContent : function(oController) {
		var oSelf = this;
		this.aFacetFilterListControls = [];
		this.oCoreApi = this.getViewData().oCoreApi;
		this.oUiApi = this.getViewData().oUiApi;
		this.oPathContextHandler = this.getViewData().oPathContextHandler;
		this.aFacetFilterListData = this.getViewData().aFacetFilterListData;
		this.aFacetFilterListData.forEach(function (oFacetFilterListData) {
			var oFacetFilterList = new sap.m.FacetFilterList({
				title: oSelf.oCoreApi.getTextNotHtmlEncoded(oFacetFilterListData.label),
				multiSelect: oFacetFilterListData.multiSelection === "true",
				key: oFacetFilterListData.property,
				growing: false,
				listClose: oController.onListClose.bind(oController)
			});
			oSelf.aFacetFilterListControls.push(oFacetFilterList);
		});
		
		this.onContextChanged = oController.onContextChanged.bind(oController);
		
		this.oFacetFilter = new sap.m.FacetFilter({
			type : "Simple",
			showReset : true,
			lists : this.aFacetFilterListControls,
			reset: oController.onResetPress.bind(oController)
		});
		return this.oFacetFilter;
	}
});
