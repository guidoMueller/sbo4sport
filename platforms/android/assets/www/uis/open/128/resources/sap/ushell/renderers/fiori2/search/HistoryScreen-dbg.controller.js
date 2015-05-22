// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console */

    jQuery.sap.require("sap.ushell.ui.launchpad.Tile");
    jQuery.sap.require("sap.ushell.ui.launchpad.TileContainer");
    jQuery.sap.require("sap.ushell.services.LaunchPage");
    jQuery.sap.require("sap.ushell.services.Search");
    jQuery.sap.require("sap.ushell.services.UserRecents");

    /**
     * @name "sap.ushell.renderers.fiori2.search.HistoryScreen
     * @extends sap.ui.core.mvc.Controller
     * @public
     */
    sap.ui.controller("sap.ushell.renderers.fiori2.search.HistoryScreen", {

        /**
         * SAPUI5 lifecycle hook.
         * @public
         */
        onInit: function () {
            var self = this;
            this.oLaunchPageService = sap.ushell.Container.getService("LaunchPage");
            this.oUserRecentsService = sap.ushell.Container.getService("UserRecents");
            this.oSearchService = sap.ushell.Container.getService("Search");
            this.oCurrentSearch = null;

            var that = this,
                oEventBus = sap.ui.getCore().getEventBus(),
                oRecentModel = new sap.ui.model.json.JSONModel();

            oRecentModel.setProperty("/apps", []);
            oRecentModel.setProperty("/searches", []);
            oRecentModel.setProperty("/dataSources", []);
            this.getView().setModel(oRecentModel);

            oEventBus.subscribe("search", this.newSearchInvoked, this);
            oEventBus.subscribe("searchDataSourceChange", this.newSearchCategory, this);
            oEventBus.subscribe("closeCurtain", this.saveSearch, this);
            oEventBus.subscribe("openApp", this.appOpened, this);
            oEventBus.subscribe("openHistoryScreen", this.updateView, this);

        },

        onExit: function () {
            if (this.oCurrentSearch) {
                this.oUserRecentsService.noticeSearch(this.oCurrentSearch);
            }
            var oEventBus = sap.ui.getCore().getEventBus();
            oEventBus.unsubscribe("search", this.newSearchInvoked, this);
            oEventBus.unsubscribe("searchDataSourceChange", this.newSearchCategory, this);
            oEventBus.unsubscribe("closeCurtain", this.saveSearch, this);
            oEventBus.unsubscribe("openApp", this.appOpened, this);
            oEventBus.unsubscribe("openHistoryScreen", this.updateView, this);
        },

        updateView: function (sChannelId, sEventId, oData) {
            var self = this;
            var oModel = this.getView().getModel();

            // this.oUserRecentsService.getRecentApps().done(function (aRecentApps) {
            //     oModel.setProperty("/apps", aRecentApps.filter(function (elem) {
            //         return elem.title && elem.url;
            //     }));
            // });

            var removeBTags = function(string){
                return string.replace(/<b>/g, "").replace(/<\/b>/g, "");
            };

            this.oUserRecentsService.getRecentSearches().done(function (aRecentSearches) {
                
                for (var i = 0; i < aRecentSearches.length; i++) {
                    var aSearch = aRecentSearches[i];
                    if (aSearch && aSearch.oDataSource && aSearch.oDataSource.objectName) {
                        aSearch.oDataSource.objectName.label = removeBTags(aSearch.oDataSource.objectName.label);
                    }
                }


                aRecentSearches = aRecentSearches.filter(function(recentSearch) {
                    if (recentSearch && recentSearch.sTerm && recentSearch.sTerm !== "") return true;
                    else return false;
                });

                oModel.setProperty("/searches", aRecentSearches);
            });

            //Datasource suggestion query 
            // self.sina = sap.ushell.Container.getService("Search").getSina();
            // var system = self.sina.sinaSystem();
            // var systemId = "";
            // var serverInfoDeferred = system.getServerInfo();
            // serverInfoDeferred.done(function(){
            //     if (system && system.properties && system.properties.rawServerInfo && system.properties.rawServerInfo.ServerInfo)
            //         systemId = system.properties.rawServerInfo.ServerInfo.SystemId;
                
            //     var sapclient = system.properties.rawServerInfo.ServerInfo.Client;
            //     self.searchConnector = systemId+sapclient+"~ESH_CONNECTOR~";
            //     self.dsSuggestionQuery = self.sina.createSuggestionQuery();
                
            //     self.dsSuggestionQuery.dataSource({
            //         objectName: {label: "", value : self.searchConnector,},
            //         packageName: {label: "", value: ""},
            //         schemaName: {label: "", value: ""},
            //         type: {label: "", value: ""}
            //     });
            // });


            // var dsSearchResponse = function(searchResults){

            //     var dataSources = [];
            //     for (var i = 0; i < searchResults.length; i++) {
            //         var searchItem = searchResults[i];

            //         if (searchItem.DESCRIPTION && searchItem.DESCRIPTION.value && searchItem.OBJECT_NAME && searchItem.OBJECT_NAME.value) {

            //             var ds ={
            //                 objectName: {label: searchItem.DESCRIPTION.value, value : searchItem.OBJECT_NAME.value,},
            //                 packageName: {label: "", value: ""},
            //                 schemaName: {label: "", value: ""},
            //                 type: {label: "", value: ""}
            //             };
            //             dataSources.push(ds);
            //         }
            //     }

            //     oModel.setProperty("/dataSources", dataSources);
            //     self.getView().dsRequestFinished();

            // };

            // self.getView().getModel("searchModel").getDataSourceSuggestions("*", dsSearchResponse, function(){
            //     oModel.setProperty("/dataSources", []);
            //     self.getView().dsRequestFinished();
            // });


            $.when(this.oUserRecentsService.getRecentDataSources()).done(function (aRecentDataSources) {

                if (!aRecentDataSources) aRecentDataSources = [];

                for (var i = 0; i < aRecentDataSources.length; i++) {
                    var aDS = aRecentDataSources[i];
                    if (aDS && aDS.objectName) {
                        aDS.objectName.label = removeBTags(aDS.objectName.label);
                    }
                }

                var containsDataSource = function(ds){
                    for (var i = 0; i < aRecentDataSources.length; i++) {
                        var recentDs = aRecentDataSources[i];
                        if (recentDs.objectName.value === ds.objectName.value ) return true;
                    }
                    return false;
                };

                if (aRecentDataSources.length >= 6) {
                    aRecentDataSources.length = 6;
                }else{
                    aRecentDataSources.sort(function(a, b){
                        var labela = a.label || a.objectName.label;
                        var labelb = b.label || b.objectName.label;

                        if(labela < labelb) return -1;
                        if(labela  > labelb) return 1;
                        return 0;
                    });
                }

                oModel.setProperty("/dataSources", aRecentDataSources);
                self.getView().dsRequestFinished();

            });

            // If less than 6 recent datasources, call server to fill ds up
            // $.when(this.oUserRecentsService.getRecentDataSources(),serverInfoDeferred).done(function (aRecentDataSources) {

            //     if (!aRecentDataSources) aRecentDataSources = [];

            //     var containsDataSource = function(ds){
            //         for (var i = 0; i < aRecentDataSources.length; i++) {
            //             var recentDs = aRecentDataSources[i];
            //             if (recentDs.objectName.value === ds.objectName.value ) return true;
            //         }
            //         return false;
            //     };

            //     if (aRecentDataSources.length < 6) {
                    
            //         self.dsSuggestionQuery.setSuggestionTerm("*");
            //         self.dsSuggestionQuery.getResultSet(jQuery.proxy(function (resultset) {
            //             var suggestions = resultset.getElements();
                        
            //                 for (var i = 0; i < suggestions.length; i++) {
            //                     var suggestion = suggestions[i];

            //                     if (suggestion.dataSource.objectName.value !== self.searchConnector) continue;
                                
            //                     var ds ={
            //                         objectName: {label: suggestion.label, value : suggestion.labelRaw,},
            //                         packageName: {label: "", value: ""},
            //                         schemaName: {label: "", value: ""},
            //                         type: {label: "", value: ""}
            //                     };

            //                     if (aRecentDataSources.length < 6 && !containsDataSource(ds) && ds.objectName.label && ds.objectName.value) {
            //                         aRecentDataSources.push(ds);
            //                     }

            //                 }
            //                 oModel.setProperty("/dataSources", aRecentDataSources);
            //                 self.getView().dsRequestFinished();
                            
            //         }, this), 
            //         function(){
            //             oModel.setProperty("/dataSources", aRecentDataSources);
            //             self.getView().dsRequestFinished();
            //         });

            //     }else{
            //         oModel.setProperty("/dataSources", aRecentDataSources);
            //         self.getView().dsRequestFinished();

            //     }

            // });


        },

        // wanted behavior: a search is only saved when you navigate away from the search screen
        //      therefore the term is saved (newSearchInvoked()), the category is updated (newSearchCategory())
        //      when the curtain is closing or an app will be opened, it will be saved (saveSearch())
        newSearchInvoked: function (sChannelId, sEventId, oData) {
            var self = this;
            if (oData.dataSource) {
                this.oCurrentSearch = {sTerm: oData.searchTerm, oDataSource: oData.dataSource};
            } else {
                this.oCurrentSearch = {
                    sTerm: oData.searchTerm,
                    oDataSource: this.getView().getModel("search").getDataSource()
                };
            }
        },

        newSearchCategory: function (sChannelId, sEventId, oData) {
            if (this.oCurrentSearch) {
                this.oCurrentSearch.oObjectName = oData;
            }
        },

        saveSearch: function (sChannelId, sEventId, oData) {
            if (this.oCurrentSearch) {
                var searchModel = this.getView().getModel("searchModel");
                //Save search only when results
                if (searchModel && searchModel.perspective && searchModel.perspective.getSearchResultSet && searchModel.perspective.getSearchResultSet().totalcount > 0) {
                    this.oUserRecentsService.noticeSearch(this.oCurrentSearch);
                    this.oCurrentSearch = null;
                }
                
            }
        },

        searchAgain: function (oData) {

            
            
            // sap.ui.getCore().getEventBus().publish("externalSearch", {searchTerm: oData.sTerm, dataSource: oData.oDataSource});
        },

//         searchAgain: function (oEvent) {
//             var oSource = oEvent.getSource(),
//                 sSearchTerm = oSource.data("sSearchTerm"),
//                 oDataSource = oSource.data("oDataSource");
// //                sObjectNameLabel = oSource.data("sObjectNameLabel"),
// //                sObjectNameValue = oSource.data("sObjectNameValue"),
// //                oObjectName = {label: sObjectNameLabel, value: sObjectNameValue};
// //            if (sObjectNameValue) {
// //                sap.ui.getCore().getEventBus().publish("externalSearch", {searchTerm: sSearchTerm, objectName: oObjectName});
// //            } else {
// //                sap.ui.getCore().getEventBus().publish("externalSearch", {searchTerm: sSearchTerm});
// //            }
//             sap.ui.getCore().getEventBus().publish("externalSearch", {searchTerm: sSearchTerm, dataSource: oDataSource});
//         },

        appOpened: function (sChannelId, sEventId, oData) {
            var that = this,
                oNewApp = {},
                aRecentAppModels;
            this.saveSearch(sChannelId, sEventId, oData);

            if (!oData.semanticObject || !oData.action || !oData.oMetadata || !oData.oMetadata.title || oData.oMetadata.libraryName === "factSheet") {
                return;
            }

            oNewApp.semanticObject = oData.semanticObject;
            oNewApp.action = oData.action;
            oNewApp.sTargetHash = oData.sShellHash;
            oNewApp.title = oData.oMetadata.title;
            oNewApp.icon = oData.oMetadata.icon;
            oNewApp.url = oData.sShellHash + (oData.sAppPart || "");

            this.oUserRecentsService.noticeApp(oNewApp);
        }
    });
}());
