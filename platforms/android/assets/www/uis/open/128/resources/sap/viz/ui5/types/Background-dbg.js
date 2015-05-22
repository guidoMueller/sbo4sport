/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Background.
jQuery.sap.declare("sap.viz.ui5.types.Background");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Background.
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
 * <li>{@link #getDrawingEffect drawingEffect} : sap.viz.ui5.types.Background_drawingEffect (default: sap.viz.ui5.types.Background_drawingEffect.normal)</li>
 * <li>{@link #getDirection direction} : sap.viz.ui5.types.Background_direction (default: sap.viz.ui5.types.Background_direction.vertical)</li>
 * <li>{@link #getColor color} : string (default: 'transparent')</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getBorder border} : sap.viz.ui5.types.Background_border</li></ul>
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
 * Module ui5/types/Background
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Background
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Background", { metadata : {

	library : "sap.viz",
	properties : {
		"visible" : {type : "boolean", group : "", defaultValue : true},
		"drawingEffect" : {type : "sap.viz.ui5.types.Background_drawingEffect", group : "", defaultValue : sap.viz.ui5.types.Background_drawingEffect.normal},
		"direction" : {type : "sap.viz.ui5.types.Background_direction", group : "", defaultValue : sap.viz.ui5.types.Background_direction.vertical},
		"color" : {type : "string", group : "", defaultValue : 'transparent', deprecated: true}
	},
	aggregations : {
		"border" : {type : "sap.viz.ui5.types.Background_border", multiple : false}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Background with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Background.extend
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set the visibility
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.viz.ui5.types.Background#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.viz.ui5.types.Background} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background#setVisible
 * @function
 */


/**
 * Getter for property <code>drawingEffect</code>.
 * Set the drawing effect for the background. If this value is set to 'glossy', the background is glossy. If this value is set to 'normal', the background is matte.
 *
 * Default value is <code>normal</code>
 *
 * @return {sap.viz.ui5.types.Background_drawingEffect} the value of property <code>drawingEffect</code>
 * @public
 * @name sap.viz.ui5.types.Background#getDrawingEffect
 * @function
 */

/**
 * Setter for property <code>drawingEffect</code>.
 *
 * Default value is <code>normal</code> 
 *
 * @param {sap.viz.ui5.types.Background_drawingEffect} oDrawingEffect  new value for property <code>drawingEffect</code>
 * @return {sap.viz.ui5.types.Background} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background#setDrawingEffect
 * @function
 */


/**
 * Getter for property <code>direction</code>.
 * Set the direction of the color gradient in the background. This only takes effect if the 'drawingEffect' value is set to 'glossy'.
 *
 * Default value is <code>vertical</code>
 *
 * @return {sap.viz.ui5.types.Background_direction} the value of property <code>direction</code>
 * @public
 * @name sap.viz.ui5.types.Background#getDirection
 * @function
 */

/**
 * Setter for property <code>direction</code>.
 *
 * Default value is <code>vertical</code> 
 *
 * @param {sap.viz.ui5.types.Background_direction} oDirection  new value for property <code>direction</code>
 * @return {sap.viz.ui5.types.Background} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background#setDirection
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * Define the color for the plot background body.
 *
 * Default value is <code>transparent</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Background#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>transparent</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.viz.ui5.types.Background} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Background#setColor
 * @function
 */


/**
 * Getter for aggregation <code>border</code>.<br/>
 * Settings for the border
 * 
 * @return {sap.viz.ui5.types.Background_border}
 * @public
 * @name sap.viz.ui5.types.Background#getBorder
 * @function
 */


/**
 * Setter for the aggregated <code>border</code>.
 * @param {sap.viz.ui5.types.Background_border} oBorder
 * @return {sap.viz.ui5.types.Background} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background#setBorder
 * @function
 */
	

/**
 * Destroys the border in the aggregation 
 * named <code>border</code>.
 * @return {sap.viz.ui5.types.Background} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Background#destroyBorder
 * @function
 */


// Start of sap/viz/ui5/types/Background.js
sap.viz.ui5.types.Background.prototype.getBorder = function() {
  return this._getOrCreate("border");
}
