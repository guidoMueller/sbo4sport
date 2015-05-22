/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class stepGallery
 *@name stepGallery
 *@memberOf sap.apf.ui.reuse.controller
 *@description controller for step Gallery 
 * 
 */
sap.ui.controller("sap.apf.ui.reuse.controller.stepGallery", {
	/**
	 *@this {sap.apf.ui.reuse.controller.stepGallery}
	 */
	/**
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method getGalleryElementsData 
	*@description Returns array needed to draw step gallery content.
	*@returns   {object} jsonData
	*/
	getGalleryElementsData : function() {
		var aGalleryElements = [];
		var aCategories = this.oCoreApi.getCategories();
		var label = this.oCoreApi.getTextNotHtmlEncoded("label");
		var steps = this.oCoreApi.getTextNotHtmlEncoded("steps");
		var category = this.oCoreApi.getTextNotHtmlEncoded("category");
		var oMessageObject;
		if (aCategories.length === 0) {
			oMessageObject = this.oCoreApi.createMessageObject({
				code : "6001",
				aParameters : [ "Categories" ]
			});
			this.oCoreApi.putMessage(oMessageObject);
		}
		var i;
		for(i = 0; i < aCategories.length; i++) {
			var oGalleryElement = {};
			var oCategory = aCategories[i];
			var categoryName = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label);
			var oCategoryDetails = {};
			if (!oCategory.label) {
				oMessageObject = this.oCoreApi.createMessageObject({
					code : "6002",
					aParameters : [ label, category + ": " + categoryName ]
				});
				this.oCoreApi.putMessage(oMessageObject);
			}
			oCategoryDetails.title = this.oCoreApi.getTextNotHtmlEncoded(oCategory.label).toUpperCase();
			oCategoryDetails.id = oCategory.id;
			oGalleryElement.categoryDetails = oCategoryDetails;
			oGalleryElement.stepTemplates = [];
			aGalleryElements.push(oGalleryElement);
		}
		var aStepTemplates = this.oCoreApi.getStepTemplates();
		if (aStepTemplates.length === 0) {
			oMessageObject = this.oCoreApi.createMessageObject({
				code : "6002",
				aParameters : [ steps, category ]
			});
			this.oCoreApi.putMessage(oMessageObject);
		}
		var j, k;
		for(i =0; i<aStepTemplates.length; i++) {
			var oStepTemplate = aStepTemplates[i];
			//var stepTitle = this.oCoreApi.getTextNotHtmlEncoded(oStepTemplate.title);
			aCategories = oStepTemplate.categories;
			for( j =0; j< aCategories.length; j++) {
				var Category = aCategories[j];
				for(  k = 0 ; k<aGalleryElements.length; k++) {
					var galleryElement = aGalleryElements[k];
					if (galleryElement.categoryDetails.id === Category.id) {
						var oStepDetail = {};
						if (!oStepTemplate.title) {
							oMessageObject = this.oCoreApi.createMessageObject({
								code : "6003",
								aParameters : [ "Title" ]
							});
							this.oCoreApi.putMessage(oMessageObject);
						}
						oStepDetail.maintitle = this.oCoreApi.getTextNotHtmlEncoded(oStepTemplate.title);
						oStepDetail.id = oStepTemplate.id;
						oStepDetail.representationtypes = oStepTemplate.getRepresentationInfo();
						oStepDetail.defaultRepresentationType = oStepDetail.representationtypes[0];
						galleryElement.stepTemplates.push(oStepDetail);
					}
				}
			}
		}
		var jsonData = {
			GalleryElements : aGalleryElements
		};
		return jsonData;
	},
	/*
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method onInit 
	 *@description Bind gallery elements data to step gallery view.
	*/
	/*
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method onInit 
	 *@description Bind gallery elements data to step gallery view.
	*/
	onInit : function() {
		this.oCoreApi = this.getView().getViewData().oCoreApi;
		this.oUiApi = this.getView().getViewData().uiApi;
		var aGalleryElements = this.getGalleryElementsData().GalleryElements;
		var oModel = new sap.ui.model.json.JSONModel({
			"GalleryElements" : aGalleryElements
		});
		this.getView().setModel(oModel, "json");
	},
	/**
	 *@memberOf sap.apf.ui.reuse.controller.stepGallery
	 *@method getStepDetails
	 *@param {object} index of the category in the binding of step gallery dialog
	 *@param {string} index of the step in the binding of step gallery dialog
	 *@return details of a step i.e. id,representationTypes etc
	 */
	getStepDetails : function(categoryIndex, stepIndex) {
		var aGalleryElements = this.getGalleryElementsData().GalleryElements;
		var stepDetails = aGalleryElements[categoryIndex].stepTemplates[stepIndex];
		return stepDetails;
	},
	openHierarchicalSelectDialog : function() {
		if (this.oHierchicalSelectDialog) {
			this.oHierchicalSelectDialog.destroy();
		}
		this.oHierchicalSelectDialog = new sap.ui.jsfragment("sap.apf.ui.reuse.fragment.stepGallery", this);
		this.oHierchicalSelectDialog.setModel(this.getView().getModel("json"), "json");
		this.oHierchicalSelectDialog.open();
	},
	/**
	*@memberOf sap.apf.ui.reuse.controller.stepGallery
	*@method onStepPress
	*@param {object} evt event object caught from add step button
	*@param {string} sId Id for step being added
	*@param {object} oRepresentationType Representation
	*@description creates new step.
	*/
	onStepPress : function(sId, oRepresentationType) {
		this.oHierchicalSelectDialog.close();
		this.oUiApi.getLayoutView().setBusy(true);
		this.oCoreApi.createStep(sId, this.oUiApi.getAnalysisPath().getController().callBackForUpdatePathAndSetLastStepAsActive.bind(this.oUiApi.getAnalysisPath().getController()), oRepresentationType);
		this.oUiApi.getLayoutView().setBusy(true);
		this.oUiApi.getAnalysisPath().getController().refresh(-1);
	}
});