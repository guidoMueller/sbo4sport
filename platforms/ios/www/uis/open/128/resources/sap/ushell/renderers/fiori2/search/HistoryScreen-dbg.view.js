//Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, SearchLayout */

    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.ui.launchpad.Tile");
    jQuery.sap.require("sap.ushell.ui.launchpad.SearchResultApps");
    jQuery.sap.require("sap.ushell.ui.launchpad.SearchResultAppItem");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchLayout");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.DataSourceList");

    sap.ui.jsview("sap.ushell.renderers.fiori2.search.HistoryScreen", {
        createContent: function (oController) {
            var self = this;
            var oSearchItemTemplate,
                oListSearches;

            // recent datassources
            // var oRecentDataSources =  new sap.ushell.renderers.fiori2.search.DataSourceList({
            //     data
            // });

            if (sap.ui.getCore().getModel("searchModel").isNormalSearchEnable()){
            	this.oRecentDataSources = new sap.ushell.renderers.fiori2.search.DataSourceList({
                    // dataSources : [{objectName:{label:"blub"}}, {objectName:{label:"b23lub"}}, {objectName:{label:"bsdlub"}}, {objectName:{label:"baalub"}}],
                    dsPress : function(params){
                        var ds = params.getParameters().ds;
                        // self.viewSwitcher.switchViewState("searchResults");
                        self.getModel("searchModel").setDataSource(ds, false);
                        self.searchfield.focus();
                    },
                    showNoData: false,
                    dataSources : "{/dataSources}"
                    
                });
            }
            

            // recent apps
            // oRecentApps =  new sap.ushell.ui.launchpad.SearchResultApps({
            //     showNoData: false,
            //     growing: true,
            //     growingThreshold: 2,
            //     growingTriggerText: {path: "i18n>showMore"},
            //     showGrowingTrigger: false,
            //     results: {
            //         path : "/apps",
            //         template : new sap.ushell.ui.launchpad.SearchResultAppItem({
            //             icon: "{icon}",
            //             text: "{title}",
            //             targetUrl: "{url}"
            //         })
            //     },
            //     visible: {
            //         path: "/apps/length",
            //         formatter: function (iAppCount) {
            //             return (iAppCount !== 0);
            //         }
            //     }
            // }).addStyleClass("sapUshellHistoryScreenRecentApps");

            // recent searches

            oListSearches = new sap.m.List({
                inset : false,
                showSeparators : sap.m.ListSeparators.Inner,
                visible: {
                    path: "/searches/length",
                    formatter: function (recentSearchCount) {
                        return (recentSearchCount !== 0);
                    }
                }
            }).addStyleClass("sapUshellHistoryScreenRecentSearches");

            oListSearches.bindAggregation("items", "/searches", function (path, bData) {
                
                var oSearchItemTemplate = new sap.m.StandardListItem({
                    title: {
                        parts: ["sTerm", "oDataSource/objectName/value", "oDataSource"],
                        formatter: function (sTerm, sObjectNameValue, oDataSource) {
                            if (sObjectNameValue === "$$ALL$$") {
                                return sTerm;
                            }
                            if (!oDataSource) return sTerm;
                            var dsLabel = oDataSource.label || oDataSource.objectName.label || oDataSource.objectName.value;

                            return sTerm + (dsLabel ? ", " + dsLabel : "");
                        }
                    },
                    type: "Active"
                });
                oSearchItemTemplate.data("sSearchTerm", "{sTerm}");
    //            oSearchItemTemplate.data("sObjectNameValue", "{oObjectName/value}");
    //            oSearchItemTemplate.data("sObjectNameLabel", "{oObjectName/label}");
                oSearchItemTemplate.data("oDataSource", "{oDataSource}");
                oSearchItemTemplate.onAfterRendering = function(){
                    $(this.getDomRef()).click(function (){
                        // oController.searchAgain();
                        self.getModel("searchModel").setDataSource(bData.getObject().oDataSource,false);
                        self.getModel("searchModel").setSearchTerm(bData.getObject().sTerm, false);
                    	window.location.href = "#Action-search&/searchTerm=" + encodeURI(self.getModel("searchModel").getProperty("/searchBoxTerm")) + "&dataSource=" + encodeURI(JSON.stringify(self.getModel("searchModel").getDataSourceJson()));
                        if (self.viewSwitcher) 
                        	self.viewSwitcher.switchViewState("searchResults");
                    });
                    $(this.getDomRef()).keyup(function(event){
                        if(event.keyCode == 13){
                        	this.click();
                        }
                    });
                };

                return oSearchItemTemplate;

            });
            this.searchLayout = new SearchLayout({
                bottomHeader: {
                    parts: ["/searches/length", "i18n>recent_searches"],
                    formatter: function (iSearchCount, sLabel) {
                        return iSearchCount !== 0 ? sLabel : undefined;
                    }
                },
                bottomList: oListSearches,
                topHeader: {
                    parts: ["/dataSources/length", "i18n>searchIn"],
                    formatter: function (dsCount, sLabel) {
                        return dsCount !== 0 ? sLabel : undefined;
                    }
                },
                topList: self.oRecentDataSources,
                searchBusy : true
            });

            var sfId = "sfOverlay";
            if (self.getViewData()!==undefined && self.getViewData().sf!==undefined) 
            	sfId = self.getViewData().sf;
            sap.ui.getCore().byId(sfId).addEventDelegate({
                onsapdown: function (oEvent) {
                        self.oRecentDataSources.focus();

                        oEvent.preventDefault();
                        oEvent.stopPropagation();
                }
            });
            
            return this.searchLayout;
        },

        dsRequestFinished: function () {
            this.searchLayout.setSearchBusy(false);
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.search.HistoryScreen";
        }
    });
}());
