/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.zen.crosstab.Crosstab.
jQuery.sap.declare("sap.zen.crosstab.Crosstab");
jQuery.sap.require("sap.zen.crosstab.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new Crosstab.
 * 
 * Accepts an object literal <code>mSettings</code> that defines initial 
 * property values, aggregated and associated objects as well as event handlers. 
 * 
 * If the name of a setting is ambiguous (e.g. a property has the same name as an event), 
 * then the framework assumes property, aggregation, association, event in that order. 
 * To override this automatic resolution, one of the prefixes "aggregation:", "association:" 
 * or "event:" can be added to the name of the setting (such a prefixed name must be
 * enclosed in single or double quotes).
 *
 * The supported settings are:
 * <ul>
 * <li>Properties
 * <ul>
 * <li>{@link #getWidth width} : sap.ui.core.CSSSize</li>
 * <li>{@link #getHeight height} : sap.ui.core.CSSSize</li></ul>
 * </li>
 * <li>Aggregations
 * <ul></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 

 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Add your documentation for the new Crosstab
 * @extends sap.ui.core.Control
 *
 * @author  
 * @version 14.1.0
 *
 * @constructor   
 * @public
 * @name sap.zen.crosstab.Crosstab
 */
sap.ui.core.Control.extend("sap.zen.crosstab.Crosstab", { metadata : {

	// ---- object ----

	// ---- control specific ----
	library : "sap.zen.crosstab",
	properties : {
		"width" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null},
		"height" : {type : "sap.ui.core.CSSSize", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.zen.crosstab.Crosstab with name <code>sClassName</code> 
 * and enriches it with the information contained in <code>oClassInfo</code>.
 * 
 * <code>oClassInfo</code> might contain the same kind of informations as described in {@link sap.ui.core.Element.extend Element.extend}.
 *   
 * @param {string} sClassName name of the class to be created
 * @param {object} [oClassInfo] object literal with informations about the class  
 * @param {function} [FNMetaImpl] constructor function for the metadata object. If not given, it defaults to sap.ui.core.ElementMetadata.
 * @return {function} the created class / constructor function
 * @public
 * @static
 * @name sap.zen.crosstab.Crosstab.extend
 * @function
 */


/**
 * Getter for property <code>width</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>width</code>
 * @public
 * @name sap.zen.crosstab.Crosstab#getWidth
 * @function
 */

/**
 * Setter for property <code>width</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sWidth  new value for property <code>width</code>
 * @return {sap.zen.crosstab.Crosstab} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.Crosstab#setWidth
 * @function
 */


/**
 * Getter for property <code>height</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {sap.ui.core.CSSSize} the value of property <code>height</code>
 * @public
 * @name sap.zen.crosstab.Crosstab#getHeight
 * @function
 */

/**
 * Setter for property <code>height</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {sap.ui.core.CSSSize} sHeight  new value for property <code>height</code>
 * @return {sap.zen.crosstab.Crosstab} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.Crosstab#setHeight
 * @function
 */


// Start of sap\zen\crosstab\Crosstab.js
///**
// * This file defines behavior for the Crosstab control, 
// */

jQuery.sap.require("sap.zen.crosstab.paging.PageManager");
jQuery.sap.require("sap.zen.crosstab.DataArea");
jQuery.sap.require("sap.zen.crosstab.ColumnHeaderArea");
jQuery.sap.require("sap.zen.crosstab.RowHeaderArea");
jQuery.sap.require("sap.zen.crosstab.DimensionHeaderArea");
jQuery.sap.require("sap.zen.crosstab.EventHandler");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderEngine");
jQuery.sap.require("sap.zen.crosstab.utils.Utils");
jQuery.sap.require("sap.zen.crosstab.PropertyBag");
jQuery.sap.require("sap.zen.crosstab.CrosstabCellApi");
jQuery.sap.require("sap.zen.crosstab.CrosstabTestProxy");
jQuery.sap.require("sap.zen.crosstab.CellStyleHandler");
jQuery.sap.require("sap.zen.crosstab.CrosstabContextMenu");

sap.zen.crosstab.Crosstab.prototype.init = function () {
	"use strict";

	this.scrolled = false;

	this.ensureIndexOf();

	var sCrosstabId = this.getId();
	var sDataAreaId = sCrosstabId + "_dataArea";
	this.dataArea = new sap.zen.crosstab.DataArea(this);
	this.dataArea.setId(sDataAreaId);

	var sColumnHeaderAreaId = sCrosstabId + "_colHeaderArea";
	this.columnHeaderArea = new sap.zen.crosstab.ColumnHeaderArea(this);
	this.columnHeaderArea.setId(sColumnHeaderAreaId);

	var sRowHeaderAreaId = sCrosstabId + "_rowHeaderArea";
	this.rowHeaderArea = new sap.zen.crosstab.RowHeaderArea(this);
	this.rowHeaderArea.setId(sRowHeaderAreaId);

	var sDimensionHeaderAreaId = sCrosstabId + "_dimHeaderArea";
	this.dimensionHeaderArea = new sap.zen.crosstab.DimensionHeaderArea(this);
	this.dimensionHeaderArea.setId(sDimensionHeaderAreaId);

	this.oPropertyBag = new sap.zen.crosstab.PropertyBag(this);
	this.oRenderEngine = new sap.zen.crosstab.rendering.RenderEngine(this);
	this.oEventHandler = new sap.zen.crosstab.EventHandler(this);
	this.oUtils = new sap.zen.crosstab.utils.Utils(this);

	this.iCalculatedWidth = -1;
	this.iCalculatedHeight = -1;

	this.fPageRequestHandler = null;

	this.bOnAfterRendering = true;

	this.bIsVResize = false;
	this.bIsHResize = false;

	this.iHierarchyIndentWidth = 0;
	this.iHierarchyIndentHeight = 0;

	this.iExceptionSymbolWidth = 0;

	// new default is COMPACT render mode
	this.iRenderMode = sap.zen.crosstab.rendering.RenderingConstants.RENDERMODE_COMPACT;

	this.bRenderScrollbars = true;

	this.bHCutOff = false;
	this.bVCutOff = false;

	this.sOnSelectCommand = null;
	this.sTransferDataCommand = null;
	this.sCallValueHelpCommand = null;

	this.iTotalRowCnt = 0;
	this.iTotalColCnt = 0;

	this.oHScrollbar = null;
	this.oVScrollbar = null;
	this.oHorizontalHeaderScrollbar = null;

	this.iTimeoutCounter = 0;
	this.oColHeaderHierarchyLevels = {};
	this.oRowHeaderHierarchyLevels = {};

	this.oTestProxy = new sap.zen.crosstab.CrosstabTestProxy(this, this.oEventHandler, this.oRenderEngine);

	this.bAdjustFrameDivs = true;
	this.iSavedWidthForPrepareDom = 0;
	this.iSavedHeightForPrepareDom = 0;

	this.bDataSelectionMode = false;

	this.oCellApi = null;

	this.iNewLinesCnt = 0;
	this.sNewLinesPos = "";
	this.bPlanningCheckMode = false;

	this.sScrollNotifyCommand = null;

	this.oContextMenu = null;
	
	this.iValueHelpStatus = 0;
	
	this.bHeaderHScrolling = false;
	
	this.bWasRendered = false;
};

sap.zen.crosstab.Crosstab.prototype.ensureIndexOf = function () {
	// official code from developer.mozilla.org
	// needed for IE8 support and other browsers that don't support the ECMA-262, 5th edition "indexOf" function
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (searchElement) {
			"use strict";
			if (this == null) {
				throw new TypeError();
			}
			var t = Object(this);
			var len = t.length >>> 0;
			if (len === 0) {
				return -1;
			}
			var n = 0;
			if (arguments.length > 1) {
				n = Number(arguments[1]);
				if (n != n) {
					n = 0;
				} else if (n != 0 && n != Infinity && n != -Infinity) {
					n = (n > 0 || -1) * Math.floor(Math.abs(n));
				}
			}
			if (n >= len) {
				return -1;
			}
			var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
			for (; k < len; k++) {
				if (k in t && t[k] === searchElement) {
					return k;
				}
			}
			return -1;
		};
	}
};

sap.zen.crosstab.Crosstab.prototype.getTableDiv = function () {
	var oTableDiv = null;
	if (this.iRenderMode === sap.zen.crosstab.rendering.RenderingConstants.RENDERMODE_COMPACT) {
		oTableDiv = $('#' + this.getId() + "_altRenderModeTableDiv");
	} else {
		oTableDiv = $('#' + this.getId());
	}
	return oTableDiv;
};

sap.zen.crosstab.Crosstab.prototype.ensurePageManager = function () {
	if (!this.oPageManager) {
		this.oPageManager = new sap.zen.crosstab.paging.PageManager(this);
	}
	return this.oPageManager;
};

sap.zen.crosstab.Crosstab.prototype.getIntWidth = function () {
	var iWidth = -1;
	var sWidth = this.getWidth();
	if (sWidth && sWidth !== "auto") {
		iWidth = parseInt(sWidth, 10);
	} else {
		iWidth = this.iCalculatedWidth;
	}
	return iWidth;
};

sap.zen.crosstab.Crosstab.prototype.getContentWidth = function () {
	var iWidth = this.getIntWidth();
	var oTableDivValues = this.getRenderEngine().getTableDivValues();
	iWidth = iWidth - oTableDivValues.borders.iLeftBorderWidth - oTableDivValues.borders.iRightBorderWidth;
	return iWidth;
};

sap.zen.crosstab.Crosstab.prototype.getContentHeight = function () {
	var iHeight = this.getIntHeight();
	var oTableDivValues = this.getRenderEngine().getTableDivValues();
	var iToolbarHeight = this.oPropertyBag.getToolbarHeight();
	iHeight = iHeight - oTableDivValues.borders.iTopBorderWidth - oTableDivValues.borders.iBottomBorderWidth
			- iToolbarHeight;
	return iHeight;
};

sap.zen.crosstab.Crosstab.prototype.getIntHeight = function () {
	var iHeight = -1;
	var sHeight = this.getHeight();
	if (sHeight && sHeight !== "auto") {
		iHeight = parseInt(sHeight, 10);
	} else {
		iHeight = this.iCalculatedHeight;
	}
	return iHeight;
};

sap.zen.crosstab.Crosstab.prototype.resize = function (e) {
	var oDomCrosstab = jQuery.sap.byId(this.getId());
	var iNewWidth = parseInt(oDomCrosstab.outerWidth(), 10);
	var iNewHeight = parseInt(oDomCrosstab.outerHeight(), 10);
	this.isHResize = iNewWidth !== this.getIntWidth();
	this.isVResize = iNewHeight !== this.getIntHeight();

	if (this.isHResize || this.isVResize) {
		this.ensurePageManager().resizeEvent();
	}
};

sap.zen.crosstab.Crosstab.prototype.determineRenderMode = function (oCrosstabControlProperties) {
	var iNewRenderMode = -1;
	if (oCrosstabControlProperties) {
		if (oCrosstabControlProperties.alwaysfill) {
			iNewRenderMode = sap.zen.crosstab.rendering.RenderingConstants.RENDERMODE_FILL;
		} else {
			iNewRenderMode = sap.zen.crosstab.rendering.RenderingConstants.RENDERMODE_COMPACT;
		}
	}
	if (iNewRenderMode === -1) {
		iNewRenderMode = sap.zen.crosstab.rendering.RenderingConstants.RENDERMODE_COMPACT;
	}
	if (iNewRenderMode !== this.iRenderMode) {
		this.oRenderEngine.reset();
		this.iRenderMode = iNewRenderMode;
	}
};

sap.zen.crosstab.Crosstab.prototype.determineScrollMode = function (oCrosstabControlProperties) {
	var bNewPixelScrolling = oCrosstabControlProperties.pixelscrolling;
	if (bNewPixelScrolling !== this.oPropertyBag.isPixelScrolling()) {
		this.oRenderEngine.reset();
		this.oPropertyBag.setPixelScrolling(bNewPixelScrolling);
	}
};

sap.zen.crosstab.Crosstab.prototype.applyControlProperties = function (oCrosstabControlProperties) {
	this.bPlanningCheckMode = oCrosstabControlProperties.pvcheck !== null
			&& oCrosstabControlProperties.pvcheck !== undefined;
	var bIsConsistent = this.ensurePageManager().checkResponseConsistency(oCrosstabControlProperties);
	if (!bIsConsistent) {
		this.reset(oCrosstabControlProperties);
	}
	if (!this.bPlanningCheckMode) {
		this.determineRenderMode(oCrosstabControlProperties);
		this.determineScrollMode(oCrosstabControlProperties);
		this.ensurePageManager().receiveData(oCrosstabControlProperties);
	} else {
		this.handlePlanningCheckData(oCrosstabControlProperties);
	}
	this.bPlanningCheckMode = false;
};

sap.zen.crosstab.Crosstab.prototype.calculateOffset = function (oCell) {
	var iOffset = 0;
	var oArea = oCell.getArea();
	if (oArea.isRowHeaderArea()) {
		for (var i = 0; i < oCell.getCol(); i++) {
			var oTempCell = oArea.getCell(oCell.getRow(), i);
			if (!oTempCell) {
				iOffset++;
			} else if (!oTempCell.isEntryEnabled()) {
				iOffset++;
			}
		}
	}
	return iOffset;
};

sap.zen.crosstab.Crosstab.prototype.calculateRowHeaderColOffsetsForRow = function(iTableRow) {
	var oColMapping = {};
	var iTableCol = 0;
	var oCell = null;
	var iEntryEnabledCol = 0;
	var iMaxColCnt = this.rowHeaderArea.getColCnt();
	
	for (iTableCol = 0; iTableCol < iMaxColCnt; iTableCol++) {
		oCell = this.getTableCell(iTableRow, iTableCol);
		if (oCell !== null && oCell.isEntryEnabled()) {
			oColMapping[iEntryEnabledCol] = iTableCol;
			iEntryEnabledCol++;
		}
	}
	
	return oColMapping;
};

sap.zen.crosstab.Crosstab.prototype.handlePlanningCheckData = function (oCrosstabControlProperties) {
	var i = 0;
	var oCheckCells = oCrosstabControlProperties.pvcheck;
	var iCellCnt = oCheckCells.length;
	var oColMappingPerTabRow = {};
	var oColMapping = null;
	var iTableCol = 0;

	for (i = 0; i < iCellCnt; i++) {
		var oCheckCell = oCheckCells[i];
		// contract: we get column positions in newlines as successively and need to map
		// them to actual table columns due to text/key display etc.
		oColMapping = oColMappingPerTabRow[oCheckCell.tabrow];
		if (!oColMapping) {
			oColMapping = this.calculateRowHeaderColOffsetsForRow(oCheckCell.tabrow);
			oColMappingPerTabRow[oCheckCell.tabrow] = oColMapping;
		}
		
		var iTableCol = oColMapping[oCheckCell.tabcol] || oCheckCell.tabcol;
		var oCell = this.getTableCell(oCheckCell.tabrow, iTableCol);
		if (oCell) {
			oCell.setText(oCheckCell.text);
			if (oCheckCell.valid === false) {
				oCell.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_INVALID_VALUE);
			} else {
				oCell.removeStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_INVALID_VALUE);
			}

			if (oCheckCell.newvalue === true) {
				oCell.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_NEW_VALUE);
			}
			this.oRenderEngine.updateRenderingOfInputCellAfterCheck(oCell);
		}
	}
};

sap.zen.crosstab.Crosstab.prototype.determineKeepUserColWidths = function (oCrosstabControlProperties) {
	if (oCrosstabControlProperties.dataproviderchanged) {
		return false;
	}
		
	if (oCrosstabControlProperties.resultsetchanged && oCrosstabControlProperties.rootcause === undefined) {
		return false;
	}
	
	return true;
};

sap.zen.crosstab.Crosstab.prototype.determineKeepCalculatedColWidths = function (oCrosstabControlProperties) {
	var iVpos = (oCrosstabControlProperties.v_pos || 1) - 1;
	var iSentDataRows = oCrosstabControlProperties.sentdatarows || 0;
	var iClientVpos = oCrosstabControlProperties.clientvpos || 0;
	var iTotalDataRows = oCrosstabControlProperties.totaldatarows || 0;
	
	var iHpos = (oCrosstabControlProperties.h_pos || 1) - 1;
	var iSentDataCols = oCrosstabControlProperties.sentdatacols || 0;
	var iClientHpos = oCrosstabControlProperties.clienthpos || 0;
	var iTotalDataCols = oCrosstabControlProperties.totaldatacols || 0;
	
	var bIsPaging = oCrosstabControlProperties.ispaging || false;
	
	var bKeepColWidthsForHScrolling = false;
	var bKeepColWidthsForVScrolling = false;
	
	if (this.bWasRendered === true && !bIsPaging) {
		if ((iClientVpos > 0) && (iClientVpos <= iTotalDataRows) && (iClientVpos > (iVpos + iSentDataRows))) {
			bKeepColWidthsForVScrolling = true;
		}
		
		if ((iClientHpos > 0) && (iClientHpos <= iTotalDataCols) && (iClientHpos > (iHpos + iSentDataCols))) {
			bKeepColWidthsForHScrolling = true;
		}
		
		if (bKeepColWidthsForVScrolling === true || bKeepColWidthsForHScrolling === true) {
			return true;
		}
	}
	
	return false;
};

sap.zen.crosstab.Crosstab.prototype.reset = function (oCrosstabControlProperties) {
	var bKeepUserColWidths = this.determineKeepUserColWidths(oCrosstabControlProperties);
	var bKeepCalculatedColWidths = this.determineKeepCalculatedColWidths(oCrosstabControlProperties);
	
	this.getDimensionHeaderArea().clear(bKeepUserColWidths, bKeepCalculatedColWidths);
	this.getColumnHeaderArea().clear(bKeepUserColWidths, bKeepCalculatedColWidths);
	this.getRowHeaderArea().clear(bKeepUserColWidths, bKeepCalculatedColWidths);
	this.getDataArea().clear(bKeepUserColWidths, bKeepCalculatedColWidths);

	this.oRenderEngine.reset();

	this.oPageManager.reset();
};

sap.zen.crosstab.Crosstab.prototype.updateControlProperties = function (oCrosstabControlProperties) {
	if (oCrosstabControlProperties && oCrosstabControlProperties.changed) {
		this.reset(oCrosstabControlProperties);
	}
	this.applyControlProperties(oCrosstabControlProperties);
};

sap.zen.crosstab.Crosstab.prototype.expectOnAfterRenderingCall = function () {
	this.bOnAfterRendering = false;
};

sap.zen.crosstab.Crosstab.prototype.onAfterRendering = function () {
	if (this.bOnAfterRendering
			|| ((typeof sap.zen.Dispatcher != 'undefined') && sap.zen.Dispatcher.instance.isDeferredRendering())) {
		this.doRendering();
	}
};

sap.zen.crosstab.Crosstab.prototype.setSelectionInfo = function (sAxis, iPos) {
	this.oEventHandler.setSelectionInfo(sAxis, iPos);
};

sap.zen.crosstab.Crosstab.prototype.setHighlightingInfo = function (oHighlightingInfo) {
	this.oEventHandler.setHighlightingInfo(oHighlightingInfo);
};

sap.zen.crosstab.Crosstab.prototype.getSelectedCellData = function () {
	return this.oEventHandler.getSelectedCellData();
};

sap.zen.crosstab.Crosstab.prototype.restoreSelection = function () {
	this.oEventHandler.restoreSelection();
};

sap.zen.crosstab.Crosstab.prototype.restoreFocusOnCell = function () {
	this.oEventHandler.restoreFocusOnCell();
};

sap.zen.crosstab.Crosstab.prototype.highlightCells = function () {
	this.oEventHandler.highlightCells();
};

sap.zen.crosstab.Crosstab.prototype.prepareExistingDom = function () {
	if (!this.bPlanningCheckMode) {
		var oDomBody = $('#' + this.getDimensionHeaderArea().getId()).find("tbody");
		oDomBody.empty();
		oDomBody = $('#' + this.getRowHeaderArea().getId()).find("tbody");
		oDomBody.empty();
		oDomBody = $('#' + this.getColumnHeaderArea().getId()).find("tbody");
		oDomBody.empty();
		oDomBody = $('#' + this.getDataArea().getId()).find("tbody");
		oDomBody.empty();
		this.bRenderScrollbars = false;

		this.determineNeedToAdjustOuterDivs();
	}
};

// Outer divs should generally not be adapted during paging operations since width and height are
// otherwise modified by JavaScript calculations which are only valid for the first rendering and
// give pixel-off errors.
// However, if the size of the crosstab is changed (either by using setWidth or implicitly by auto width),
// and paging is active, a resize of the outer divs needs to happen. This requires the size adaptation for
// the outer divs to work unless the last page has been loaded.
// Once the last page has been loaded due to enlarging the crosstab size, any further request to prepare
// the existing DOM is again a simple paging operation without size change, which means that starting from
// that point the outer size div sizes can again be left unaltered.
sap.zen.crosstab.Crosstab.prototype.determineNeedToAdjustOuterDivs = function () {
	var iWidth = this.getIntWidth();
	var iHeight = this.getIntHeight();
	this.bAdjustFrameDivs = true;
	if (iWidth === this.iSavedWidthForPrepareDom && iHeight === this.iSavedHeightForPrepareDom) {
		this.bAdjustFrameDivs = false;
	} else {
		// any outer div adjust operation in the existing dom context needs to clear
		// the borders for the calculations to work properly. Otherwise, calculations for
		// border corrections will be carried out on already adjusted borders which leads
		// to wrong results and pixel-off errors
		this.getRenderEngine().removeOuterDivBorders();
	}

	if (!this.getDataArea().hasLoadingPages()) {
		this.iSavedWidthForPrepareDom = iWidth;
		this.iSavedHeightForPrepareDom = iHeight;
	}
};

sap.zen.crosstab.Crosstab.prototype.determineHierarchyIndents = function () {
	var oDomMeasureDiv = $('#' + this.getId() + "_measureDiv");
	if (oDomMeasureDiv && oDomMeasureDiv.length > 0) {
		oDomMeasureDiv.css("visibility", "visible");
		this.iHierarchyIndentWidth = parseInt(oDomMeasureDiv.outerWidth(), 10);
		this.iHierarchyIndentHeight = parseInt(oDomMeasureDiv.outerHeight(), 10);
		oDomMeasureDiv.css("visibility", "none");
	}
};

sap.zen.crosstab.Crosstab.prototype.determineAlertSymbolDimensions = function () {
	var oDomMeasureDiv = $('#' + this.getId() + "_exceptionMeasureDiv");
	if (oDomMeasureDiv && oDomMeasureDiv.length > 0) {
		oDomMeasureDiv.css("visibility", "visible");
		this.iExceptionSymbolWidth = parseInt(oDomMeasureDiv.outerWidth(), 10);
		oDomMeasureDiv.css("visibility", "none");
	}
};

sap.zen.crosstab.Crosstab.prototype.isRenderingPossible = function () {
	/*
	 * Sometimes doRendering is called even though the DOM is not prepared. This means there is no basic Crosstab
	 * structure available which could be filled with content. If rendering is continued in this case, there will be
	 * JavaScript exceptions. In this case it is safer to wait for UI5 to call onAfterRendering(). See Message Number
	 * 0120061532 0001269803 2013 See Message Number 0120031469 0004834824 2012
	 */

	if ((typeof sap.zen.Dispatcher != 'undefined') && sap.zen.Dispatcher.instance.suppressRendering()) {
		if (!sap.zen.Dispatcher.instance.isSingleDelta(this.getId())) {
			// register for deferred rendering, do not render right now
			// because the parent might not have correct size yet
			sap.zen.Dispatcher.instance.registerForDeferredRendering(this);
			return false;
		}
	}

	var aElementsToCheck = [];
	aElementsToCheck.push($('#' + this.getId()));
	aElementsToCheck.push($('#' + this.getId() + '_upperSection'));
	aElementsToCheck.push($('#' + this.getId() + '_lowerSection'));
	aElementsToCheck.push($('#' + this.getId() + '_dimHeaderArea'));
	aElementsToCheck.push($('#' + this.getId() + '_colHeaderArea'));
	aElementsToCheck.push($('#' + this.getId() + '_dataArea'));

	for (var i = 0; i < aElementsToCheck.length; i++) {
		if (aElementsToCheck[i].length !== 1) {
			// expect another rendering call
			this.bOnAfterRendering = true;
			// do not continue with rendering
			return false;
		}
	}
	return true;
};

sap.zen.crosstab.Crosstab.prototype.determineCrosstabSize = function () {
	var oSizeInfo = {};
	oSizeInfo.bContinueRendering = true;
	oSizeInfo.bAutoHeight = false;
	oSizeInfo.bAutoWidth = false;
	if (!this.getWidth() || !this.getHeight()) {
		// if width/height has not been set there is no point in continuing the rendering process
		// either a pixel value or 'auto' is required to render
		oSizeInfo.bContinueRendering = false;
	} else {
		if (this.getWidth() === "auto") {
			oSizeInfo.bAutoWidth = true;
			var iWidth = jQuery.sap.byId(this.getId()).parent().outerWidth();
			if (iWidth && iWidth > 0) {
				this.iCalculatedWidth = iWidth;
			}
		}
		if (this.getHeight() === "auto") {
			oSizeInfo.bAutoHeight = true;
			var iHeight = jQuery.sap.byId(this.getId()).parent().outerHeight();
			if (iHeight && iHeight > 0) {
				this.iCalculatedHeight = iHeight;
			}
		}
	}
	return oSizeInfo;
};

sap.zen.crosstab.Crosstab.prototype.doRendering = function () {
	if (this.bPlanningCheckMode === true) {
		return;
	}

	if (!this.isRenderingPossible()) {
		return;
	}
	var oSizeInfo = this.determineCrosstabSize();
	if (!oSizeInfo.bContinueRendering) {
		return;
	}
	// If no size is available, the container probably hasn't been fully rendered yet.
	// Therefore, delay the rendering until a size is available.
	// Crosstab 10x10px does not make any sense. If containers don't have their sizes yet, their size
	// may be 0 or 1px, so with 10px, we should have a safe heuristics
	if ((oSizeInfo.bAutoWidth && this.iCalculatedWidth <= 10)
			|| (oSizeInfo.bAutoHeight && this.iCalculatedHeight <= 10)) {
		this.iTimeoutCounter++;
		if (this.iTimeoutCounter > 1000) {
			return;
		}
		setTimeout((function (that) {
			return function () {
				that.doRendering();
			};
		})(this), 10);
		return;
	}

	this.determineHierarchyIndents();

	if (this.getPropertyBag().isDisplayExceptions()) {
		this.determineAlertSymbolDimensions();
	}

	var oRenderEngine = this.getRenderEngine();
	oRenderEngine.setAdjustFrameDivs(this.bAdjustFrameDivs);

	if (oRenderEngine.hasCrosstabSizeChanged()) {
		this.ensurePageManager().resizeEvent();
	}

	if (this.oPropertyBag.hasToolbar()) {
		var oToolbarDiv = $('#' + this.getId() + "_toolbar");
		var iToolbarHeight = oToolbarDiv.outerHeight();
		this.oPropertyBag.setToolbarHeight(iToolbarHeight);
	}

	// The sequence of this is important, think before changing it!
	oRenderEngine.beginRendering();

	oRenderEngine.renderDimensionHeaderArea();
	oRenderEngine.setUserColWidths(this.getDimensionHeaderArea());

	oRenderEngine.renderRowHeaderArea(this.getRowHeaderArea().getRenderStartRow());
	oRenderEngine.setUserColWidths(this.getRowHeaderArea());
	
	oRenderEngine.adjustColWidths(this.getDimensionHeaderArea(), this.getRowHeaderArea());
	
	// all of the steps above (especially the col width adjuster) must have been done before forcing a width on the
	// header area in case of scrolling
	oRenderEngine.forceHeaderWidth();

	oRenderEngine.renderColHeaderArea(this.getColumnHeaderArea().getRenderStartCol());
	oRenderEngine.setUserColWidths(this.getColumnHeaderArea());

	oRenderEngine.renderDataArea();
	oRenderEngine.setUserColWidths(this.getDataArea());

	oRenderEngine.adjustColWidths(this.getColumnHeaderArea(), this.getDataArea());
	oRenderEngine.adjustRowHeights(this.getDimensionHeaderArea(), this.getColumnHeaderArea());
	oRenderEngine.adjustRowHeights(this.getRowHeaderArea(), this.getDataArea());

	oRenderEngine.calculateRenderSizeDivSize();

	if (!this.oPropertyBag.isPixelScrolling()) {
		oRenderEngine.appendColumnsAfterResize();
		oRenderEngine.appendRowsAfterResize();
	}
	
	if (this.bRenderScrollbars) {
		oRenderEngine.renderScrollbars();
	}

	oRenderEngine.adjustRenderSizeDivSize();

	if (this.bRenderScrollbars) {
		oRenderEngine.setScrollbarSteps();
	}

	oRenderEngine.adjustScrollDivSizes();

	if (!this.bRenderScrollbars) {
		oRenderEngine.checkScrollbarSize();
	}
	oRenderEngine.adjustScrollPositions(this.bRenderScrollbars);

	if (!this.oPropertyBag.isPixelScrolling()) {
		oRenderEngine.moveScrollDivs();
	}
	
	oRenderEngine.updateHeaderScrollbarSizes();

	oRenderEngine.finishRendering();

	this.oEventHandler.attachEvents();

	this.bOnAfterRendering = true;
	this.bRenderScrollbars = true;
	this.bAdjustFrameDivs = true;
	this.bWasRendered = true;

	// Test ONLY
	// if (!this.scrolled && this.getId() === "CROSSTAB_1") {
	// this.scrollHorizontal(27);
	// this.scrolled = true;
	// }
};

sap.zen.crosstab.Crosstab.prototype.scrollHorizontal = function (iCol) {
	this.oRenderEngine.scrollHorizontal(iCol);
};

sap.zen.crosstab.Crosstab.prototype.scrollVertical = function (iRow) {
	this.oRenderEngine.scrollVertical(iRow);
};

sap.zen.crosstab.Crosstab.prototype.scrollHeaderHorizontal = function (iPos) {
	this.oRenderEngine.scrollHeaderHorizontal(iPos);
};

sap.zen.crosstab.Crosstab.prototype.getVScrollPos = function () {
	var iVScrollPos = -1;
	if (this.oVScrollbar) {
		iVScrollPos = this.oVScrollbar.getScrollPosition();
	}
	return iVScrollPos;
};

sap.zen.crosstab.Crosstab.prototype.getHScrollPos = function () {
	var iHScrollPos = -1;
	if (this.oHScrollbar) {
		iHScrollPos = this.oHScrollbar.getScrollPosition();
	}
	return iHScrollPos;
};

sap.zen.crosstab.Crosstab.prototype.renderResizeOutline = function () {
	this.oRenderEngine.renderResizeOutline();
};

sap.zen.crosstab.Crosstab.prototype.removeResizeOutline = function () {
	this.oRenderEngine.removeResizeOutline();
};

sap.zen.crosstab.Crosstab.prototype.registerPageRequestHandler = function (fHandler) {
	this.fPageRequestHandler = fHandler;
};

sap.zen.crosstab.Crosstab.prototype.unregisterPageRequestHandler = function () {
	this.fPageRequestHandler = null;
};

sap.zen.crosstab.Crosstab.prototype.getPageRequestHandler = function () {
	return this.fPageRequestHandler;
};

sap.zen.crosstab.Crosstab.prototype.getReceivedPages = function () {
	return this.ensurePageManager().getReceivedPages();
};

sap.zen.crosstab.Crosstab.prototype.getHierarchyIndentWidth = function () {
	return this.iHierarchyIndentWidth;
};

sap.zen.crosstab.Crosstab.prototype.getExceptionSymbolWidth = function () {
	return this.iExceptionSymbolWidth;
};

sap.zen.crosstab.Crosstab.prototype.getHierarchyIndentHeight = function () {
	return this.iHierarchyIndentHeight;
};

sap.zen.crosstab.Crosstab.prototype.hideLoadingIndicator = function () {
	this.oRenderEngine.hideLoadingIndicator();
};

sap.zen.crosstab.Crosstab.prototype.showLoadingIndicator = function () {
	this.oRenderEngine.showLoadingIndicator();
};

sap.zen.crosstab.Crosstab.prototype.setHCutOff = function (bHCutOff) {
	this.bHCutOff = bHCutOff;
};

sap.zen.crosstab.Crosstab.prototype.isHCutOff = function () {
	return this.bHCutOff;
};

sap.zen.crosstab.Crosstab.prototype.setVCutOff = function (bVCutOff) {
	this.bVCutOff = bVCutOff;
};

sap.zen.crosstab.Crosstab.prototype.isVCutOff = function () {
	return this.bVCutOff;
};

sap.zen.crosstab.Crosstab.prototype.getTotalRows = function () {
	return this.iTotalRowCnt;
};

sap.zen.crosstab.Crosstab.prototype.getTotalCols = function () {
	return this.iTotalColCnt;
};

sap.zen.crosstab.Crosstab.prototype.setTotalCols = function (iColCnt) {
	this.iTotalColCnt = iColCnt;
};

sap.zen.crosstab.Crosstab.prototype.setTotalRows = function (iRowCnt) {
	this.iTotalRowCnt = iRowCnt;
};

sap.zen.crosstab.Crosstab.prototype.setHScrollbar = function (oHScrollbar) {
	this.oHScrollbar = oHScrollbar;
};

sap.zen.crosstab.Crosstab.prototype.setVScrollbar = function (oVScrollbar) {
	this.oVScrollbar = oVScrollbar;
};

sap.zen.crosstab.Crosstab.prototype.getVScrollbar = function () {
	return this.oVScrollbar;
};

sap.zen.crosstab.Crosstab.prototype.getHScrollbar = function () {
	return this.oHScrollbar;
};

sap.zen.crosstab.Crosstab.prototype.getTestProxy = function () {
	return this.oTestProxy;
};

sap.zen.crosstab.Crosstab.prototype.setOnSelectCommand = function (sOnSelectCommand) {
	this.sOnSelectCommand = sOnSelectCommand;
};

sap.zen.crosstab.Crosstab.prototype.getOnSelectCommand = function () {
	return this.sOnSelectCommand;
};

sap.zen.crosstab.Crosstab.prototype.setTransferDataCommand = function (sTransferDataCommand) {
	this.sTransferDataCommand = sTransferDataCommand;
};

sap.zen.crosstab.Crosstab.prototype.getTransferDataCommand = function () {
	return this.sTransferDataCommand;
};

sap.zen.crosstab.Crosstab.prototype.setCallValueHelpCommand = function (sCallValueHelpCommand) {
	this.sCallValueHelpCommand = sCallValueHelpCommand;
};

sap.zen.crosstab.Crosstab.prototype.getCallValueHelpCommand = function () {
	return this.sCallValueHelpCommand;
};

sap.zen.crosstab.Crosstab.prototype.getRenderMode = function () {
	return this.iRenderMode;
};

sap.zen.crosstab.Crosstab.prototype.getUtils = function () {
	return this.oUtils;
};

sap.zen.crosstab.Crosstab.prototype.getDataArea = function () {
	return this.dataArea;
};

sap.zen.crosstab.Crosstab.prototype.getDimensionHeaderArea = function () {
	return this.dimensionHeaderArea;
};

sap.zen.crosstab.Crosstab.prototype.getColumnHeaderArea = function () {
	return this.columnHeaderArea;
};

sap.zen.crosstab.Crosstab.prototype.getRowHeaderArea = function () {
	return this.rowHeaderArea;
};

sap.zen.crosstab.Crosstab.prototype.getRenderEngine = function () {
	return this.oRenderEngine;
};

sap.zen.crosstab.Crosstab.prototype.hResize = function () {
	return this.isHResize;
};

sap.zen.crosstab.Crosstab.prototype.vResize = function () {
	return this.isVResize;
};

sap.zen.crosstab.Crosstab.prototype.getPageManager = function () {
	return this.oPageManager;
};

sap.zen.crosstab.Crosstab.prototype.isRenderScrollbars = function () {
	return this.bRenderScrollbars;
};

sap.zen.crosstab.Crosstab.prototype.getPropertyBag = function () {
	return this.oPropertyBag;
};

sap.zen.crosstab.Crosstab.prototype.hasToolbar = function () {
	return this.bHasToolbar;
};

sap.zen.crosstab.Crosstab.prototype.setColHeaderHierarchyLevels = function (oLevels) {
	this.oColHeaderHierarchyLevels = oLevels;
};

sap.zen.crosstab.Crosstab.prototype.getColHeaderHierarchyLevels = function () {
	return this.oColHeaderHierarchyLevels;
};

sap.zen.crosstab.Crosstab.prototype.setRowHeaderHierarchyLevels = function (oLevels) {
	this.oRowHeaderHierarchyLevels = oLevels;
};

sap.zen.crosstab.Crosstab.prototype.getRowHeaderHierarchyLevels = function () {
	return this.oRowHeaderHierarchyLevels;
};

sap.zen.crosstab.Crosstab.prototype.isIE8Mode = function () {
	return this.oRenderEngine.isIE8Mode();
};

sap.zen.crosstab.Crosstab.prototype.hasDimensionHeaderArea = function () {
	var bResult = false;
	if (this.dimensionHeaderArea !== undefined) {
		bResult = (this.dimensionHeaderArea.getColCnt() > 0 && this.dimensionHeaderArea.getRowCnt() > 0);
	}
	return bResult;
};

sap.zen.crosstab.Crosstab.prototype.hasRowHeaderArea = function () {
	var bResult = false;
	if (this.rowHeaderArea !== undefined) {
		bResult = (this.rowHeaderArea.getColCnt() > 0 && this.rowHeaderArea.getRowCnt() > 0);
	}
	return bResult;
};

sap.zen.crosstab.Crosstab.prototype.hasColHeaderArea = function () {
	var bResult = false;
	if (this.columnHeaderArea !== undefined) {
		bResult = (this.columnHeaderArea.getColCnt() > 0 && this.columnHeaderArea.getRowCnt() > 0);
	}
	return bResult;
};

sap.zen.crosstab.Crosstab.prototype.hasDataArea = function () {
	var bResult = false;
	if (this.dataArea !== undefined) {
		bResult = (this.dataArea.getColCnt() > 0 && this.dataArea.getRowCnt() > 0);
	}
	return bResult;
};

sap.zen.crosstab.Crosstab.prototype.setDataSelectionMode = function (bIsDataSelectionMode) {
	this.bDataSelectionMode = bIsDataSelectionMode;
};

sap.zen.crosstab.Crosstab.prototype.isDataSelectionMode = function () {
	return this.bDataSelectionMode;
};

sap.zen.crosstab.Crosstab.prototype.setSingleDataCellSelection = function (bIsSingleDataCellSelection) {
	this.bSingleDataCellSelection = bIsSingleDataCellSelection;
};

sap.zen.crosstab.Crosstab.prototype.isSingleDataCellSelection = function () {
	return this.bSingleDataCellSelection;
};

sap.zen.crosstab.Crosstab.prototype.setSingleDataCellSelectionInfo = function (iRowPos, iColPos) {
	this.oEventHandler.setSingleDataCellSelectionInfo(iRowPos, iColPos);
};

// Cell API
sap.zen.crosstab.Crosstab.prototype.getTableCell = function (iTableRow, iTableCol) {
	return this.oCellApi.getTableCell(iTableRow, iTableCol);
};

sap.zen.crosstab.Crosstab.prototype.getTableCellWithSpans = function (iRow, iCol) {
	return this.oCellApi.getTableCellWithSpans(iRow, iCol);
};

sap.zen.crosstab.Crosstab.prototype.getTableRowCnt = function (iTableRow, iTableCol) {
	return this.oCellApi.getTableRowCnt();
};

sap.zen.crosstab.Crosstab.prototype.getTableColCnt = function (iTableRow, iTableCol) {
	return this.oCellApi.getTableColCnt();
};

sap.zen.crosstab.Crosstab.prototype.getTableFixedRowHeaderColCnt = function () {
	return this.oCellApi.getTableFixedRowHeaderColCnt();
};

sap.zen.crosstab.Crosstab.prototype.getTableFixedColHeaderRowCnt = function () {
	return this.oCellApi.getTableFixedColHeaderRowCnt();
};

sap.zen.crosstab.Crosstab.prototype.getTableMaxScrollColCnt = function () {
	return this.oCellApi.getTableMaxScrollColCnt();
};

sap.zen.crosstab.Crosstab.prototype.getTableMaxScrollRowCnt = function () {
	return this.oCellApi.getTableMaxScrollRowCnt();
};

sap.zen.crosstab.Crosstab.prototype.setCellApi = function (poCellApi) {
	this.oCellApi = poCellApi;
};

sap.zen.crosstab.Crosstab.prototype.hasLoadingPages = function () {
	return this.dataArea.hasLoadingPages() || this.rowHeaderArea.hasLoadingPages()
			|| this.columnHeaderArea.hasLoadingPages();
};

sap.zen.crosstab.Crosstab.prototype.getRenderRowCnt = function () {
	if (this.dataArea) {
		return this.dataArea.getRenderRowCnt();
	} else if (this.rowHeaderArea) {
		return this.rowHeaderArea.getRenderRowCnt();
	}
};

sap.zen.crosstab.Crosstab.prototype.getRenderStartRow = function () {
	if (this.dataArea) {
		return this.dataArea.getRenderStartRow();
	} else if (this.rowHeaderArea) {
		return this.rowHeaderArea.getRenderStartRow();
	}
};

sap.zen.crosstab.Crosstab.prototype.getRenderColCnt = function () {
	if (this.dataArea) {
		return this.dataArea.getRenderColCnt();
	} else if (this.columnHeaderArea) {
		return this.columnHeaderArea.getRenderColCnt();
	}
};

sap.zen.crosstab.Crosstab.prototype.getRenderStartCol = function () {
	if (this.dataArea) {
		return this.dataArea.getRenderStartCol();
	} else if (this.columnHeaderArea) {
		return this.columnHeaderArea.getRenderStartCol();
	}
};

sap.zen.crosstab.Crosstab.prototype.setNewLinesCnt = function (iNewLinesCnt) {
	this.iNewLinesCnt = iNewLinesCnt;
};

sap.zen.crosstab.Crosstab.prototype.getNewLinesCnt = function () {
	return this.iNewLinesCnt;
};

sap.zen.crosstab.Crosstab.prototype.setNewLinesPos = function (sNewLinesPos) {
	this.sNewLinesPos = sNewLinesPos;
};

sap.zen.crosstab.Crosstab.prototype.getNewLinesPos = function () {
	return this.sNewLinesPos;
};

sap.zen.crosstab.Crosstab.prototype.isNewLinesTop = function () {
	if (!this.sNewLinesPos) {
		return false;
	}
	return (this.sNewLinesPos === "TOP");
};

sap.zen.crosstab.Crosstab.prototype.isNewLinesBottom = function () {
	if (!this.sNewLinesPos) {
		return false;
	}
	return (this.sNewLinesPos === "BOTTOM");
};

sap.zen.crosstab.Crosstab.prototype.setScrollNotifyCommand = function (sScrollNotifyCommand) {
	this.sScrollNotifyCommand = sScrollNotifyCommand;
};

sap.zen.crosstab.Crosstab.prototype.getScrollNotifyCommand = function () {
	return this.sScrollNotifyCommand;
};

sap.zen.crosstab.Crosstab.prototype.getContextMenuAction = function (sContextMenuComponentId, oDomClickedElement) {
	var fAction = null;
	if (this.oContextMenu) {
		fAction = this.oContextMenu.getContextMenuAction(sContextMenuComponentId, oDomClickedElement);
	}
	return fAction;
};

sap.zen.crosstab.Crosstab.prototype.createContextMenu = function () {
	if (!this.oContextMenu) {
		this.oContextMenu = new sap.zen.crosstab.CrosstabContextMenu(this);
	}
};

sap.zen.crosstab.Crosstab.prototype.setValueHelpStatus = function(iValueHelpStatus) {
	this.iValueHelpStatus = iValueHelpStatus;
};

sap.zen.crosstab.Crosstab.prototype.getValueHelpStatus = function() {
	return this.iValueHelpStatus;
};

sap.zen.crosstab.Crosstab.prototype.getHorizontalHeaderScrollbar = function() {
	return this.oHorizontalHeaderScrollbar;
};

sap.zen.crosstab.Crosstab.prototype.setHorizontalHeaderScrollbar = function(oHorizontalHeaderScrollbar) {
	this.oHorizontalHeaderScrollbar = oHorizontalHeaderScrollbar;
};

sap.zen.crosstab.Crosstab.prototype.setHeaderHScrolling = function(bHeaderHScrolling) {
	this.bHeaderHScrolling = bHeaderHScrolling;
	if (!this.bHeaderHScrolling) {
		this.oHorizontalHeaderScrollbar = null;
	}
};

sap.zen.crosstab.Crosstab.prototype.isHeaderHScrolling = function() {
	return this.bHeaderHScrolling;
};