/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.zen.crosstab.HeaderCell.
jQuery.sap.declare("sap.zen.crosstab.HeaderCell");
jQuery.sap.require("sap.zen.crosstab.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new HeaderCell.
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
 * <li>{@link #getRowSpan rowSpan} : int</li>
 * <li>{@link #getColSpan colSpan} : int</li>
 * <li>{@link #getText text} : string</li>
 * <li>{@link #getMergeKey mergeKey} : string</li>
 * <li>{@link #getSort sort} : string</li>
 * <li>{@link #getSortAction sortAction} : string</li>
 * <li>{@link #getArea area} : object</li>
 * <li>{@link #getEffectiveColSpan effectiveColSpan} : int</li>
 * <li>{@link #getEffectiveRowSpan effectiveRowSpan} : int</li>
 * <li>{@link #getRow row} : int</li>
 * <li>{@link #getCol col} : int</li>
 * <li>{@link #getLevel level} : int</li>
 * <li>{@link #getDrillState drillState} : string</li>
 * <li>{@link #getHierarchyAction hierarchyAction} : string</li>
 * <li>{@link #getHierarchyTooltip hierarchyTooltip} : string</li>
 * <li>{@link #getHtmlIE8RowSpan htmlIE8RowSpan} : int (default: 1)</li>
 * <li>{@link #getSortTextIndex sortTextIndex} : int</li>
 * <li>{@link #getTableRow tableRow} : int</li>
 * <li>{@link #getTableCol tableCol} : int</li></ul>
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
 * Add your documentation for the new HeaderCell
 * @extends sap.ui.core.Control
 *
 * @author  
 * @version 14.1.0
 *
 * @constructor   
 * @public
 * @name sap.zen.crosstab.HeaderCell
 */
sap.ui.core.Control.extend("sap.zen.crosstab.HeaderCell", { metadata : {

	// ---- object ----
	publicMethods : [
		// methods
		"addStyle"
	],

	// ---- control specific ----
	library : "sap.zen.crosstab",
	properties : {
		"rowSpan" : {type : "int", group : "Misc", defaultValue : null},
		"colSpan" : {type : "int", group : "Misc", defaultValue : null},
		"text" : {type : "string", group : "Misc", defaultValue : null},
		"mergeKey" : {type : "string", group : "Misc", defaultValue : null},
		"sort" : {type : "string", group : "Misc", defaultValue : null},
		"sortAction" : {type : "string", group : "Misc", defaultValue : null},
		"area" : {type : "object", group : "Misc", defaultValue : null},
		"effectiveColSpan" : {type : "int", group : "Misc", defaultValue : null},
		"effectiveRowSpan" : {type : "int", group : "Misc", defaultValue : null},
		"row" : {type : "int", group : "Misc", defaultValue : null},
		"col" : {type : "int", group : "Misc", defaultValue : null},
		"level" : {type : "int", group : "Misc", defaultValue : null},
		"drillState" : {type : "string", group : "Misc", defaultValue : null},
		"hierarchyAction" : {type : "string", group : "Misc", defaultValue : null},
		"hierarchyTooltip" : {type : "string", group : "Misc", defaultValue : null},
		"htmlIE8RowSpan" : {type : "int", group : "Misc", defaultValue : 1},
		"sortTextIndex" : {type : "int", group : "Misc", defaultValue : null},
		"tableRow" : {type : "int", group : "Misc", defaultValue : null},
		"tableCol" : {type : "int", group : "Misc", defaultValue : null}
	}
}});


/**
 * Creates a new subclass of class sap.zen.crosstab.HeaderCell with name <code>sClassName</code> 
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
 * @name sap.zen.crosstab.HeaderCell.extend
 * @function
 */


/**
 * Getter for property <code>rowSpan</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>rowSpan</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getRowSpan
 * @function
 */

/**
 * Setter for property <code>rowSpan</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iRowSpan  new value for property <code>rowSpan</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setRowSpan
 * @function
 */


/**
 * Getter for property <code>colSpan</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>colSpan</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getColSpan
 * @function
 */

/**
 * Setter for property <code>colSpan</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iColSpan  new value for property <code>colSpan</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setColSpan
 * @function
 */


/**
 * Getter for property <code>text</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>text</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getText
 * @function
 */

/**
 * Setter for property <code>text</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sText  new value for property <code>text</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setText
 * @function
 */


/**
 * Getter for property <code>mergeKey</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>mergeKey</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getMergeKey
 * @function
 */

/**
 * Setter for property <code>mergeKey</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sMergeKey  new value for property <code>mergeKey</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setMergeKey
 * @function
 */


/**
 * Getter for property <code>sort</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>sort</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getSort
 * @function
 */

/**
 * Setter for property <code>sort</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSort  new value for property <code>sort</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setSort
 * @function
 */


/**
 * Getter for property <code>sortAction</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>sortAction</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getSortAction
 * @function
 */

/**
 * Setter for property <code>sortAction</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sSortAction  new value for property <code>sortAction</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setSortAction
 * @function
 */


/**
 * Getter for property <code>area</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object} the value of property <code>area</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getArea
 * @function
 */

/**
 * Setter for property <code>area</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object} oArea  new value for property <code>area</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setArea
 * @function
 */


/**
 * Getter for property <code>effectiveColSpan</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>effectiveColSpan</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getEffectiveColSpan
 * @function
 */

/**
 * Setter for property <code>effectiveColSpan</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iEffectiveColSpan  new value for property <code>effectiveColSpan</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setEffectiveColSpan
 * @function
 */


/**
 * Getter for property <code>effectiveRowSpan</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>effectiveRowSpan</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getEffectiveRowSpan
 * @function
 */

/**
 * Setter for property <code>effectiveRowSpan</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iEffectiveRowSpan  new value for property <code>effectiveRowSpan</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setEffectiveRowSpan
 * @function
 */


/**
 * Getter for property <code>row</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>row</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getRow
 * @function
 */

/**
 * Setter for property <code>row</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iRow  new value for property <code>row</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setRow
 * @function
 */


/**
 * Getter for property <code>col</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>col</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getCol
 * @function
 */

/**
 * Setter for property <code>col</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iCol  new value for property <code>col</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setCol
 * @function
 */


/**
 * Getter for property <code>level</code>.
 * 
 *
 * Default value is <code></code>
 *
 * @return {int} the value of property <code>level</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getLevel
 * @function
 */

/**
 * Setter for property <code>level</code>.
 *
 * Default value is <code></code> 
 *
 * @param {int} iLevel  new value for property <code>level</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setLevel
 * @function
 */


/**
 * Getter for property <code>drillState</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>drillState</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getDrillState
 * @function
 */

/**
 * Setter for property <code>drillState</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sDrillState  new value for property <code>drillState</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setDrillState
 * @function
 */


/**
 * Getter for property <code>hierarchyAction</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>hierarchyAction</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getHierarchyAction
 * @function
 */

/**
 * Setter for property <code>hierarchyAction</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sHierarchyAction  new value for property <code>hierarchyAction</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setHierarchyAction
 * @function
 */


/**
 * Getter for property <code>hierarchyTooltip</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>hierarchyTooltip</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getHierarchyTooltip
 * @function
 */

/**
 * Setter for property <code>hierarchyTooltip</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sHierarchyTooltip  new value for property <code>hierarchyTooltip</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setHierarchyTooltip
 * @function
 */


/**
 * Getter for property <code>htmlIE8RowSpan</code>.
 * 
 *
 * Default value is <code>1</code>
 *
 * @return {int} the value of property <code>htmlIE8RowSpan</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getHtmlIE8RowSpan
 * @function
 */

/**
 * Setter for property <code>htmlIE8RowSpan</code>.
 *
 * Default value is <code>1</code> 
 *
 * @param {int} iHtmlIE8RowSpan  new value for property <code>htmlIE8RowSpan</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setHtmlIE8RowSpan
 * @function
 */


/**
 * Getter for property <code>sortTextIndex</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>sortTextIndex</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getSortTextIndex
 * @function
 */

/**
 * Setter for property <code>sortTextIndex</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iSortTextIndex  new value for property <code>sortTextIndex</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setSortTextIndex
 * @function
 */


/**
 * Getter for property <code>tableRow</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>tableRow</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getTableRow
 * @function
 */

/**
 * Setter for property <code>tableRow</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iTableRow  new value for property <code>tableRow</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setTableRow
 * @function
 */


/**
 * Getter for property <code>tableCol</code>.
 * 
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>tableCol</code>
 * @public
 * @name sap.zen.crosstab.HeaderCell#getTableCol
 * @function
 */

/**
 * Setter for property <code>tableCol</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iTableCol  new value for property <code>tableCol</code>
 * @return {sap.zen.crosstab.HeaderCell} <code>this</code> to allow method chaining
 * @public
 * @name sap.zen.crosstab.HeaderCell#setTableCol
 * @function
 */


/**
 * 
 *
 * @name sap.zen.crosstab.HeaderCell.prototype.addStyle
 * @function
 * @param {string} 
 *         sSStyle
 * 

 * @type void
 * @public
 */


// Start of sap\zen\crosstab\HeaderCell.js
///**
// * This file defines behavior for the control, 
// */
jQuery.sap.require("sap.zen.crosstab.CellStyleHandler");
jQuery.sap.require("sap.zen.crosstab.rendering.RenderingConstants");
jQuery.sap.require("sap.zen.crosstab.utils.Utils");

sap.zen.crosstab.HeaderCell.prototype.init = function () {
	"use strict";
	this.aStyles = [];
	this.addStyle(sap.zen.crosstab.rendering.RenderingConstants.STYLE_HEADER_CELL);
	this.bLoading = false;
	this.bSelectable = false;
	this.bIsInnerMember = false;
	this.bIsResult = false;
	this.bIsMobileResize = false;
	this.sUnit = "";
	this.bIsEntryEnabled = false;
	this.sPassiveCellType = sap.zen.crosstab.rendering.RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
	this.bTextHasLineBreaks = false;
};

sap.zen.crosstab.HeaderCell.prototype.getCellType = function() {
	return sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL;
};

sap.zen.crosstab.HeaderCell.prototype.getCssClassNames = function (bIsIE8) {
	return sap.zen.crosstab.CellStyleHandler.getCssClasses(this.aStyles, bIsIE8);
};

sap.zen.crosstab.HeaderCell.prototype.getStyleIdList = function () {
	return this.aStyles;
};

sap.zen.crosstab.HeaderCell.prototype.setStyleIdList = function (aNewStyles) {
	this.aStyles = aNewStyles;
};

sap.zen.crosstab.HeaderCell.prototype.addStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);
	if (this.aStyles.indexOf(iStyleId) === -1) {
		this.aStyles.push(iStyleId);
	}
};

sap.zen.crosstab.HeaderCell.prototype.removeStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);
	var iIndex = this.aStyles.indexOf(iStyleId);
	if (iIndex !== -1) {
		this.aStyles.splice(iIndex, 1);
	}
};

sap.zen.crosstab.HeaderCell.prototype.hasStyle = function (sStyle) {
	var iStyleId = sap.zen.crosstab.CellStyleHandler.getStyleId(sStyle,
			sap.zen.crosstab.rendering.RenderingConstants.TYPE_HEADER_CELL);
	var iIndex = this.aStyles.indexOf(iStyleId);
	if (iIndex === -1) {
		return false;
	} else {
		return true;
	}
};

sap.zen.crosstab.HeaderCell.prototype.isLoading = function () {
	return this.bLoading;
};

sap.zen.crosstab.HeaderCell.prototype.setLoading = function (bLoading) {
	this.bLoading = bLoading;
};

sap.zen.crosstab.HeaderCell.prototype.isSelectable = function () {
	return this.bSelectable;
};

sap.zen.crosstab.HeaderCell.prototype.setSelectable = function (bSelectable) {
	this.bSelectable = bSelectable;
};

sap.zen.crosstab.HeaderCell.prototype.setInnerMember = function (bIsInnerMember) {
	this.bIsInnerMember = bIsInnerMember;
};

sap.zen.crosstab.HeaderCell.prototype.isInnerMember = function () {
	return this.bIsInnerMember;
};

sap.zen.crosstab.HeaderCell.prototype.setResult = function (bIsResult) {
	this.bIsResult = bIsResult;
};

sap.zen.crosstab.HeaderCell.prototype.isResult = function () {
	return this.bIsResult;
};

sap.zen.crosstab.HeaderCell.prototype.getUnescapedText = function () {
	return sap.zen.crosstab.utils.Utils.unEscapeDisplayString(this.getText());
};

sap.zen.crosstab.HeaderCell.prototype.isMobileResize = function () {
	return this.bIsMobileResize;
};

sap.zen.crosstab.HeaderCell.prototype.setMobileResize = function (pbMobileResize) {
	this.bIsMobileResize = pbMobileResize;
};

sap.zen.crosstab.HeaderCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
	this.bIsEntryEnabled = bIsEntryEnabled;
};

sap.zen.crosstab.HeaderCell.prototype.isEntryEnabled = function () {
	return this.bIsEntryEnabled;
};

sap.zen.crosstab.HeaderCell.prototype.setUnit = function (sUnit) {
	this.sUnit = sUnit;
};

sap.zen.crosstab.HeaderCell.prototype.getUnit = function () {
	return this.sUnit;
};

sap.zen.crosstab.HeaderCell.prototype.getPassiveCellType = function () {
	return this.sPassiveCellType;
};

sap.zen.crosstab.HeaderCell.prototype.setPassiveCellType = function (sPCellType) {
	this.sPassiveCellType = sPCellType;
};

sap.zen.crosstab.HeaderCell.prototype.setTextHasLineBreaks = function (bTextHasLineBreaks) {
	this.bTextHasLineBreaks = bTextHasLineBreaks;
};

sap.zen.crosstab.HeaderCell.prototype.textHasLineBreaks = function () {
	return this.bTextHasLineBreaks;
};
