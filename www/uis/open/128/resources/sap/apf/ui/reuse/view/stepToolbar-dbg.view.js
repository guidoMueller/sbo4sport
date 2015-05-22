/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class  stepToolbar
 * @name  stepToolbar
 * @description toolbar for a step shown in main area
 * @memberOf sap.apf.ui.reuse.view
 */
sap.ui.jsview("sap.apf.ui.reuse.view.stepToolbar", {
	getControllerName : function() {
		return "sap.apf.ui.reuse.controller.stepToolbar";
	},
	createContent : function(oController) {
		/*this.selectionCountLayout =  new sap.ui.commons.layout.HorizontalLayout(); //{content: [this.selectedNumber,this.deleteButton]}
		this.toolbarIconsLayout = new sap.ui.commons.layout.HorizontalLayout().addStyleClass('toolbarIconsLayout');
		this.toolbar =  new sap.ui.commons.Toolbar().setDesign(sap.ui.commons.ToolbarDesign.Standard).setVisible(false).addStyleClass('toolbar');
		this.toolbar.addItem(this.selectionCountLayout);
		this.toolbar.addItem(this.toolbarIconsLayout);
		this.toolbarLayout = new sap.ui.commons.layout.HorizontalLayout({content: this.toolbar}).addStyleClass("toolbarLayout");*/
		this.chartToolbar = new sap.ca.ui.charts.ChartToolBar({
			showLegend: true,
			showFullScreen: true
		});
		return this.chartToolbar;
	}
});