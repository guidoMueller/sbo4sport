/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Combination.
jQuery.sap.declare("sap.viz.ui5.types.Combination");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Combination.
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
 * <li>{@link #getOrientation orientation} : sap.viz.ui5.types.Combination_orientation (default: sap.viz.ui5.types.Combination_orientation.vertical)</li>
 * <li>{@link #getColorPalette colorPalette} : string[] (default: ['#748CB2','#9CC677','#EACF5E','#F9AD79','#D16A7C','#8873A2','#3A95B3','#B6D949','#FDD36C','#F47958','#A65084','#0063B1','#0DA841','#FCB71D','#F05620','#B22D6E','#3C368E','#8FB2CF','#95D4AB','#EAE98F','#F9BE92','#EC9A99','#BC98BD','#1EB7B2','#73C03C','#F48323','#EB271B','#D9B5CA','#AED1DA','#DFECB2','#FCDAB0','#F5BCB4'])</li>
 * <li>{@link #getPrimaryValuesColorPalette primaryValuesColorPalette} : string[] (default: ['#8FBADD','#B8D4E9','#7AAED6','#A3C7E3','#3D88C4','#66A1D0','#297CBE','#5295CA','#005BA3','#146FB7','#005395','#0063B1'])</li>
 * <li>{@link #getSecondaryValuesColorPalette secondaryValuesColorPalette} : string[] (default: ['#F6A09B','#F9C3C0','#F58E88','#F8B1AD','#F05B52','#F37D76','#EE4A40','#F16C64','#D92419','#ED382D','#C52117','#EB271B'])</li>
 * <li>{@link #getDrawingEffect drawingEffect} : sap.viz.ui5.types.Combination_drawingEffect (default: sap.viz.ui5.types.Combination_drawingEffect.normal)</li>
 * <li>{@link #getFormatRules formatRules} : object[]</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getToolTip toolTip} : sap.viz.ui5.types.Combination_tooltip</li>
 * <li>{@link #getAnimation animation} : sap.viz.ui5.types.Combination_animation</li>
 * <li>{@link #getDataShape dataShape} : sap.viz.ui5.types.Combination_dataShape</li>
 * <li>{@link #getBar bar} : sap.viz.ui5.types.Combination_bar</li>
 * <li>{@link #getLine line} : sap.viz.ui5.types.Combination_line</li></ul>
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
 * Module ui5/types/Combination
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Combination
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Combination", { metadata : {

	library : "sap.viz",
	properties : {
		"orientation" : {type : "sap.viz.ui5.types.Combination_orientation", group : "", defaultValue : sap.viz.ui5.types.Combination_orientation.vertical, deprecated: true},
		"colorPalette" : {type : "string[]", group : "", defaultValue : ['#748CB2','#9CC677','#EACF5E','#F9AD79','#D16A7C','#8873A2','#3A95B3','#B6D949','#FDD36C','#F47958','#A65084','#0063B1','#0DA841','#FCB71D','#F05620','#B22D6E','#3C368E','#8FB2CF','#95D4AB','#EAE98F','#F9BE92','#EC9A99','#BC98BD','#1EB7B2','#73C03C','#F48323','#EB271B','#D9B5CA','#AED1DA','#DFECB2','#FCDAB0','#F5BCB4']},
		"primaryValuesColorPalette" : {type : "string[]", group : "", defaultValue : ['#8FBADD','#B8D4E9','#7AAED6','#A3C7E3','#3D88C4','#66A1D0','#297CBE','#5295CA','#005BA3','#146FB7','#005395','#0063B1']},
		"secondaryValuesColorPalette" : {type : "string[]", group : "", defaultValue : ['#F6A09B','#F9C3C0','#F58E88','#F8B1AD','#F05B52','#F37D76','#EE4A40','#F16C64','#D92419','#ED382D','#C52117','#EB271B']},
		"drawingEffect" : {type : "sap.viz.ui5.types.Combination_drawingEffect", group : "", defaultValue : sap.viz.ui5.types.Combination_drawingEffect.normal},
		"formatRules" : {type : "object[]", group : "", defaultValue : null}
	},
	aggregations : {
		"toolTip" : {type : "sap.viz.ui5.types.Combination_tooltip", multiple : false, deprecated: true}, 
		"animation" : {type : "sap.viz.ui5.types.Combination_animation", multiple : false}, 
		"dataShape" : {type : "sap.viz.ui5.types.Combination_dataShape", multiple : false}, 
		"bar" : {type : "sap.viz.ui5.types.Combination_bar", multiple : false}, 
		"line" : {type : "sap.viz.ui5.types.Combination_line", multiple : false}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Combination with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Combination.extend
 * @function
 */


/**
 * Getter for property <code>orientation</code>.
 * Set the orientation of the plot area.
 *
 * Default value is <code>vertical</code>
 *
 * @return {sap.viz.ui5.types.Combination_orientation} the value of property <code>orientation</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Combination#getOrientation
 * @function
 */

/**
 * Setter for property <code>orientation</code>.
 *
 * Default value is <code>vertical</code> 
 *
 * @param {sap.viz.ui5.types.Combination_orientation} oOrientation  new value for property <code>orientation</code>
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Combination#setOrientation
 * @function
 */


/**
 * Getter for property <code>colorPalette</code>.
 * Set the color palette for the chart. This is not supported for dual axis charts that have measureNamesDimension bound to the legend.
 *
 * Default value is <code>#748CB2,#9CC677,#EACF5E,#F9AD79,#D16A7C,#8873A2,#3A95B3,#B6D949,#FDD36C,#F47958,#A65084,#0063B1,#0DA841,#FCB71D,#F05620,#B22D6E,#3C368E,#8FB2CF,#95D4AB,#EAE98F,#F9BE92,#EC9A99,#BC98BD,#1EB7B2,#73C03C,#F48323,#EB271B,#D9B5CA,#AED1DA,#DFECB2,#FCDAB0,#F5BCB4</code>
 *
 * @return {string[]} the value of property <code>colorPalette</code>
 * @public
 * @name sap.viz.ui5.types.Combination#getColorPalette
 * @function
 */

/**
 * Setter for property <code>colorPalette</code>.
 *
 * Default value is <code>#748CB2,#9CC677,#EACF5E,#F9AD79,#D16A7C,#8873A2,#3A95B3,#B6D949,#FDD36C,#F47958,#A65084,#0063B1,#0DA841,#FCB71D,#F05620,#B22D6E,#3C368E,#8FB2CF,#95D4AB,#EAE98F,#F9BE92,#EC9A99,#BC98BD,#1EB7B2,#73C03C,#F48323,#EB271B,#D9B5CA,#AED1DA,#DFECB2,#FCDAB0,#F5BCB4</code> 
 *
 * @param {string[]} aColorPalette  new value for property <code>colorPalette</code>
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setColorPalette
 * @function
 */


/**
 * Getter for property <code>primaryValuesColorPalette</code>.
 * Set the color palette for axis 1 in dual charts.
 *
 * Default value is <code>#8FBADD,#B8D4E9,#7AAED6,#A3C7E3,#3D88C4,#66A1D0,#297CBE,#5295CA,#005BA3,#146FB7,#005395,#0063B1</code>
 *
 * @return {string[]} the value of property <code>primaryValuesColorPalette</code>
 * @public
 * @name sap.viz.ui5.types.Combination#getPrimaryValuesColorPalette
 * @function
 */

/**
 * Setter for property <code>primaryValuesColorPalette</code>.
 *
 * Default value is <code>#8FBADD,#B8D4E9,#7AAED6,#A3C7E3,#3D88C4,#66A1D0,#297CBE,#5295CA,#005BA3,#146FB7,#005395,#0063B1</code> 
 *
 * @param {string[]} aPrimaryValuesColorPalette  new value for property <code>primaryValuesColorPalette</code>
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setPrimaryValuesColorPalette
 * @function
 */


/**
 * Getter for property <code>secondaryValuesColorPalette</code>.
 * Set the color palette for axis 2 in dual chart.
 *
 * Default value is <code>#F6A09B,#F9C3C0,#F58E88,#F8B1AD,#F05B52,#F37D76,#EE4A40,#F16C64,#D92419,#ED382D,#C52117,#EB271B</code>
 *
 * @return {string[]} the value of property <code>secondaryValuesColorPalette</code>
 * @public
 * @name sap.viz.ui5.types.Combination#getSecondaryValuesColorPalette
 * @function
 */

/**
 * Setter for property <code>secondaryValuesColorPalette</code>.
 *
 * Default value is <code>#F6A09B,#F9C3C0,#F58E88,#F8B1AD,#F05B52,#F37D76,#EE4A40,#F16C64,#D92419,#ED382D,#C52117,#EB271B</code> 
 *
 * @param {string[]} aSecondaryValuesColorPalette  new value for property <code>secondaryValuesColorPalette</code>
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setSecondaryValuesColorPalette
 * @function
 */


/**
 * Getter for property <code>drawingEffect</code>.
 * Set the drawing effect for the plot area. If this value is set to 'glossy', the plot area is glossy. If this value is set to 'normal', the plot area is matte.
 *
 * Default value is <code>normal</code>
 *
 * @return {sap.viz.ui5.types.Combination_drawingEffect} the value of property <code>drawingEffect</code>
 * @public
 * @name sap.viz.ui5.types.Combination#getDrawingEffect
 * @function
 */

/**
 * Setter for property <code>drawingEffect</code>.
 *
 * Default value is <code>normal</code> 
 *
 * @param {sap.viz.ui5.types.Combination_drawingEffect} oDrawingEffect  new value for property <code>drawingEffect</code>
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setDrawingEffect
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
 * @name sap.viz.ui5.types.Combination#getFormatRules
 * @function
 */

/**
 * Setter for property <code>formatRules</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object[]} aFormatRules  new value for property <code>formatRules</code>
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setFormatRules
 * @function
 */


/**
 * Getter for aggregation <code>toolTip</code>.<br/>
 * Settings for the tooltip
 * 
 * @return {sap.viz.ui5.types.Combination_tooltip}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Combination#getToolTip
 * @function
 */


/**
 * Setter for the aggregated <code>toolTip</code>.
 * @param {sap.viz.ui5.types.Combination_tooltip} oToolTip
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Combination#setToolTip
 * @function
 */
	

/**
 * Destroys the toolTip in the aggregation 
 * named <code>toolTip</code>.
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Combination#destroyToolTip
 * @function
 */


/**
 * Getter for aggregation <code>animation</code>.<br/>
 * Settings for animations in the plot area
 * 
 * @return {sap.viz.ui5.types.Combination_animation}
 * @public
 * @name sap.viz.ui5.types.Combination#getAnimation
 * @function
 */


/**
 * Setter for the aggregated <code>animation</code>.
 * @param {sap.viz.ui5.types.Combination_animation} oAnimation
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setAnimation
 * @function
 */
	

/**
 * Destroys the animation in the aggregation 
 * named <code>animation</code>.
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#destroyAnimation
 * @function
 */


/**
 * Getter for aggregation <code>dataShape</code>.<br/>
 * Settings for the shape of data series
 * 
 * @return {sap.viz.ui5.types.Combination_dataShape}
 * @public
 * @name sap.viz.ui5.types.Combination#getDataShape
 * @function
 */


/**
 * Setter for the aggregated <code>dataShape</code>.
 * @param {sap.viz.ui5.types.Combination_dataShape} oDataShape
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setDataShape
 * @function
 */
	

/**
 * Destroys the dataShape in the aggregation 
 * named <code>dataShape</code>.
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#destroyDataShape
 * @function
 */


/**
 * Getter for aggregation <code>bar</code>.<br/>
 * Settings for bar properties
 * 
 * @return {sap.viz.ui5.types.Combination_bar}
 * @public
 * @name sap.viz.ui5.types.Combination#getBar
 * @function
 */


/**
 * Setter for the aggregated <code>bar</code>.
 * @param {sap.viz.ui5.types.Combination_bar} oBar
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setBar
 * @function
 */
	

/**
 * Destroys the bar in the aggregation 
 * named <code>bar</code>.
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#destroyBar
 * @function
 */


/**
 * Getter for aggregation <code>line</code>.<br/>
 * Settings for line properties
 * 
 * @return {sap.viz.ui5.types.Combination_line}
 * @public
 * @name sap.viz.ui5.types.Combination#getLine
 * @function
 */


/**
 * Setter for the aggregated <code>line</code>.
 * @param {sap.viz.ui5.types.Combination_line} oLine
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#setLine
 * @function
 */
	

/**
 * Destroys the line in the aggregation 
 * named <code>line</code>.
 * @return {sap.viz.ui5.types.Combination} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Combination#destroyLine
 * @function
 */


// Start of sap/viz/ui5/types/Combination.js
sap.viz.ui5.types.Combination.prototype.getToolTip = function() {
  return this._getOrCreate("toolTip");
}
sap.viz.ui5.types.Combination.prototype.getAnimation = function() {
  return this._getOrCreate("animation");
}
sap.viz.ui5.types.Combination.prototype.getDataShape = function() {
  return this._getOrCreate("dataShape");
}
sap.viz.ui5.types.Combination.prototype.getBar = function() {
  return this._getOrCreate("bar");
}
sap.viz.ui5.types.Combination.prototype.getLine = function() {
  return this._getOrCreate("line");
}
