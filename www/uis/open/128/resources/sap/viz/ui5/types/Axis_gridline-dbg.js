/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Axis_gridline.
jQuery.sap.declare("sap.viz.ui5.types.Axis_gridline");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Axis_gridline.
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
 * <li>{@link #getVisible visible} : boolean (default: true)</li>
 * <li>{@link #getDisable disable} : boolean (default: false)</li>
 * <li>{@link #getShowFirstLine showFirstLine} : boolean (default: false)</li>
 * <li>{@link #getShowLastLine showLastLine} : boolean (default: false)</li>
 * <li>{@link #getType type} : sap.viz.ui5.types.Axis_gridline_type (default: sap.viz.ui5.types.Axis_gridline_type.line)</li>
 * <li>{@link #getColor color} : string (default: '#d8d8d8')</li>
 * <li>{@link #getSize size} : int (default: 1)</li></ul>
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
 * 
 * In addition, all settings applicable to the base type {@link sap.viz.ui5.core.BaseStructuredType#constructor sap.viz.ui5.core.BaseStructuredType}
 * can be used as well.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Settings for the gridlines on the axis
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Axis_gridline
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Axis_gridline", { metadata : {

	library : "sap.viz",
	properties : {
		"visible" : {type : "boolean", group : "", defaultValue : true},
		"disable" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"showFirstLine" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"showLastLine" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"type" : {type : "sap.viz.ui5.types.Axis_gridline_type", group : "", defaultValue : sap.viz.ui5.types.Axis_gridline_type.line},
		"color" : {type : "string", group : "", defaultValue : '#d8d8d8'},
		"size" : {type : "int", group : "", defaultValue : 1}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Axis_gridline with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Axis_gridline.extend
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set the visibility of gridlines on the axis
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#setVisible
 * @function
 */


/**
 * Getter for property <code>disable</code>.
 * Disable gridline or not
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>disable</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_gridline#getDisable
 * @function
 */

/**
 * Setter for property <code>disable</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bDisable  new value for property <code>disable</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_gridline#setDisable
 * @function
 */


/**
 * Getter for property <code>showFirstLine</code>.
 * Set whether the first gridline on the axis appears
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showFirstLine</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_gridline#getShowFirstLine
 * @function
 */

/**
 * Setter for property <code>showFirstLine</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowFirstLine  new value for property <code>showFirstLine</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_gridline#setShowFirstLine
 * @function
 */


/**
 * Getter for property <code>showLastLine</code>.
 * Set whether the last gridline on the axis appears
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>showLastLine</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_gridline#getShowLastLine
 * @function
 */

/**
 * Setter for property <code>showLastLine</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bShowLastLine  new value for property <code>showLastLine</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_gridline#setShowLastLine
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * Set the line type of gridlines on the axis
 *
 * Default value is <code>line</code>
 *
 * @return {sap.viz.ui5.types.Axis_gridline_type} the value of property <code>type</code>
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is <code>line</code> 
 *
 * @param {sap.viz.ui5.types.Axis_gridline_type} oType  new value for property <code>type</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#setType
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * Set the color of the gridlines on the axis
 *
 * Default value is <code>#d8d8d8</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>#d8d8d8</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#setColor
 * @function
 */


/**
 * Getter for property <code>size</code>.
 * Set the line size of gridlines on the axis
 *
 * Default value is <code>1</code>
 *
 * @return {int} the value of property <code>size</code>
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>1</code> 
 *
 * @param {int} iSize  new value for property <code>size</code>
 * @return {sap.viz.ui5.types.Axis_gridline} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_gridline#setSize
 * @function
 */


// Start of sap/viz/ui5/types/Axis_gridline.js
