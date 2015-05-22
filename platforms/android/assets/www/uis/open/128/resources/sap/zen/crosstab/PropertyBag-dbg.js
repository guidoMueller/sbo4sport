jQuery.sap.declare("sap.zen.crosstab.PropertyBag");

sap.zen.crosstab.PropertyBag = function (oCrosstab) {

	var bDebugMode = false;
	var bMobileMode = false;
	var bPixelScrolling = false;
	var bSelectionEnabled = false;
	var bHasToolbar = false;
	var iToolbarHeight = 0;
	var bDisplayExceptions = false;
	var bEnableColResize = true;
	var bTestMobileMode = false;
	var sContextMenuCommand = null;
	var iMaxHeaderWidth = 0;

	this.setMaxHeaderWidth = function(piHeaderWidth) {
		iMaxHeaderWidth = piHeaderWidth;
	};
	
	this.getMaxHeaderWidth = function() {
		return iMaxHeaderWidth;
	};
	
	this.isDebugMode = function () {
		return bDebugMode;
	};

	this.setDebugMode = function (pbDebugMode) {
		bDebugMode = pbDebugMode;
	};

	this.isMobileMode = function () {
		return bMobileMode;
	};

	this.isTestMobileMode = function () {
		return bTestMobileMode;
	};

	this.setMobileMode = function (pbMobileMode) {
		bMobileMode = pbMobileMode;
	};

	this.isPixelScrolling = function () {
		return bPixelScrolling;
	};

	this.setPixelScrolling = function (pbPixelScrolling) {
		bPixelScrolling = pbPixelScrolling;
	};

	this.isSelectionEnabled = function () {
		return bSelectionEnabled;
	};

	this.setSelectionEnabled = function (pbSelectionEnabled) {
		bSelectionEnabled = pbSelectionEnabled;
	};

	this.isDisplayExceptions = function () {
		return bDisplayExceptions;
	};

	this.setDisplayExceptions = function (pbDisplayExceptions) {
		bDisplayExceptions = pbDisplayExceptions;
	};

	this.addText = function (sKey, sText) {
		sap.zen.CrosstabTextCache.oTexts[sKey] = sText;
	};

	this.getText = function (sKey) {
		return sap.zen.CrosstabTextCache.oTexts[sKey];
	};

	this.setContextMenuCommand = function (psContextMenuCommand) {
		sContextMenuCommand = psContextMenuCommand;
	};

	this.getContextMenuCommand = function () {
		return sContextMenuCommand;
	};

	this.setHasToolbar = function (pbHasToolbar) {
		bHasToolbar = pbHasToolbar;
	};

	this.hasToolbar = function () {
		return bHasToolbar;
	};

	this.setToolbarHeight = function (piToolbarHeight) {
		iToolbarHeight = piToolbarHeight;
	};

	this.getToolbarHeight = function () {
		var iHeight = 0;
		if (bHasToolbar) {
			iHeight = iToolbarHeight;
		}
		return iHeight;
	};

	this.setEnableColResize = function (pbEnableColResize) {
		bEnableColResize = pbEnableColResize;
	};

	this.isEnableColResize = function () {
		return bEnableColResize;
	};

	this.addSortingTextLookup = function (sKey, oSortingTextLookup) {
		sap.zen.CrosstabTextCache.oSortingTextLookupTable[sKey] = oSortingTextLookup;
	};

	this.getSortingAltText = function (sKey) {
		var sAltText = "";
		if (sap.zen.CrosstabTextCache.oSortingTextLookupTable[sKey]) {
			sAltText = sap.zen.CrosstabTextCache.oSortingTextLookupTable[sKey].alttext;
		}
		return sAltText;
	};

	this.getSortingToolTip = function (sKey) {
		var sTipKey = null;
		var sToolTip = "";
		if (sap.zen.CrosstabTextCache.oSortingTextLookupTable[sKey]) {
			sTipKey = sap.zen.CrosstabTextCache.oSortingTextLookupTable[sKey].tooltipidx;
		}
		if (sTipKey !== undefined) {
			if (sap.zen.CrosstabTextCache.oSortingTextLookupTable[sTipKey]) {
				sToolTip = sap.zen.CrosstabTextCache.oSortingTextLookupTable[sTipKey].alttext;
			}
		}
		return sToolTip;
	};
};