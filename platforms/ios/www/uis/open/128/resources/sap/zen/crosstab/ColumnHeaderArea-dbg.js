jQuery.sap.declare("sap.zen.crosstab.ColumnHeaderArea");
jQuery.sap.require("sap.zen.crosstab.BaseArea");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");

sap.zen.crosstab.ColumnHeaderArea = function (oCrosstab) {
	"use strict";
	sap.zen.crosstab.BaseArea.call(this, oCrosstab);
	this.sAreaType = sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA;
	this.iRenderStartCol = 0;
	this.iRenderColCnt = 0;
	this.bLastPageLoaded = false;
};

sap.zen.crosstab.ColumnHeaderArea.prototype = jQuery.sap.newObject(sap.zen.crosstab.BaseArea.prototype);

sap.zen.crosstab.ColumnHeaderArea.prototype.renderArea = function (oRenderManager) {
	this.renderContainerStructure(oRenderManager, "sapzencrosstab-ColumnHeaderArea", false, this.oCrosstab.isHCutOff());
};
