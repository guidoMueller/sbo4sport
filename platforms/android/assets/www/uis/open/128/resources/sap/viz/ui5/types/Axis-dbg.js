/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.control, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides control sap.viz.ui5.types.Axis.
jQuery.sap.declare("sap.viz.ui5.types.Axis");
jQuery.sap.require("sap.viz.library");
jQuery.sap.require("sap.viz.ui5.core.BaseStructuredType");


/**
 * Constructor for a new ui5/types/Axis.
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
 * <li>{@link #getIsIndependentMode isIndependentMode} : boolean (default: false)</li>
 * <li>{@link #getIsPercentMode isPercentMode} : boolean (default: false)</li>
 * <li>{@link #getIsKeepFirstAndLastLabel isKeepFirstAndLastLabel} : boolean (default: false)</li>
 * <li>{@link #getLineSize lineSize} : int (default: 1)</li>
 * <li>{@link #getColor color} : string (default: '#6c6c6c')</li>
 * <li>{@link #getType type} : sap.viz.ui5.types.Axis_type (default: sap.viz.ui5.types.Axis_type.value)</li>
 * <li>{@link #getVisible visible} : boolean (default: true)</li>
 * <li>{@link #getPosition position} : sap.viz.ui5.types.Axis_position (default: sap.viz.ui5.types.Axis_position.bottom)</li>
 * <li>{@link #getIsTruncateAvailable isTruncateAvailable} : boolean (default: true)</li>
 * <li>{@link #getForceLabelArea forceLabelArea} : boolean (default: false)</li>
 * <li>{@link #getEnableLabelSelection enableLabelSelection} : boolean (default: true)</li>
 * <li>{@link #getHideTitleFirst hideTitleFirst} : boolean (default: false)</li>
 * <li>{@link #getMaxSizeRatio maxSizeRatio} : float (default: 0.25)</li></ul>
 * </li>
 * <li>Aggregations
 * <ul>
 * <li>{@link #getTitle title} : sap.viz.ui5.types.Axis_title</li>
 * <li>{@link #getGridline gridline} : sap.viz.ui5.types.Axis_gridline</li>
 * <li>{@link #getAxisline axisline} : sap.viz.ui5.types.Axis_axisline</li>
 * <li>{@link #getLabel label} : sap.viz.ui5.types.Axis_label</li>
 * <li>{@link #getIndicator indicator} : sap.viz.ui5.types.Axis_indicator</li>
 * <li>{@link #getScale scale} : sap.viz.ui5.types.Axis_scale</li>
 * <li>{@link #getLayoutInfo layoutInfo} : sap.viz.ui5.types.Axis_layoutInfo</li>
 * <li>{@link #getAxisTick axisTick} : sap.viz.ui5.types.Axis_axisTick</li></ul>
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
 * Module ui5/types/Axis
 * @extends sap.viz.ui5.core.BaseStructuredType
 * @version 1.24.4
 *
 * @constructor
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @name sap.viz.ui5.types.Axis
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.core.BaseStructuredType.extend("sap.viz.ui5.types.Axis", { metadata : {

	library : "sap.viz",
	properties : {
		"isIndependentMode" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"isPercentMode" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"isKeepFirstAndLastLabel" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"lineSize" : {type : "int", group : "", defaultValue : 1},
		"color" : {type : "string", group : "", defaultValue : '#6c6c6c'},
		"type" : {type : "sap.viz.ui5.types.Axis_type", group : "", defaultValue : sap.viz.ui5.types.Axis_type.value, deprecated: true},
		"visible" : {type : "boolean", group : "", defaultValue : true},
		"position" : {type : "sap.viz.ui5.types.Axis_position", group : "", defaultValue : sap.viz.ui5.types.Axis_position.bottom, deprecated: true},
		"isTruncateAvailable" : {type : "boolean", group : "", defaultValue : true, deprecated: true},
		"forceLabelArea" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"enableLabelSelection" : {type : "boolean", group : "", defaultValue : true, deprecated: true},
		"hideTitleFirst" : {type : "boolean", group : "", defaultValue : false, deprecated: true},
		"maxSizeRatio" : {type : "float", group : "", defaultValue : 0.25}
	},
	aggregations : {
		"title" : {type : "sap.viz.ui5.types.Axis_title", multiple : false}, 
		"gridline" : {type : "sap.viz.ui5.types.Axis_gridline", multiple : false}, 
		"axisline" : {type : "sap.viz.ui5.types.Axis_axisline", multiple : false}, 
		"label" : {type : "sap.viz.ui5.types.Axis_label", multiple : false}, 
		"indicator" : {type : "sap.viz.ui5.types.Axis_indicator", multiple : false, deprecated: true}, 
		"scale" : {type : "sap.viz.ui5.types.Axis_scale", multiple : false}, 
		"layoutInfo" : {type : "sap.viz.ui5.types.Axis_layoutInfo", multiple : false, deprecated: true}, 
		"axisTick" : {type : "sap.viz.ui5.types.Axis_axisTick", multiple : false, deprecated: true}
	}
}});


/**
 * Creates a new subclass of class sap.viz.ui5.types.Axis with name <code>sClassName</code> 
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
 * @name sap.viz.ui5.types.Axis.extend
 * @function
 */


