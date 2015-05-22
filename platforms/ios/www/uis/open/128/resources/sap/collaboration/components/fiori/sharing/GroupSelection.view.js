/*!
 * @copyright@
 */
sap.ui.jsview("sap.collaboration.components.fiori.sharing.GroupSelection",{getControllerName:function(){return"sap.collaboration.components.fiori.sharing.GroupSelection"},createContent:function(c){var p=this.getViewData().controlId;this.oGroupList=new sap.m.List(p+"_GroupList",{inset:false,growing:true,growingThreshold:20,showNoData:false});var d=new sap.m.VBox(p+"_DisplayGroupsLayout",{width:"100%",height:"100%",items:[this.oGroupList]});return d}});
