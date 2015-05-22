jQuery.sap.require("sap.ca.scfld.md.controller.BaseFullscreenController");

sap.ca.scfld.md.controller.BaseFullscreenController.extend("sap.suite.ui.smartbusiness.designtime.authorization.view.S4", {

	onInit: function() {
		var that = this;
		this.userSearch = false;
		this.roleSearch =  false;
		this.previousAuthorizations =  [];
		this.previousSelectedIds = {};
		this.previousSelectedIds["USER"] = {};
		this.previousSelectedIds["ROLE"] = {};
		this.selectedIds = {};
		this.selectedIds["USER"] = {};
		this.selectedIds["ROLE"] = {};
		var filterByAlphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		this.filterByAlphabetModel = new sap.ui.model.json.JSONModel();	
		this.filterByAlphabetModel.setData(filterByAlphabet);	
		this.selectedItemsModel = new sap.ui.model.json.JSONModel();
		this.selectedItemsModel.setData([]);
		this.byId("selectedItemsList").setModel(this.selectedItemsModel,"selectedItems");
		this.alphabetFilterDialog = {};
		this.deletedItems = [];		
		
		this.oRouter.attachRouteMatched(function(evt){
			if(evt.getParameter("name") != "subDetail")
				return;
			var context = new sap.ui.model.Context(that.getView().getModel(), '/' + (evt.getParameter("arguments").contextPath));
			that.getView().setBindingContext(context);
			that.itemId = that.getView().getBindingContext().getProperty("ID");
			if(!that.itemId)
			{
				that.itemId = (/ID=\'.*\'/).exec(evt.getParameter("arguments").contextPath)[0];
				that.itemId = that.itemId.slice(that.itemId.indexOf("'")+1,that.itemId.lastIndexOf("'"));
			}
			that.getView().getModel().read("/AUTHORIZED_USERS",null,"$filter=ID eq '"+that.itemId+"'",false,function(data){
				that.selectedIds["USER"] = {};
				that.selectedIds["ROLE"] = {};		
				that.deletedItems = [];					
				that.previousAuthorizations = jQuery.extend(true,[],data.results);
				that.selectedItemsModel.setData(data.results);
				that.initialSelectedItems = jQuery.extend(true, [], data.results);
				that.byId("selectedItemsTab").setCount(data.results.length);	
				for(var key in data.results)
					that.selectedIds[data.results[key].TYPE][data.results[key].NAME] = data.results[key].NAME;
				that.previousSelectedIds = jQuery.extend(true,{},that.selectedIds);
			}, function(error){
				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("ERROR_LOADING_AUTH"));
			});
			that.byId("userList").bindItems("/HANA_USERS", new sap.m.CustomListItem({
				selected: {
					path: "NAME",
					formatter: function(name){
						return ((that.selectedIds["USER"][name])?true:false);
					}
				},
				content: [
				          new sap.ui.layout.Grid({
				        	  defaultSpan:"L12 M12",
				        	  width:"60%",
				        	  vSpacing:0,
				        	  content:[new sap.ui.core.Icon({
				        	        	   src:"sap-icon://person-placeholder",
				        	        	   size:"40px",
				        	        	   color:{
				        						path: "NAME",
				        						formatter: function(name){ return (that.selectedIds["USER"][name]?"#009de0":"#e6e6e6"); }
				        	        	   },
				        	        	   layoutData: new sap.ui.layout.GridData({span:"L1 M1"})
				        	           }),
				        	           new sap.m.Label({text:"{NAME}",layoutData: new sap.ui.layout.GridData({span:"L8 M8"})})
				        	           ]
				          })]
			}));
			that.byId("roleList").bindItems("/HANA_ROLES", new sap.m.CustomListItem({
				selected: {
					path: "NAME",
					formatter: function(name){return (that.selectedIds["ROLE"][name]?true:false);}
				},
				content: [
				          new sap.ui.layout.Grid({
				        	  defaultSpan:"L12 M12",
				        	  width:"60%",
				        	  vSpacing:0,
				        	  content:[new sap.ui.core.Icon({
				        	        	   src:"sap-icon://group",
				        	        	   size:"40px",
				        	        	   color:{
				        						path: "NAME",
				        						formatter: function(name){
				        							return (that.selectedIds["ROLE"][name]?"#009de0":"#e6e6e6");
				        						}
				        	        	   },
				        	        	   layoutData: new sap.ui.layout.GridData({span:"L1 M1"})
				        	           }),
				        	           new sap.m.Label({text:"{NAME}",layoutData: new sap.ui.layout.GridData({span:"L7 M7"})}),
				        	           new sap.m.Link({
				        	        	   text: {path:'NO_OF_USERS', formatter: jQuery.proxy(that.formatNoOfUsers,that)},
				        	        	   press: jQuery.proxy(that.onAllRolesLinkSelect,that),
				        	        	   layoutData:new sap.ui.layout.GridData({span:"L2 M2"})
				        	           })]
				          })]
			}));			
		});
		this.oHeaderFooterOptions =
		{ 	
				bSuppressBookmarkButton: {},
				sI18NFullscreenTitle: "S3_EDIT",
				oFilterOptions : {
					onFilterPressed: function(evt) {
						if(that.byId("idIconTabBarMulti").getSelectedKey() == "selected")
							sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("FILTER_NOT_APPLICABLE"));
						else
							that.openFilterDialog();
					}
				},
				onBack: function(oEvent){
					that.handleBackAndCancel();
				},
				oEditBtn : {
					sI18nBtnTxt : "SAVE",
					onBtnPressed : function(evt) {
						that.saveAuthorizations();
					}
				},
				buttonList : [{
					sI18nBtnTxt : "RESET",
					onBtnPressed : function(evt) {
						that.resetAuthorizations();
					},
				},
				{	sI18nBtnTxt : "CANCEL",
					onBtnPressed : function(evt) {
						that.handleBackAndCancel();						
					}
				}]				
		};	
		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},
	
	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},			
	onUserSearch: function(oEvent){
		var prevUserSearch = this.userSearch;
		oEvent.getSource().getValue() == "" ? this.userSearch = false : this.userSearch = true;
		var itemBinding = this.byId("userList").getBinding("items");
		if(prevUserSearch)
			itemBinding.aFilters.pop();
		if(this.userSearch)
			itemBinding.aFilters.push(new sap.ui.model.Filter("tolower(NAME)","Contains","'"+oEvent.getSource().getValue().toLowerCase()+"'"));		
		itemBinding.filter(itemBinding.aFilters);
	},
	onRoleSearch: function(oEvent){
		var prevRoleSearch = this.roleSearch;
		oEvent.getSource().getValue() == "" ? this.roleSearch = false : this.roleSearch = true;
		var itemBinding = this.byId("roleList").getBinding("items");
		if(prevRoleSearch)
			itemBinding.aFilters.pop();
		if(this.roleSearch)
			itemBinding.aFilters.push(new sap.ui.model.Filter("tolower(NAME)","Contains","'"+oEvent.getSource().getValue().toLowerCase()+"'"));
		itemBinding.filter(itemBinding.aFilters);
	},
	refreshFilter: function(){
		var eventSourceType = this.byId("idIconTabBarMulti").getSelectedKey();
		var itemBinding = this.byId((eventSourceType === "users")?"userList":"roleList").getBinding("items");
		itemBinding.filter(itemBinding.aFilters.pop(),false);
		this.byId((eventSourceType === "users")?"userInfoToolbar":"roleInfoToolbar").setVisible(false);
		this.alphabetFilterDialog[eventSourceType] = null;	
	},
	onUserItemSelectionChange: function(oEvent){
		this.onItemSelectionChange(oEvent,"USER");
	},
	onRoleItemSelectionChange: function(oEvent){
		this.onItemSelectionChange(oEvent,"ROLE");
	},
	onItemSelectionChange: function(oEvent,type){
		var selectedItemData = this.selectedItemsModel.getData();
		var selectedItem = oEvent.getParameter("listItem");
		var selectedItemContext = selectedItem.getBindingContext().getObject();
		if(selectedItem.getSelected())
		{	//remove re-selected item from deletion array if it exists there
			for(var key in this.deletedItems)
			{ 	if(this.deletedItems[key].NAME === selectedItemContext.NAME && this.deletedItems[key].TYPE === type)
					this.deletedItems.splice(key,1);
			}			
			selectedItemContext.TYPE = type;
			selectedItemData.push(selectedItemContext);
			var selectedItemIcon = selectedItem.getContent()[0].getContent()[0];			
			selectedItemIcon.setColor("#009de0");
			this.selectedIds[type][selectedItemContext.NAME] = selectedItemContext.NAME;			
		}
		else
		{	//Maintaining array of deleted items that were previously authorised
			for(var key in this.previousAuthorizations)
			{	if(this.previousAuthorizations[key].NAME === selectedItemContext.NAME && this.previousAuthorizations[key].TYPE === type)
				{ 	selectedItemContext.TYPE = type;
					this.deletedItems.push(selectedItemContext);			
				}
			}
			for(var key in selectedItemData)
				if((selectedItemData[key].NAME == selectedItemContext.NAME) && (selectedItemData[key].TYPE == type))
					selectedItemData.splice(key,1);
			var selectedItemIcon = selectedItem.getContent()[0].getContent()[0];
			selectedItemIcon.setColor("#e6e6e6");
			this.selectedIds[type][selectedItemContext.NAME] = null;
		}
		this.selectedItemsModel.setData(selectedItemData);
		this.byId("selectedItemsTab").setCount(selectedItemData.length);
	},
	onSelectedItemDelete: function(oEvent){
		var deletedObject = oEvent.getParameter("listItem").getBindingContext("selectedItems").getObject();
		var itemList = this.byId(deletedObject.TYPE=="USER"?"userList":"roleList");
		//Maintaining array of deleted items that were previously authorised
		for(var key in this.previousAuthorizations)
		{	if(this.previousAuthorizations[key].NAME === deletedObject.NAME && this.previousAuthorizations[key].TYPE === deletedObject.TYPE)
				this.deletedItems.push(deletedObject);			
		}
		this.selectedIds[deletedObject.TYPE][deletedObject.NAME] = null;
		itemList.getModel().refresh(true);

		var selectedItemsData = this.selectedItemsModel.getData();
		var spliceIndex = oEvent.getParameter("listItem").getBindingContext("selectedItems").getPath().substr(1);
		selectedItemsData.splice(spliceIndex,1);
		this.selectedItemsModel.setData(selectedItemsData);
		this.byId("selectedItemsList").rerender();
		this.byId("selectedItemsTab").setCount(selectedItemsData.length);	
	},
	onAllRolesLinkSelect: function(oEvent){
		var roleName = oEvent.getSource().getBindingContext().getProperty("NAME");
		var noOfUsers = oEvent.getSource().getBindingContext().getProperty("NO_OF_USERS");
		this.onRolesLinkSelect(oEvent,roleName,noOfUsers);
	},
	onSelectedRolesLinkSelect: function(oEvent){
		var roleName = oEvent.getSource().getBindingContext("selectedItems").getProperty("NAME");
		var noOfUsers = oEvent.getSource().getBindingContext("selectedItems").getProperty("NO_OF_USERS");
		this.onRolesLinkSelect(oEvent,roleName,noOfUsers);
	},
	onRolesLinkSelect: function(oEvent,roleName,noOfUsers){
		noOfUsers = noOfUsers+" "+( noOfUsers==1?this.oApplicationFacade.getResourceBundle().getText("USER"):this.oApplicationFacade.getResourceBundle().getText("USERS"));
		if(!this._rolesPopover)
		{
			this.roleNameLabel = new sap.m.Label({
				text:roleName,
				design: "Bold",
				layoutData: new sap.ui.layout.GridData({span:"L10 M10"}) 
			});
			this.noOfUsersLabel = new sap.m.Label({
				text: noOfUsers,
				design: "Bold",
				layoutData: new sap.ui.layout.GridData({span:"L12 M12"}) 
			});
			var rolesPopoverHeader =  new sap.ui.layout.Grid({
				defaultSpan:"L12 M12",
				content:[new sap.ui.core.Icon({
							src:"sap-icon://group",
							size: "40px",
							color: "#e6e6e6",
							layoutData: new sap.ui.layout.GridData({span:"L2 M2"}) }),
				         this.roleNameLabel,
				         this.noOfUsersLabel
				         ]
			});
			this.usersForRole = new sap.ui.layout.Grid({span:"L12 M12"});
			var rolesPopoverLayout = new sap.m.VBox({
				items: [rolesPopoverHeader,this.usersForRole],
			});
			this._rolesPopover = new sap.m.Popover({
				title: "{i18n>ROLE_DETAILS}",
				content: rolesPopoverLayout						
			});
			this.getView().addDependent(this._rolesPopover);
		}
		this.roleNameLabel.setText(roleName);
		this.noOfUsersLabel.setText(noOfUsers);
		this.usersForRole.bindAggregation("content","/USERS_GRANTED_ROLE(P_ROLE_NAME='"+roleName+"')/Results",new sap.m.Label({
			text:"{NAME}",
			layoutData: new sap.ui.layout.GridData({span:"L12 M12"})
		}));
		var infoBar = oEvent.getSource();
		jQuery.sap.delayedCall(0, this, function () {
			this._rolesPopover.openBy(infoBar);
		});	
	},
	formatSelectedItemsIcon: function(type){
		if(type === "ROLE")
			return "sap-icon://group";
		else
			return "sap-icon://person-placeholder";
	},
	formatNoOfUsers: function(noOfUsers){
		if(noOfUsers)
			return noOfUsers+" "+(noOfUsers==1?this.oApplicationFacade.getResourceBundle().getText("USER"):this.oApplicationFacade.getResourceBundle().getText("USERS"));
		else
			return "";		
	},
	saveAuthorizations: function(){
		var that = this;
		var selectedItems = this.selectedItemsModel.getData();
		var deleteBatch = [];
		var createBatch = [];
		var isDeleteSuccessful = true;
		var payload = {ID:this.itemId,REVOKE:[],GRANT:[]};
		var busyDialog = new sap.m.BusyDialog();
		busyDialog.open();
		
		//odata remove
		//Deleting the removed authorizations
//		for(var key in this.deletedItems)
//		{	var path = "(NAME='"+this.deletedItems[key].NAME+"',TYPE='"+this.deletedItems[key].TYPE+"',ID='"+this.itemId+"')";
//			deleteBatch.push(this.getView().getModel().createBatchOperation("/AUTHORIZED_USERS"+path,"DELETE"));
//		}
//		this.getView().getModel().addBatchChangeOperations(deleteBatch);
//		this.getView().getModel().submitBatch(function(data,response,errorResponse){
//			if(errorResponse.length)
//			{	isDeleteSuccessful = false;
//				return;
//			}
//			var responses = data.__batchResponses[0].__changeResponses;
//			for(var key in responses)
//				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200")
//					isDeleteSuccessful = false;		
//		},function(error){
//			isDeleteSuccessful = false;
//		},false);
//		if(!isDeleteSuccessful)
//		{	busyDialog.close();
//			sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_ERROR"));
//			return;
//		}

		//odata write
		//Writing the new authorizations
//		for(var key in selectedItems)
//		{	var payload = {
//				NAME: selectedItems[key].NAME,
//				TYPE: selectedItems[key].TYPE,
//				ID: this.itemId,
//				OBJECT_NAME: (this.itemId + "_SSB_AP")
//			};
//			createBatch.push(this.getView().getModel().createBatchOperation("/AUTHORIZED_USERS","POST",payload));
//		}
//		this.getView().getModel().addBatchChangeOperations(createBatch);
//		this.getView().getModel().submitBatch(function(data,response,errorResponse){
//			if(errorResponse.length)
//			{	busyDialog.close();
//				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_ERROR"));
//				return;
//			}
//			var error = false;
//			var responses = data.__batchResponses[0].__changeResponses;
//			for(var key in responses)
//				if(responses[key].statusCode != "201" && responses[key].statusCode != "204" && responses[key].statusCode != "200")
//					error = true;				
//			if(error)
//				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_ERROR"));
//			else
//			{	sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_SUCCESS"));
//				that.onNavBack();	
//				window.history.back();
//			}
//			busyDialog.close();
//		}, function(error){
//				sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_ERROR"));
//				busyDialog.close();
//		},false);
		//xsjs create
		for(var key in this.deletedItems) {
			payload.REVOKE.push(this.deletedItems[key].NAME);
		}
		for(var key in selectedItems) {
			payload.GRANT.push(selectedItems[key].NAME);
		}
		sap.suite.smartbusiness.utils.create(sap.suite.smartbusiness.utils.serviceUrl("AUTHORIZATION_SERVICE_URI"),payload,null,function(data) {
			sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_SUCCESS"));
			that.onNavBack();	
			sap.suite.smartbusiness.utils.replaceHash({action:"authorizeSBEvaluation", route:"detail", context: that.getView().getBindingContext().getPath().split("/")[1]});
			busyDialog.close();
		}, function(err) {
			sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("AUTH_SAVE_ERROR"), err.responseText);
			busyDialog.close();
		});
	},
	resetAuthorizations: function(){
		this.selectedIds = jQuery.extend(true,{},this.previousSelectedIds);
		this.selectedItemsModel.setData(jQuery.extend(true,[],this.previousAuthorizations));
		this.byId("selectedItemsTab").setCount(this.previousAuthorizations.length);
		this.byId("selectedItemsList").rerender();
		this.byId("userList").getModel().refresh(true);
		this.byId("roleList").getModel().refresh(true);
		this.deletedItems = [];	
	},
	onNavBack: function(){
		this.selectedIds["USER"] = {};
		this.selectedIds["ROLE"] = {};		
		this.deletedItems = [];	
	},
	openFilterDialog: function(){
		var that = this;
		var eventSourceType = this.byId("idIconTabBarMulti").getSelectedKey();
		if(!this.alphabetFilterDialog[eventSourceType])
		{		
			this.alphabetFilterDialog[eventSourceType] = new sap.m.SelectDialog({
				title: that.oApplicationFacade.getResourceBundle().getText("FILTER")+" : "+
				(eventSourceType=="users"?that.oApplicationFacade.getResourceBundle().getText("USERS"):that.oApplicationFacade.getResourceBundle().getText("ROLES")),
				growingScrollToLoad: true,
				rememberSelections: true,
				multiSelect: true,
				search: function(oEvent){
					that.alphabetFilterDialog[eventSourceType].getBinding("items").filter(new sap.ui.model.Filter("","Contains",this.getValue()));
				},
				confirm: function(oEvent){
					var aFilters = [];
					var itemBinding = that.byId((eventSourceType === "users")?"userList":"roleList").getBinding("items");
					
					var searchFilter = null;
					if(eventSourceType === "users")
						searchFilter = that.userSearch ? itemBinding.aFilters.pop() : null;
					else
						searchFilter = that.roleSearch ? itemBinding.aFilters.pop() : null;	
						
					var selectedFilters = [];
					var selectedItems = oEvent.getParameter("selectedContexts");
					for(var key in selectedItems)
					{	aFilters.push(new sap.ui.model.Filter("NAME","StartsWith",selectedItems[key].getObject()));
						selectedFilters.push(selectedItems[key].getObject());
					}		
					if(searchFilter)
						aFilters.push(searchFilter);
					itemBinding.filter(aFilters,false);
					if(selectedFilters.length > 0)
					{	that.byId((eventSourceType === "users")?"userInfoToolbar":"roleInfoToolbar").setVisible(true);
						that.byId((eventSourceType === "users")?"userInfoToolbarLabel":"roleInfoToolbarLabel").setText(that.oApplicationFacade.getResourceBundle().getText("FILTERED_BY")+"("+selectedFilters.join(", ")+")");
					}
					else
						that.byId((eventSourceType === "users")?"userInfoToolbar":"roleInfoToolbar").setVisible(false);
				},
				items: {
					path:"/",
					template: new sap.m.StandardListItem({title: "{}"})
				}
			});
			this.alphabetFilterDialog[eventSourceType].setModel(this.filterByAlphabetModel);						
		}
		this.alphabetFilterDialog[eventSourceType].open();
	},
	onSelectIconTab: function(oEvent){
		if(oEvent.getParameter("selectedKey") == "selected")
		{	this.oHeaderFooterOptions.oFilterOptions.bDisabled = true;
			this.setHeaderFooterOptions(this.oHeaderFooterOptions);
		}
		else
		{	this.oHeaderFooterOptions.oFilterOptions.bDisabled = false;
			this.setHeaderFooterOptions(this.oHeaderFooterOptions);
		}
	},
	
	handleBackAndCancel: function() {
		var that = this;
		var deltaAuth = sap.suite.smartbusiness.utils.dirtyBitCheck({oldPayload: that.initialSelectedItems, newPayload: that.selectedItemsModel.getData(), objectType: "AUTHORIZATION"});
		
		if(deltaAuth.updates.length || deltaAuth.deletes.length) {
			var backDialog = new sap.m.Dialog({
				icon:"sap-icon://warning2",
				title: that.oApplicationFacade.getResourceBundle().getText("WARNING"),
				state:"Error",
				type:"Message",
				content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("ON_BACK_WARNING")})],
				beginButton: new sap.m.Button({
					text: that.oApplicationFacade.getResourceBundle().getText("CONTINUE"),
					press: function(){
						sap.suite.smartbusiness.utils.replaceHash({action:"authorizeSBEvaluation", route:"detail", context: that.getView().getBindingContext().getPath().split("/")[1]});
					}
				}),
				endButton: new sap.m.Button({
					text: that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
					press: function(){backDialog.close();}
				})							
			});
			backDialog.open();
		}
		else {
			sap.suite.smartbusiness.utils.replaceHash({action:"authorizeSBEvaluation", route:"detail", context: that.getView().getBindingContext().getPath().split("/")[1]});
		}
	}
});