/**
 * Getter for property <code>isIndependentMode</code>.
 * Set whether the axis works in independent mode. Currently, this property is used only for boxplot charts.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>isIndependentMode</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getIsIndependentMode
 * @function
 */

/**
 * Setter for property <code>isIndependentMode</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bIsIndependentMode  new value for property <code>isIndependentMode</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setIsIndependentMode
 * @function
 */


/**
 * Getter for property <code>isPercentMode</code>.
 * Show the label as a percentage. For example '0.1' would show as '10'.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>isPercentMode</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getIsPercentMode
 * @function
 */

/**
 * Setter for property <code>isPercentMode</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bIsPercentMode  new value for property <code>isPercentMode</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setIsPercentMode
 * @function
 */


/**
 * Getter for property <code>isKeepFirstAndLastLabel</code>.
 * Try to keep the first label and last label when the space is limited.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>isKeepFirstAndLastLabel</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getIsKeepFirstAndLastLabel
 * @function
 */

/**
 * Setter for property <code>isKeepFirstAndLastLabel</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bIsKeepFirstAndLastLabel  new value for property <code>isKeepFirstAndLastLabel</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setIsKeepFirstAndLastLabel
 * @function
 */


/**
 * Getter for property <code>lineSize</code>.
 * Set the thickness of the axis line
 *
 * Default value is <code>1</code>
 *
 * @return {int} the value of property <code>lineSize</code>
 * @public
 * @name sap.viz.ui5.types.Axis#getLineSize
 * @function
 */

/**
 * Setter for property <code>lineSize</code>.
 *
 * Default value is <code>1</code> 
 *
 * @param {int} iLineSize  new value for property <code>lineSize</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setLineSize
 * @function
 */


/**
 * Getter for property <code>color</code>.
 * Set the color of the axis line
 *
 * Default value is <code>#6c6c6c</code>
 *
 * @return {string} the value of property <code>color</code>
 * @public
 * @name sap.viz.ui5.types.Axis#getColor
 * @function
 */

/**
 * Setter for property <code>color</code>.
 *
 * Default value is <code>#6c6c6c</code> 
 *
 * @param {string} sColor  new value for property <code>color</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setColor
 * @function
 */


/**
 * Getter for property <code>type</code>.
 * Set the axis type
 *
 * Default value is <code>value</code>
 *
 * @return {sap.viz.ui5.types.Axis_type} the value of property <code>type</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getType
 * @function
 */

/**
 * Setter for property <code>type</code>.
 *
 * Default value is <code>value</code> 
 *
 * @param {sap.viz.ui5.types.Axis_type} oType  new value for property <code>type</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setType
 * @function
 */


/**
 * Getter for property <code>visible</code>.
 * Set the visibility of the entire axis, including the axis line, gridlines, and labels
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>visible</code>
 * @public
 * @name sap.viz.ui5.types.Axis#getVisible
 * @function
 */

/**
 * Setter for property <code>visible</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bVisible  new value for property <code>visible</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setVisible
 * @function
 */


/**
 * Getter for property <code>position</code>.
 * Set the position of the axis
 *
 * Default value is <code>bottom</code>
 *
 * @return {sap.viz.ui5.types.Axis_position} the value of property <code>position</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getPosition
 * @function
 */

