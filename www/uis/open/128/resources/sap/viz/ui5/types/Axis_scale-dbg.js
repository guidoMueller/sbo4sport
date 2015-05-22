/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Axis_scale.
jQuery.sap.declare("sap.viz.ui5.types.Axis_scale");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Axis_scale.
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
 * <li>{@link #getFixedRange fixedRange} : boolean (default: false)</li>
 * <li>{@link #getMinValue minValue} : float (default: 0)</li>
 * <li>{@link #getMaxValue maxValue} : float (default: 0)</li>
 * <li>{@link #getFixedTicks fixedTicks} : object[]</li></ul>
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
 * Set the scale of the value axis. This property only works on value type axes.
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Axis_scale
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Axis_scale", { metadata : {

	library : "sap.viz",
	properties : {
		"fixedRange" : {type : "boolean", group : "", defaultValue : false},
		"minValue" : {type : "float", group : "", defaultValue : 0},
		"maxValue" : {type : "float", group : "", defaultValue : 0},
		"fixedTicks" : {type : "object[]", group : "", defaultValue : null, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Axis_scale with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Axis_scale.extend
 * @function
 */


/**
 * Getter for property <code>fixedRange</code>.
 * Set whether the axis range is limited to the range between the minValue and maxValue
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>fixedRange</code>
 * @public
 * @name sap.viz.ui5.types.Axis_scale#getFixedRange
 * @function
 */

/**
 * Setter for property <code>fixedRange</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bFixedRange  new value for property <code>fixedRange</code>
 * @return {sap.viz.ui5.types.Axis_scale} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_scale#setFixedRange
 * @function
 */


/**
 * Getter for property <code>minValue</code>.
 * Set the minValue of the value axis
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>minValue</code>
 * @public
 * @name sap.viz.ui5.types.Axis_scale#getMinValue
 * @function
 */

/**
 * Setter for property <code>minValue</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fMinValue  new value for property <code>minValue</code>
 * @return {sap.viz.ui5.types.Axis_scale} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_scale#setMinValue
 * @function
 */


/**
 * Getter for property <code>maxValue</code>.
 * Set the maxValue of the value axis
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>maxValue</code>
 * @public
 * @name sap.viz.ui5.types.Axis_scale#getMaxValue
 * @function
 */

/**
 * Setter for property <code>maxValue</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fMaxValue  new value for property <code>maxValue</code>
 * @return {sap.viz.ui5.types.Axis_scale} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis_scale#setMaxValue
 * @function
 */


/**
 * Getter for property <code>fixedTicks</code>.
 * Set the specific ticks for value axis. The format should be [{value : "/value/", text : "/text/"}...]. If its length is less than 2, this property will not take effect.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object[]} the value of property <code>fixedTicks</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_scale#getFixedTicks
 * @function
 */

/**
 * Setter for property <code>fixedTicks</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object[]} aFixedTicks  new value for property <code>fixedTicks</code>
 * @return {sap.viz.ui5.types.Axis_scale} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis_scale#setFixedTicks
 * @function
 */


// Start of sap/viz/ui5/types/Axis_scale.js
