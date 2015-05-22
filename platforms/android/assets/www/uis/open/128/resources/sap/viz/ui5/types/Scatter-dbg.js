/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Scatter.
jQuery.sap.declare("sap.viz.ui5.types.Scatter");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Scatter.
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
 * <li>{@link #getColorPalette colorPalette} : string[] (default: ['#748CB2','#9CC677','#EACF5E','#F9AD79','#D16A7C','#8873A2','#3A95B3','#B6D949','#FDD36C','#F47958','#A65084','#0063B1','#0DA841','#FCB71D','#F05620','#B22D6E','#3C368E','#8FB2CF','#95D4AB','#EAE98F','#F9BE92','#EC9A99','#BC98BD','#1EB7B2','#73C03C','#F48323','#EB271B','#D9B5CA','#AED1DA','#DFECB2','#FCDAB0','#F5BCB4'])</li>
 * <li>{@link #getShapePalette shapePalette} : string[] (default: ['circle','square','diamond','triangleUp','triangleDown','triangleLeft','triangleRight','cross','intersection'])</li>
 * <li>{@link #getMaxPriValue maxPriValue} : float (default: 0)</li>
 * <li>{@link #getMinPriValue minPriValue} : float (default: 0)</li>
 * <li>{@link #getMaxSecValue maxSecValue} : float (default: 0)</li>
 * <li>{@link #getMinSecValue minSecValue} : float (default: 0)</li>
 * <li>{@link #getTimeBased timeBased} : boolean (default: false)</li>
 * <li>{@link #getDrawingEffect drawingEffect} : sap.viz.ui5.types.Scatter_drawingEffect (default: sap.viz.ui5.types.Scatter_drawingEffect.normal)</li>
 * <li>{@link #getFormatRules formatRules} : object[]</li>
 * <li>{@link #getShowNegativeValues showNegativeValues} : boolean (default: true)</li>
 * <li>{@link #getMarkerSize markerSize} : int (default: 10)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getAnimation animation} : sap.viz.ui5.types.Scatter_animation</li>
 * <li>{@link #getAxisTooltip axisTooltip} : sap.viz.ui5.types.Scatter_axisTooltip</li>
 * <li>{@link #getHoverline hoverline} : sap.viz.ui5.types.Scatter_hoverline</li></ul>
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
 * Module ui5/types/Scatter
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Scatter
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Scatter", { metadata : {

	library : "sap.viz",
	properties : {
		"colorPalette" : {type : "string[]", group : "", defaultValue : ['#748CB2','#9CC677','#EACF5E','#F9AD79','#D16A7C','#8873A2','#3A95B3','#B6D949','#FDD36C','#F47958','#A65084','#0063B1','#0DA841','#FCB71D','#F05620','#B22D6E','#3C368E','#8FB2CF','#95D4AB','#EAE98F','#F9BE92','#EC9A99','#BC98BD','#1EB7B2','#73C03C','#F48323','#EB271B','#D9B5CA','#AED1DA','#DFECB2','#FCDAB0','#F5BCB4']},
		"shapePalette" : {type : "string[]", group : "", defaultValue : ['circle','square','diamond','triangleUp','triangleDown','triangleLeft','triangleRight','cross','intersection']},
		"maxPriValue" : {type : "float", group : "", defaultValue : 0, deprecated: true},
		"minPriValue" : {type : "float", group : "", defaultValue : 0, deprecated: true},
		"maxSecValue" : {type : "float", group : "", defaultValue : 0, deprecated: true},
		"minSecValue" : {type : "float", group : "", defaultValue : 0, deprecated: true},
		"timeBased" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"drawingEffect" : {type : "sap.viz.ui5.types.Scatter_drawingEffect", group : "", defaultValue : sap.viz.ui5.types.Scatter_drawingEffect.normal},
		"formatRules" : {type : "object[]", group : "", defaultValue : null},
		"showNegativeValues" : {type : "boolean", group : "", defaultValue : true, deprecated: true},
		"markerSize" : {type : "int", group : "", defaultValue : 10}
	},
	aggregations : {
		"animation" : {type : "sap.viz.ui5.types.Scatter_animation", multiple : false}, 
		"axisTooltip" : {type : "sap.viz.ui5.types.Scatter_axisTooltip", multiple : false, deprecated: true}, 
		"hoverline" : {type : "sap.viz.ui5.types.Scatter_hoverline", multiple : false, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Scatter with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Scatter.extend
 * @function
 */


/**
 * Getter for property <code>colorPalette</code>.
 * Set the color of the bubbles
 *
 * Default value is <code>#748CB2,#9CC677,#EACF5E,#F9AD79,#D16A7C,#8873A2,#3A95B3,#B6D949,#FDD36C,#F47958,#A65084,#0063B1,#0DA841,#FCB71D,#F05620,#B22D6E,#3C368E,#8FB2CF,#95D4AB,#EAE98F,#F9BE92,#EC9A99,#BC98BD,#1EB7B2,#73C03C,#F48323,#EB271B,#D9B5CA,#AED1DA,#DFECB2,#FCDAB0,#F5BCB4</code>
 *
 * @return {string[]} the value of property <code>colorPalette</code>
 * @public
 * @name sap.viz.ui5.types.Scatter#getColorPalette
 * @function
 */

/**
 * Setter for property <code>colorPalette</code>.
 *
 * Default value is <code>#748CB2,#9CC677,#EACF5E,#F9AD79,#D16A7C,#8873A2,#3A95B3,#B6D949,#FDD36C,#F47958,#A65084,#0063B1,#0DA841,#FCB71D,#F05620,#B22D6E,#3C368E,#8FB2CF,#95D4AB,#EAE98F,#F9BE92,#EC9A99,#BC98BD,#1EB7B2,#73C03C,#F48323,#EB271B,#D9B5CA,#AED1DA,#DFECB2,#FCDAB0,#F5BCB4</code> 
 *
 * @param {string[]} aColorPalette  new value for property <code>colorPalette</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#setColorPalette
 * @function
 */


/**
 * Getter for property <code>shapePalette</code>.
 * Set the shape of the bubbles
 *
 * Default value is <code>circle,square,diamond,triangleUp,triangleDown,triangleLeft,triangleRight,cross,intersection</code>
 *
 * @return {string[]} the value of property <code>shapePalette</code>
 * @public
 * @name sap.viz.ui5.types.Scatter#getShapePalette
 * @function
 */

/**
 * Setter for property <code>shapePalette</code>.
 *
 * Default value is <code>circle,square,diamond,triangleUp,triangleDown,triangleLeft,triangleRight,cross,intersection</code> 
 *
 * @param {string[]} aShapePalette  new value for property <code>shapePalette</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#setShapePalette
 * @function
 */


/**
 * Getter for property <code>maxPriValue</code>.
 * Set the max value of primary values
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>maxPriValue</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getMaxPriValue
 * @function
 */

/**
 * Setter for property <code>maxPriValue</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fMaxPriValue  new value for property <code>maxPriValue</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setMaxPriValue
 * @function
 */


/**
 * Getter for property <code>minPriValue</code>.
 * Set the minimum value of primary values
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>minPriValue</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getMinPriValue
 * @function
 */

/**
 * Setter for property <code>minPriValue</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fMinPriValue  new value for property <code>minPriValue</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setMinPriValue
 * @function
 */


/**
 * Getter for property <code>maxSecValue</code>.
 * Set the max value of secondary values
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>maxSecValue</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getMaxSecValue
 * @function
 */

/**
 * Setter for property <code>maxSecValue</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fMaxSecValue  new value for property <code>maxSecValue</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setMaxSecValue
 * @function
 */


/**
 * Getter for property <code>minSecValue</code>.
 * Set the minimum value of secondary values
 *
 * Default value is <code>0</code>
 *
 * @return {float} the value of property <code>minSecValue</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getMinSecValue
 * @function
 */

/**
 * Setter for property <code>minSecValue</code>.
 *
 * Default value is <code>0</code> 
 *
 * @param {float} fMinSecValue  new value for property <code>minSecValue</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setMinSecValue
 * @function
 */


/**
 * Getter for property <code>timeBased</code>.
 * Set whether it is time based scatter/bubble
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>timeBased</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getTimeBased
 * @function
 */

/**
 * Setter for property <code>timeBased</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bTimeBased  new value for property <code>timeBased</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setTimeBased
 * @function
 */


/**
 * Getter for property <code>drawingEffect</code>.
 * Set the drawing effect for the bubbles
 *
 * Default value is <code>normal</code>
 *
 * @return {sap.viz.ui5.types.Scatter_drawingEffect} the value of property <code>drawingEffect</code>
 * @public
 * @name sap.viz.ui5.types.Scatter#getDrawingEffect
 * @function
 */

/**
 * Setter for property <code>drawingEffect</code>.
 *
 * Default value is <code>normal</code> 
 *
 * @param {sap.viz.ui5.types.Scatter_drawingEffect} oDrawingEffect  new value for property <code>drawingEffect</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#setDrawingEffect
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
 * @name sap.viz.ui5.types.Scatter#getFormatRules
 * @function
 */

/**
 * Setter for property <code>formatRules</code>.
 *
 * Default value is empty/<code>undefined</code> 
 *
 * @param {object[]} aFormatRules  new value for property <code>formatRules</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#setFormatRules
 * @function
 */


/**
 * Getter for property <code>showNegativeValues</code>.
 * Show/hide the data of negetive value.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>showNegativeValues</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getShowNegativeValues
 * @function
 */

/**
 * Setter for property <code>showNegativeValues</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bShowNegativeValues  new value for property <code>showNegativeValues</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setShowNegativeValues
 * @function
 */


/**
 * Getter for property <code>markerSize</code>.
 * Set the marker size for data points. The available range is from '4' to '32'.
 *
 * Default value is <code>10</code>
 *
 * @return {int} the value of property <code>markerSize</code>
 * @public
 * @name sap.viz.ui5.types.Scatter#getMarkerSize
 * @function
 */

/**
 * Setter for property <code>markerSize</code>.
 *
 * Default value is <code>10</code> 
 *
 * @param {int} iMarkerSize  new value for property <code>markerSize</code>
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#setMarkerSize
 * @function
 */


/**
 * Getter for aggregation <code>animation</code>.<br/>
 * Settings for animations in bubble and scatter charts
 * 
 * @return {sap.viz.ui5.types.Scatter_animation}
 * @public
 * @name sap.viz.ui5.types.Scatter#getAnimation
 * @function
 */


/**
 * Setter for the aggregated <code>animation</code>.
 * @param {sap.viz.ui5.types.Scatter_animation} oAnimation
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#setAnimation
 * @function
 */
	

/**
 * Destroys the animation in the aggregation 
 * named <code>animation</code>.
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Scatter#destroyAnimation
 * @function
 */


/**
 * Getter for aggregation <code>axisTooltip</code>.<br/>
 * Set tooltip related properties.
 * 
 * @return {sap.viz.ui5.types.Scatter_axisTooltip}
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getAxisTooltip
 * @function
 */


/**
 * Setter for the aggregated <code>axisTooltip</code>.
 * @param {sap.viz.ui5.types.Scatter_axisTooltip} oAxisTooltip
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setAxisTooltip
 * @function
 */
	

/**
 * Destroys the axisTooltip in the aggregation 
 * named <code>axisTooltip</code>.
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#destroyAxisTooltip
 * @function
 */


/**
 * Getter for aggregation <code>hoverline</code>.<br/>
 * Settings for hoverline properties.
 * 
 * @return {sap.viz.ui5.types.Scatter_hoverline}
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#getHoverline
 * @function
 */


/**
 * Setter for the aggregated <code>hoverline</code>.
 * @param {sap.viz.ui5.types.Scatter_hoverline} oHoverline
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#setHoverline
 * @function
 */
	

/**
 * Destroys the hoverline in the aggregation 
 * named <code>hoverline</code>.
 * @return {sap.viz.ui5.types.Scatter} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Scatter#destroyHoverline
 * @function
 */


// Start of sap/viz/ui5/types/Scatter.js
sap.viz.ui5.types.Scatter.prototype.getAnimation = function() {
  return this._getOrCreate("animation");
}
sap.viz.ui5.types.Scatter.prototype.getAxisTooltip = function() {
  return this._getOrCreate("axisTooltip");
}
sap.viz.ui5.types.Scatter.prototype.getHoverline = function() {
  return this._getOrCreate("hoverline");
}