/**
 * Setter for property <code>position</code>.
 *
 * Default value is <code>bottom</code> 
 *
 * @param {sap.viz.ui5.types.Axis_position} oPosition  new value for property <code>position</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setPosition
 * @function
 */


/**
 * Getter for property <code>isTruncateAvailable</code>.
 * Set whether truncation logic is available for the category axis
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>isTruncateAvailable</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getIsTruncateAvailable
 * @function
 */

/**
 * Setter for property <code>isTruncateAvailable</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bIsTruncateAvailable  new value for property <code>isTruncateAvailable</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setIsTruncateAvailable
 * @function
 */


/**
 * Getter for property <code>forceLabelArea</code>.
 * Set whether the label area is limited to the text area
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>forceLabelArea</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getForceLabelArea
 * @function
 */

/**
 * Setter for property <code>forceLabelArea</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bForceLabelArea  new value for property <code>forceLabelArea</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setForceLabelArea
 * @function
 */


/**
 * Getter for property <code>enableLabelSelection</code>.
 * Set whether the label selection effect is enabled. For mobile devices, the default value is 'false'.
 *
 * Default value is <code>true</code>
 *
 * @return {boolean} the value of property <code>enableLabelSelection</code>
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getEnableLabelSelection
 * @function
 */

/**
 * Setter for property <code>enableLabelSelection</code>.
 *
 * Default value is <code>true</code> 
 *
 * @param {boolean} bEnableLabelSelection  new value for property <code>enableLabelSelection</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setEnableLabelSelection
 * @function
 */


/**
 * Getter for property <code>hideTitleFirst</code>.
 * Hide axis title firstly if the space is limited.
 *
 * Default value is <code>false</code>
 *
 * @return {boolean} the value of property <code>hideTitleFirst</code>
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getHideTitleFirst
 * @function
 */

/**
 * Setter for property <code>hideTitleFirst</code>.
 *
 * Default value is <code>false</code> 
 *
 * @param {boolean} bHideTitleFirst  new value for property <code>hideTitleFirst</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.20. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setHideTitleFirst
 * @function
 */


/**
 * Getter for property <code>maxSizeRatio</code>.
 * The ratio to limit axis' space in its container, which only accepts values between 0 and 1(0 and 1 included). All the invalid values would be replaced by default value.
 *
 * Default value is <code>0.25</code>
 *
 * @return {float} the value of property <code>maxSizeRatio</code>
 * @public
 * @name sap.viz.ui5.types.Axis#getMaxSizeRatio
 * @function
 */

/**
 * Setter for property <code>maxSizeRatio</code>.
 *
 * Default value is <code>0.25</code> 
 *
 * @param {float} fMaxSizeRatio  new value for property <code>maxSizeRatio</code>
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setMaxSizeRatio
 * @function
 */


/**
 * Getter for aggregation <code>title</code>.<br/>
 * Settings for the axis title
 * 
 * @return {sap.viz.ui5.types.Axis_title}
 * @public
 * @name sap.viz.ui5.types.Axis#getTitle
 * @function
 */


/**
 * Setter for the aggregated <code>title</code>.
 * @param {sap.viz.ui5.types.Axis_title} oTitle
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setTitle
 * @function
 */
	

/**
 * Destroys the title in the aggregation 
 * named <code>title</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#destroyTitle
 * @function
 */


/**
 * Getter for aggregation <code>gridline</code>.<br/>
 * Settings for the gridlines on the axis
 * 
 * @return {sap.viz.ui5.types.Axis_gridline}
 * @public
 * @name sap.viz.ui5.types.Axis#getGridline
 * @function
 */


/**
 * Setter for the aggregated <code>gridline</code>.
 * @param {sap.viz.ui5.types.Axis_gridline} oGridline
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setGridline
 * @function
 */
	

/**
 * Destroys the gridline in the aggregation 
 * named <code>gridline</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#destroyGridline
 * @function
 */


/**
 * Getter for aggregation <code>axisline</code>.<br/>
 * Settings for the axis line
 * 
 * @return {sap.viz.ui5.types.Axis_axisline}
 * @public
 * @name sap.viz.ui5.types.Axis#getAxisline
 * @function
 */


/**
 * Setter for the aggregated <code>axisline</code>.
 * @param {sap.viz.ui5.types.Axis_axisline} oAxisline
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setAxisline
 * @function
 */
	

