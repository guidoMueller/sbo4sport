jQuery.sap.declare("sap.zen.crosstab.CellStyleHandler");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");

sap.zen.crosstab.CellStyleHandler = {};

sap.zen.crosstab.CellStyleHandler.aStyles = [];
sap.zen.crosstab.CellStyleHandler.iDataCellAlternatingIndex = -1;
sap.zen.crosstab.CellStyleHandler.iHeaderCellAlternatingIndex = -1;

sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping = {};
sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[sap.zen.crosstab.rendering.RenderingConstants.ALERT_TYPE_BACKGROUND] = "Background";
sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[sap.zen.crosstab.rendering.RenderingConstants.ALERT_TYPE_FONT_COLOR] = "FontColor";
sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[sap.zen.crosstab.rendering.RenderingConstants.ALERT_TYPE_STATUS_SYMBOL] = "StatusSymbol";
sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[sap.zen.crosstab.rendering.RenderingConstants.ALERT_TYPE_TREND_ASCENDING_SYMBOL] = "TrendAscendingSymbol";
sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[sap.zen.crosstab.rendering.RenderingConstants.ALERT_TYPE_TREND_DESCENDING_SYMBOL] = "TrendDescendingSymbol";
sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[sap.zen.crosstab.rendering.RenderingConstants.ALERT_TYPE_TREND_GREY_SYMBOL] = "TrendGreySymbol";

sap.zen.crosstab.CellStyleHandler.getCompleteStyleName = function(sStyle, sCellType) {
	var sCompleteStyle = "";
	if (sCellType === sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL) {
		sCompleteStyle = sap.zen.crosstab.rendering.RenderingConstants.STYLE_PREFIX_DATA_CELL + sStyle;
	} else {
		sCompleteStyle = sap.zen.crosstab.rendering.RenderingConstants.STYLE_PREFIX_HEADER_CELL + sStyle;
	}
	return sCompleteStyle;
};

sap.zen.crosstab.CellStyleHandler.pushStyle = function(sCompleteStyle) {
	var iIndex = sap.zen.crosstab.CellStyleHandler.aStyles.push(sCompleteStyle);
	// array.push returns the new length of the array, not the index of the new element
	iIndex--;
	return iIndex;
};

sap.zen.crosstab.CellStyleHandler.getStyleId = function (sStyle, sCellType) {
	var sCompleteStyle = sap.zen.crosstab.CellStyleHandler.getCompleteStyleName(sStyle, sCellType);
	var iIndex = sap.zen.crosstab.CellStyleHandler.aStyles.indexOf(sCompleteStyle);
	if (iIndex === -1) {
		iIndex = sap.zen.crosstab.CellStyleHandler.pushStyle(sCompleteStyle);
	}
	return iIndex;
};


sap.zen.crosstab.CellStyleHandler.pushPresetStyle = function(sStyle, sCellType) {
	var sCompleteStyle = sap.zen.crosstab.CellStyleHandler.getCompleteStyleName(sStyle, sCellType);
	var iIndex = sap.zen.crosstab.CellStyleHandler.pushStyle(sCompleteStyle);
	return iIndex;
};

//These styles are added in advance because they need special handling later on: IE8 doesn't support alternating styles
sap.zen.crosstab.CellStyleHandler.iDataCellAlternatingIndex = sap.zen.crosstab.CellStyleHandler.pushPresetStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_ALTERNATING, sap.zen.crosstab.rendering.RenderingConstants.TYPE_DATA_CELL);
sap.zen.crosstab.CellStyleHandler.iHeaderCellAlternatingIndex = sap.zen.crosstab.CellStyleHandler.pushPresetStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_ALTERNATING, sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);

sap.zen.crosstab.CellStyleHandler.getCssClasses = function (aCellStyles, bIsIE8) {
	var sCss = "";
	var iStylesLength = aCellStyles.length;
	for ( var i = 0; i < iStylesLength; i++) {
		var iStyleId = aCellStyles[i];
		if (iStyleId !== -1) {
			if (!(bIsIE8 && (iStyleId === sap.zen.crosstab.CellStyleHandler.iDataCellAlternatingIndex || iStyleId === sap.zen.crosstab.CellStyleHandler.iHeaderCellAlternatingIndex))) {
				var sStyle = sap.zen.crosstab.CellStyleHandler.aStyles[iStyleId];
				if (sStyle) {
					sCss += sStyle;
					sCss += " ";
				}
			}
		}
	}
	return sCss;
};

sap.zen.crosstab.CellStyleHandler.getStyleForExceptionViz = function (iFormatType, iAlertLevel) {
	var style = "Alert" + iAlertLevel + sap.zen.crosstab.CellStyleHandler.oExceptionVisualizationMapping[iFormatType];
	return style;
};

sap.zen.crosstab.CellStyleHandler.setExceptionStylesOnCell = function (oCell, iFormatType, iAlertLevel) {
	if (iFormatType > 4) {
		oCell.getArea().columnHasSymbolException(oCell.getCol());
		oCell.addStyle("SymbolAlertBackground");
	}
	var sStyle = sap.zen.crosstab.CellStyleHandler.getStyleForExceptionViz(iFormatType, iAlertLevel);
	if (sStyle) {
		oCell.addStyle(sStyle);
	}
};
