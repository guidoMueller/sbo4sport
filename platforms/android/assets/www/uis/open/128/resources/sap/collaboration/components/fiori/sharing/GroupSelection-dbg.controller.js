/*!
 * @copyright@
 */

sap.ui.controller("sap.collaboration.components.fiori.sharing.GroupSelection", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * Initialize class variables
	 * memberOf DisplayGroups
	 */
	onInit: function() {
		this.sPrefixId = this.getView().getViewData().controlId;
		this.oLangBundle = this.getView().getViewData().langBundle;
		this.fSelectGroupCallback = this.getView().getViewData().selectGroupCallback;
		
		//this.bindGroupList();
		
		this.aGroupsLinkedToBO = this.getView().getViewData().groupsLinkedToBO;
	},
	/**
	* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	* (NOT before the first rendering! onInit() is used for that one!).
	*/
	onBeforeRendering: function() {
		this.setViewModel();
//		this.getView().oGroupSearchField.setValue("");
	},
	/**
	* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	* This hook is the same one that SAPUI5 controls get after being rendered.
	*/
	onAfterRendering: function() {
	},

	/**
	* Sets the view model
	* @private
	*/
	setViewModel : function() {
		this.oViewModel = this.getView().getViewData().oDataModel;
		//this.oViewModel.refresh(true);
		this.getView().setModel(this.oViewModel);
		
		// the bind should only happens once (on the levl of the inint), but we have it here so that we can get any updates that happens to the Jam groups
		// whether add, delete, update in the same session each time the user opens the group selection view
		// Note: we did not use the model.refresh because the model.refresh may fetch all the groups which might cause an issue if the groups that the model want
		// to fetch is > the max than Jam can return.
		// So by binding each time, we guarantee we fetch the newest list of groups and only 20 groups.
		this.bindGroupList();
	},
	
	/**
	* Binds data to the group List
	* @private
	*/
	bindGroupList : function() {
		
		var self = this;
		var fOnPress = function(oControlEvent){
			self.oSelectedGroup = oControlEvent.getSource().getBindingContext().getObject();
			self.fSelectGroupCallback(oControlEvent, self.oSelectedGroup);
				
		};
		
		var oItemTemplateStandardIcon = new sap.m.StandardListItem({
			title : {
				parts: [
						"Name",
						"GroupType"
					],
					formatter : function(sName,sGroupType) {
						return sName + " (" + sGroupType + ")";
					}
				},
		/*	icon : {
					parts: [
			               "Id"
			               ],
					formatter : function(iId){
									if(self.aGroupsLinkedToBO){
										for (var i = 0; i <	self.aGroupsLinkedToBO.length; i++){
											if (self.aGroupsLinkedToBO[i].Id.toString() === iId.toString()){
												return "sap-icon://share-2";											
											}											
										}
									}
								}
					},*/
			type : sap.m.ListType.Active,
			press: fOnPress
		});

		this.getView().oGroupList.destroyItems();
		this.getView().oGroupList.bindAggregation("items","/Groups", oItemTemplateStandardIcon);
	},
	
	/**
	* Returns the path of the selected group in the list
	* @private
	*/
	getSelectedGroup: function() {
		return this.oSelectedGroup;
	},
	
	/**
	* Event handler for the onLiveChange of the search field
	* @private
	*/
	/*onGroupSearchLiveChange : function(event) {
		if(event.getParameter("newValue") !== ""){
			var aGroupSearchResult = [];
			for(var i = 0; i < this.aJamGroups.length; i++){
				if(this.aJamGroups[i].Name.toLowerCase().search(event.getParameter("newValue").toLowerCase()) !== -1)
					aGroupSearchResult.push(this.aJamGroups[i]);
			}
			
			this.aJamGroups = aGroupSearchResult;
		}
			
		this.setViewModel();
		
		this.aJamGroups = this.getView().getViewData().groups;
	}
	*/
});
