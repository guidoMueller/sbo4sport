
jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");

sap.ca.scfld.md.controller.ScfldMasterController.extend("sap.suite.ui.smartbusiness.designtime.drilldown.view.S2", {

	onInit:function(){
           var that = this;
		
		   that.oApplicationFacade.getODataModel().setSizeLimit(100000);
		
		if(!(that.oApplicationFacade.currentLogonHanaUser)) {
			this.oApplicationFacade.getODataModel().read("/SESSION_USER",null,null,true,function(data) {
				that.oApplicationFacade.currentLogonHanaUser = (data.results && data.results.length) ? data.results[0].LOGON_USER : null; 
			}, function(err) {
				that.oApplicationFacade.currentLogonHanaUser = null;
				sap.suite.smartbusiness.utils.showErrorMessage(that.getView().getModel("i18n").getProperty("YMSG_ERROR_RETRIEVING_DATA"), err.response.body);
			});
		}
		
		
		
	},
	

	formatIndicatorId: function(context) {
		return {text: ("KPI: " + context.getProperty("INDICATOR")), key: context.getProperty("INDICATOR")}; 
	},
	_handleItemPress:function(){
		
	},
	createGroupOptions: function() {
		var that = this;
		var groupOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("groupOptionsDialog"),
			groupItems: [
					new sap.m.ViewSettingsItem({
						text: that.getView().getModel("i18n").getProperty("BY_INDICATOR"),
						key: "indicator"
					}),
					new sap.m.ViewSettingsItem({
						text: that.getView().getModel("i18n").getProperty("BY_OWNER"),
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
		return groupOptionsDialog;
	},
	
	getHeaderFooterOptions : function() {
		var that = this;
		return {
			sI18NMasterTitle : "ALL_ACTIVE_EVALUATIONS",
			// sI18NSearchFieldPlaceholder : "SEARCHFIELD_PLACEHOLDER",
		/*	onEditPress : function() {
				jQuery.sap.log.info("master list: edit pressed");
				that.refreshHeaderFooterForEditToggle();
			},*/
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
	setGrouping: function(key, groupDescending) {
		var that=this;
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
				case null: groupTitle = that.getView().getModel("i18n").getProperty("NO_OWNER");
				break;
				case "": groupTitle = that.getView().getModel("i18n").getProperty("NO_OWNER");
				break;
				default: groupTitle = owner_name;
				}
				return {
					key: groupTitle,
					text: groupTitle
				}
			})]);
		}
	},
	
	createSortOptions: function() {
		var that = this;
		var sortOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("sortOptionsDialog"),
			sortItems: [
					new sap.m.ViewSettingsItem({
						text: that.getView().getModel("i18n").getProperty("CREATION_DATE"),
						key: "newest"
					}), 
					new sap.m.ViewSettingsItem({
						text: that.getView().getModel("i18n").getProperty("ALPHABETICALLY"),
						key: "alphabetically"
					}),
					new sap.m.ViewSettingsItem({
						text: that.getView().getModel("i18n").getProperty("NONE"),
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
	
	setSorting: function(key, groupDescending) {
		groupDescending = groupDescending || false;
		var list = this.getView().byId("list");
		if(key == "newest") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("CREATED_ON",groupDescending,null)]); 
		} 
		else if(key == "alphabetically") {
			list.getBinding("items").sort([new sap.ui.model.Sorter("TITLE",groupDescending,null)]);
		}
	},
	setFiltering: function(items) {
		var filters = [];
		var list = this.getView().byId("list");
		
		var filterObject = {
			"self_created": (new sap.ui.model.Filter("CREATED_BY", sap.ui.model.FilterOperator.EQ, this.oApplicationFacade.currentLogonHanaUser)),
			
			
		};
		
		for(var item in items) {
			filters.push(filterObject[item]);
		}
		
		if(filters.length) {
			list.getBinding("items").filter(new sap.ui.model.Filter(filters,false));
		}
		else {
			list.getBinding("items").filter(filters);
		}
	},
	createFilterOptions: function() {
		var that = this;
		var filterOptionsDialog = new sap.m.ViewSettingsDialog({
			id: this.createId("filterOptionsDialog"),
			filterItems: [
					new sap.m.ViewSettingsFilterItem({
						text: that.getView().getModel("i18n").getProperty("ACTIVITY"),
						key: "activity",
						items: [
						         new sap.m.ViewSettingsItem({
						        	 text: that.getView().getModel("i18n").getProperty("SELF_CREATED"),
						        	 key: "self_created"
						         }),
						        
						         
						        ]
					})
					],
					confirm : function(evt) {
						var infoBarText = "";
						var selectedFilters = evt.getParameter("filterItems");

						that.setFiltering(evt.getParameter("filterKeys"));

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
								
						}
						
					}
		});
		return filterOptionsDialog;
	},
	
	 
	
	
});	