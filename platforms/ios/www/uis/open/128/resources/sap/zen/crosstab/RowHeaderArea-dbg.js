jQuery.sap.declare("sap.zen.crosstab.RowHeaderArea");
jQuery.sap.require("sap.zen.crosstab.BaseArea");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");

sap.zen.crosstab.RowHeaderArea = function (oCrosstab) {
	"use strict";
	sap.zen.crosstab.BaseArea.call(this, oCrosstab);
	this.sAreaType = sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA;
	this.iRenderStartRow = 0;
	this.iRenderRowCnt = 0;
	this.bLastPageLoaded = false;
};

sap.zen.crosstab.RowHeaderArea.prototype = jQuery.sap.newObject(sap.zen.crosstab.BaseArea.prototype);

sap.zen.crosstab.RowHeaderArea.prototype.renderArea = function (oRenderManager) {
	var sClasses = "sapzencrosstab-RowHeaderArea";
	if (this.oCrosstab.getPropertyBag().isMobileMode()) {
		sClasses += " sapzencrosstab-MobileHeaderSeparator"; 
	}
	this.renderContainerStructure(oRenderManager, sClasses, this.oCrosstab.isVCutOff(), false);
};