/**
 * Destroys the axisline in the aggregation 
 * named <code>axisline</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#destroyAxisline
 * @function
 */


/**
 * Getter for aggregation <code>label</code>.<br/>
 * Settings for the labels on this axis
 * 
 * @return {sap.viz.ui5.types.Axis_label}
 * @public
 * @name sap.viz.ui5.types.Axis#getLabel
 * @function
 */


/**
 * Setter for the aggregated <code>label</code>.
 * @param {sap.viz.ui5.types.Axis_label} oLabel
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setLabel
 * @function
 */
	

/**
 * Destroys the label in the aggregation 
 * named <code>label</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#destroyLabel
 * @function
 */


/**
 * Getter for aggregation <code>indicator</code>.<br/>
 * Settings for the axis indicator
 * 
 * @return {sap.viz.ui5.types.Axis_indicator}
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getIndicator
 * @function
 */


/**
 * Setter for the aggregated <code>indicator</code>.
 * @param {sap.viz.ui5.types.Axis_indicator} oIndicator
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setIndicator
 * @function
 */
	

/**
 * Destroys the indicator in the aggregation 
 * named <code>indicator</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.19. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#destroyIndicator
 * @function
 */


/**
 * Getter for aggregation <code>scale</code>.<br/>
 * Set the scale of the value axis. This property only works on value type axes.
 * 
 * @return {sap.viz.ui5.types.Axis_scale}
 * @public
 * @name sap.viz.ui5.types.Axis#getScale
 * @function
 */


/**
 * Setter for the aggregated <code>scale</code>.
 * @param {sap.viz.ui5.types.Axis_scale} oScale
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#setScale
 * @function
 */
	

/**
 * Destroys the scale in the aggregation 
 * named <code>scale</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @name sap.viz.ui5.types.Axis#destroyScale
 * @function
 */


/**
 * Getter for aggregation <code>layoutInfo</code>.<br/>
 * Settings for the layout of the category axis. This property only works for category type axes.
 * 
 * @return {sap.viz.ui5.types.Axis_layoutInfo}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getLayoutInfo
 * @function
 */


/**
 * Setter for the aggregated <code>layoutInfo</code>.
 * @param {sap.viz.ui5.types.Axis_layoutInfo} oLayoutInfo
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setLayoutInfo
 * @function
 */
	

/**
 * Destroys the layoutInfo in the aggregation 
 * named <code>layoutInfo</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#destroyLayoutInfo
 * @function
 */


/**
 * Getter for aggregation <code>axisTick</code>.<br/>
 * Settings for the ticks on the axis
 * 
 * @return {sap.viz.ui5.types.Axis_axisTick}
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#getAxisTick
 * @function
 */


/**
 * Setter for the aggregated <code>axisTick</code>.
 * @param {sap.viz.ui5.types.Axis_axisTick} oAxisTick
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#setAxisTick
 * @function
 */
	

/**
 * Destroys the axisTick in the aggregation 
 * named <code>axisTick</code>.
 * @return {sap.viz.ui5.types.Axis} <code>this</code> to allow method chaining
 * @public
 * @deprecated Since version 1.12. 
 * This Property has been deprecated. This interface will be removed from the SAPUI5 delivery in one of the next releases.
 * @name sap.viz.ui5.types.Axis#destroyAxisTick
 * @function
 */


// Start of sap/viz/ui5/types/Axis.js
sap.viz.ui5.types.Axis.prototype.getTitle = function() {
  return this._getOrCreate("title");
}
sap.viz.ui5.types.Axis.prototype.getGridline = function() {
  return this._getOrCreate("gridline");
}
sap.viz.ui5.types.Axis.prototype.getAxisline = function() {
  return this._getOrCreate("axisline");
}
sap.viz.ui5.types.Axis.prototype.getLabel = function() {
  return this._getOrCreate("label");
}
sap.viz.ui5.types.Axis.prototype.getIndicator = function() {
  return this._getOrCreate("indicator");
}
sap.viz.ui5.types.Axis.prototype.getScale = function() {
  return this._getOrCreate("scale");
}
sap.viz.ui5.types.Axis.prototype.getLayoutInfo = function() {
  return this._getOrCreate("layoutInfo");
}
sap.viz.ui5.types.Axis.prototype.getAxisTick = function() {
  return this._getOrCreate("axisTick");
}
