jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.authorization.view.S2", {

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
		this.byId("list").getBinding("items").filter([new sap.ui.model.Filter("IS_ACTIVE","EQ",1)]);
	},
	createFilterOptions: function() {
		var that = this;
		var filterOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
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
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("FAVORITE"),
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
			            		  that.byId("visualizationInfo").setText(infoBarText);   
			            	  }
			            	  else {
			            		  that.byId("visualizationInfo").setText("");
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
			            	text: that.oApplicationFacade.getResourceBundle().getText("CREATION_DATE"),
			            	key: "newest"
			            }), 
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("ALPHABETICALLY"),
			            	key: "alphabetically"
			            }),
			            new sap.m.ViewSettingsItem({
			            	text: that.oApplicationFacade.getResourceBundle().getText("NONE"),
			            	key: "none"
			            })
			            ],
			            confirm : function(evt) {
			            	if(evt.getParameter("sortItem")) {
			            		if(evt.getParameter("sortItem").getKey() == "none") {
			            			that.setGrouping("indicator", (evt.getParameter("groupDescending") || false));
			            		} 
			            		else {
			            			that.setSorting(evt.getParameter("sortItem").getKey(), evt.getParameter("sortDescending"));
			            		}
			            	}
			            	else {
			            		that.setGrouping("indicator", (evt.getParameter("groupDescending") || false));
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
			            	 text: that.oApplicationFacade.getResourceBundle().getText("BY_INDICATOR"),
			            	 key: "indicator"
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
			            		 that.setGrouping("indicator", (evt.getParameter("groupDescending") || false));
			            	 }
			             }
		});
		groupOptionsDialog.setSelectedGroupItem("workspace");
		groupOptionsDialog.setGroupDescending(true);
		return groupOptionsDialog;
	},

	getHeaderFooterOptions : function() {
		var that = this;
		return {
			sI18NMasterTitle : "MASTER_TITLE",
			onBack: function() {
				window.history.back();
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
		};
	},

	formatIndicatorId: function(context) {
		var that = this;
		var indicator_type = context.getProperty("MANUAL_ENTRY");
		var groupTitle = "";
		switch(indicator_type) {
		case 1: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_FAVOURITES");
		break;
		case 0: groupTitle = that.oApplicationFacade.getResourceBundle().getText("MY_LAST_WORKED_UPON");
		break;
		default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_EVALUATIONS");
		}
		return {
			key: groupTitle,
			text: groupTitle
		}
		//return {text: ("KPI: " + context.getProperty("INDICATOR")), key: context.getProperty("INDICATOR")}; 
	},

	setGrouping: function(key, groupDescending) {
		var that = this;
		groupDescending = groupDescending || false;
		var list = this.getView().byId("list");
		if(key == "indicator") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("INDICATOR",groupDescending,function(context){
				return {
					key: context.getProperty("INDICATOR"),
					text: ("KPI: " + context.getProperty("INDICATOR"))
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
				default: groupTitle = that.oApplicationFacade.getResourceBundle().getText("ALL_EVALUATIONS");
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			})]);
		}
	},

	setFiltering: function(items) {
		var that = this;
		var filtersArray = [];
		var list = that.getView().byId("list");

		var filterObject = {
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
			list.getBinding("items").sort([new sap.ui.model.Sorter("CREATED_ON",groupDescending,null)]); 
		} 
		else if(key == "alphabetically") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("TITLE",groupDescending,null)]);
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
