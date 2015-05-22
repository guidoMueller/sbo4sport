//Copyright (c) 2013 SAP AG, All Rights Reserved
/**
 * @fileOverview
 *
 * @version
 */
(function (global) {
	"use strict";
	/* global jQuery, sap, console, SearchLayout, SearchResultListWithDetail,
    SearchResultListItem, SearchResultListItemFooter, SearchResultListItemDetail */

	sap.ui.jsview("sap.ushell.renderers.fiori2.search.container.App", {

		// create content
		// ===================================================================
		createContent: function() {
			var self = this;
			self.aDanglingControls = [];
			self.suggestionsEnabled = true;
			sap.ui.getCore().getEventBus().subscribe("search", function(){this.onSearch();}, this);
			sap.ui.getCore().getEventBus().subscribe("allSearchFinished", function(){this.onSearchFinished();}, this);

			/*
			 * Search Model
			 */
			var searchModel = sap.ui.getCore().getModel("searchModel");
			if (!searchModel) {
				searchModel = new sap.ushell.renderers.fiori2.search.SearchModel();
				searchModel.setSizeLimit(200);

				sap.ui.getCore().setModel(searchModel, "searchModel");
				searchModel.searchInit();
			}
			searchModel.setSkip(0, false);
			self.setModel(searchModel, "searchModel");
			self.setModel(sap.ushell.resources.i18nModel, "i18n");


			/*
			 * Search Select
			 */
			if (!self.oSearchSelect) {
				self.oSearchSelect = new sap.m.Select("containerSs", { 
					name : "SearchSelect",
					autoAdjustWidth : true,
					items : {
						path : "searchModel>/connectors",
						template: new sap.ui.core.Item({
							key: "{searchModel>labelRaw}",
							text: "{searchModel>label}"
						})
					}
				}).addStyleClass('sapUshellContainerSearchSelect');

				self.oSearchSelect.addEventDelegate({                	                	
					onAfterRendering: function(){
						self.oSearchSelect.setSelectedKey(searchModel.getProperty("/dataSourceLabelRaw"));
					}
				}, self.oSearchSelect);
			}
			self.oSearchSelect.attachChange(function (oEvent) {
				var selectedDS = self.oSearchSelect.getSelectedItem();
				var json = {};

				if(selectedDS.getKey() === "$$ALL$$"){
					json = searchModel.createAllDataSource();

				}else if(selectedDS.getKey() === "$$APP$$"){
					json = searchModel.createAppDataSource();

				}else{
					json = searchModel.sina.createDataSource({
						objectName : {label: selectedDS.getText(), value: selectedDS.getKey()},
						packageName : {label: "", value:""},
						schemaName : {label: "", value:""},
						label: ""
					});
				}

				//set input box placeholder
				if(selectedDS.getKey() !== "$$ALL$$"){
					self.oSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("searchIn") + ": " + selectedDS.getText());					
				}else{
					self.oSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("search"));										
				}

				//new feature: after change datasource trigger search
//				searchModel.setSearchTerm(self.oSearchInput.getValue());
//				searchModel.setDataSource(json, true);
				searchModel.setProperty("/dataSource", json);

				self.handleHash(searchModel);
				self.oSearchInput.destroySuggestionRows();
//				self.closeHeadSearchBox();

			}, this);


			/*
			 * Search Input
			 */
			if (!self.oSearchInput) {
				self.oSearchInput = new sap.m.Input("containerSi", { 
					name : "SearchInput",
					width: "50%",
//					placeholder : sap.ushell.resources.i18n.getText("search"),
					// value:  "{searchModel>/searchBoxTerm}",
					showValueStateMessage: false,
					showTableSuggestionValueHelp: false,
					showSuggestion: true,
					filterSuggests: true,
					suggestionColumns: [new sap.m.Column({})],
					liveChange: function(oEvent){
						self.inputLiveChange(oEvent);
					},
					suggest: function(oEvent){
						self.handleSuggest(oEvent);
					},
					suggestionItemSelected: function(oEvent){
						if(self.changeTimer){
							window.clearTimeout(self.changeTimer);
							self.changeTimer = null;
						}
						self.selectSuggest(oEvent);
					}, 
					change: function(oEvent) {
						//workaround because suggestionItemSelected event will fire soon and
						//we must avoid to fire 2 searches. Just using suggestionItemSelected
						//does also not work since we cannot get the selected row from this event.
						self.changeTimer = window.setTimeout(function(){
							var searchModel = self.getModel("searchModel");	
							self.handleHash(searchModel);
							self.oSearchInput.destroySuggestionRows();
							self.changeTimer = null;
						},100);
					}
				})
				.addStyleClass('sapUshellContainerSearchInput')
				.setFilterFunction(function(){
					return self.suggestionsEnabled;
				});




				self.oSearchInput.addEventDelegate({                	                	
					onAfterRendering: function(){
						//set input box placeholder
						var selectedDS = self.oSearchSelect.getSelectedItem();
						if (selectedDS) {
							if(selectedDS.getKey() !== "$$ALL$$"){
								self.oSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("searchIn") + ": " + selectedDS.getText());					
							}else{
								self.oSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("search"));										
							}
						}
					}
				}, self.oSearchInput);
			}

			self.oSearchInput.bindAggregation("suggestionRows", "searchModel>/mixedSection", function (path, bData) {
				var label = new sap.m.Label({
					text: "{searchModel>mixedLabel}"
				}).addStyleClass ('sapUshellSuggestText').addStyleClass('sapUshellSearchSuggestionNavItem');
				label.addEventDelegate({                	                	
					onAfterRendering: function(){
						self.bTagUnescaper(this.getDomRef());                			
					}
				}, label);
				label.data("labelRaw", "{searchModel>labelRaw}");
				label.data("targetURL", "{searchModel>targetURL}");
				label.data("dataSource", "{searchModel>dataSource}");
                label.data("suggestType", "{searchModel>suggestType}");
				var icon = new sap.ui.core.Icon ({
					src: "{searchModel>icon}"
				}).addStyleClass('sapUshellSuggestIcon');
				var app = new sap.m.Label({
					text: {
						path: "searchModel>icon",
						formatter: function(sValue) {
							if (sValue) {
								return "<i>"+sap.ushell.resources.i18n.getText("label_app")+"</i>";
							}
							return "";
						}
					}
				}).addStyleClass ('sapUshellSuggestText').addStyleClass('sapUshellSearchSuggestionNavItem');
				app.addEventDelegate({                	                	
					onAfterRendering: function(){
						self.bTagUnescaper(this.getDomRef());                			
					}
				}, app);
				var cell =  new sap.m.CustomListItem({
					type:sap.m.ListType.Active,
					content: [app,icon,label]
				});
				cell.getText = function(){
					return label.data("labelRaw");
				};
				if (!self.oSearchInput.getValue())
					return null;
				return new sap.m.ColumnListItem({
					cells: [cell],
					type: "Active"
				});
			});
			self.oSearchInput.addEventDelegate({
//				onkeyup : function(oEvent) {
//				if(oEvent.keyCode == 13){
//				self.handleHash(searchModel);
//				self.oSearchInput.destroySuggestionRows();
//				//		    			self.closeHeadSearchBox();
//				}
//				},
				onfocusin : function(oEvent) {
					self.closeHeadSearchBox();
				}
			}, self.oSearchInput);


			/*
			 * Search Button
			 */
			if (!self.oSearchBtn) {
				self.oSearchBtn = new sap.m.Button("containerSb", { 
					name : "SearchBtn",
					icon: sap.ui.core.IconPool.getIconURI("search"),
					press: function (event) {
						self.handleHash(searchModel);
						self.oSearchInput.destroySuggestionRows();
//						self.closeHeadSearchBox();
					}
				});
			}


			/*
			 * Search Result
			 */
			self.oSearchResults = sap.ui.getCore().byId("searchContainerResultsView");
			if (!self.oSearchResults) {
				self.oSearchResults = sap.ui.view({
					id : "searchContainerResultsView",
					tooltip: "{i18n>searchResultsView_tooltip}",
					viewName : "sap.ushell.renderers.fiori2.search.Search",
					type : sap.ui.core.mvc.ViewType.JS
				});
			}
			self.oSearchResults.viewSwitcher = self.getController();
			self.aDanglingControls.push(self.oSearchResults);


			self.oSearchResults.setModel(searchModel);

//			self.oSubContainer = self.containerFactory("searchSubContainer", []);
//			self.oSubContainer = self.containerFactory("searchSubContainer", [self.getDataSourceBadge(searchModel)]);
//			self.oPage = self.pageFactory("searchPage", [self.oSearchSelect, self.oSearchInput, self.oSearchBtn, self.oSubContainer]);
			self.oPage = self.pageFactory("searchPage", [self.oSearchSelect, self.oSearchInput, self.oSearchBtn, self.oSearchResults]);
			self.updateSearchModelFromURL(searchModel);


			return self.oPage;
		},

		onSearch: function(){
			var self = this;
			self.suggestionsEnabled = false;
		},

		onSearchFinished: function(){
			var self = this;
			self.suggestionsEnabled = true;
		},

		bTagUnescaper: function (domref) {
			var innerhtml = domref.innerHTML;
			while( innerhtml.indexOf('&lt;b&gt;')+innerhtml.indexOf('&lt;/b&gt;') >= -1  ){ // while these tags are found
				innerhtml = innerhtml.replace('&lt;b&gt;', '<b>');
				innerhtml = innerhtml.replace('&lt;/b&gt;', '</b>');
			}
			while( innerhtml.indexOf('&lt;i&gt;')+innerhtml.indexOf('&lt;/i&gt;') >= -1  ){ // while these tags are found
				innerhtml = innerhtml.replace('&lt;i&gt;', '<i>');
				innerhtml = innerhtml.replace('&lt;/i&gt;', '</i>');
			}
			domref.innerHTML = innerhtml;
		},

		closeHeadSearchBox: function(){
			if(sap.ui.getCore().byId('headSearchBox') !== undefined){
				if(sap.ui.getCore().byId('headSearchBox').getVisible()){
					jQuery('.headSearchDiv').animate(
							{'maxWidth':'38rem'}, 
							{duration: 100, complete: function(){
								sap.ui.getCore().byId('headSearchBox').setVisible(false);
							}});         			
				}	
			}

		},

		handleHash: function(searchModel){
			var self = this;

			if (self.oSearchInput.getValue() === "")
				return;
			var sHash = "#Action-search&/searchTerm=" + encodeURIComponent(self.oSearchInput.getValue()) + "&dataSource=" + encodeURIComponent(JSON.stringify(searchModel.getDataSourceJson()));
			if (window.location.hash === sHash) {
				return;
			}
			else {
				window.location.href = sHash;
				searchModel.setProperty("/searchBoxTerm", self.oSearchInput.getValue());
				self.closeHeadSearchBox();
			}
		},

		inputLiveChange: function (oEvent) {
			//destroy suggetion box items
			var searchModel = this.getModel("searchModel");
			if (!this.oSearchInput.getValue()) {
				searchModel.setProperty("/appSection", []);
				searchModel.setProperty("/suggestSection", []);
				searchModel.setProperty("/mixedSection", []);
			}
		},

		handleSuggest: function (oEvent) {
			this.oSearchInput.destroySuggestionItems();
			var suggestTerm = this.oSearchInput.getValue();
			var searchModel = this.getModel("searchModel");
			searchModel.setProperty("/searchBoxTerm", suggestTerm);
			searchModel.doSuggestion();
		},

		selectSuggest: function (oEvent) {
			var searchModel = sap.ui.getCore().getModel("searchModel");
            
            var suggestType = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("suggestType");                
			var searchTerm = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("labelRaw");
			var dataSource = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("dataSource");
			var targetURL = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("targetURL");
            
            if(suggestType === "dataSourceSuggest"){
                
                //Reset Text Empty
			     searchModel.setProperty("/searchBoxTerm", "");
			     this.oSearchInput.setValue("");

                
                //set select and datasource in model
                this.oSearchSelect.setSelectedKey(searchTerm);

                var selectedDS = this.oSearchSelect.getSelectedItem();
				var json = {};

				if(selectedDS.getKey() === "$$ALL$$"){
					json = searchModel.createAllDataSource();

				}else if(selectedDS.getKey() === "$$APP$$"){
					json = searchModel.createAppDataSource();

				}else{
					json = searchModel.sina.createDataSource({
						objectName : {label: selectedDS.getText(), value: selectedDS.getKey()},
						packageName : {label: "", value:""},
						schemaName : {label: "", value:""},
						label: ""
					});
				}

				searchModel.setProperty("/dataSource", json);

                //set input box placeholder
				if(selectedDS.getKey() !== "$$ALL$$"){
					this.oSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("searchIn") + ": " + selectedDS.getText());					
				}else{
					this.oSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("search"));										
				}
                
                return;
            }
            
			var sHash;
			if (targetURL) {
				sHash = targetURL;
			}
			else {
				searchModel.setSearchTerm(searchTerm, false);
				searchModel.setDataSource(dataSource, false);
				sHash = "#Action-search&/searchTerm=" + encodeURIComponent(searchModel.getProperty("/searchBoxTerm")) + "&dataSource=" + encodeURIComponent(JSON.stringify(searchModel.getDataSourceJson()));
			}
			if (window.location.hash !== sHash) {
                if (sHash.charAt(0) === '#')
				    window.location.href = sHash;
                else 
                    window.open(sHash);
			}
		},

		updateSearchModelFromURL: function (searchModel) {
			var oURLParsing = sap.ushell.Container.getService("URLParsing");

			var appSpecificRoute = oURLParsing.splitHash(window.location.hash).appSpecificRoute;
			if (!appSpecificRoute)
				return;
			var oParameters = oURLParsing.parseParameters("?"+appSpecificRoute.substring(2));

			if (!oParameters.searchTerm)
				return;
			var searchTerm = decodeURI(oParameters.searchTerm[0]);
			searchModel.setSearchTerm(searchTerm, false);

			var dataSource;
			if (oParameters.dataSource) {
				var dataSourceJson = JSON.parse(decodeURI(oParameters.dataSource[0]));
				dataSource = searchModel.sina.createDataSource(dataSourceJson);
				searchModel.setDataSource(dataSource, false);
			}
			else {
				searchModel.resetDataSource(false);
			}

			this.oSearchResults.searchLayout.setShowBottomList(searchModel.getProperty("/isNormalSearchEnable"));
			if (!searchModel.getProperty("/isNormalSearchEnable"))
				this.oSearchResults.searchLayout.setBottomCount(0);

//			this.oSearchSelect.setSelectedKey(searchModel.getProperty("/dataSourceLabelRaw"));
			this.oSearchInput.setValue(searchModel.getProperty('/searchBoxTerm'));     

			searchModel._searchFireQuery();	
		},


		containerFactory: function (sId, oControl, bDisableBouncing) {
			var oContainer = new sap.m.ScrollContainer({
				id: sId,
				content: oControl
			});

			oContainer.addStyleClass('sapUshellSubContainer');

			return oContainer;
		},


		pageFactory: function (sId, oControl, bDisableBouncing) {
//			var self = this;

			var oPage = new sap.m.Page({
				id: sId,
				showNavButton: true,
				content: oControl,
				enableScrolling: true,
				navButtonPress: function (event) {
					window.history.back(1);
				}
			}),
			aEvents = ["onAfterHide", "onAfterShow", "onBeforeFirstShow", "onBeforeHide", "onBeforeShow"],
			oDelegates = {};

			// Pass navigation container events to children.
			jQuery.each(aEvents, function (iIndex, sEvent) {
				oDelegates[sEvent] = jQuery.proxy(function (evt) {
					jQuery.each(this.getContent(), function (iIndex, oControl) {
						/*jslint nomen: true */
						oControl._handleEvent(evt);
					});
				}, oPage);
			});

			oPage.addEventDelegate(oDelegates);
			if (!sap.ui.Device.system.desktop) {
				oPage._bUseIScroll = true;
			}
			if (bDisableBouncing) {
				this.disableBouncing(oPage);
			}
			oPage.setTitle("{i18n>search}");
//			oPage.addHeaderContent(self.oSearchField);

			return oPage;
		},

		getControllerName: function () {
			return "sap.ushell.renderers.fiori2.search.container.App";
		}
	});

}(window));
