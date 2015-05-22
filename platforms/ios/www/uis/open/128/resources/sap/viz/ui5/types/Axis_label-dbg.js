/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Axis_label.
jQuery.sap.declare("sap.viz.ui5.types.Axis_label");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Axis_label.
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
 * <li>{@link #getNumberFormat numberFormat} : string (default: '')</li>
 * <li>{@link #getFormatString formatString} : any (default: null)</li>
 * <li>{@link #getUnitFormatType unitFormatType} : sap.viz.ui5.types.Axis_label_unitFormatType (default: sap.viz.ui5.types.Axis_label_unitFormatType.FinancialUnits)</li>
 * <li>{@link #getHideSubLevels hideSubLevels} : boolean (default: false)</li></ul>
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
 * Settings for the labels on this axis
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Axis_label
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Axis_label", { metadata : {

	library : "sap.viz",
	properties : {
		"visible" : {type : "boolean", group : "", defaultValue : true},
		"numberFormat" : {type : "string", group : "", defaultValue : '', deprecated: true},
		"formatString" : {type : "any", group : "", defaultValue : null},
		"unitFormatType" : {type : "sap.viz.ui5.types.Axis_label_unitFormatType", group : "", defaultValue : sap.viz.ui5.types.Axis_label_unitFormatType.FinancialUnits},
		"hideSubLevels" : {type : "boolean", group : "", defaultValue : false}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Axis_label with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Axis_label.extend
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set the visibility of the labels on this axis
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.viz.ui5.types.Axis_label#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.viz.ui5.types.Axis_label} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_label#setVisible
 * @function
 */


/**
 * Getter for property <code>numberFormat</code>.
 * Set the number format for the value axis
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string} the value of property <code>numberFormat</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_label#getNumberFormat
 * @function
 */

/**
 * Setter for property <code>numberFormat</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string} sNumberFormat  new value for property <code>numberFormat</code>
 * @return {sap.viz.ui5.types.Axis_label} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_label#setNumberFormat
 * @function
 */


/**
 * Getter for property <code>formatString</code>.
 * Set the format strings for labels on the value axis. If a single format string is entered, it is applied to all measures. A two-dimensional array of format strings can be entered for scatter matrix charts and multiple charts with measureNamesDimension, to apply different formats to each sub-chart. For all other chart types, the first value of the first dimension of a two-dimensional array is used as a global format string. The following characters are reserved as tokens for format code: MDYHSAmdyhsa#?%0@. The letter "u" is used at the end of a format string to format values in SI units. If the letter "u" is added to a value between 1e12 and 1e-3 before SI units are applied, the value is formatted in exponential style. The remaining syntax matches Excel format strings. The following is a simple example of a two-dimensional array for a chart with two measures: [["#,##0.00 DM;-#,##.00 DM","#,##.00;-#,##.00"]].
 *
 * Default value is <code>null</code>
 *
 * @return {any} the value of property <code>formatString</code>
 * @public
 * @name sap.viz.ui5.types.Axis_label#getFormatString
 * @function
 */

/**
 * Setter for property <code>formatString</code>.
 *
 * Default value is <code>null</code> 
 *
 * @param {any} oFormatString  new value for property <code>formatString</code>
 * @return {sap.viz.ui5.types.Axis_label} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_label#setFormatString
 * @function
 */


/**
 * Getter for property <code>unitFormatType</code>.
 * Set the unit format type. If set MetricUnits, unit K,M,G,T will be applied, eg, 5000 will display as 5K, 5000000 will display as 5M, 5000000000 will display as 5G and so on. If set FinancialUnits, unit K,M,B,T will be applied. 5000000000 will display as 5B.
 *
 * Default value is <code>FinancialUnits</code>
 *
 * @return {sap.viz.ui5.types.Axis_label_unitFormatType} the value of property <code>unitFormatType</code>
 * @public
 * @name sap.viz.ui5.types.Axis_label#getUnitFormatType
 * @function
 */

/**
 * Setter for property <code>unitFormatType</code>.
 *
 * Default value is <code>FinancialUnits</code> 
 *
 * @param {sap.viz.ui5.types.Axis_label_unitFormatType} oUnitFormatType  new value for property <code>unitFormatType</code>
 * @return {sap.viz.ui5.types.Axis_label} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_label#setUnitFormatType
 * @function
 */


/**
 * Getter for property <code>hideSubLevels</code>.
 * Set the visibility of the sub levels of labels on this axis
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>hideSubLevels</code>
 * @public
 * @name sap.viz.ui5.types.Axis_label#getHideSubLevels
 * @function
 */

/**
 * Setter for property <code>hideSubLevels</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bHideSubLevels  new value for property <code>hideSubLevels</code>
 * @return {sap.viz.ui5.types.Axis_label} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_label#setHideSubLevels
 * @function
 */


// Start of sap/viz/ui5/types/Axis_label.js
