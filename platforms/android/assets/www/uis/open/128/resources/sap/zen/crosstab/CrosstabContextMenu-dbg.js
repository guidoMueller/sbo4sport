jQuery.sap.declare("sap.zen.crosstab.CrosstabContextMenu");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");

sap.zen.crosstab.CrosstabContextMenu = function (oCrosstab) {

	this.getContextMenuAction = function (sContextMenuComponentId, oDomClickedElement) {
		var oCore = sap.ui.getCore();
		var oElement = oDomClickedElement;
		while (!oCore.byId(oElement.attr("id"))) {
			oElement = oElement.parent();
		}

		if (oElement.attr("id") === oCrosstab.getId()) {
			return null;
		}

		var oCell = oCore.byId(oElement.attr("id"));
		var sCellType = oCell.getCellType();

		var sAreaType = oCell.getArea().getAreaType();
		var sAxis = "";
		if (sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_COLUMN_HEADER_AREA) {
			sAxis = "COLS";
		} else if (sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_ROW_HEADER_AREA) {
			sAxis = "ROWS";
		} else if (sAreaType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_DIMENSION_HEADER_AREA) {
			var sText = oCell.getText();
			if (sText !== undefined && sText !== null && sText !== "") {
				sAxis = "DIM";
			} else {
				var sSort = oCell.getSort();
				if (sSort !== undefined && sSort !== null && sSort !== "") {
					sAxis = "DIM";
				} else {
					return null;
				}
			} 
		} else if (sCellType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL) {
			sAxis = "DATA";
		} else {
			return null;
		}

		var iRow = oCell.getRow();
		var iCol = oCell.getCol();

		var sContextMenuCommand = oCrosstab.getPropertyBag().getContextMenuCommand();

		sContextMenuCommand = sContextMenuCommand.replace("__AXIS__", sAxis);
		sContextMenuCommand = sContextMenuCommand.replace("__ROW__", iRow);
		sContextMenuCommand = sContextMenuCommand.replace("__COL__", iCol);
		sContextMenuCommand = sContextMenuCommand.replace("__ID__", sContextMenuComponentId);
		sContextMenuCommand = sContextMenuCommand.replace("__DOM_REF_ID__", oDomClickedElement.attr("id"));

		return new Function(sContextMenuCommand);
	};

};
