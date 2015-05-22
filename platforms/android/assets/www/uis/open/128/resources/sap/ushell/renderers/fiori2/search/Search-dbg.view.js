// Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview
 *
 * @version
 */
(function (global) {
    "use strict";
    /* global jQuery, sap, console, SearchLayout, SearchResultListWithDetail,
    SearchResultListItem, SearchResultListItemFooter, SearchResultListItemDetail */

    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchResultListItem");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchResultListItemDetail");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchLayout");
    jQuery.sap.require("sap.ushell.ui.launchpad.SearchResultApps");
    jQuery.sap.require("sap.ushell.ui.launchpad.SearchResultAppItem");

    sap.ui.jsview("sap.ushell.renderers.fiori2.search.Search", {

        // create content
        // ===================================================================
        createContent: function(oController) {
            var self = this;

            var listProperties = {
                growing: true,
                threshold: 2,
                inset: false,
                showUnread: true,
                width: "auto",
                showNoData: false
            };
            
            sap.ui.getCore().getEventBus().subscribe("appSearchFinished", self.appSearchFinished, self);
            sap.ui.getCore().getEventBus().subscribe("searchFinished", self.onSearchFinished, self);
            sap.ui.getCore().getEventBus().subscribe("searchStarted",  self.onAllSearchStarted, self);
            sap.ui.getCore().getEventBus().subscribe("allSearchFinished",  self.onAllSearchFinished, self);


            self.resultList = new sap.m.List(listProperties);
            self.resultList.setGrowingThreshold(2000);
            self.resultList.bindAggregation("items", "/results", function (path, bData) {
                return self.assembleListItem(bData);
            });

            self.appSearchResult = self.assembleAppSearch();

            self.resultListWithDetail = new SearchResultListWithDetail({
                resultList: self.resultList
            });
            
            if (sap.ui.getCore().getModel("searchModel").isNormalSearchEnable()){
                self.showBottomList = true;
            }
            else {
            	self.showBottomList = false;
            }

            // self.facets = self.assembleFacets();

            self.searchLayout = new SearchLayout({
                showMainHeader:true,
                searchTerm: sap.ushell.resources.i18n.getText(""),
                topHeader: '{i18n>apps}',
                topList: self.appSearchResult,
                bottomHeader: sap.ushell.resources.i18n.getText("business_objects"),
                bottomHeaderIsUnspecific: true,
                bottomList: self.resultListWithDetail,
                facets: self.facets,
                searchBusy: false,
                showBottomList: self.showBottomList
            });
            
            self.searchContainer = new sap.search.DivContainer({
                content: self.searchLayout,
                cssClass : 'searchContainer'
            });

            return self.searchContainer;

        },

        // app search area
        // ===================================================================
        assembleAppSearch: function(){
            var self = this;
            var oTilesContainer = new sap.ushell.ui.launchpad.SearchResultApps({
                showNoData: false,
                growing: true,
                growingThreshold: 2,
                growingTriggerText: {path: "i18n>showMore"},
                results: {
                    path : "/tiles",
                    template : new sap.ushell.ui.launchpad.SearchResultAppItem({
                        icon: "{icon}",
                        text: "{title}",
                        targetUrl: "{url}"
                    })
                }
            });
            // oTilesContainer.addStyleClass("appSearchContent");
            this.oTilesContainer = oTilesContainer;



            var appSearchResult = new sap.search.DivContainer({
                content: [oTilesContainer],
                cssClass : 'appSearchResults'
            });
            // appSearchResult.addStyleClass('appSearchResults');

            // var oOpenCatalogLink = new sap.m.Link({
            //     text: "{i18n>open_catalog}",
            //     press: function () {
            //         sap.ui.getCore().getEventBus().publish("openCatalog", {
            //             groupContext: null
            //         });
            //     }
            // });

            // appSearchResult.addItem(oOpenCatalogLink);
            // oOpenCatalogLink.addStyleClass("catalogLink");

            return appSearchResult;
            //**************************************************** APP SEARCH END

        },

        _assembleDataSourceFacetList : function(){
            var self = this;

            var createFacetFilterItem = function(){
                var item = new sap.m.FacetFilterItem({
                            text: "{text}",
                            key: "{id}",
                            count: "{count}",
                            selected: "{selected}"
                            });
                item.data("dataSource","{dataSource}");
                return item;
            };

            var oJsonModel = new sap.ui.model.json.JSONModel({
                values : self.getModel().getDataSources()
            });

            var dataSourceList = new sap.m.FacetFilterList( {
                    title: "All Categories",
                    multiSelect: false,
                    allCount: self.getModel().getProperty("/count"),
                    items: {
                        path: "/values",
                        template: createFacetFilterItem()
                    },  
                    listClose: function(){
                        if(this.getSelectedItems()&&this.getSelectedItems().length>0){
                            var newDS = this.getSelectedItems()[0].data("dataSource");
                            self.getModel().setDataSource(newDS);
                            self.getModel().resetAttributeFacets(false);
                            self.getModel().resetFilterConditions();
                        }
                    }
            });
            dataSourceList.setModel(oJsonModel);
            return dataSourceList;
        },

        _assembleAttributeFacetList : function(facet){
            var self = this;

            var createFacetFilterItem = function(){
                var item = new sap.m.FacetFilterItem({
                            text: "{text}",
                            count: "{count}",
                            selected: "{selected}"
                            });
                item.data("filterCondition","{filterCondition}");
                return item;
            };

            var oJsonModel = new sap.ui.model.json.JSONModel({
                values : facet.items
            });

            var attributeFacetList = new sap.m.FacetFilterList( {
                    title: facet.title,
                    multiSelect: true,
                    allCount: facet.allCount,
                    items: {
                        path: "/values",
                        template: createFacetFilterItem()
                    },  
                    listClose: function(){
                        if(this.getSelectedItems()){
                            for (var i = 0, len = this.getSelectedItems().length; i < len; i++) {
                                var item = this.getSelectedItems()[i].data("filterCondition");
                                if(item.attribute&&item.operator&&item.value){
                                    self.getModel().addFilterCondition(item.attribute,item.operator,item.value,false);
                                }
                                else if(item.conditions){
                                    self.getModel().addFilterConditionGroup(item,false);       
                                }
                            }
                            // self.getModel().getProperty("/facets/attributes").push(this.data("facet"));
                            self.getModel()._searchFireQuery();
                        }
                    }
            });
            attributeFacetList.data("facet",facet);
            attributeFacetList.setModel(oJsonModel);
            return attributeFacetList;
        },

        // assemble facets
        // ===================================================================
        assembleFacets : function(){
            var self = this;
            if(self.getModel()){

                var dataSourceList = self._assembleDataSourceFacetList();
                var lists = [dataSourceList];
                for (var i = 0, len = self.getModel().getProperty("/facets/attributes").length; i < len; i++) {
                    var facet = self.getModel().getProperty("/facets/attributes")[i];
                    var list = self._assembleAttributeFacetList(facet);
                    lists.push(list);
                }
                var searchFilter = new sap.m.FacetFilter({
                    lists : lists,
                    reset : function(){
                        self.getModel().resetAttributeFacets(false);
                        self.getModel().resetFilterConditions(false);
                        self.getModel().resetDataSources(false);
                        self.getModel().resetDataSource();
                    } 
                });
                if(self.searchLayout){
                    self.searchLayout.setFacets(searchFilter);
                }
                return searchFilter;
            }
            
        },


        // assemble title item
        // ===================================================================
        assembleTitleItem: function (oData) {
            var item = new sap.m.CustomListItem();
            var title = new sap.m.Label({
                text: "{title}"
            });
            title.addStyleClass('bucketTitle');
            item.addStyleClass('bucketTitleContainer');
            item.addContent(new sap.m.HBox({
                items: [title]
            }));
            return item;
        },

        // assemble footer item
        // ===================================================================
        assembleFooterItem: function (oData) {
            var self = this;

            self.footerItem = new SearchResultListItemFooter({
                text : "{i18n>showMore}",
                showMore: function(){
                    var newSkip = self.getModel().getSkip()+10;
                    self.getModel().setSkip(newSkip);
                }
            });
            return self.footerItem;
        },

        // assemble result list item
        // ===================================================================
        assembleResultListItem: function(oData, path){
            var self = this;
            var item = new SearchResultListItem({
                title: "{$$Name$$}",
                titleUrl: "{uri}",
                type: "{dataSourceName}",
                imageUrl: "{imageUrl}",
                data: oData,
                visibleAttributes: 3,
                navigate: function(){
                    // alert("navigate event received from control");
                },
                previewOpen: function(){
                    self.selectItem(item, oData, path);
                    // self.searchLayout.setRightPaneStatus('preview');
                },
                previewClose: function(){
                    // self.hideDetail(this);
                    // self.showApps();
                    // self.selectedPath = null;

                    // if(this.selectedItem){
                    //     this.selectedItem.setStatus("closed");
                    // }
                }
            });
            
            
            // allow <b> in title and attributes
            item.addEventDelegate({                	                	
            	onAfterRendering: function(){
//            		var self = this;
            		$(this.getDomRef()).find(".searchResultListItem-main").bind('click', this.fireNavigate(this.getTitleUrl()));
            		this.setSafeText(
            				$(this.getDomRef()).find(".searchResultListItem-title, .searchResultListItem-attribute-value, .searchResultListItem-type"));                		
            	}
            }, item);

            if (self.selectedPath === path) // Saved path
            {
                // item.setStatus("open");
                // self.selectedItem = item;
                self.selectItem(item, oData, path);
            }

            return item;
        },


        selectItem: function(item, oData, path){
            var self = this;
            if (item === self.selectedItem)
            {
                return;
            }
            self.selectedPath = path;
            self.getModel().setProperty("/detail/title", oData ? oData.$$Name$$ : undefined);
            self.getModel().setProperty("/detail/titleUrl", oData ? oData.uri : undefined);
            self.getModel().setProperty("/detail/type", oData ? oData.dataSourceName : undefined);
            self.getModel().setProperty("/detail/data", oData);
            self.resultListWithDetail.setPreview(self.assembleDetail());
            if (item){
                item.setStatus("open");
            }

            if(self.selectedItem){
                self.selectedItem.setStatus("closed");
            }
            self.selectedItem = item;

        },

        assembleDetail: function(){
            var self = this;
            var detail = new SearchResultListItemDetail({
                headerLabel: "{i18n>more_information_on}",
                itemTitle: {path: "/detail/title"},
                itemTitleUrl: "{/detail/titleUrl}",
                itemType: "{/detail/type}",
                itemData: "{/detail/data}",
                firstDetailAttribute: 4,
                maxDetailAttributes: 8
            });
     
            // allow <b> in title and attributes
            detail.addEventDelegate({                	                	
            	onAfterRendering: function(){
//            		var self = this;
            		//$(this.getDomRef()).find(".searchResultListItem-main").bind('click', this.fireNavigate(this.getTitleUrl()));
            		this.setSafeText(
            				$(this.getDomRef()).find(".searchResultListItemDetail-title, .searchResultListItemDetail-attribute-value"));                		
            	}
            }, detail);
            
            return detail;
        },

//        _setSafeText: function(objs) {
//            objs.each(function(i,d) {
//                var $d = $(d);
//                var s = $d.text().replace(/<b>/gi, '').replace(/<\/b>/gi, '');  /// Only those two HTML tags are allowed.
//                if (s.indexOf('<') === -1) {
//                    $d.html($d.text());
//                }
//                //emphasize whyfound in case of ellipsis
//                var posOfWhyfound = $d.html().indexOf("<b>");
//                if (posOfWhyfound>-1 && d.offsetWidth < d.scrollWidth) {
//                    var emphasizeWhyfound = "..." + $d.html().substring(posOfWhyfound);
//                    $d.html(emphasizeWhyfound);                    
//                }
//            });
//        },
        
        // assemble list item
        // ===================================================================
        assembleListItem: function (bData) {
            var self = this;
            var oData = bData.getObject();
            if (oData.type === 'title') {
                return self.assembleTitleItem(oData);
            } else if (oData.type === 'footer') {
                return self.assembleFooterItem(oData);
            } else {
                return self.assembleResultListItem(oData, bData.getPath());
            }
        },

        onAllSearchStarted: function (){
            var self = this;
            if(self.getModel().getProperty("/isResultAppended")){
                self.footerItem.setShowSpinner(true);
                return;
            }

            this.searchLayout.setEnableNoResults(false);

//            self.resultList.setBusy(true);
//            if (self.viewSwitcher) {
//            	self.viewSwitcher.switchViewState("searchResults");
//            }
            self.searchLayout.setSearchBusy(true);
            
            //self.searchLayout.setBottomCount(0);
            if(self.selectedItem){
                self.selectedItem.setStatus("closed");
                if(self.resultListWithDetail.getPreview()){
                    self.resultListWithDetail.getPreview().destroy();
                }
            }
            this.selectedPath = null;
            this.oTilesContainer.resetGrowing();

            self.searchLayout.setBottomList(self.resultListWithDetail);


        },

        onAllSearchFinished: function () {
        	
        	this.searchLayout.setSearchTerm(this.getModel().getSearchTerm());
            this.searchLayout.setEnableNoResults(true);
            this.searchLayout.setSearchBusy(false);
            
        },

        onSearchFinished: function () {
            var self = this;
            var oSearchModel = this.getModel();
            if(self.getModel().getProperty("/isResultAppended")){
                self.footerItem.setShowSpinner(false);
                return;
            }
            // self.facets = self.assembleFacets();

            self.searchLayout.setSearchTerm(self.getModel().getSearchTerm());
            self.searchLayout.setBottomCount(self.getModel().getProperty("/count"));

            var dataSource = oSearchModel.getDataSource();
            var bottomLabel = this.getModel().getProperty('/dataSourceName');
            // if (dataSource)
            // {
            //     bottomLabel = dataSource.label;
            // }else{
            //     bottomLabel = sap.ushell.resources.i18n.getText("others");
            // }

            // self.searchLayout.setBottomHeader( || 'Others');

            if (!dataSource || dataSource.objectName.value.toLowerCase() === '$$all$$' )
            {
                self.searchLayout.setBottomHeaderIsUnspecific(true);
                self.searchLayout.setBottomHeader(sap.ushell.resources.i18n.getText("business_objects") );
                // self.searchLayout.setBottomCount(result.resultset.getSearchResultSet().totalcount);
            }else{
                self.searchLayout.setBottomHeaderIsUnspecific(false);
                self.searchLayout.setBottomHeader(bottomLabel);
            }


            var items = self.resultList.getItems();
            
            // test for focus
//          var sf = sap.ui.getCore().byId("sfOverlay").getFocusDomRef();
//          var sr = sap.ui.getCore().byId("searchResultsView").getDomRef();
////          $(sf).find('input').change(function(){$(sr).hide();});
//          $(sf).find('input').change(alert('haha');});
//          $(sf).focusout(function(){$(sr).show();});
            
            if (self.getModel().getProperty("/count") !== 0 && !self.getModel().getProperty("/isResultAppended"))
            {
                self.searchLayout.setBottomList(self.resultListWithDetail);
                // items[0].setStatus("open");
                var path = '/results/0'; // First item
                self.selectItem(items[0], this.getModel().getProperty(path), path); // sets the detail
            }else{
                // self.resultListWithDetail.setPreview(undefined);
                // self.searchLayout.setBottomList(undefined);
            }

//            if (self.viewSwitcher) {
//            	self.viewSwitcher.switchViewState("searchResults");
//            }
            sap.ui.getCore().getEventBus().publish("closeCurtain");
            
        },

        onSearchFailed : function(){
            var self = this;
            if(self.getModel().getProperty("/isResultAppended")){
                self.footerItem.setShowSpinner(false);
                return;
            }
            
            self.searchLayout.setSearchBusy(false);

        },

        appSearchFinished : function (bla, blub, oResult) {
            var self = this;
            var searchTerm = self.getModel().getSearchTerm();
            // if (searchTerm) { // HIGHLIGHTING!!
            //     var tiles = self.oTilesContainer.getTiles();
            //     var baseTitleElem;
            //     var regexObj = new RegExp('(' + searchTerm.replace(/[^A-Za-z0-9;]/g, "") + ')', "gi");
            //     for (var k=0; k<tiles.length; k++) {
            //         baseTitleElem = $(tiles[k].getDomRef()).find('.sapUshellTileBaseTitle');
            //         if (baseTitleElem && baseTitleElem.html()) {
            //             baseTitleElem.html(baseTitleElem.html().replace(regexObj, '<b>$1</b>'));
            //         }
            //     }
            // }
            if (!oResult.totalResults || oResult.totalResults === 0)
            {
                self.appsFound = false;
                self.searchLayout.setTopCount(oResult.totalResults);
                self.searchLayout.setTopList(undefined);
            }else{
                self.appsFound = true;
                self.searchLayout.setTopCount(oResult.totalResults);
                self.searchLayout.setTopList(self.appSearchResult);
            }

        },

        // onResultItemsChanged: function(){
        //     var self = this;
        //     self.resultList.setBusy(false);
        // },

        // startLoading: function () {
        //     // this.searchLayout.addStyleClass('loading');
        // },

        // finishLoading: function () {
        //     // this.searchLayout.removeStyleClass('loading');
        // },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.search.Search";
        }

    });

    // =======================================================================
    // UI5 Helper Methods
    // =======================================================================

    sap.ui.core.Control.extend("sap.search.DivLayout", {
        metadata : {
            aggregations: {
                content: {singularName: "content", multiple:true } // default type is "sap.ui.core.Control", multiple is "true"
            }
        },

        renderer : function(oRm, oControl) {      // the part creating the HTML

            var aChildren = oControl.getContent();
            for (var i = 0; i < aChildren.length; i++) { // loop over all child Controls,
                                                       // render the colored box around them
                oRm.renderControl(aChildren[i]);   // render the child Controls
            }

        }
    });


    sap.ui.core.Control.extend("sap.search.DivContainer", {      // call the new Control type "my.Hello"
                                                  // and let it inherit from sap.ui.core.Control
        metadata : {                              // the Control API
            properties : {
                "cssClass" : "string"
            },
            aggregations: {
               "content": {singularName: "content", multiple:true } // default type is "sap.ui.core.Control", multiple is "true"
            },
        },

        renderer : function(oRm, oControl) {      // the part creating the HTML
            oRm.write('<div');
            oRm.writeControlData(oControl);  // writes the Control ID
            oRm.addClass(oControl.getCssClass());
            oRm.writeClasses();
            oRm.write('>');
            var aChildren = oControl.getContent();
            for (var i = 0; i < aChildren.length; i++) { // loop over all child Controls,
                oRm.renderControl(aChildren[i]);   // render the child Controls
            }
            oRm.write('</div>');
        }
    });


}(window));
