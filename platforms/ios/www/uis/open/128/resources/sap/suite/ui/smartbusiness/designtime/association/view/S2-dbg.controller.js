/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.association.view.S2", {

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
		this.byId("list").getBinding("items").filter(new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1));
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
			            	        	  text: that.oApplicationFacade.getResourceBundle().getText("FAVOURITE"),
			            	        	  key: "favorite"
			            	          }),
			            	          ]
			              })
			              ],
			              confirm : function(evt) {
			            	  that.setFiltering(evt.getParameter("filterItems"));
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
			            		 that.setGrouping("workspace", true);
			            	 }
			             }
		});
		return groupOptionsDialog;
	},

	getHeaderFooterOptions : function() {
		var that = this;
		return {
			sI18NMasterTitle : "MASTER_TITLE",
			onBack : function() {
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
			}
		};
	},

	formatTitle: function(title) {
		return (title || "");
	},

	formatAssociationCount: function(sourceCount,targetCount) {
		if(sourceCount==null && targetCount==null){
			return 0;
		}
		if(sourceCount==null){
			return parseInt(targetCount);
		}
		if(targetCount==null){
			return parseInt(sourceCount);
		}
		return (parseInt(sourceCount)+parseInt(targetCount));
	},

	formatID: function(id,type) {
		if(type == "KPI") {
			return (this.oApplicationFacade.getResourceBundle().getText(type, id));
		}
		else {
			return (this.oApplicationFacade.getResourceBundle().getText(type) + ": " + id);
		}
	},

	formatOwnerName: function(ownerName) {
		return (this.oApplicationFacade.getResourceBundle().getText("ADDED_BY",ownerName));
	},

	formatState: function(state) {
		return (state ? "ACTIVE" : "DRAFT");
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
		var list = this.getView().byId("list");
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
					key: context.getProperty("IS_ACTIVE") ? "ACTIVE" : "DRAFT",
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
	},

	setFiltering: function(items) {
		var that = this
		var filtersArray = [];
		var list = this.getView().byId("list");

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
//			// extra source of data "the tags"
//			var dependents = oItem.getDependents() || [];
//			for(var i=0,l=dependents.length; i<l; i++) {
//				if(dependents[i].getText().toLowerCase().indexOf(sFilterPattern) != -1) {
//					return true;
//				}
//			}
		}
		return false;
	}
});