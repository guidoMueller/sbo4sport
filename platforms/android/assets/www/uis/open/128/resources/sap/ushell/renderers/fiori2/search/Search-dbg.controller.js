// Copyright (c) 2013 SAP AG, All Rights Reserved

(function () {
    "use strict";
    /*global jQuery, sap, console */

    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchModel");
    
    /**
     * @name "sap.ushell.renderers.fiori2.SearchController
     * @extends sap.ui.core.mvc.Controller
     * @public
     */
    sap.ui.controller("sap.ushell.renderers.fiori2.search.Search", {

        /**
         * SAPUI5 lifecycle hook.
         * @public
         */
        onInit: function () {
            var self = this;

            // var searchModel = new sap.ushell.renderers.fiori2.search.SearchModel();
            // searchModel.searchInit();
            // self.getView().setModel(searchModel);
            // searchModel.attachRequestSent(function(oControlEvent){
            //     self.getView().onSearchStarted();
            // });
            // searchModel.attachRequestFailed(function(oControlEvent){
            //     self.getView().onSearchFailed();
            // });
            // searchModel.attachRequestCompleted(function(oControlEvent){
            //     self.getView().onSearchFinished(oControlEvent);
            // });
            // sap.ui.getCore().getEventBus().subscribe("search", searchModel._searchInvoked, searchModel);
        },

        onExit: function () {
            var self = this;
            // sap.ui.getCore().getEventBus().unsubscribe("search", self.getView().getModel()._searchInvoked, self.getView().getModel());
            sap.ui.getCore().getEventBus().unsubscribe("appSearchFinished", self.getView().appSearchFinished, self.getView());
            sap.ui.getCore().getEventBus().unsubscribe("searchFinished", self.getView().onSearchFinished, self.getView());
            sap.ui.getCore().getEventBus().unsubscribe("searchStarted",  self.getView().onAllSearchStarted, self.getView());
            sap.ui.getCore().getEventBus().unsubscribe("allSearchFinished",  self.getView().onAllSearchFinished, self.getView());
        },


        
    });
}());
