//Copyright (c) 2013 SAP AG, All Rights Reserved
(function () {
	"use strict";
	/*global jQuery, sap, location, window, clearTimeout, setTimeout */

	jQuery.sap.require("sap.ushell.renderers.fiori2.Navigation");
	jQuery.sap.require("sap.ushell.renderers.fiori2.launchpad.DashboardManager");
	jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchModel");
	jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchBox");
//	jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchSelect");

	//add touch support for mobile devices
	jQuery.sap.require("sap.ushell.touchSupport");
	jQuery.sap.require("sap.ushell.UserActivityLog");
	sap.ui.jsview("sap.ushell.renderers.fiori2.Shell", {

		/**
		 * Most of the following code acts just as placeholder for new Unified Shell Control.
		 *
		 * @param oController
		 * @returns {sap.ui.unified.Shell}
		 * @public
		 */
		createContent: function (oController) {
			var self = this;
			var oViewData = this.getViewData() || {},
			oConfig = oViewData.config || {},
			bStateEmbedded = (oConfig.appState === "embedded") ? true : false,
					bStateHeaderless = (oConfig.appState === "headerless") ? true : false,
							fnPaneButtonTooltip = function (bState, sShowTooltip, sHideTooltip) {
						return bState ? sHideTooltip : sShowTooltip;
					},
					fnShellUpdateAggItem = function (sId, oContext) {
						return sap.ui.getCore().byId(oContext.getObject());
					},
					oLoadingDialog = new sap.ushell.ui.launchpad.LoadingDialog({
						id: "loadingDialog",
						title: null,
						text: "",   // in order to calculate dimension before first call
						showCancelButton: false
					}),
					oConfigButton = new sap.ui.unified.ShellHeadItem({
						id: "configBtn",
						tooltip: "{i18n>showGrpsBtn_tooltip}",
						icon: sap.ui.core.IconPool.getIconURI("menu2"),
						selected: {path: "/currentState/showPane"},
						press: [oController.togglePane, oController]
					}),
					oHomeButton = new sap.ui.unified.ShellHeadItem({
						id: "homeBtn",
						title: "{i18n>homeBtn_tooltip}",
						tooltip: "{i18n>homeBtn_tooltip}",
						icon: sap.ui.core.IconPool.getIconURI("home"),
						press: [oController.navigateToHome, oController]
					}),
					oBackButton = new sap.ui.unified.ShellHeadItem({
						id: "backBtn",
						title: "{i18n>backBtn_tooltip}",
						tooltip: "{i18n>backBtn_tooltip}",
						icon: {
							parts : ["/rtl"],
							formatter : function (bRtl) {
								return bRtl ? sap.ui.core.IconPool.getIconURI("feeder-arrow") : sap.ui.core.IconPool.getIconURI("nav-back");
							}
						},
						press: [oController.navigateToHome, oController]
					});

					oConfigButton.addEventDelegate({
						onsaptabprevious: function (oEvent) {
							try {
								if (!sap.ushell.renderers.fiori2.AccessKeysHandler.goToEdgeTile('last')) {
									sap.ui.getCore().byId('actionsBtn').focus();
								}
								oEvent.preventDefault();
							} catch (e) {
							}
						}
					});

					oHomeButton.addEventDelegate({
						onsaptabprevious: function (oEvent) {
							try {
								if (!sap.ushell.renderers.fiori2.AccessKeysHandler.goToEdgeTile('last')) {
									jQuery(document).find(".sapUshellNoFilteredItems").focus();
								}
								oEvent.preventDefault();
							} catch (e) {
							}
						}
					});


					var oActionsUserButton,
					oActionsButton;
					if (bStateEmbedded) {
						oActionsButton = new sap.ui.unified.ShellHeadItem({
							id: "standardActionsBtn",
							tooltip: "{i18n>headerActionsTooltip}",
							icon: sap.ui.core.IconPool.getIconURI("account"),
							press: [oController.pressActionBtn, oController]
						});
					}
					else if (!bStateHeaderless) {
						oActionsUserButton = new sap.ui.unified.ShellHeadUserItem({
							id: "actionsBtn",
							username: sap.ushell.Container.getUser().getFullName(),
							tooltip: "{i18n>headerActionsTooltip}",
							image: sap.ui.core.IconPool.getIconURI("account"),
							press: [oController.pressActionBtn, oController]
						});
						oActionsUserButton.addEventDelegate({
							onsaptabnext: function(oEvent){
								try {
									var oShell = sap.ui.getCore().byId('shell'),
									oData = oShell.getModel().getData();
									if ( oData.currentState.stateName === "home") {
										if (oData.currentState.showPane) {
											var groupListPage = sap.ui.getCore().byId('groupListPage');
											var groupList = groupListPage.getContent()[1];
											var item = groupList.getItems()[0];
											if (item) {
												item.focus();
											} else {
												sap.ui.getCore().byId('addGroupActionItem').focus();
											}
										}
										else {
											if (!sap.ushell.renderers.fiori2.AccessKeysHandler.goToEdgeTile('first')) {
												sap.ui.getCore().byId('configBtn').focus();
											}else{
												oUnifiedShell.setFocusOnFirstGroupOnPage();
											}
										}
										oEvent.preventDefault();
									}
								} catch (e) {
								}
							}
						});
						/*
                 in case user image URI is set we try to get it,
                 only if request was successful, we set it on the
                 oActionsButton icon.
                 In case of success, 2 get requests will be executed
                 (one here and the second by the control) however
                 the second one will be taken from the cache
						 */
						var imageURI = sap.ushell.Container.getUser().getImage();

						if (imageURI) {
							//Using jQuery.ajax instead of jQuery.get in-order to be able to control the caching.
							jQuery.ajax({
								url: imageURI,
								//"cache: false" didn't work as expected hence, turning off the cache vie explicit headers.
								headers: {
									'Cache-Control': 'no-cache, no-store, must-revalidate',
									'Pragma': 'no-cache',
									'Expires': '0'
								},
								success: function () {
									oActionsUserButton.setImage(imageURI);
								},
								error: function () {
									jQuery.sap.log.error("Could not load user image from: " + imageURI, "", "sap.ushell.renderers.fiori2.Shell.view");
								}
							});
						}
					}


					var oUnifiedShell = new sap.ui.unified.Shell({
						id: "shell",
						fullHeightContent: true,
						showPane: {path: "/currentState/showPane"},
						headItems: {path: "/currentState/headItems", factory: fnShellUpdateAggItem},
						headEndItems: {path: "/currentState/headEndItems", factory: fnShellUpdateAggItem},
						user: oActionsUserButton,
						paneContent: {path: "/currentState/paneContent", factory: fnShellUpdateAggItem},
						headerHiding: {path: "/currentState/headerHiding"},
						headerVisible : {path: "/currentState/headerVisible"}
					});
					oUnifiedShell._setStrongBackground(true);

					// fixing double events which occur on Android. Two events are caught by the UI -
					// (touchend & click event) and thrown from the open/close pane button (oConfigButton)
					// e.g. sap.ui.unified.ShellHeadItem.onclick method
					// which causes the pane to remain in its state when trying to open / close the pane.
					// this is a temporary fix until we will do it on the ShellHeadItem class level.
					if (sap.ui.Device.os.android) {
						oConfigButton.addEventDelegate({
							onclick : function (e) {
								e.preventDefault();
							}
						});
					}

					oUnifiedShell.focusOnConfigBtn = function () {
						jQuery.sap.delayedCall(0, this, function () {
							if (!bStateHeaderless) {
								var oConfig = sap.ui.getCore().byId('configBtn');
								if( oConfig ){
									oConfig.focus();
								}
							}
						});
					};

					oUnifiedShell.oldInvalidate = oUnifiedShell.invalidate;
					oUnifiedShell.invalidate = function () {
						this.oldInvalidate.apply(this, arguments);
					};

					oUnifiedShell.setFocusOnFirstGroupOnPage = function(){
						var oDashboardGroupsNode = sap.ui.getCore().byId('dashboardGroups'),
						oNode = jQuery( oDashboardGroupsNode.getDomRef() ).find(".sapUshellTileContainer:first");
						if( oNode[0] ){
							oNode.focus();
						}else{
							sap.ui.getCore().byId('addGroupActionItem').focus();
						}
					};

					oUnifiedShell.setFocusOnFirstGroupInList = function(){
						var groupsNode = sap.ui.getCore().byId('groupList'),
						oNode = jQuery( groupsNode.getDomRef() ).find("li:first");
						if( oNode[0] ){
							oNode.focus();
						}
					};


					this.oDashboardManager = new sap.ushell.renderers.fiori2.launchpad.DashboardManager("dashboardMgr", {
						model : oController.getModel(),
						config : oConfig
					});

					var oDashboardPage = this.pageFactory("dashboardPage", this.oDashboardManager.getDashboardView(), !sap.ui.Device.system.desktop),
					oShellPage = this.pageFactory("shellPage", oUnifiedShell, true);

					this.initNavContainer(oController);

					if (bStateEmbedded) {
						oUnifiedShell.setIcon(sap.ui.resource('sap.ui.core', 'themes/base/img/1x1.gif'));
					}
					else {
						this.initShellBarLogo(oUnifiedShell);
					}

					this.setDisplayBlock(true);

//					if (!sap.ui.Device.system.desktop) {
//					oShellPage.setEnableScrolling(false);
//					}
					this.aDanglingControls = [sap.ui.getCore().byId('navContainer'), oShellPage, oDashboardPage, oBackButton, oLoadingDialog, oHomeButton, oConfigButton];
					oUnifiedShell.updateAggregation = this.updateShellAggregation;

					var bSearchEnable = (oConfig.enableSearch !== false);
					oController.getModel().setProperty("/searchAvailable", bSearchEnable);

					if (bSearchEnable) {

						//Search Icon
						self.oSearchField = new sap.ui.unified.ShellHeadItem({
							id: "sf",
							tooltip: "{i18n>searchbox_tooltip}",
							icon: sap.ui.core.IconPool.getIconURI("search"),
//							width: "100%",
							visible: {path: "/searchAvailable"},
							press: function (event) {
								if(!self.oHeadSearchBox){
									self.initHeadSearchBox();
									self.openHeadSearchBox(event,true);

								}else{
									if(!self.oHeadSearchBox.getVisible()){
										self.openHeadSearchBox(event,false);									
									}else{
										if(self.oHeadSearchInput.getValue() === ""){
											self.closeHeadSearchBox(event);
										}else{
											self.handleHash(self.getModel("searchModelInHead"));
											self.oHeadSearchInput.destroySuggestionRows();
											self.closeHeadSearchBox(event);										
										}
									}	
								}


							}
						});

						self.aDanglingControls.push(self.oSearchField);

					}

					//This property is needed for a special scenario when a remote Authentication is required.
					//IFrame src is set by UI2 Services
					this.logonIFrameReference = null;

					return new sap.m.App({
						pages: oShellPage
					});
		},


		_getIconURI: function (ico) {
			var result = null;
			if (ico) {
				var match = /url[\s]*\('?"?([^\'")]*)'?"?\)/.exec(ico);
				if (match) {
					result = match[1];
				}
			}
			return result;
		},

		initShellBarLogo: function (oUnifiedShell) {
			jQuery.sap.require("sap.ui.core.theming.Parameters");
			var ico = sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");
			if (ico) {
				ico = this._getIconURI(ico);
				if(!ico){
					oUnifiedShell.setIcon(sap.ui.resource("sap.ui.core", "mimes/logo/sap_50x26.png")); //sets the logo manually on the sap.ui.unified.Shell instance
				}
			}

			//Change the Theme icon once it is changed (in the theme designer) 
			var that=this;
			sap.ui.getCore().attachThemeChanged( function(){
				var newIco = sap.ui.core.theming.Parameters.get("sapUiGlobalLogo");
				if(newIco) {
					newIco= that._getIconURI(newIco);
					if(newIco) {
						oUnifiedShell.setIcon(newIco);
					}
				}
			});
		},

		initHeadSearchBox: function () {
			var self = this;
			var oShell;

			//Search Box, contains Select and Input
			self.oHeadSearchBox = sap.ui.getCore().byId("headSearchBox");
			if(!self.oHeadSearchBox){
				self.oHeadSearchBox = new sap.m.Toolbar({
					id: "headSearchBox"
				}).addStyleClass('sapUshellHeadSearchBox');
			}
			oShell = sap.ui.getCore().byId('shell');
			oShell.setSearch(self.oHeadSearchBox);
            
			//Search Select
			self.oHeadSearchSelect = sap.ui.getCore().byId("headSearchSelect");
			if(!self.oHeadSearchSelect){
				self.oHeadSearchSelect = new sap.m.Select({ 
					id: "headSearchSelect",
					name : "headSearchSelect",
//					maxWidth: "38%",
					autoAdjustWidth : true,
					items : {
						path : "searchModelInHead>/connectors",
						template: new sap.ui.core.Item({
							key: "{searchModelInHead>labelRaw}",
							text: "{searchModelInHead>label}"
						})
					}
				}).addStyleClass('sapUshellContainerSearchSelect');	
			}


			//Search Input
			self.oHeadSearchInput = sap.ui.getCore().byId("headSearchInput");
			if(!self.oHeadSearchInput){
				self.oHeadSearchInput = new sap.m.Input({
					id : "headSearchInput",
//					width: "60%",
					type : "Text",
					// value:  "{searchModelInHead>/searchBoxTerm}",
					showValueStateMessage: false,
					showTableSuggestionValueHelp: false,
					showSuggestion: true,
					filterSuggests: false,
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
							var searchModelInHead = self.getModel("searchModelInHead");
							self.handleHash(searchModelInHead);
							self.oHeadSearchInput.destroySuggestionRows();
							self.closeHeadSearchBox(event);	
							self.changeTimer = null;
						},100);
					}
				});            		
			}

//			self.oHeadSearchBox.addContent([self.oHeadSearchSelect, self.oHeadSearchInput]);
			self.oHeadSearchBox.addContent(self.oHeadSearchSelect);
			self.oHeadSearchBox.addContent(self.oHeadSearchInput);
            
            self.oHeadSearchBox.addEventDelegate({
				onAfterRendering: function(oEvent) {
                    // add class to select parent divs, set css style and animation 
                    jQuery('#headSearchBox').parent().parent().parent().addClass('headSearchDivContainer');
                    jQuery('#headSearchBox').parent().parent().addClass('headSearchDiv');
				}
			}, self.oHeadSearchBox);
		},

        
		openHeadSearchBox: function (event, bFirstTime) {
			var self = this;

			var oShell = sap.ui.getCore().byId('shell');
			var searchBox = oShell.getSearch();
			if(!searchBox){
				oShell.setSearch(self.oHeadSearchBox);
				bFirstTime=true;
			}			

			// Search Model in Core
			var searchModel = sap.ui.getCore().getModel("searchModel");
			if (!searchModel) {
				searchModel = new sap.ushell.renderers.fiori2.search.SearchModel();
				searchModel.setSizeLimit(200);

				sap.ui.getCore().setModel(searchModel, "searchModel");
				searchModel.searchInit();
			}
			else {
//				searchModel.setProperty('/isNormalSearchEnable', true);
			}
			searchModel.setSkip(0, false);

			self.setModel(sap.ushell.resources.i18nModel, "i18n");


			// Search Model in Head
			var searchModelInHead = self.getModel("searchModelInHead");
			if(!searchModelInHead){
				searchModelInHead = new sap.ushell.renderers.fiori2.search.SearchModel();
				searchModelInHead.setSizeLimit(200);

				self.setModel(searchModelInHead, "searchModelInHead");
				searchModelInHead.searchInit();

				self.createHeadSearchBoxViews(searchModelInHead);
			}
			else {
//				searchModelInHead.setProperty('/isNormalSearchEnable', true);
			}

			//Reset Select
			var json;
			if(searchModelInHead.getProperty('/isNormalSearchEnable')){
				json = searchModelInHead.createAllDataSource();
			}else{
				json = searchModelInHead.createAppDataSource();
			}

			searchModelInHead.setProperty("/dataSource", json);
			if(searchModelInHead.getProperty('/isNormalSearchEnable')){
				self.oHeadSearchSelect.setSelectedKey("$$ALL$$");				
			}else{
				self.oHeadSearchSelect.setSelectedKey("$$APP$$");
			}

//			searchModelInHead.setProperty("/isNormalSearchEnable", true);

			//Reset Text Empty
			searchModelInHead.setProperty("/searchBoxTerm", "");
			self.oHeadSearchInput.setValue("");
			self.oHeadSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("search"));

			//Reset Search Box
			self.oHeadSearchBox.setVisible(true);
            self.oHeadSearchBox.addEventDelegate({
				onAfterRendering: function(oEvent) {
                    if(bFirstTime){
                        jQuery('.headSearchDiv').css("maxWidth", "38rem");
			         }else{
				        jQuery('.headSearchDiv').css("maxWidth", "0rem");
				        jQuery('.headSearchDiv').animate({'maxWidth':'38rem'}, 100);	
			         }
				}
			}, self.oHeadSearchBox);
		},


		closeHeadSearchBox: function(){	
			var self = this;
			jQuery('.headSearchDiv').animate(
					{'maxWidth':'38rem'}, 
					{duration: 100, complete: function(){
						self.oHeadSearchBox.setVisible(false);
					}}); 
		},


		createHeadSearchBoxViews: function(searchModelInHead){
			var self = this;

			//Change Event
			self.oHeadSearchSelect.attachChange(function (oEvent) {

				var selectedDS = self.oHeadSearchSelect.getSelectedItem();
				var json = {};

				if(selectedDS.getKey() === "$$ALL$$"){
					json = searchModelInHead.createAllDataSource();

				}else if(selectedDS.getKey() === "$$APP$$"){
					json = searchModelInHead.createAppDataSource();

				}else{
					json = searchModelInHead.sina.createDataSource({
						objectName : {label: selectedDS.getText(), value: selectedDS.getKey()},
						packageName : {label: "", value:""},
						schemaName : {label: "", value:""},
						label: ""
					});
				}

				searchModelInHead.setProperty("/dataSource", json);

				//set input box placeholder
				if(selectedDS.getKey() !== "$$ALL$$"){
					self.oHeadSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("searchIn") + ": " + selectedDS.getText());					
				}else{
					self.oHeadSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("search"));										
				}
			}, this);


			/*
			 * Search Input View
			 */       
			//Key Press Event
			self.oHeadSearchInput.addEventDelegate({
				onAfterRendering: function(oEvent) {
					oEvent.srcControl.focus();
				},


			}, self.oHeadSearchInput);


			self.oHeadSearchInput.bindAggregation("suggestionRows", "searchModelInHead>/mixedSection", function (path, bData) {
				var label = new sap.m.Label({
					text: "{searchModelInHead>mixedLabel}"
				}).addStyleClass ('sapUshellSuggestText').addStyleClass('sapUshellSearchSuggestionNavItem');
				label.addEventDelegate({                	                	
					onAfterRendering: function(){
						self.bTagUnescaper(this.getDomRef());                		
					}
				}, label);
				label.data("labelRaw", "{searchModelInHead>labelRaw}");
				label.data("targetURL", "{searchModelInHead>targetURL}");
				label.data("dataSource", "{searchModelInHead>dataSource}");
                label.data("suggestType", "{searchModelInHead>suggestType}");
				var icon = new sap.ui.core.Icon ({
					src: "{searchModelInHead>icon}"
				}).addStyleClass('sapUshellSuggestIcon');
				var app = new sap.m.Label({
					text: {
						path: "searchModelInHead>icon",
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
				if (!self.oHeadSearchInput.getValue())
					return null;
				return new sap.m.ColumnListItem({
					cells: [cell],
					type: "Active"
				});
			});
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

		handleHash: function(searchModel){
			var self = this;

			if (self.oHeadSearchInput.getValue() === "")
				return;
			var sHash = "#Action-search&/searchTerm=" + encodeURIComponent(self.oHeadSearchInput.getValue()) + "&dataSource=" + encodeURIComponent(JSON.stringify(searchModel.getDataSourceJson()));
			if (window.location.hash === sHash) {
				return;
			}
			else {
				window.location.href = sHash;
				searchModel.setProperty("/searchBoxTerm", self.oHeadSearchInput.getValue());
			}
		},

		inputLiveChange: function (oEvent) {
			//destroy suggetion box items
			var searchModel = this.getModel("searchModelInHead");
			if (!this.oHeadSearchInput.getValue()) {
				searchModel.setProperty("/appSection", []);
				searchModel.setProperty("/suggestSection", []);
				searchModel.setProperty("/mixedSection", []);
			}
		},

		handleSuggest: function (oEvent) {
			this.oHeadSearchInput.destroySuggestionItems();
			var suggestTerm = this.oHeadSearchInput.getValue();
			var searchModel = this.getModel("searchModelInHead");
			searchModel.setProperty("/searchBoxTerm", suggestTerm);
			searchModel.doSuggestion();
		},

		selectSuggest: function (oEvent) {
			var searchModel = this.getModel("searchModelInHead");
            
            var suggestType = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("suggestType");                
			var searchTerm = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("labelRaw");
			var dataSource = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("dataSource");
			var targetURL = oEvent.getParameter("selectedRow").getCells()[0].getContent()[2].data("targetURL");
            
            if(suggestType === "dataSourceSuggest"){
                
                //Reset Text Empty
			     searchModel.setProperty("/searchBoxTerm", "");
			     this.oHeadSearchInput.setValue("");

                
                //set select and datasource in model
                this.oHeadSearchSelect.setSelectedKey(searchTerm);

                var selectedDS = this.oHeadSearchSelect.getSelectedItem();
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
					this.oHeadSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("searchIn") + ": " + selectedDS.getText());					
				}else{
					this.oHeadSearchInput.setPlaceholder(sap.ushell.resources.i18n.getText("search"));										
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
				this.closeHeadSearchBox(event);	
			}
		},


		initNavContainer: function (oController) {
			var oDashboardPage = sap.ui.getCore().byId("dashboardPage"),
			oNavContainer = new sap.m.NavContainer({
				id: "navContainer",
				pages: [oDashboardPage],
				initialPage: oDashboardPage,
				afterNavigate: jQuery.proxy(oController.onAfterNavigate, oController)
			});

			oNavContainer.addCustomTransition(
					"slideBack",
					sap.m.NavContainer.transitions.slide.back,
					sap.m.NavContainer.transitions.slide.back
			);

			return oNavContainer;
		},


		updateShellAggregation: function (sName) {
			/*jslint nomen: true */
			var oBindingInfo = this.mBindingInfos[sName],
			oAggregationInfo = this.getMetadata().getJSONKeys()[sName],
			oClone;

			jQuery.each(this[oAggregationInfo._sGetter](), jQuery.proxy(function (i, v) {
				this[oAggregationInfo._sRemoveMutator](v);
			}, this));
			jQuery.each(oBindingInfo.binding.getContexts(), jQuery.proxy(function (i, v) {
				oClone = oBindingInfo.factory(this.getId() + "-" + i, v) ? oBindingInfo.factory(this.getId() + "-" + i, v).setBindingContext(v, oBindingInfo.model) : "";
				this[oAggregationInfo._sMutator](oClone);
			}, this));
		},


		// Disable bouncing outside of the boundaries
		disableBouncing: function (oPage) {
			/*jslint nomen: true */
			oPage.onBeforeRendering = function () {
				sap.m.Page.prototype.onBeforeRendering.apply(oPage);

				var oScroller = this._oScroller,
				oOriginalAfterRendering = oScroller.onAfterRendering;

				oScroller.onAfterRendering = function () {
					oOriginalAfterRendering.apply(oScroller);

					if (oScroller._scroller) {
						oScroller._scroller.options.bounce = false;
					}
				};
			};

			return oPage;
		},


		getControllerName: function () {
			return "sap.ushell.renderers.fiori2.Shell";
		},


		pageFactory: function (sId, oControl, bDisableBouncing) {
			var oPage = new sap.m.Page({
				id: sId,
				showHeader: false,
				showFooter: false,
				content: oControl,
				enableScrolling: !!sap.ui.Device.system.desktop
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
			if (bDisableBouncing && sap.ui.Device.system.desktop) {
				this.disableBouncing(oPage);
			}

			return oPage;
		},

		onAfterRendering: function () {
			if (window.f2p) {//If performance is enabled we initialize the monitor UI so that CTRL + ALT +  L will open it.
				jQuery.sap.require("sap.ushell.components.perf.monitor");
				window.f2pMonitor.init(sap.ui.getCore().byId("navContainer"));
			}
		},

		createIFrameDialog: function () {
			jQuery.sap.require("sap.ushell.ui.footerbar.ContactSupportButton");
			var oDialog = null;
			var oLogonIframe = this.logonIFrameReference;

			var _getIFrame = function() {
				//In order to assure the same iframe for SAML authentication is not reused, we will first remove it from the DOM if exists.
				if(oLogonIframe){
					oLogonIframe.remove();
				}
				//The src property is empty by default. the caller will set it as required.
				return $('<iframe id="SAMLDialogFrame" src="" frameborder="0"></iframe>');
			};

			var _hideDialog = function () {
				oDialog.addStyleClass('samlDialogHidden');
				$('#sap-ui-blocklayer-popup').addClass('samlDialogHidden');
			};

			//A new dialog wrapper with a new inner iframe will be created each time.
			this.destroyIFrameDialog();

			var closeBtn = new sap.m.Button({
				text: sap.ushell.resources.i18n.getText("samlCloseBtn"),
				press: function () {
					sap.ushell.Container.cancelLogon(); // Note: calls back destroyIFrameDialog()!
				}
			});

			var contactBtn = new sap.ushell.ui.footerbar.ContactSupportButton();
			contactBtn.setWidth('150px');
			contactBtn.setIcon('');

			var oHTMLCtrl = new sap.ui.core.HTML("SAMLDialogFrame");
			//create new iframe and add it to the Dialog HTML control
			this.logonIFrameReference = _getIFrame();
			oHTMLCtrl.setContent(this.logonIFrameReference.prop('outerHTML'));

			oDialog = new sap.m.Dialog({
				id: "SAMLDialog",
				title: sap.ushell.resources.i18n.getText("samlDialogTitle"),
				contentWidth: "50%",
				contentHeight: "50%",
				leftButton: contactBtn,
				rightButton: closeBtn
			});

			oDialog.addContent(oHTMLCtrl);
			oDialog.open();
			//Make sure to manipulate css properties after the dialog is rendered.
			_hideDialog();

			this.logonIFrameReference = $('#SAMLDialogFrame');
			return this.logonIFrameReference[0];
		},

		destroyIFrameDialog : function () {
			var dialog = sap.ui.getCore().byId('SAMLDialog');
			if(dialog){
				dialog.destroy();
			}
			this.logonIFrameReference = null;
		},

		showIFrameDialog : function () {
			//remove css class of dialog
			var oDialog = sap.ui.getCore().byId('SAMLDialog');
			if (oDialog) {
				oDialog.removeStyleClass('samlDialogHidden');
				$('#sap-ui-blocklayer-popup').removeClass('samlDialogHidden');
			}
		}


	});
}());
