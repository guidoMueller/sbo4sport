jQuery.sap.declare("sap.zen.crosstab.DataArea");
jQuery.sap.require("sap.zen.crosstab.BaseArea");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");

sap.zen.crosstab.DataArea = function (oCrosstab) {
	"use strict";
	sap.zen.crosstab.BaseArea.call(this, oCrosstab);
	this.sAreaType = sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_AREA;
};

sap.zen.crosstab.DataArea.prototype = jQuery.sap.newObject(sap.zen.crosstab.BaseArea.prototype);

sap.zen.crosstab.DataArea.prototype.renderArea = function (oRenderManager) {
	this.renderContainerStructure(oRenderManager, "sapzencrosstab-DataArea", this.oCrosstab.isVCutOff(), this.oCrosstab
			.isHCutOff());
};

sap.zen.crosstab.DataArea.prototype.insertCell = function (oCell, iRow, iCol) {
	sap.zen.crosstab.BaseArea.prototype.insertCell.call(this, oCell, iRow, iCol);
	if (iCol === this.oDataModel.getColCnt() - 1 && oCell) {
		oCell.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_LAST_IN_ROW);
	}

	if (iRow === this.oDataModel.getRowCnt() - 1 && oCell) {
		oCell.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_LAST_IN_COL);
	}
};
