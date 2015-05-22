// // Copyright (c) 2013 SAP AG, All Rights Reserved

// (function () {
//     "use strict";
//     /*global jQuery, sap, console */

//     /**
//      * @name "sap.ushell.renderers.fiori2.SearchFilter
//      * @extends sap.ui.core.mvc.Controller
//      * @public
//      */
//     sap.ui.controller("sap.ushell.renderers.fiori2.search.SearchFilter", {

//         /**
//          * SAPUI5 lifecycle hook.
//          * @public
//          */
//         onInit: function () {
//             var self = this;
//             if(self.getView().getModel()){
//                 var facets = self.getView().getModel().getFacets();
//                 var dataSources = facets.filter(function(element){
//                     return element.facetType === "datasource";
//                 });
//                 if(dataSources.length>0){
//                     dataSources = dataSources[0];
//                 }
                
//             }

//         },


//         selectCategory : function(event,category){
//             sap.ushell.Container.getService("Search").setDataSource(category.dataSource, this.getView().getModel('SearchFilter'));
//             sap.ui.getCore().getEventBus().publish("selectCategory", category.dataSource);
//         },


//         buildCategoryTreeForSuggestion: function (sChannelId, sEventId, oData) {
//             var self = this;
//             self.getView().getModel("SearchFilter").setProperty("/currentState/showCurtainPane", false);
//             if(oData.categorySuggested){
//                 sap.ushell.Container.getService("Search").setSearchCategoryTree(oData);
//             }
//         },

//         buildCategoryTreeForNoSearchTerm: function(sChannelId, sEventId, oData){
//             var self = this;
//                 if(oData.searchTerm === ""){
//                     sap.ushell.Container.getService("Search").setQueryForAll(this.getView().getModel('SearchFilter'), false);
//                 } else {
//                     sap.ushell.Container.getService("Search").setSearchTermWithoutQuery(oData.searchTerm);
//                 };
//         },

// //        buildCategoryTreeForCloseCurtain: function(){
// //            sap.ushell.Container.getService("Search").setQueryForAll(this.getView().getModel('SearchFilter'), true);
// //        }



//     });
// }());
