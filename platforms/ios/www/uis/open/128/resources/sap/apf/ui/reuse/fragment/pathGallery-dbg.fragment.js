/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class pathGallery
 *@name  pathGallery Fragment
 *@description Holds the saved paths and displays them in a dialog using js fragment
 *@memberOf sap.apf.ui.reuse.fragment
 * 
 */
sap.ui.jsfragment("sap.apf.ui.reuse.fragment.pathGallery", {
	createContent : function(oController) {
		this.oController = oController;
		this.contentWidth = jQuery(window).height()* 0.6+"px"; // height and width for the dialog relative to the window
		this.contentHeight = jQuery(window).height()* 0.6+"px";
		var self = this;
		this.oCoreApi = oController.oCoreApi;
		this.oUiApi = oController.oUiApi;
		this.pathGalleryHierarchicalDialog = new sap.ca.ui.HierarchicalSelectDialog({ // path gallery
			title : self.oCoreApi.getTextNotHtmlEncoded("select-analysis-path"),
			contentWidth : self.contentWidth,
			contentHeight : self.contentHeight,
			select : function(evt) {
				self.oUiApi.getLayoutView().setBusy(true);
				var eventBindingContext = evt.getParameters().selectedItem.oBindingContexts.json.sPath.split('/');
				var pathName = this.getModel("json").getData().GalleryElements[eventBindingContext[2]].AnalysisPathName;
				var analysisPath = this.getModel("json").getData().GalleryElements[eventBindingContext[2]].AnalysisPath;
				var activeStepindex = eventBindingContext[5];
				oController.openPath(pathName, analysisPath, activeStepindex);
				self.oUiApi.getLayoutView().setBusy(false);
			},
			cancel : function() {
				var oSelf = this;
				self.oUiApi.getLayoutView().setBusy(false);
				oSelf.close();
				oSelf.destroy();
			}
		});
		this.pathName = new sap.ca.ui.HierarchicalSelectDialogItem({ // Dialog Item to hold  list of paths
			title : self.oCoreApi.getTextNotHtmlEncoded("select-analysis-path"),
			entityName : "json>/GalleryElements",
			visible : true
		});
		this.pathTemplate = new sap.m.StandardListItem({
			title : '{json>AnalysisPathName}',
			description : '{json>description}',
			tooltip : '{json>AnalysisPathName}'
		});
		this.stepTitle = new sap.ca.ui.HierarchicalSelectDialogItem({ // Dialog Item to hold  list of steps
			entityName : "json>StructuredAnalysisPath/steps"
		});
		this.stepTemplate = new sap.m.StandardListItem({
			title : '{json>title}',
			icon : '{json>imgSrc}',
			tooltip : '{json>title}'
		});
		this.pathName.setListItemTemplate(this.pathTemplate); //binding list of paths,steps to the dialog item
		this.stepTitle.setListItemTemplate(this.stepTemplate);
		this.pathGalleryHierarchicalDialog.addItem(this.pathName); //Path Names list
		this.pathGalleryHierarchicalDialog.addItem(this.stepTitle);// Steps in a path*/
		return this.pathGalleryHierarchicalDialog;
	}
});
