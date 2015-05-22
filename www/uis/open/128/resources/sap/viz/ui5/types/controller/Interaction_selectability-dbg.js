/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.controller.Interaction_selectability.
jQuery.sap.declare("sap.viz.ui5.types.controller.Interaction_selectability");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/controller/Interaction_selectability.
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
 * <li>{@link #getMode mode} : sap.viz.ui5.types.controller.Interaction_selectability_mode (default: sap.viz.ui5.types.controller.Interaction_selectability_mode.inclusive)</li>
 * <li>{@link #getAxisLabelSelection axisLabelSelection} : boolean (default: true)</li>
 * <li>{@link #getLegendSelection legendSelection} : boolean (default: true)</li>
 * <li>{@link #getPlotLassoSelection plotLassoSelection} : boolean (default: true)</li>
 * <li>{@link #getPlotStdSelection plotStdSelection} : boolean (default: true)</li>
 * <li>{@link #getLassoWithCtrlKey lassoWithCtrlKey} : boolean (default: false)</li>
 * <li>{@link #getDataPointsCacheable dataPointsCacheable} : boolean (default: true)</li></ul>
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
 * Settings for selectability
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.controller.Interaction_selectability
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.controller.Interaction_selectability", { metadata : {

	library : "sap.viz",
	properties : {
		"mode" : {type : "sap.viz.ui5.types.controller.Interaction_selectability_mode", group : "", defaultValue : sap.viz.ui5.types.controller.Interaction_selectability_mode.inclusive},
		"axisLabelSelection" : {type : "boolean", group : "", defaultValue : true},
		"legendSelection" : {type : "boolean", group : "", defaultValue : true},
		"plotLassoSelection" : {type : "boolean", group : "", defaultValue : true},
		"plotStdSelection" : {type : "boolean", group : "", defaultValue : true},
		"lassoWithCtrlKey" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"dataPointsCacheable" : {type : "boolean", group : "", defaultValue : true, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.controller.Interaction_selectability with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.controller.Interaction_selectability.extend
 * @function
 */


/**
 * Getter for property <code>mode</code>.
 * Set the selection mode. If this value is set to 'exclusive' or 'single', only one set of data points can be selected at once. If this value is set to 'inclusive' or 'multiple', multiple sets of data points can be selected at once. If this value is set to 'none', no sets of data points can be selected. The values 'single' and 'multiple' are deprecated; please remove them from your chart.
 *
 * Default value is <code>inclusive</code>
 *
 * @return {sap.viz.ui5.types.controller.Interaction_selectability_mode} the value of property <code>mode</code>
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getMode
 * @function
 */

/**
 * Setter for property <code>mode</code>.
 *
 * Default value is <code>inclusive</code> 
 *
 * @param {sap.viz.ui5.types.controller.Interaction_selectability_mode} oMode  new value for property <code>mode</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setMode
 * @function
 */


/**
 * Getter for property <code>axisLabelSelection</code>.
 * Set whether axis labels can be selected
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>axisLabelSelection</code>
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getAxisLabelSelection
 * @function
 */

/**
 * Setter for property <code>axisLabelSelection</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bAxisLabelSelection  new value for property <code>axisLabelSelection</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setAxisLabelSelection
 * @function
 */


/**
 * Getter for property <code>legendSelection</code>.
 * Set whether the legend can be selected
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>legendSelection</code>
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getLegendSelection
 * @function
 */

/**
 * Setter for property <code>legendSelection</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bLegendSelection  new value for property <code>legendSelection</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setLegendSelection
 * @function
 */


/**
 * Getter for property <code>plotLassoSelection</code>.
 * Set whether lasso selection can be used in the plot area
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>plotLassoSelection</code>
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getPlotLassoSelection
 * @function
 */

/**
 * Setter for property <code>plotLassoSelection</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bPlotLassoSelection  new value for property <code>plotLassoSelection</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setPlotLassoSelection
 * @function
 */


/**
 * Getter for property <code>plotStdSelection</code>.
 * Set whether selection can be done in the plot area by clicking and tapping
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>plotStdSelection</code>
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getPlotStdSelection
 * @function
 */

/**
 * Setter for property <code>plotStdSelection</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bPlotStdSelection  new value for property <code>plotStdSelection</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setPlotStdSelection
 * @function
 */


/**
 * Getter for property <code>lassoWithCtrlKey</code>.
 * Set whether the user must hold the ctrl key to use lasso selection
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>lassoWithCtrlKey</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getLassoWithCtrlKey
 * @function
 */

/**
 * Setter for property <code>lassoWithCtrlKey</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bLassoWithCtrlKey  new value for property <code>lassoWithCtrlKey</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setLassoWithCtrlKey
 * @function
 */


/**
 * Getter for property <code>dataPointsCacheable</code>.
 * Set whether data points can be cached. If it's true, data points might be cached by Interaction for better performance.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>dataPointsCacheable</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.controller.Interaction_selectability#getDataPointsCacheable
 * @function
 */

/**
 * Setter for property <code>dataPointsCacheable</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bDataPointsCacheable  new value for property <code>dataPointsCacheable</code>
 * @return {sap.viz.ui5.types.controller.Interaction_selectability} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.controller.Interaction_selectability#setDataPointsCacheable
 * @function
 */


// Start of sap/viz/ui5/types/controller/Interaction_selectability.js
