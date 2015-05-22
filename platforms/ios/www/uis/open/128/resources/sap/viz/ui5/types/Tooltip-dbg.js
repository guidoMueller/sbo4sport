/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Tooltip.
jQuery.sap.declare("sap.viz.ui5.types.Tooltip");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Tooltip.
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
 * <li>{@link #getPreRender preRender} : any (default: null)</li>
 * <li>{@link #getPostRender postRender} : any (default: null)</li>
 * <li>{@link #getVisible visible} : boolean (default: true)</li>
 * <li>{@link #getDrawingEffect drawingEffect} : sap.viz.ui5.types.Tooltip_drawingEffect (default: sap.viz.ui5.types.Tooltip_drawingEffect.normal)</li>
 * <li>{@link #getFormatString formatString} : any[][] (default: [[null]])</li>
 * <li>{@link #getLayinChart layinChart} : boolean (default: true)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getBackground background} : sap.viz.ui5.types.Tooltip_background</li>
 * <li>{@link #getFooterLabel footerLabel} : sap.viz.ui5.types.Tooltip_footerLabel</li>
 * <li>{@link #getSeparationLine separationLine} : sap.viz.ui5.types.Tooltip_separationLine</li>
 * <li>{@link #getBodyDimensionLabel bodyDimensionLabel} : sap.viz.ui5.types.Tooltip_bodyDimensionLabel</li>
 * <li>{@link #getBodyDimensionValue bodyDimensionValue} : sap.viz.ui5.types.Tooltip_bodyDimensionValue</li>
 * <li>{@link #getBodyMeasureLabel bodyMeasureLabel} : sap.viz.ui5.types.Tooltip_bodyMeasureLabel</li>
 * <li>{@link #getBodyMeasureValue bodyMeasureValue} : sap.viz.ui5.types.Tooltip_bodyMeasureValue</li>
 * <li>{@link #getCloseButton closeButton} : sap.viz.ui5.types.Tooltip_closeButton</li></ul>
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
 * Module ui5/types/Tooltip
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Tooltip
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Tooltip", { metadata : {

	library : "sap.viz",
	properties : {
		"preRender" : {type : "any", group : "", defaultValue : null},
		"postRender" : {type : "any", group : "", defaultValue : null},
		"visible" : {type : "boolean", group : "", defaultValue : true},
		"drawingEffect" : {type : "sap.viz.ui5.types.Tooltip_drawingEffect", group : "", defaultValue : sap.viz.ui5.types.Tooltip_drawingEffect.normal, deprecated: true},
		"formatString" : {type : "any[][]", group : "", defaultValue : [[null]]},
		"layinChart" : {type : "boolean", group : "", defaultValue : true}
	},
	aggregations : {
		"background" : {type : "sap.viz.ui5.types.Tooltip_background", multiple : false}, 
		"footerLabel" : {type : "sap.viz.ui5.types.Tooltip_footerLabel", multiple : false, deprecated: true}, 
		"separationLine" : {type : "sap.viz.ui5.types.Tooltip_separationLine", multiple : false, deprecated: true}, 
		"bodyDimensionLabel" : {type : "sap.viz.ui5.types.Tooltip_bodyDimensionLabel", multiple : false, deprecated: true}, 
		"bodyDimensionValue" : {type : "sap.viz.ui5.types.Tooltip_bodyDimensionValue", multiple : false, deprecated: true}, 
		"bodyMeasureLabel" : {type : "sap.viz.ui5.types.Tooltip_bodyMeasureLabel", multiple : false, deprecated: true}, 
		"bodyMeasureValue" : {type : "sap.viz.ui5.types.Tooltip_bodyMeasureValue", multiple : false, deprecated: true}, 
		"closeButton" : {type : "sap.viz.ui5.types.Tooltip_closeButton", multiple : false, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Tooltip with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Tooltip.extend
 * @function
 */


/**
 * Getter for property <code>preRender</code>.
 * A callback function can be specified as a parameter and passed to chart options when the user calls the createViz function. This callback function is called before the tooltip is rendered. The input parameter is a dom element, which is at the bottom of the tooltip. Any dom element such as a button can be appended to this parent node. It can only be called when the tooltip is in actionMode.
 *
 * Default value is <code>null</code>
 *
 * @return {any} the value of property <code>preRender</code>
 * @public
 * @name sap.viz.ui5.types.Tooltip#getPreRender
 * @function
 */

/**
 * Setter for property <code>preRender</code>.
 *
 * Default value is <code>null</code> 
 *
 * @param {any} oPreRender  new value for property <code>preRender</code>
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#setPreRender
 * @function
 */


/**
 * Getter for property <code>postRender</code>.
 * A callback function can be specified as a parameter and passed to chart options when the user calls the createViz function. This callback function is called after the tooltip is rendered. The user can select and change dom elements' properties under the tooltip element.
 *
 * Default value is <code>null</code>
 *
 * @return {any} the value of property <code>postRender</code>
 * @public
 * @name sap.viz.ui5.types.Tooltip#getPostRender
 * @function
 */

/**
 * Setter for property <code>postRender</code>.
 *
 * Default value is <code>null</code> 
 *
 * @param {any} oPostRender  new value for property <code>postRender</code>
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#setPostRender
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set the visibility of the tooltip
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.viz.ui5.types.Tooltip#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#setVisible
 * @function
 */


/**
 * Getter for property <code>drawingEffect</code>.
 * Set the drawing effect for the tooltip
 *
 * Default value is <code>normal</code>
 *
 * @return {sap.viz.ui5.types.Tooltip_drawingEffect} the value of property <code>drawingEffect</code>
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getDrawingEffect
 * @function
 */

/**
 * Setter for property <code>drawingEffect</code>.
 *
 * Default value is <code>normal</code> 
 *
 * @param {sap.viz.ui5.types.Tooltip_drawingEffect} oDrawingEffect  new value for property <code>drawingEffect</code>
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setDrawingEffect
 * @function
 */


/**
 * Getter for property <code>formatString</code>.
 * Set the format strings for text in the tooltip. For dual axis charts, the first array is applied to the primary axis and the second array is applied to the second axis. If you enter fewer format strings into an array than there are measures in the respective axis, then the last format string is applied to all remaining measures. The following characters are reserved as tokens for format code: MDYHSAmdyhsa#?%0@.The following is an example of an array for a chart with two measures: [["#,##0.00 DM;-#,##.00 DM","#,##.00;-#,##.00"]].
 *
 * Default value is <code>null</code>
 *
 * @return {any[][]} the value of property <code>formatString</code>
 * @public
 * @name sap.viz.ui5.types.Tooltip#getFormatString
 * @function
 */

/**
 * Setter for property <code>formatString</code>.
 *
 * Default value is <code>null</code> 
 *
 * @param {any[][]} aFormatString  new value for property <code>formatString</code>
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#setFormatString
 * @function
 */


/**
 * Getter for property <code>layinChart</code>.
 * Set whether the tooltip appears in the chart area
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>layinChart</code>
 * @public
 * @name sap.viz.ui5.types.Tooltip#getLayinChart
 * @function
 */

/**
 * Setter for property <code>layinChart</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bLayinChart  new value for property <code>layinChart</code>
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#setLayinChart
 * @function
 */


/**
 * Getter for aggregation <code>background</code>.<br/>
 * Define the background style of the tooltip.
 * 
 * @return {sap.viz.ui5.types.Tooltip_background}
 * @public
 * @name sap.viz.ui5.types.Tooltip#getBackground
 * @function
 */


/**
 * Setter for the aggregated <code>background</code>.
 * @param {sap.viz.ui5.types.Tooltip_background} oBackground
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#setBackground
 * @function
 */
	

/**
 * Destroys the background in the aggregation 
 * named <code>background</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Tooltip#destroyBackground
 * @function
 */


/**
 * Getter for aggregation <code>footerLabel</code>.<br/>
 * Define the style of the label of the tooltip footer.
 * 
 * @return {sap.viz.ui5.types.Tooltip_footerLabel}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getFooterLabel
 * @function
 */


/**
 * Setter for the aggregated <code>footerLabel</code>.
 * @param {sap.viz.ui5.types.Tooltip_footerLabel} oFooterLabel
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setFooterLabel
 * @function
 */
	

/**
 * Destroys the footerLabel in the aggregation 
 * named <code>footerLabel</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroyFooterLabel
 * @function
 */


/**
 * Getter for aggregation <code>separationLine</code>.<br/>
 * Define the color of the value of the tooltip separation line.
 * 
 * @return {sap.viz.ui5.types.Tooltip_separationLine}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getSeparationLine
 * @function
 */


/**
 * Setter for the aggregated <code>separationLine</code>.
 * @param {sap.viz.ui5.types.Tooltip_separationLine} oSeparationLine
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setSeparationLine
 * @function
 */
	

/**
 * Destroys the separationLine in the aggregation 
 * named <code>separationLine</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroySeparationLine
 * @function
 */


/**
 * Getter for aggregation <code>bodyDimensionLabel</code>.<br/>
 * Define the color of the dimension name of the tooltip body.
 * 
 * @return {sap.viz.ui5.types.Tooltip_bodyDimensionLabel}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getBodyDimensionLabel
 * @function
 */


/**
 * Setter for the aggregated <code>bodyDimensionLabel</code>.
 * @param {sap.viz.ui5.types.Tooltip_bodyDimensionLabel} oBodyDimensionLabel
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setBodyDimensionLabel
 * @function
 */
	

/**
 * Destroys the bodyDimensionLabel in the aggregation 
 * named <code>bodyDimensionLabel</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroyBodyDimensionLabel
 * @function
 */


/**
 * Getter for aggregation <code>bodyDimensionValue</code>.<br/>
 * Define the color of the dimension value of the tooltip body.
 * 
 * @return {sap.viz.ui5.types.Tooltip_bodyDimensionValue}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getBodyDimensionValue
 * @function
 */


/**
 * Setter for the aggregated <code>bodyDimensionValue</code>.
 * @param {sap.viz.ui5.types.Tooltip_bodyDimensionValue} oBodyDimensionValue
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setBodyDimensionValue
 * @function
 */
	

/**
 * Destroys the bodyDimensionValue in the aggregation 
 * named <code>bodyDimensionValue</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroyBodyDimensionValue
 * @function
 */


/**
 * Getter for aggregation <code>bodyMeasureLabel</code>.<br/>
 * Define the color of the measure name of the tooltip body.
 * 
 * @return {sap.viz.ui5.types.Tooltip_bodyMeasureLabel}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getBodyMeasureLabel
 * @function
 */


/**
 * Setter for the aggregated <code>bodyMeasureLabel</code>.
 * @param {sap.viz.ui5.types.Tooltip_bodyMeasureLabel} oBodyMeasureLabel
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setBodyMeasureLabel
 * @function
 */
	

/**
 * Destroys the bodyMeasureLabel in the aggregation 
 * named <code>bodyMeasureLabel</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroyBodyMeasureLabel
 * @function
 */


/**
 * Getter for aggregation <code>bodyMeasureValue</code>.<br/>
 * Define the color of the measure value of the tooltip body.
 * 
 * @return {sap.viz.ui5.types.Tooltip_bodyMeasureValue}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getBodyMeasureValue
 * @function
 */


/**
 * Setter for the aggregated <code>bodyMeasureValue</code>.
 * @param {sap.viz.ui5.types.Tooltip_bodyMeasureValue} oBodyMeasureValue
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setBodyMeasureValue
 * @function
 */
	

/**
 * Destroys the bodyMeasureValue in the aggregation 
 * named <code>bodyMeasureValue</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroyBodyMeasureValue
 * @function
 */


/**
 * Getter for aggregation <code>closeButton</code>.<br/>
 * Define the background and border color of tooltip close button.
 * 
 * @return {sap.viz.ui5.types.Tooltip_closeButton}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#getCloseButton
 * @function
 */


/**
 * Setter for the aggregated <code>closeButton</code>.
 * @param {sap.viz.ui5.types.Tooltip_closeButton} oCloseButton
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#setCloseButton
 * @function
 */
	

/**
 * Destroys the closeButton in the aggregation 
 * named <code>closeButton</code>.
 * @return {sap.viz.ui5.types.Tooltip} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Tooltip#destroyCloseButton
 * @function
 */


// Start of sap/viz/ui5/types/Tooltip.js
sap.viz.ui5.types.Tooltip.prototype.getBackground = function() {
  return this._getOrCreate("background");
}
sap.viz.ui5.types.Tooltip.prototype.getFooterLabel = function() {
  return this._getOrCreate("footerLabel");
}
sap.viz.ui5.types.Tooltip.prototype.getSeparationLine = function() {
  return this._getOrCreate("separationLine");
}
sap.viz.ui5.types.Tooltip.prototype.getBodyDimensionLabel = function() {
  return this._getOrCreate("bodyDimensionLabel");
}
sap.viz.ui5.types.Tooltip.prototype.getBodyDimensionValue = function() {
  return this._getOrCreate("bodyDimensionValue");
}
sap.viz.ui5.types.Tooltip.prototype.getBodyMeasureLabel = function() {
  return this._getOrCreate("bodyMeasureLabel");
}
sap.viz.ui5.types.Tooltip.prototype.getBodyMeasureValue = function() {
  return this._getOrCreate("bodyMeasureValue");
}
sap.viz.ui5.types.Tooltip.prototype.getCloseButton = function() {
  return this._getOrCreate("closeButton");
}
