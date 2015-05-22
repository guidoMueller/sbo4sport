//Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
    "use strict";
    /*global jQuery, sap, setTimeout */

    jQuery.sap.require("sap.ushell.ui.launchpad.SearchSuggestionList");
    jQuery.sap.require("sap.ushell.ui.launchpad.SearchSuggestionListItem");
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchSuggestionControls");

    sap.ui.jsview("sap.ushell.renderers.fiori2.search.SearchSuggestions", {
        createContent: function (oController) {
            var self = this;
            var dataSourceSection = new sapUshellSuggestSection();
            var suggestSection = new sapUshellSuggestSection();
            var appSection = new sapUshellSuggestSection();

            self.suggestList =  new sapUshellSuggestionList({
                sections : [dataSourceSection, suggestSection, appSection]
            });
            self.suggestList.addStyleClass('sapUshellSearchSuggestionList');

            var sfId = "sfOverlay";
            if (self.getViewData().sf!==undefined) 
            	sfId = self.getViewData().sf;
            sap.ui.getCore().byId(sfId).addEventDelegate({
                onsapdown: function (oEvent) {
                    // if (self.suggestList.getItems().length > 0) {
                        // self.suggestList.setDisableKeyboardNavigation(false);
                        self.suggestList.focus();

                        oEvent.preventDefault();
                        oEvent.stopPropagation();
                    // }
                },
                onsapescape: function (oEvent) {
                    oController.closeSuggestions();

                    oEvent.preventDefault();
                    oEvent.stopPropagation();
                }
            });

            var buildHeader = function(){
                return new sap.m.GroupHeaderListItem ({
                    title : "{title}"
                }).addStyleClass ('sapUshellSuggestHeader');
            };

            var buildFooter = function(){
                return new sap.m.CustomListItem({
                    type:sap.m.ListType.Inactive,
                    content: [new sap.m.Label({text: "{text}"}).addStyleClass ('sapUshellSuggestEnter')]
                });
            };

            var onEnter = function(item, callback){

                var oldAfterRendering = item.onAfterRendering;

                item.onAfterRendering = function(){
                    if (oldAfterRendering) oldAfterRendering.apply(this, arguments);
                    var domref = $(this.getDomRef());
                    domref.keypress(function(e) {
                        if (e.which === 13) {
                            callback();
                        }
                    });
                };
                
            };

            var onClick = function(item, callback){

                item.addEventDelegate({
                    onclick: function (oEvent) {
                        callback(oEvent);
                        oEvent.stopImmediatePropagation();
                        oEvent.stopPropagation();
                    },
                    ontouch: function (oEvent) {
                        callback(oEvent);
                        oEvent.stopImmediatePropagation();
                        oEvent.stopPropagation();
                    }
                });

                
            };
            
            var newSearch = function(searchterm, datasource){
                if (searchterm) 
                    self.getModel().setSearchTerm(searchterm, false);
                    
                if (datasource)
                    self.getModel().setDataSource(datasource, false);

//                self.getModel()._searchFireQuery();
                window.location.href = "#Action-search&/searchTerm=" + encodeURI(self.getModel().getProperty("/searchBoxTerm")) + "&dataSource=" + encodeURI(JSON.stringify(self.getModel().getDataSourceJson()));
                if (self.viewSwitcher) 
                	self.viewSwitcher.switchViewState("searchResults");
            };

            var getNewDS = function(objectName, objectNameLabel){
                return {
                    objectName: {
                        value: objectName,
                        label: objectNameLabel
                    }, 
                    packageName: { label: "", value: "" },
                    schemaName: { label: "", value: "" }
                };
            };

            var dataSourceSelected = function(datasource){
                self.getModel().setDataSource(datasource, false);
                self.getModel().setProperty("/searchBoxTerm", "");
                self.getModel().doSuggestion();
            };

            dataSourceSection.bindAggregation("items", "/dataSourceSection", function (path, bData) {
                if(bData.getObject().isTitle)
                    return buildHeader();
                 

                var suggestDSSelected = function(){
                    var ds = getNewDS(bData.getObject().labelRaw, bData.getObject().label);
                    // dataSourceSelected(ds);
                    self.getModel().setDataSource(ds, false);
                    self.getModel().setProperty("/searchBoxTerm", "");

                    self.searchfield.focus();
                };
                var listItem =  new sap.m.CustomListItem({
                    type:sap.m.ListType.Active,
                    content: [
                        new sap.ushell.renderers.fiori2.search.DataSourcePill({
                            dataSourceName: "{dataSourceLabel}",
                            press: function(){
                                suggestDSSelected();
                            }
                        }).addStyleClass ('sapUshellSuggestDataSource').addStyleClass('sapUshellSearchSuggestionNavItem')
                    ],
                    press: function(){
                        suggestDSSelected();
                    }
                }).addStyleClass ('sapUshellSuggestListItem');

                onEnter(listItem, function(){
                    suggestDSSelected();
                });

                return listItem;
            });



            suggestSection.bindAggregation("items", "/suggestSection", function (path, bData) {
                if(bData.getObject().isTitle)
                    return buildHeader();

                if(bData.getObject().isFooter)
                    return buildFooter();
                
                var left = new sap.m.Link({text: "{label}"
                }).addStyleClass ('sapUshellSuggestText').addStyleClass('sapUshellSearchSuggestionNavItem');

//                left.onAfterRendering = function(){
//                    self.bTagUnescaper(this.getDomRef());
//                };
                
                left.addEventDelegate({                	                	
                	onAfterRendering: function(){
                        self.bTagUnescaper(this.getDomRef());                		
                	}
                }, left);

                onClick(left, function(){
                    newSearch(bData.getObject().labelRaw);
                    // event.stopPropagation();
                });


                var dataSource = new sap.ushell.renderers.fiori2.search.DataSourcePill({
                    dataSourceName: "{dataSourceLabel}"
                }).addStyleClass ('sapUshellSuggestDataSourceRight').addStyleClass ('sapUshellSuggestDataSource').addStyleClass('sapUshellSearchSuggestionNavItem');

                var content = [left];
                if (bData.getObject().dataSourceLabel)
                    content.push(dataSource);

                var listItem =  new sap.m.CustomListItem({
                    type:sap.m.ListType.Active,
                    content: content
                }).addStyleClass ('sapUshellSuggestListItem');

                onClick(listItem, function(){
                    newSearch(bData.getObject().labelRaw, bData.getObject().dataSource);
                });

                onEnter(left, function(){
                    newSearch(bData.getObject().labelRaw);
                });
                onEnter(dataSource, function(){
                    // dataSourceSelected(bData.getObject().dataSource);
                    newSearch(bData.getObject().labelRaw, bData.getObject().dataSource);
                });

                return listItem;

            });

            appSection.bindAggregation("items", "/appSection", function (path, bData) {
                if(bData.getObject().isTitle){
                    return buildHeader();
                }
                // var listItem = new sap.m.DisplayListItem ({
                //     type:sap.m.ListType.Active,
                //     label: "{label}",
                //     press: function(){
                //         window.location = bData.getObject().targetURL;
                //     }
                // });

                var appSelected = function(){
                    if (bData.getObject().targetURL) {
                        window.location = bData.getObject().targetURL;
                    }else{

                        jQuery.sap.require("sap.ca.ui.message.message");
                        sap.ca.ui.message.showMessageBox({
                            type: sap.ca.ui.message.Type.ERROR,
                            message: sap.ushell.resources.i18n.getText("noappurl"),
                            details: ""
                        });

                    }
                };

                var label = new sap.m.Link({
                    text: "{label}",
                    press: appSelected
                }).addStyleClass ('sapUshellSuggestText').addStyleClass('sapUshellSearchSuggestionNavItem');

                var icon = new sap.ui.core.Icon ({
                    src: bData.getObject().icon
                }).addStyleClass('sapUshellSuggestIcon');
                var listItem =  new sap.m.CustomListItem({
                    type:sap.m.ListType.Active,
                    content: [icon,label],
                    press: appSelected
                }).addStyleClass ('sapUshellSuggestListItem');

//                label.onAfterRendering = function(){
//                    self.bTagUnescaper(this.getDomRef());
//                };

                label.addEventDelegate({                	                	
                	onAfterRendering: function(){
                        self.bTagUnescaper(this.getDomRef());                		
                	}
                }, label);
                
                onEnter(listItem, appSelected);

                return listItem;

            });


            return self.suggestList;

        },

        bTagUnescaper: function (domref) {
            var innerhtml = domref.innerHTML;
            while( innerhtml.indexOf('&lt;b&gt;')+innerhtml.indexOf('&lt;/b&gt;') >= -1  ){ // while these tags are found
                innerhtml = innerhtml.replace('&lt;b&gt;', '<b>');
                innerhtml = innerhtml.replace('&lt;/b&gt;', '</b>');
            }
            
            domref.innerHTML = innerhtml;
            
        },


        focusSearchfield: function (oEvent) {
            sap.ui.getCore().byId("sfOverlay").focus();
        },

        onAfterRendering: function () {
            // if (!this.getModel("suggestions").getProperty("/visible")) {
            //     this.hideSuggestions();
            // }
        },

        hideSuggestions: function () {
            //this.$().slideUp(200);
        },

        showSuggestions: function () {
            this.$().slideDown(200);
            if (this.getParent() && this.getParent().scrollTo) {
                this.getParent().scrollTo(0);
            } else {
                this.$().parent().scrollTop(0);
            }
        },

        getControllerName: function () {
            return "sap.ushell.renderers.fiori2.search.SearchSuggestions";
        }
    });
}());
