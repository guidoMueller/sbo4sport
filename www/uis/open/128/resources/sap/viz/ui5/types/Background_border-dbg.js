/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Background_border.
jQuery.sap.declare("sap.viz.ui5.types.Background_border");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Background_border.
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
 * <li>{@link #getStroke stroke} : string (default: '#d8d8d8')</li>
 * <li>{@link #getStrokeWidth strokeWidth} : int (default: 1)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getLeft left} : sap.viz.ui5.types.Background_border_left</li>
 * <li>{@link #getRight right} : sap.viz.ui5.types.Background_border_right</li>
 * <li>{@link #getTop top} : sap.viz.ui5.types.Background_border_top</li>
 * <li>{@link #getBottom bottom} : sap.viz.ui5.types.Background_border_bottom</li></ul>
 * </li>
 * <li>Associations
 * <ul></ul>
 * </li>
 * <li>Events
 * <ul></ul>
 * </li>
 * </ul> 
 *
 * 
 * In addition, all settings applicable to the base type {@link sap.viz.ui5.core.BaseStructuredType#constructor sap.viz.ui5.core.BaseStructuredType}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Settings for the border
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Background_border
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Background_border", { metadata : {

	library : "sap.viz",
	properties : {
		"stroke" : {type : "string", group : "", defaultValue : '#d8d8d8', deprecated: true},
		"strokeWidth" : {type : "int", group : "", defaultValue : 1, deprecated: true}
	},
	aggregations : {
		"left" : {type : "sap.viz.ui5.types.Background_border_left", multiple : false}, 
		"right" : {type : "sap.viz.ui5.types.Background_border_right", multiple : false}, 
		"top" : {type : "sap.viz.ui5.types.Background_border_top", multiple : false}, 
		"bottom" : {type : "sap.viz.ui5.types.Background_border_bottom", multiple : false}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Background_border with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Background_border.extend
 * @function
 */


/**
 * Getter for property <code>stroke</code>.
 * Settings for the color of the stroke.
 *
 * Default value is <code>#d8d8d8</code>
 *
 * @return {string} the value of property <code>stroke</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Background_border#getStroke
 * @function
 */

/**
 * Setter for property <code>stroke</code>.
 *
 * Default value is <code>#d8d8d8</code> 
 *
 * @param {string} sStroke  new value for property <code>stroke</code>
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Background_border#setStroke
 * @function
 */


/**
 * Getter for property <code>strokeWidth</code>.
 * Settings for the width of the stroke.
 *
 * Default value is <code>1</code>
 *
 * @return {int} the value of property <code>strokeWidth</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Background_border#getStrokeWidth
 * @function
 */

/**
 * Setter for property <code>strokeWidth</code>.
 *
 * Default value is <code>1</code> 
 *
 * @param {int} iStrokeWidth  new value for property <code>strokeWidth</code>
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Background_border#setStrokeWidth
 * @function
 */


/**
 * Getter for aggregation <code>left</code>.<br/>
 * Settings for the left border
 * 
 * @return {sap.viz.ui5.types.Background_border_left}
 * @public
 * @name sap.viz.ui5.types.Background_border#getLeft
 * @function
 */


/**
 * Setter for the aggregated <code>left</code>.
 * @param {sap.viz.ui5.types.Background_border_left} oLeft
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#setLeft
 * @function
 */
	

/**
 * Destroys the left in the aggregation 
 * named <code>left</code>.
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#destroyLeft
 * @function
 */


/**
 * Getter for aggregation <code>right</code>.<br/>
 * Settings for the right border
 * 
 * @return {sap.viz.ui5.types.Background_border_right}
 * @public
 * @name sap.viz.ui5.types.Background_border#getRight
 * @function
 */


/**
 * Setter for the aggregated <code>right</code>.
 * @param {sap.viz.ui5.types.Background_border_right} oRight
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#setRight
 * @function
 */
	

/**
 * Destroys the right in the aggregation 
 * named <code>right</code>.
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#destroyRight
 * @function
 */


/**
 * Getter for aggregation <code>top</code>.<br/>
 * Settings for the top border
 * 
 * @return {sap.viz.ui5.types.Background_border_top}
 * @public
 * @name sap.viz.ui5.types.Background_border#getTop
 * @function
 */


/**
 * Setter for the aggregated <code>top</code>.
 * @param {sap.viz.ui5.types.Background_border_top} oTop
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#setTop
 * @function
 */
	

/**
 * Destroys the top in the aggregation 
 * named <code>top</code>.
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#destroyTop
 * @function
 */


/**
 * Getter for aggregation <code>bottom</code>.<br/>
 * Settings for the bottom border
 * 
 * @return {sap.viz.ui5.types.Background_border_bottom}
 * @public
 * @name sap.viz.ui5.types.Background_border#getBottom
 * @function
 */


/**
 * Setter for the aggregated <code>bottom</code>.
 * @param {sap.viz.ui5.types.Background_border_bottom} oBottom
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#setBottom
 * @function
 */
	

/**
 * Destroys the bottom in the aggregation 
 * named <code>bottom</code>.
 * @return {sap.viz.ui5.types.Background_border} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background_border#destroyBottom
 * @function
 */


// Start of sap/viz/ui5/types/Background_border.js
sap.viz.ui5.types.Background_border.prototype.getLeft = function() {
  return this._getOrCreate("left");
}
sap.viz.ui5.types.Background_border.prototype.getRight = function() {
  return this._getOrCreate("right");
}
sap.viz.ui5.types.Background_border.prototype.getTop = function() {
  return this._getOrCreate("top");
}
sap.viz.ui5.types.Background_border.prototype.getBottom = function() {
  return this._getOrCreate("bottom");
}
