/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class stepGallery
 *@name  stepGallery Fragment
 *@description Holds the available steps of configuration and displays them in a dialog using js fragment
 *@memberOf sap.apf.ui.reuse.view
 * 
 */
sap.ui.jsfragment("sap.apf.ui.reuse.fragment.stepGallery", {
	createContent : function(oController) {
		this.oController = oController;
		this.contentWidth = jQuery(window).height() * 0.6 + "px"; // height and width for the dialog relative to the window
		this.contentHeight = jQuery(window).height() * 0.6 + "px";
		var self = this;
		this.oCoreApi = oController.oCoreApi;
		this.oUiApi = oController.oUiApi;
		this.hierarchicalDialog = new sap.ca.ui.HierarchicalSelectDialog({ // step gallery
			title : self.oCoreApi.getTextNotHtmlEncoded("stepGallery"),
			contentWidth : self.contentWidth,
			contentHeight : self.contentHeight,
			select : function(evt) {
				self.oUiApi.getLayoutView().setBusy(true);
				var eventBindingContext = evt.getParameters().selectedItem.oBindingContexts.json.sPath.split('/');
				var categoryIndex = eventBindingContext[2];
				var stepIndex = eventBindingContext[4];
				var representationIndex = eventBindingContext[6];
				var stepDetails = oController.getStepDetails(categoryIndex, stepIndex); //TODO Is there any alternate way of getting step details from list binding???
				oController.onStepPress(stepDetails.id, stepDetails.representationtypes[representationIndex].representationId);
			},
			cancel : function() {
				var oSelf = this;
				oSelf.close();
				oSelf.destroy();
			}
		});
		this.categoryTitle = new sap.ca.ui.HierarchicalSelectDialogItem({ // Dialog Item to hold  list of categories
			title : self.oCoreApi.getTextNotHtmlEncoded("category"),
			entityName : "json>/GalleryElements",
			visible : true
		});
		this.categoryTemplate = new sap.m.StandardListItem({
			title : '{json>categoryDetails/title}',
			tooltip : '{json>categoryDetails/title}'
		});
		this.stepTitle = new sap.ca.ui.HierarchicalSelectDialogItem({ // Dialog Item to hold  list of steps
			//title: self.oCoreApi.getTextNotHtmlEncoded("step"),
			entityName : "json>stepTemplates"
		});
		this.stepTemplate = new sap.m.StandardListItem({
			title : '{json>maintitle}',
			tooltip : '{json>maintitle}'
		});
		this.representationTitle = new sap.ca.ui.HierarchicalSelectDialogItem({ // Dialog Item to hold  list of representations
			// title: self.oCoreApi.getTextNotHtmlEncoded("representation"),
			entityName : "json>representationtypes"
		});
		this.representationTemplate = new sap.m.StandardListItem({
			icon : '{json>picture}'
		});
		this.representationTemplate.bindProperty("title", "json>label", function(value) {
			if (value === null) {
				return null;
			}
			return self.oCoreApi.getTextNotHtmlEncoded(value);
		});
		this.representationTemplate.bindProperty("tooltip", "json>label", function(value) {
			if (value === null) {
				return null;
			}
			return self.oCoreApi.getTextNotHtmlEncoded(value);
		});
		this.categoryTitle.setListItemTemplate(this.categoryTemplate); //binding list of categories,steps and representations to the dialog item
		this.stepTitle.setListItemTemplate(this.stepTemplate);
		this.representationTitle.setListItemTemplate(this.representationTemplate);
		this.hierarchicalDialog.addItem(this.categoryTitle); //Category list
		this.hierarchicalDialog.addItem(this.stepTitle);// Steps in a category
		this.hierarchicalDialog.addItem(this.representationTitle);//Representations in a step
		return this.hierarchicalDialog;
	}
});