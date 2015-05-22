// Copyright (c) 2013 SAP AG, All Rights Reserved

/* global jQuery, sap */
jQuery.sap.require("sap.m.MessageToast");

/* global sap */
sap.ui.controller("sap.ushell.renderers.fiori2.search.container.App",{
	
	onInit: function () {
		this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
//        this.oShellNavigation.init(jQuery.proxy(this.doHashChange, this));
		this.oShellNavigation.hashChanger.attachEvent("hashChanged", this.hashChanged);
	},
	
//	switchViewState: function (sState, bSaveLastState) {
//		var self = this;
//		var oView = self.getView();
//		
//		var mState = {
//				"searchResults":oView.oSearchResults,
//				"suggestions":oView.oSearchSuggestions,
//				"historyScreen":oView.oHistoryScreen
//		};
//		
//		for (var key in mState) {
//			if (key === sState)
////				oView.oPage.addContent(mState[key]);
//				oView.oSubContainer.addContent(mState[key]);
//			else 
////				oView.oPage.removeContent(mState[key]);
//			 	oView.oSubContainer.removeContent(mState[key]);
//		}
//		
//    },
    
    hashChanged: function (oEvent) {
		var oView = sap.ui.getCore().byId("searchContainerApp");
		
        var searchModel = sap.ui.getCore().getModel("searchModel");
		var oURLParsing = sap.ushell.Container.getService("URLParsing");
        var oParameters = oURLParsing.parseParameters("?" + oEvent.getParameter("newHash").replace(/#/g, '%23'));
        
        if (!oParameters.searchTerm)
        	return;
        var searchTerm = decodeURIComponent(oParameters.searchTerm[0]);
		searchModel.setSearchTerm(searchTerm, false);
		
        var dataSource;
        if (oParameters.dataSource) {
        	var dataSourceJson = JSON.parse(decodeURIComponent(oParameters.dataSource[0]));
            dataSource = searchModel.sina.createDataSource(dataSourceJson);
            searchModel.setDataSource(dataSource, false);
        }
        else {
        	searchModel.resetDataSource(false);
        }
        
        oView.oSearchResults.searchLayout.setShowBottomList(searchModel.getProperty("/isNormalSearchEnable"));
		if (!searchModel.getProperty("/isNormalSearchEnable"))
			oView.oSearchResults.searchLayout.setBottomCount(0);
		
        oView.oSearchSelect.setSelectedKey(searchModel.getProperty("/dataSourceLabelRaw"));
        oView.oSearchInput.setValue(searchModel.getProperty('/searchBoxTerm'));     
        
        var oHeadSearchBoxView = sap.ui.getCore().byId("headSearchBox");
        if(oHeadSearchBoxView !== undefined){
        	if(oHeadSearchBoxView.getVisible()){
            	oHeadSearchBoxView.setVisible(false);	
        	}	
        }
        
		searchModel._searchFireQuery();
    },
    
    onExit: function () {
//        sap.ui.getCore().getEventBus().unsubscribe("externalSearch", this.externalSearchTriggered, this);
//        sap.ui.getCore().getEventBus().unsubscribe("openApp", this.openApp, this);
    	this.oShellNavigation.hashChanger.detachEvent("hashChanged", this.hashChanged);
//        this.getView().aDanglingControls.forEach(function (oControl) {
//            if (oControl.destroyContent) {
//                oControl.destroyContent();
//            }
//            oControl.destroy();
//        });
    },

});