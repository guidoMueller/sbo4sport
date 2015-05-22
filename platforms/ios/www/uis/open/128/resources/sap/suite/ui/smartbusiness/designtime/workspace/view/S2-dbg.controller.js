jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.workspace.view.S2", {

	onInit: function() {
		var that = this;
		that.oApplicationFacade.getODataModel().setSizeLimit(100000); 
		if(!(that.oApplicationFacade.currentLogonHanaUser)) {
			this.oApplicationFacade.getODataModel().read("/SESSION_USER",null,null,true,function(data) {
				that.oApplicationFacade.currentLogonHanaUser = (data.results && data.results.length) ? data.results[0].LOGON_USER : null; 
			}, function(err) {
				that.oApplicationFacade.currentLogonHanaUser = null;
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
			});
		}

		this.defaultHeaderFooterOptions = {
				sI18NMasterTitle : "MASTER_TITLE",
				sI18NSearchFieldPlaceholder : "SEARCHFIELD_PLACEHOLDER",
				onBack: function() {
					window.history.back();
				},
				onEditPress : function(isMultiSelect) {
					that.toggleListSelection(isMultiSelect);
				},
				oFilterOptions : {
					onFilterPressed: function(evt) {
						that.getView().filterOptionDialog = that.getView().filterOptionDialog || that.createFilterOptions();
						that.getView().filterOptionDialog.open();
					}
				},
				oSortOptions : {
					onSortPressed: function(evt) {
						that.getView().sortOptionDialog = that.getView().sortOptionDialog || that.createSortOptions();
						that.getView().sortOptionDialog.open();
					}
				},
				oGroupOptions : {
					onGroupPressed: function(evt) {
						that.getView().groupOptionDialog = that.getView().groupOptionDialog || that.createGroupOptions();
						that.getView().groupOptionDialog.open();
					}
				},
				onAddPress : function(evt) {
					sap.suite.smartbusiness = sap.suite.smartbusiness || {};
					sap.suite.smartbusiness.modelerAppCache = sap.suite.smartbusiness.modelerAppCache || {};
					sap.suite.smartbusiness.modelerAppCache.createSBKPI  = sap.suite.smartbusiness.modelerAppCache.createSBKPI || {};
					sap.suite.smartbusiness.modelerAppCache.createSBKPI.appFromWorkspace = true;
					sap.suite.smartbusiness.utils.appToAppNavigation({action:"createSBKPI"});
				}
		};

		this.multiSelectHeaderFooterOptions = {
				bSuppressBookmarkButton: {},
				onBack: function() {
					sap.suite.smartbusiness.utils.appToAppNavigation({});
				},
				onEditPress : function(isMultiSelect) {
					that.toggleListSelection(isMultiSelect);
				},
				buttonList : [{
					sId: "favouriteButton",
					sI18nBtnTxt : "FAVOURITE_BUTTON_TEXT",
					onBtnPressed : function(evt) { 
						if(that.byId("list").getSelectedContexts().length) {
							var selectedContexts = that.byId("list").getSelectedContexts();
							var payload = {};
							var batchOperations = [];
							var path = null;
							var isFavouritesSuccessful = true;
							var oDataModel = that.oApplicationFacade.getODataModel();
							//odata update
//							for(var i=0,l=selectedContexts.length; i<l; i++) {
//							payload = {ID:selectedContexts[i].getProperty("ID"), TYPE:selectedContexts[i].getProperty("ENTITY_TYPE"), USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null};
//							if(selectedContexts[i].getProperty("MANUAL_ENTRY") == null) {
//							// DO POST
//							batchOperations.push(oDataModel.createBatchOperation("/FAVOURITES","POST",payload));
//							}
//							else if(selectedContexts[i].getProperty("MANUAL_ENTRY") == 0) {
//							// DO PUT
//							path = "(ID='" + selectedContexts[i].getProperty("ID") + "',TYPE='" + selectedContexts[i].getProperty("ENTITY_TYPE") + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')"; 
//							batchOperations.push(oDataModel.createBatchOperation(("/FAVOURITES" + path),"PUT",payload));
//							}
//							else {
//							// DO NOTHING
//							}
//							}
//							oDataModel.addBatchChangeOperations(batchOperations);
//							oDataModel.submitBatch(function(data,response,errorResponse){
//							if(errorResponse.length)
//							{      isFavouritesSuccessful = false;
//							return;
//							}
//							var responses = data.__batchResponses[0].__changeResponses;
//							for(var key in responses)
//							if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//							isFavouritesSuccessful = false;   
//							}
//							},function(err){
//							isFavouritesSuccessful = false;
//							},false);

//							if(!isFavouritesSuccessful) {      
//							sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"));
//							}
//							else {
//							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_SUCCESS_KPI_OPI"));
//							oDataModel.refresh();
//							}

							//xsjs update
							var payloads = [];
							for(var i=0,l=selectedContexts.length; i<l; i++) {
								if(!(selectedContexts[i].getProperty("MANUAL_ENTRY"))) {
									payloads.push({ID:selectedContexts[i].getProperty("ID"), TYPE:selectedContexts[i].getProperty("ENTITY_TYPE"), USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null});
								}
							}
							if(payloads.length) {
								sap.suite.smartbusiness.utils.update(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_FAVOURITE_SERVICE_URI"),payloads,null,function(data) {
									sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_IN_SUCCESS_KPI_OPI"));
									oDataModel.refresh();
								}, function(err) {
									sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_KPI_OPI_ERROR"));
								});
							}
							else {
								
							}
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
				}, {
					sId: "removeFavouriteButton",
					sI18nBtnTxt : "REMOVE_FAV_BUTTON_TEXT",
					onBtnPressed : function(evt) { 
						if(that.byId("list").getSelectedContexts().length) {
							var selectedContexts = that.byId("list").getSelectedContexts();
							var batchOperations = [];
							var path = null;
							var isFavouritesSuccessful = true;
							var oDataModel = that.oApplicationFacade.getODataModel();
							//odata remove
//							for(var i=0,l=selectedContexts.length; i<l; i++) {
//								if(selectedContexts[i].getProperty("MANUAL_ENTRY") == null) {
//									// DO NOTHING
//								}
//								else if(selectedContexts[i].getProperty("MANUAL_ENTRY") == 0) {
//									// DO NOTHING
//								}
//								else {
//									// DO DELETE
//									path = "(ID='" + selectedContexts[i].getProperty("ID") + "',TYPE='" + selectedContexts[i].getProperty("ENTITY_TYPE") + "',USER_ID='" + that.oApplicationFacade.currentLogonHanaUser + "')"; 
//									batchOperations.push(oDataModel.createBatchOperation(("/FAVOURITES" + path),"DELETE"));
//								}
//							}
//							oDataModel.addBatchChangeOperations(batchOperations);
//							oDataModel.submitBatch(function(data,response,errorResponse){
//								if(errorResponse.length)
//								{      isFavouritesSuccessful = false;
//								return;
//								}
//								var responses = data.__batchResponses[0].__changeResponses;
//								for(var key in responses)
//									if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//										isFavouritesSuccessful = false;   
//									}
//							},function(error){
//								isFavouritesSuccessful = false;
//							},false);
//
//							if(!isFavouritesSuccessful) {      
//								sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"));
//							}
//							else {
//								sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("REM_FAVOURITE_BATCH_SAVE_SUCCESS_KPI_OPI"));
//								oDataModel.refresh();
//							}
							
							//xsjs remove
							var payloads = [];
							for(var i=0,l=selectedContexts.length; i<l; i++) {
								if(selectedContexts[i].getProperty("MANUAL_ENTRY")) {
									payloads.push({ID:selectedContexts[i].getProperty("ID"), TYPE:selectedContexts[i].getProperty("ENTITY_TYPE"), USER_ID:that.oApplicationFacade.currentLogonHanaUser, MANUAL_ENTRY:1, LAST_WORKED_ON:null});
								}
							}
							if(payloads.length) {
								sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_FAVOURITE_SERVICE_URI"),payloads,function(data) {
									sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("REM_FAVOURITE_BATCH_SAVE_SUCCESS_KPI_OPI"));
									oDataModel.refresh();
								}, function(err) {
									sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("FAVOURITE_BATCH_SAVE_ERROR_KPI_OPI"));
								});
							}
							else {
								
							}
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
				}, {
					sId: "deleteButton",
					sI18nBtnTxt : "DELETE_BUTTON_TEXT",
					onBtnPressed : function(evt) {
						if(that.byId("list").getSelectedContexts().length) {
							sap.m.MessageBox.show(
									that.oApplicationFacade.getResourceBundle().getText("WARNING_INDICATOR_DELETE_KPI_OPI"),
									"sap-icon://hint",
									that.oApplicationFacade.getResourceBundle().getText("INDICATOR_DELETE_ALERT_TITLE"),
									[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ],
									function(evt){
										if(evt=="OK"){
											var selectedContexts = that.byId("list").getSelectedContexts();
											var payload = {};
											var batchOperations = [];
											var isDeletesSuccessful = true;
											var oDataModel = that.oApplicationFacade.getODataModel();
											//odata remove
//											for(var i=0,l=selectedContexts.length; i<l; i++) {
//												if(selectedContexts[i].getProperty("IS_ACTIVE") == 1) {
//													// DO ACTIVE DELETE
//
//													path = selectedContexts[i].sPath.replace("INDICATORS_MODELER","INDICATORS");
//													batchOperations.push(oDataModel.createBatchOperation(path,"DELETE"));
//
//												}
//												else if(selectedContexts[i].getProperty("IS_ACTIVE") == 0) {
//													// DO INACTIVE DELETE
//													path = selectedContexts[i].sPath.replace("INDICATORS_MODELER","INDICATORS");
//													batchOperations.push(oDataModel.createBatchOperation(path,"DELETE"));
//												}
//												else {
//													// DO NOTHING
//												}
//											}
//
//											oDataModel.addBatchChangeOperations(batchOperations);
//											oDataModel.submitBatch(function(data,response,errorResponse){
//												if(errorResponse.length)
//												{       isDeletesSuccessful = false;
//												return;
//												}
//												var responses = data.__batchResponses[0].__changeResponses;
//												for(var key in responses)
//													if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200") {
//														isDeletesSuccessful = false;      
//													}
//
//											},function(error){
//												isDeletesSuccessful = false;
//											},false);
//
//											if(!isDeletesSuccessful) { 
//												sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_ERROR_KPI_OPI"));
//											}
//											else {
//												sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_SUCCESS_KPI_OPI"));
//												oDataModel.refresh();
//											}
											
											//xsjs remove
											var payloads = [];
											for(var i=0,l=selectedContexts.length; i<l; i++) {
												payloads.push({ID:selectedContexts[i].getProperty("ID"),IS_ACTIVE:selectedContexts[i].getProperty("IS_ACTIVE")});
											}
											if(payloads.length) {
												sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("INDICATOR_SERVICE_URI"),payloads,function(data){
													sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_SUCCESS_KPI_OPI"));
													oDataModel.refresh();
												},
												function(err){
													sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETE_BATCH_SAVE_ERROR_KPI_OPI"));
												});
											}
											else {
												
											}
										}
										if(evt=="CANCEL"){

										}
									}
							);
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
				}]
		};

		if(jQuery.sap.getUriParameters().get("sap-sb-enable-export") == "true") {
			var exportButton = {
					sI18nBtnTxt : "EXPORT_INDICATORS_KPI_OPI",
					onBtnPressed : function(evt) {
						if(that.byId("list").getSelectedContexts().length) {
							that.exportIndicators();
						}
						else {
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_SELECTED"));
						}
					}
			}

			this.multiSelectHeaderFooterOptions.buttonList.unshift(exportButton);
		}  

		this.currentHeaderFooterOptions = this.defaultHeaderFooterOptions;
	},

	createFilterOptions: function() {
		var that = this;
		var filterOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("BY_STATUS"),
			            	  key: "status",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("DRAFTS"),
			            	        	  key: "drafts"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("ACTIVATED"),
			            	        	  key: "activated"
			            	          }),
			            	          ]
			              }), 
			              new sap.m.ViewSettingsFilterItem({
			            	  text: that.oApplicationFacade.getResourceBundle().getText("ACTIVITY"),
			            	  key: "activity",
			            	  items: [
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("SELF_CREATED"),
			            	        	  key: "self_created"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("RECENTLY_WORKED_UPON"),
			            	        	  key: "recently_worked_upon"
			            	          }),
			            	          new sap.m.ViewSettingsItem({
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("FAVOURITE"),
			            	        	  key: "favorite"
			            	          }),
			            	          ]
			              })
			              ],
			              confirm : function(evt) {
			            	  var infoBarText = "";
			            	  var selectedFilters = evt.getParameter("filterItems");

			            	  that.setFiltering(evt.getParameter("filterItems"));

			            	  if(selectedFilters && selectedFilters.length) {
			            		  var filterObj = {};
			            		  for(var i=0,l=selectedFilters.length; i<l; i++) {
			            			  filterObj[selectedFilters[i].getParent().getKey()] = filterObj[selectedFilters[i].getParent().getKey()] || "";
			            			  filterObj[selectedFilters[i].getParent().getKey()] += (filterObj[selectedFilters[i].getParent().getKey()]) ? (",") : "";
			            			  filterObj[selectedFilters[i].getParent().getKey()] += selectedFilters[i].getText(); 
			            		  }

			            		  for(var filter in filterObj) {
			            			  if(filterObj.hasOwnProperty(filter)) {
			            				  infoBarText += (infoBarText) ? " ; " : "";
			            				  infoBarText += filterObj[filter];
			            			  }
			            		  }
			            		  that.byId("filterToolbar").setVisible(true);
			            		  that.byId("workspaceInfo").setText(infoBarText);	
			            	  }
			            	  else {
			            		  that.byId("workspaceInfo").setText("");
			            		  that.byId("filterToolbar").setVisible(false);
			            	  }
			              }
		});
		return filterOptionsDialog;
	},

	createSortOptions: function() {
		var that = this;
		var sortOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("sortOptionsDialog"),
			sortItems: [
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_NEWEST"),
			            	key: "newest"
			            }), 
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_OLDEST"),
			            	key: "oldest"
			            }),
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("BY_TYPE"),
			            	key: "type"
			            }),
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("ALPHABETICALLY"),
			            	key: "alphabetically"
			            })
			            ],
			            confirm : function(evt) {
			            	if(evt.getParameter("sortItem")) {
			            		that.setSorting(evt.getParameter("sortItem").getKey(), evt.getParameter("sortDescending"));
			            	}
			            	else {
			            		that.setGrouping("workspace", true);
			            	}
			            }
		});
		return sortOptionsDialog;
	},

	createGroupOptions: function() {
		var that = this;
		var groupOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("groupOptionsDialog"),
			groupItems: [
			             new sap.m.ViewSettingsItem({
			            	 text: that.oApplicationFacade.getResourceBundle().getText("BY_WORKSPACE"),
			            	 key: "workspace"
			             }), 
			             new sap.m.ViewSettingsItem({
			            	 text: that.oApplicationFacade.getResourceBundle().getText("BY_TYPE"),
			            	 key: "type"
			             }),
			             new sap.m.ViewSettingsItem({
			            	 text: that.oApplicationFacade.getResourceBundle().getText("BY_STATUS"),
			            	 key: "status"
			             }),
			             new sap.m.ViewSettingsItem({
			            	 text: that.oApplicationFacade.getResourceBundle().getText("BY_OWNER"),
			            	 key: "owner"
			             })
			             ],
			             confirm : function(evt) {
			            	 if(evt.getParameter("groupItem")) {
			            		 that.setGrouping(evt.getParameter("groupItem").getKey(), evt.getParameter("groupDescending"));
			            	 }
			            	 else {
			            		 that.setGrouping("none");
			            	 }
			             }
		});
		groupOptionsDialog.setSelectedGroupItem("workspace");
		groupOptionsDialog.setGroupDescending(true);
		return groupOptionsDialog;
	},

	getHeaderFooterOptions : function() {
		var that = this;
		return this.currentHeaderFooterOptions;
	},

	formatTitle: function(title) {
		return (title || "");
	},

	formatEvaluationCount: function(evalCount) {
		return (evalCount || 0);
	},

	formatID: function(id) {
		var that = this;
		return (that.oApplicationFacade.getResourceBundle().getText("KPI_MASTER_ID_TEXT") + ": " + (id || ""));
	},

	formatGroupName: function(context) {
		var that = this;
		var indicator_type = context.getProperty("MANUAL_ENTRY");
		var groupTitle = "";
		switch(indicator_type) {
		case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
		break;
		case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
		break;
		default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_KPI_OPI");
		}
		return {
			key: groupTitle,
			text: groupTitle
		}
	},

	setGrouping: function(key, groupDescending) {
		var that = this;
		groupDescending = groupDescending || false;
		var list = that.getView().byId("list");
		if(key == "type") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("TYPE",groupDescending,function(context){
				return {
					key: context.getProperty("TYPE"),
					text: (context.getProperty("TYPE") + "S")
				}
			})]);
		} 
		else if(key == "status") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("IS_ACTIVE",groupDescending,function(context){
				return {
					key: context.getProperty("IS_ACTIVE") ? that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE") : that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"),
							text: context.getProperty("IS_ACTIVE") ? that.oApplicationFacade.getResourceBundle().getText("ACTIVE_KPI_OPI") : that.oApplicationFacade.getResourceBundle().getText("DRAFT_KPI_OPI"),
				}
			})]);
		}
		else if(key == "owner") { 
			list.getBinding("items").sort([new sap.ui.model.Sorter("OWNER_NAME",groupDescending,function(context){
				var owner_name = context.getProperty("OWNER_NAME");
				var groupTitle = "";
				switch(owner_name) {
				case null: groupTitle = that.oApplicationFacade.getResourceBundle().getText("NO_OWNER");
				break;
				case "": groupTitle = that.oApplicationFacade.getResourceBundle().getText("NO_OWNER");
				break;
				default: groupTitle = owner_name;
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			})]);
		}
		else if(key == "workspace") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("MANUAL_ENTRY",groupDescending,function(context){
				var indicator_type = context.getProperty("MANUAL_ENTRY");
				var groupTitle = "";
				switch(indicator_type) {
				case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
				break;
				case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
				break;
				default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_KPI_OPI");
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			})]);
		}
		else if(key == "none") {
			list.getBinding("items").sort([]);
		}
	},

	setFiltering: function(items) {
		var that = this;
		var filtersArray = [];
		var list = that.getView().byId("list");

		var filterObject = {
				"drafts": (new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 0)),
				"activated": (new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1)),
				"self_created": (new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, that.oApplicationFacade.currentLogonHanaUser)),
				"recently_worked_upon": (new sap.ui.model.Filter("MANUAL_ENTRY", sap.ui.model.FilterOperator.EQ, 0)),
				"favorite": (new sap.ui.model.Filter("MANUAL_ENTRY", sap.ui.model.FilterOperator.EQ, 1))
		};

		filtersArray = sap.suite.smartbusiness.utils.getFilterArray(items, filterObject);

		if(filtersArray.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filtersArray,true));
		}
		else {
			list.getBinding("items").filter(filtersArray);
		}
	},

	setSorting: function(key, groupDescending) {
		var that = this;
		groupDescending = groupDescending || false;
		var list = that.getView().byId("list");
		if(key == "newest") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("CREATED_ON",true,null)]); 
		} 
		else if(key == "oldest") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("CREATED_ON",false,null)]);
		}
		else if(key == "type") { 
			list.getBinding("items").sort([new sap.ui.model.Sorter("TYPE",groupDescending,null)]);
		}
		else if(key == "alphabetically") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("TITLE",groupDescending,null)]);
		}
	},

	toggleListSelection: function(isMultiSelect) {

		if(isMultiSelect) {
			this.byId("list").detachSelectionChange(this._handleSelect,this);
			this.byId("list").setMode("MultiSelect");
			this.currentHeaderFooterOptions = this.multiSelectHeaderFooterOptions;
			this.refreshHeaderFooterForEditToggle();
			this.oRouter.navTo("multiSelect",{});
			this.showEmptyView("DETAIL_TITLE",sap.ui.getCore().getConfiguration().getLanguage()," ");
		}
		else {
			this.byId("list").attachSelectionChange(this._handleSelect,this);
			this.byId("list").setMode("SingleSelectMaster");
			this.currentHeaderFooterOptions = this.defaultHeaderFooterOptions;
			this.refreshHeaderFooterForEditToggle();
			this.oRouter.navTo("detail",{
				contextPath: this.oApplicationFacade.currentContextPath
			});
		}
	},

	exportIndicators: function() { 
		var that = this;
		var dialogForHanaPackages = new sap.m.SelectDialog({
			title : that.oApplicationFacade.getResourceBundle().getText("SELECT_PACKAGES"),
			items : {
				path : "/HANA_PACKAGES",
				template : new sap.m.StandardListItem({
					title : "{OBJECT}"
				})
			},
			confirm : function(oEvent) {
				var package_name = oEvent.getParameter("selectedItem").getProperty("title");

				if(package_name) {
					var payload = that.getExportObject();
					payload = payload.replace("<Hana Package Here>", oEvent.getParameter("selectedItem").getProperty("title"));
					var selectedContexts = that.byId("list").getSelectedContexts();
					var indicatorsString = "";
					var inactiveIndicatorsList = [];
					var inactiveIndicatorsText = "";
					for(var i=0,l=selectedContexts.length; i<l; i++) {
						if(selectedContexts[i].getProperty("IS_ACTIVE") == 1) {
							indicatorsString += (indicatorsString) ? ',' : ''; 
							indicatorsString += '{"value":"' + selectedContexts[i].getProperty("ID") + '","operator":"="}';
						}
						else {
							inactiveIndicatorsText += (inactiveIndicatorsText) ? ' , ' : '';
							inactiveIndicatorsText += '"' + selectedContexts[i].getProperty("TITLE") + '"';
							inactiveIndicatorsList.push(selectedContexts[i]);
						}
					}

					payload = payload.replace(/"<Indicators Here>"/g, indicatorsString);

					if(indicatorsString) {
						if(inactiveIndicatorsList.length) {
							sap.m.MessageBox.show(
									inactiveIndicatorsText + " " +that.oApplicationFacade.getResourceBundle().getText("INACTIVE_KPI_OPI_FOR_EXPORT"),
									"sap-icon://hint",
									that.oApplicationFacade.getResourceBundle().getText("EXPORT_ALERT_TITLE"),
									[sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL ], 
									function(evt) {
										if(evt=="OK") {
											that.callExportService(payload);
										}
										else {
										}
									});
						}
						else {
							that.callExportService(payload);
						}
					}
					else {
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_KPI_OPI_FOR_EXPORT"))
					}
				}
				else {
					sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("NO_HANA_PACKAGE_SELECTED"));
				}
			},
			liveChange : function(oEvent) {
				var searchValue = "'" + oEvent.getParameter("value").toLowerCase() + "'";
				var oFilterObject = new sap.ui.model.Filter("tolower(OBJECT)", sap.ui.model.FilterOperator.Contains,
						searchValue);
				var oBinding = oEvent.getSource().getBinding("items");
				oBinding.filter(new sap.ui.model.Filter([oFilterObject], false));
			}
		});

		dialogForHanaPackages.setModel(this.oApplicationFacade.getODataModel());
		dialogForHanaPackages.open(); 
	},

	getExportObject : function() { 
		var expObj = {"data":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"]},{"tableName":"sap.hba.r.sb.core.db::INDICATOR_TEXTS","schema":"SAP_HBA","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[]},{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","customKeys":["ID"],"keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"INDICATOR","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::EVALUATION_TEXTS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"dependentKey":"INDICATOR","mappingKey":"ID","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"keys":{},"dependentKey":"ID","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::EVALUATION_VALUES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"dependentKey":"INDICATOR","mappingKey":"ID","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"keys":{},"dependentKey":"ID","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::EVALUATION_FILTERS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"dependentKey":"INDICATOR","mappingKey":"ID","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"keys":{},"dependentKey":"ID","mappingKey":"ID"}]},{"tableName":"sap.hba.r.sb.core.db::PROPERTIES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"IN","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"ID","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::PROPERTIES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"EV","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"mappingKey":"ID","dependentKey":"INDICATOR","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"dependentKey":"ID","mappingKey":"ID"}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::TAGS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"IN","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"ID","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::TAGS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"TYPE":[{"value":"EV","operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentOn":[],"mappingKey":"ID","dependentKey":"INDICATOR","keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"dependentKey":"ID","mappingKey":"ID"}],"customKeys":["ID","TYPE"]},{"tableName":"sap.hba.r.sb.core.db::ASSOCIATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"SOURCE_INDICATOR","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["SOURCE_INDICATOR"]},{"tableName":"sap.hba.r.sb.core.db::ASSOCIATION_PROPERTIES","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"SOURCE_INDICATOR","mappingKey":"ID","dependentOn":[],"keys":{"ID":["<Indicators Here>"],"IS_ACTIVE":[{"value":1,"operator":"="}]}}],"customKeys":["SOURCE_INDICATOR"]},{"tableName":"sap.hba.r.sb.core.db::DDA_MASTER","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_MASTER_TEXT","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_FILTERS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_HEADER","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_COLUMNS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_CHART","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::DDA_CONFIGURATION","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"customKeys":["EVALUATION_ID"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"EVALUATION_ID","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::CHIPS","schema":"SAP_HBA","keys":{"isActive":[{"value":1,"operator":"="}]},"customKeys":["id"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"evaluationId","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}]},{"tableName":"sap.hba.r.sb.core.db::CHIP_TEXTS","schema":"SAP_HBA","keys":{"isActive":[{"operator":"=","value":1}]},"customKeys":["id"],"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::CHIPS","schema":"SAP_HBA","keys":{"isActive":[{"value":1,"operator":"="}]},"dependentOn":[{"tableName":"sap.hba.r.sb.core.db::EVALUATIONS","schema":"SAP_HBA","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}]},"dependentKey":"evaluationId","mappingKey":"ID","dependentOn":[{"tableName":"sap.hba.r.sb.core.db::INDICATORS","schema":"SAP_HBA","dependentKey":"INDICATOR","mappingKey":"ID","keys":{"IS_ACTIVE":[{"value":1,"operator":"="}],"ID":["<Indicators Here>"]},"dependentOn":[]}]}],"mappingKey":"id","dependentKey":"id"}]}],"file":{"package_name":"<Hana Package Here>"}};
		return JSON.stringify(expObj); 
	},

	callExportService: function(payload) {
		var that = this;

		jQuery.ajax({
			type: "HEAD",
			async: false,
			dataType: "json",
			url: "/sap/hba/r/sb/core/logic/__token.xsjs",
			headers: {"X-CSRF-Token": "Fetch"},
			success: function(d, s, x) {
				that.exportBusyDialog = that.exportBusyDialog || new sap.m.BusyDialog({text:that.oApplicationFacade.getResourceBundle().getText("EXPORT_KPI_OPI_BUSY_DIALOG_TEXT"), title:that.oApplicationFacade.getResourceBundle().getText("EXPORT_KPI_OPI_BUSY_DIALOG_TITLE")})
				that.exportBusyDialog.open();
				jQuery.ajax({
					url: "/sap/hba/r/sb/core/logic/transferToHanaRepo.xsjs",
					type: "POST",
					data: payload,
					headers: {"X-CSRF-Token": x.getResponseHeader("X-CSRF-Token")},
					async: true,
					success: function(d) {
						that.exportBusyDialog.close();
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("EXPORT_SUCCESS"));
					},
					error: function(e) {
						that.exportBusyDialog.close();
						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("EXPORT_ERROR"));
					}});

			},
			error: function() {
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERR_FETCH_AUTH_TOKEN"));
				$.sap.log.error("ERR_FETCH_AUTH_TOKEN");
			}
		});
	},

	onExit: function() {
		var hashObj = hasher || window.hasher;
		if(!(hashObj.getHash())) {
			sap.suite.smartbusiness.utils.backToHome();
		}
	},

	applySearchPatternToListItem : function(oItem, sFilterPattern) {
		if(sap.ca.scfld.md.controller.ScfldMasterController.prototype.applySearchPatternToListItem.apply(this, arguments)) {
			return true;
		}
		else {
			// extra source of data "the tags"
			var dependents = oItem.getDependents() || [];
			for(var i=0,l=dependents.length; i<l; i++) {
				if(dependents[i].getText().toLowerCase().indexOf(sFilterPattern) != -1) {
					return true;
				}
			}
		}
		return false;
	}

});

