/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Treemap.
jQuery.sap.declare("sap.viz.ui5.types.Treemap");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Treemap.
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
 * <li>{@link #getStartColor startColor} : string (default: '#C2E3A9')</li>
 * <li>{@link #getEndColor endColor} : string (default: '#73C03C')</li>
 * <li>{@link #getColorPalette colorPalette} : string[]</li>
 * <li>{@link #getLegendValues legendValues} : int[]</li>
 * <li>{@link #getFormatRules formatRules} : object[]</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getBorder border} : sap.viz.ui5.types.Treemap_border</li>
 * <li>{@link #getAnimation animation} : sap.viz.ui5.types.Treemap_animation</li>
 * <li>{@link #getToolTip toolTip} : sap.viz.ui5.types.Treemap_tooltip</li></ul>
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
 * Module ui5/types/Treemap
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Treemap
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Treemap", { metadata : {

	library : "sap.viz",
	properties : {
		"startColor" : {type : "string", group : "", defaultValue : '#C2E3A9'},
		"endColor" : {type : "string", group : "", defaultValue : '#73C03C'},
		"colorPalette" : {type : "string[]", group : "", defaultValue : null},
		"legendValues" : {type : "int[]", group : "", defaultValue : null},
		"formatRules" : {type : "object[]", group : "", defaultValue : null}
	},
	aggregations : {
		"border" : {type : "sap.viz.ui5.types.Treemap_border", multiple : false}, 
		"animation" : {type : "sap.viz.ui5.types.Treemap_animation", multiple : false}, 
		"toolTip" : {type : "sap.viz.ui5.types.Treemap_tooltip", multiple : false, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Treemap with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Treemap.extend
 * @function
 */


/**
 * Getter for property <code>startColor</code>.
 * Set the starting color of the tree map
 *
 * Default value is <code>#C2E3A9</code>
 *
 * @return {string} the value of property <code>startColor</code>
 * @public
 * @name sap.viz.ui5.types.Treemap#getStartColor
 * @function
 */

/**
 * Setter for property <code>startColor</code>.
 *
 * Default value is <code>#C2E3A9</code> 
 *
 * @param {string} sStartColor  new value for property <code>startColor</code>
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setStartColor
 * @function
 */


/**
 * Getter for property <code>endColor</code>.
 * Set the end color of the tree map
 *
 * Default value is <code>#73C03C</code>
 *
 * @return {string} the value of property <code>endColor</code>
 * @public
 * @name sap.viz.ui5.types.Treemap#getEndColor
 * @function
 */

/**
 * Setter for property <code>endColor</code>.
 *
 * Default value is <code>#73C03C</code> 
 *
 * @param {string} sEndColor  new value for property <code>endColor</code>
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setEndColor
 * @function
 */


/**
 * Getter for property <code>colorPalette</code>.
 * Set the color palette for the various sectors. For example, ["#748CB2", "#9CC677", "#EACF5E", "#F9AD79", "#D16A7C"].
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {string[]} the value of property <code>colorPalette</code>
 * @public
 * @name sap.viz.ui5.types.Treemap#getColorPalette
 * @function
 */

/**
 * Setter for property <code>colorPalette</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {string[]} aColorPalette  new value for property <code>colorPalette</code>
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setColorPalette
 * @function
 */


/**
 * Getter for property <code>legendValues</code>.
 * Set the MBC legend values. For example, [10,11,12,13,14,15]. The values in the array should be in ascending order. If the number of values in the array is smaller than the MBC legend segment number, the MBC legend automatically calculates the values according to the data. If the number of values in the legendValues array is larger than MBC legend segment number, then only the first "segment number + 1" values are used.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {int[]} the value of property <code>legendValues</code>
 * @public
 * @name sap.viz.ui5.types.Treemap#getLegendValues
 * @function
 */

/**
 * Setter for property <code>legendValues</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {int[]} aLegendValues  new value for property <code>legendValues</code>
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setLegendValues
 * @function
 */


/**
 * Getter for property <code>formatRules</code>.
 * Sample value for formatRules: [{condition: [{Key1:Value1, Key2:Value2}], color:"#00ff00"}, {condition: [{Key3:Value3}], color:"#00ffff"}]. Each rule has two properties: the "condition" and the "color". Value1, Value2 and Value3 are values. <br /> The value of a dimension may be <br /> 1, Single value (string), like "China" . <br /> 2. Array (enumeration), like ["UK","USA"] . <br /> The value of a measure may be <br /> 1, Single value (number), like 20 . <br /> 2. Arry (enumeration), like [121,122] . <br /> 3. Object (range), like {min:100, max 200} . Min and max are inclusive. If users want to inlcude 200, but not 100 in the range, they may use {min:100.00001, max:200}. If users want values larger than 100, they may write {min:100}. <br /> The color is applied if one or more conditions in the condition array is met. If multiple rules could apply on the same data point, it is the last rule that takes effect.
 *
 * Default value is empty/<code>undefined</code>
 *
 * @return {object[]} the value of property <code>formatRules</code>
 * @public
 * @name sap.viz.ui5.types.Treemap#getFormatRules
 * @function
 */

/**
 * Setter for property <code>formatRules</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object[]} aFormatRules  new value for property <code>formatRules</code>
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setFormatRules
 * @function
 */


/**
 * Getter for aggregation <code>border</code>.<br/>
 * Settings for the border
 * 
 * @return {sap.viz.ui5.types.Treemap_border}
 * @public
 * @name sap.viz.ui5.types.Treemap#getBorder
 * @function
 */


/**
 * Setter for the aggregated <code>border</code>.
 * @param {sap.viz.ui5.types.Treemap_border} oBorder
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setBorder
 * @function
 */
	

/**
 * Destroys the border in the aggregation 
 * named <code>border</code>.
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#destroyBorder
 * @function
 */


/**
 * Getter for aggregation <code>animation</code>.<br/>
 * Settings for animations in the plot area
 * 
 * @return {sap.viz.ui5.types.Treemap_animation}
 * @public
 * @name sap.viz.ui5.types.Treemap#getAnimation
 * @function
 */


/**
 * Setter for the aggregated <code>animation</code>.
 * @param {sap.viz.ui5.types.Treemap_animation} oAnimation
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#setAnimation
 * @function
 */
	

/**
 * Destroys the animation in the aggregation 
 * named <code>animation</code>.
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Treemap#destroyAnimation
 * @function
 */


/**
 * Getter for aggregation <code>toolTip</code>.<br/>
 * Settings for tooltip
 * 
 * @return {sap.viz.ui5.types.Treemap_tooltip}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Treemap#getToolTip
 * @function
 */


/**
 * Setter for the aggregated <code>toolTip</code>.
 * @param {sap.viz.ui5.types.Treemap_tooltip} oToolTip
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Treemap#setToolTip
 * @function
 */
	

/**
 * Destroys the toolTip in the aggregation 
 * named <code>toolTip</code>.
 * @return {sap.viz.ui5.types.Treemap} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Treemap#destroyToolTip
 * @function
 */


// Start of sap/viz/ui5/types/Treemap.js
sap.viz.ui5.types.Treemap.prototype.getBorder = function() {
  return this._getOrCreate("border");
}
sap.viz.ui5.types.Treemap.prototype.getAnimation = function() {
  return this._getOrCreate("animation");
}
sap.viz.ui5.types.Treemap.prototype.getToolTip = function() {
  return this._getOrCreate("toolTip");
}
