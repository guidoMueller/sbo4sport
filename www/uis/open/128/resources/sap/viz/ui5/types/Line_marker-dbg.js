/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Line_marker.
jQuery.sap.declare("sap.viz.ui5.types.Line_marker");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Line_marker.
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
 * <li>{@link #getShape shape} : sap.viz.ui5.types.Line_marker_shape (default: sap.viz.ui5.types.Line_marker_shape.circle)</li>
 * <li>{@link #getSize size} : int (default: 6)</li>
 * <li>{@link #getNumber number} : int</li></ul>
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
 * Settings for marker/data point graphics
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Line_marker
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Line_marker", { metadata : {

	library : "sap.viz",
	properties : {
		"visible" : {type : "boolean", group : "", defaultValue : true},
		"shape" : {type : "sap.viz.ui5.types.Line_marker_shape", group : "", defaultValue : sap.viz.ui5.types.Line_marker_shape.circle},
		"size" : {type : "int", group : "", defaultValue : 6},
		"number" : {type : "int", group : "", defaultValue : null, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Line_marker with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Line_marker.extend
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set the visibility of the markers
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.viz.ui5.types.Line_marker#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.viz.ui5.types.Line_marker} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Line_marker#setVisible
 * @function
 */


/**
 * Getter for property <code>shape</code>.
 * Set the shape of the markers
 *
 * Default value is <code>circle</code>
 *
 * @return {sap.viz.ui5.types.Line_marker_shape} the value of property <code>shape</code>
 * @public
 * @name sap.viz.ui5.types.Line_marker#getShape
 * @function
 */

/**
 * Setter for property <code>shape</code>.
 *
 * Default value is <code>circle</code> 
 *
 * @param {sap.viz.ui5.types.Line_marker_shape} oShape  new value for property <code>shape</code>
 * @return {sap.viz.ui5.types.Line_marker} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Line_marker#setShape
 * @function
 */


/**
 * Getter for property <code>size</code>.
 * Set the marker size for data points, ranging from '4' to '32'. If you enter a value outside that range, the marker size defaults to '6'.
 *
 * Default value is <code>6</code>
 *
 * @return {int} the value of property <code>size</code>
 * @public
 * @name sap.viz.ui5.types.Line_marker#getSize
 * @function
 */

/**
 * Setter for property <code>size</code>.
 *
 * Default value is <code>6</code> 
 *
 * @param {int} iSize  new value for property <code>size</code>
 * @return {sap.viz.ui5.types.Line_marker} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Line_marker#setSize
 * @function
 */


/**
 * Getter for property <code>number</code>.
 * Set the number to enable events for markers when they are invisible. If the total amount of markers is bigger than this value, markers will remain hidden when selected or hovered over. The default value is Number.POSITIVE_INFINITY, which is the largest possible value.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int} the value of property <code>number</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Line_marker#getNumber
 * @function
 */

/**
 * Setter for property <code>number</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int} iNumber  new value for property <code>number</code>
 * @return {sap.viz.ui5.types.Line_marker} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Line_marker#setNumber
 * @function
 */


// Start of sap/viz/ui5/types/Line_marker.js
