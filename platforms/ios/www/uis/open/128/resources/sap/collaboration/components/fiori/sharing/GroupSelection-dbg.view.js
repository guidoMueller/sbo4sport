/*!
 * @copyright@
 */

sap.ui.jsview("sap.collaboration.components.fiori.sharing.GroupSelection", {

	/**
	 * Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * memberOf DisplayGroups
	 */ 
	getControllerName : function() {
		return "sap.collaboration.components.fiori.sharing.GroupSelection";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away.
	 * Creates and returns a UI5 mobile list 
	 */ 
	createContent : function(oController) {
		var sPrefixId = this.getViewData().controlId;
		
		/*this.oGroupSearchField = new sap.m.SearchField(sPrefixId + "_GroupSearch", {
			width: "100%",
			search: function(event) {
				oController.onGroupSearchPress(event);
			},
			liveChange: function(event) {
				oController.onGroupSearchLiveChange(event);
			}
		});*/
		
		this.oGroupList = new sap.m.List(sPrefixId + "_GroupList", {
			inset : false,
			growing : true,
			growingThreshold : 20,
			showNoData : false
		});
		
		/*var oDisplayGroupsLayout = new sap.ui.layout.VerticalLayout(sPrefixId + "_DisplayGroupsLayout", {
			width: "100%",
		    content: [this.oGroupSearchField, this.oGroupList]
		});*/
		var oDisplayGroupsVBox = new sap.m.VBox(sPrefixId + "_DisplayGroupsLayout", {
			width: "100%",
			height: "100%",
		    items: [this.oGroupList]
		});
		
		return oDisplayGroupsVBox;
	}
});