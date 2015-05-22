/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2013 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.m.MessageBox");

sap.ca.scfld.md.controller.BaseDetailController.extend("sap.suite.ui.smartbusiness.designtime.association.view.S3", {

	onInit : function() { 
		var that = this;
		var view = this.getView();

		this.oRouter.attachRouteMatched(function(evt) {
			if (evt.getParameter("name") === "detail") {

				var context = new sap.ui.model.Context(view.getModel(), '/' + (evt.getParameter("arguments").contextPath));
				view.setBindingContext(context);

				that.contextIndicatorId = view.getBindingContext().getProperty("ID") || evt.getParameter("arguments").contextPath.split("(")[1].split(",")[0].split("=")[1].replace(/'/g,'');

				var model = new sap.ui.model.json.JSONModel();
				that.getView().byId("kpiAssociationTable").getBinding("items").filter(new sap.ui.model.Filter([new sap.ui.model.Filter("SOURCE_INDICATOR", sap.ui.model.FilterOperator.EQ, that.contextIndicatorId) , new sap.ui.model.Filter("TARGET_INDICATOR", sap.ui.model.FilterOperator.EQ, that.contextIndicatorId)],false));
				that.getView().byId("tags").getBinding("items").filter(new sap.ui.model.Filter([new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, that.contextIndicatorId) , new sap.ui.model.Filter("IS_ACTIVE", sap.ui.model.FilterOperator.EQ, 1), new sap.ui.model.Filter("TYPE", sap.ui.model.FilterOperator.EQ, "IN")],true));
			}
		}, this);

		this.oHeaderFooterOptions =
		{
				bSuppressBookmarkButton: {},
				oEditBtn : {
					sI18nBtnTxt : "ADD_ASSOCIATION",
					onBtnPressed : function(evt) {
						sap.suite.smartbusiness.utils.replaceHash({action:"manageSBKPIAssociation", route:"associationCreate", context:that.getView().getBindingContext().sPath.substring(1)});
					}
				}
		};
		that.byId("idDirection").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));
		that.byId("associationEdit").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));
		that.byId("associationDelete").setColor(sap.ui.core.theming.Parameters.get("sapUiLightText"));
	},

	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	formatAssociationCount: function(sourceCount,targetCount) {
		var that = this;
		if(sourceCount==null && targetCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"(0)";
		}
		if(sourceCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+targetCount+")";
		}
		if(targetCount==null){
			return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+sourceCount+")";
		}
		var count = (parseInt(sourceCount)+parseInt(targetCount));
		return that.oApplicationFacade.getResourceBundle().getText("ASSOCIATIONS")+"("+count.toString()+")";
	},

	formatStatus: function(status) {
		return ((status) ? this.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE") 
				: this.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT"));
	},

	formatGoalType: function(goalType) {
		var goalTypeText = null;
		switch(goalType) {
		case 'MA': goalTypeText = this.oApplicationFacade.getResourceBundle().getText("MAXIMIZING"); break;
		case 'MI': goalTypeText = this.oApplicationFacade.getResourceBundle().getText("MINIMIZING"); break;
		case 'RA': goalTypeText = this.oApplicationFacade.getResourceBundle().getText("RANGE"); break;
		default : goalTypeText = this.oApplicationFacade.getResourceBundle().getText("NONE");
		}
		return goalTypeText;
	},

	formatTags: function(tag) { 
		return ((this.getView().byId("tags").getItems().length > 1) ? (', ' + tag) : (tag));
	},
	formatStatusOfAssociation: function(is_active,counter){
		var that = this;
		if(counter=="2"){
			var str = that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE")+","+that.oApplicationFacade.getResourceBundle().getText("STATUS_DRAFT");
			return str;
		}
		if(is_active==0){
			return that.oApplicationFacade.getResourceBundle().getText("STATUS_NEW");
		}
		if(is_active==1){
			return that.oApplicationFacade.getResourceBundle().getText("STATUS_ACTIVE");
		}
	},

	formatProperties: function(name, value)  {
		var prop = ((this.getView().byId("assoProperties").getItems().length > 1) ? (", " + name + " : " + value) : (name + " : " + value+","));
		return prop;
	},
	formatAssociationType: function(associationType){
		if(associationType=="SUPPORTING"){
			return this.oApplicationFacade.getResourceBundle().getText("SUPPORTING");
		}
		else{
			return this.oApplicationFacade.getResourceBundle().getText("CONFLICTING");
		}
	},
	formatArrowDirection: function(source_indicator) {
		return ((source_indicator == this.contextIndicatorId) ? ("sap-icon://arrow-right") : ("sap-icon://arrow-left"));  
	},

	formatTargetIndicatorText: function(sourceIndicator, targetIndicator, sourceIndicatorTitle, targetIndicatorTitle) { 
		var indicatorText = null;
		if(targetIndicator == this.contextIndicatorId) {
			indicatorText = sourceIndicatorTitle;
		}
		else {
			indicatorText = targetIndicatorTitle;
		}
		return indicatorText;
	},

	handleAssociationEdit: function(evt) {
		var that = this;
		var associationPathText;
		if(evt.getSource().getBindingContext().getObject().COUNTER=="1"){
			associationPathText = evt.getSource().getBindingContext().sPath.substring(1).replace("ASSOCIATIONS_MODELER","ASSOCIATIONS");
		}
		else{
			associationPathText = evt.getSource().getBindingContext().sPath.substring(1).replace("ASSOCIATIONS_MODELER","ASSOCIATIONS").replace("IS_ACTIVE=1","IS_ACTIVE=0")
		}
		sap.suite.smartbusiness.utils.replaceHash({action:"manageSBKPIAssociation", route:"associationEdit", context:(that.getView().getBindingContext().sPath.substring(1).replace("INDICATORS_MODELER","INDICATORS") + "/" + associationPathText)});
	},

	handleAssociationDelete: function(event) {
		var that = this;
		that.entity = event.getSource().getBindingContext().sPath.substring(1).replace("ASSOCIATIONS_MODELER","ASSOCIATIONS");
		that.entityObj=that.formOldObjectForAssociation(that.entity);

		var confirmDialog = new sap.m.Dialog({
			title:that.oApplicationFacade.getResourceBundle().getText("DELETE"),
			type:"Message",
			content:[new sap.m.Text({text:that.oApplicationFacade.getResourceBundle().getText("DELETE_ASSOCIATION")})],
			beginButton: new sap.m.Button({
				text:"Ok",
				press: function(oEvent){
				
					confirmDialog.close();
					var ODataModel = that.oApplicationFacade.getODataModel();
					/*ODataModel.remove(that.entity,null,function(data){
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
						ODataModel.refresh();
					
					
					},
					function(error){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"));
					});*/
					
					//ajax call to delete the association
					sap.suite.smartbusiness.utils.remove(sap.suite.smartbusiness.utils.serviceUrl("ASSOCIATIONS_CUD"),that.entityObj,function(data){
						sap.m.MessageToast.show(that.oApplicationFacade.getResourceBundle().getText("DELETION_SUCCESSFUL"));
						ODataModel.refresh();
					},
					function(error){
						sap.suite.smartbusiness.utils.showErrorMessage(that.oApplicationFacade.getResourceBundle().getText("DELETION_FAILED"));
					});
					 //////////////////
					
					}
			}),
			endButton: new sap.m.Button({
				text:that.oApplicationFacade.getResourceBundle().getText("CANCEL"),
				press:function(){
					confirmDialog.close();}
			})                                              
		});
		confirmDialog.open();                                                                 
	},
	formOldObjectForAssociation: function(str) {
		var that = this;
		
		var oldAssociationPayload={};
		oldAssociationPayload.TYPE = str.substring(str.indexOf("'",str.search("TYPE"))+1, str.indexOf("'",str.indexOf("'",str.search("TYPE"))+1));
		oldAssociationPayload.SOURCE_INDICATOR= str.substring(str.indexOf("'",str.search("SOURCE_INDICATOR"))+1, str.indexOf("'",str.indexOf("'",str.search("SOURCE_INDICATOR"))+1));
		oldAssociationPayload.TARGET_INDICATOR= str.substring(str.indexOf("'",str.search("TARGET_INDICATOR"))+1, str.indexOf("'",str.indexOf("'",str.search("TARGET_INDICATOR"))+1));
		oldAssociationPayload.IS_ACTIVE= parseInt(str.substring(str.indexOf("=",str.search("IS_ACTIVE"))+1, str.indexOf("=",str.search("IS_ACTIVE"))+2));

		return oldAssociationPayload;
		
	},
});
