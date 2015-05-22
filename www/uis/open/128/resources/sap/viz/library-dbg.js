/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* -----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ----------------------------------------------------------------------------------- */

/**
 * Initialization Code and shared classes of library sap.viz (1.24.4)
 */
jQuery.sap.declare("sap.viz.library");
jQuery.sap.require("sap.ui.core.Core");
/**
 * Chart controls based on the SAP BI CVOM charting library
 *
 * @namespace
 * @name sap.viz
 * @public
 */


// library dependencies
jQuery.sap.require("sap.ui.core.library");

// delegate further initialization of this library to the Core
sap.ui.getCore().initLibrary({
  name : "sap.viz",
  dependencies : ["sap.ui.core"],
  types: [
    "sap.viz.ui5.types.Area_drawingEffect",
    "sap.viz.ui5.types.Area_marker_shape",
    "sap.viz.ui5.types.Area_mode",
    "sap.viz.ui5.types.Area_orientation",
    "sap.viz.ui5.types.Axis_gridline_type",
    "sap.viz.ui5.types.Axis_label_unitFormatType",
    "sap.viz.ui5.types.Axis_position",
    "sap.viz.ui5.types.Axis_type",
    "sap.viz.ui5.types.Background_direction",
    "sap.viz.ui5.types.Background_drawingEffect",
    "sap.viz.ui5.types.Bar_drawingEffect",
    "sap.viz.ui5.types.Bar_orientation",
    "sap.viz.ui5.types.Bubble_drawingEffect",
    "sap.viz.ui5.types.Bullet_drawingEffect",
    "sap.viz.ui5.types.Bullet_orientation",
    "sap.viz.ui5.types.Combination_drawingEffect",
    "sap.viz.ui5.types.Combination_orientation",
    "sap.viz.ui5.types.Datalabel_orientation",
    "sap.viz.ui5.types.Datalabel_outsidePosition",
    "sap.viz.ui5.types.Datalabel_paintingMode",
    "sap.viz.ui5.types.Datalabel_position",
    "sap.viz.ui5.types.Legend_layout_position",
    "sap.viz.ui5.types.Line_drawingEffect",
    "sap.viz.ui5.types.Line_marker_shape",
    "sap.viz.ui5.types.Line_orientation",
    "sap.viz.ui5.types.Pie_drawingEffect",
    "sap.viz.ui5.types.Pie_valign",
    "sap.viz.ui5.types.Scatter_drawingEffect",
    "sap.viz.ui5.types.StackedVerticalBar_drawingEffect",
    "sap.viz.ui5.types.StackedVerticalBar_mode",
    "sap.viz.ui5.types.StackedVerticalBar_orientation",
    "sap.viz.ui5.types.Title_alignment",
    "sap.viz.ui5.types.Tooltip_drawingEffect",
    "sap.viz.ui5.types.VerticalBar_drawingEffect",
    "sap.viz.ui5.types.VerticalBar_orientation",
    "sap.viz.ui5.types.controller.Interaction_pan_orientation",
    "sap.viz.ui5.types.controller.Interaction_selectability_mode",
    "sap.viz.ui5.types.legend.Common_alignment",
    "sap.viz.ui5.types.legend.Common_drawingEffect",
    "sap.viz.ui5.types.legend.Common_position",
    "sap.viz.ui5.types.legend.Common_type"
  ],
  interfaces: [],
  controls: [
    "sap.viz.ui5.Area",
    "sap.viz.ui5.Area100",
    "sap.viz.ui5.Bar",
    "sap.viz.ui5.Bubble",
    "sap.viz.ui5.Bullet",
    "sap.viz.ui5.Column",
    "sap.viz.ui5.Combination",
    "sap.viz.ui5.Donut",
    "sap.viz.ui5.DualBar",
    "sap.viz.ui5.DualColumn",
    "sap.viz.ui5.DualCombination",
    "sap.viz.ui5.DualLine",
    "sap.viz.ui5.DualStackedColumn",
    "sap.viz.ui5.DualStackedColumn100",
    "sap.viz.ui5.Heatmap",
    "sap.viz.ui5.HorizontalArea",
    "sap.viz.ui5.HorizontalArea100",
    "sap.viz.ui5.Line",
    "sap.viz.ui5.Pie",
    "sap.viz.ui5.Scatter",
    "sap.viz.ui5.StackedColumn",
    "sap.viz.ui5.StackedColumn100",
    "sap.viz.ui5.TimeBubble",
    "sap.viz.ui5.Treemap",
    "sap.viz.ui5.VizContainer",
    "sap.viz.ui5.controls.Popover",
    "sap.viz.ui5.controls.VizFrame",
    "sap.viz.ui5.controls.common.BaseControl",
    "sap.viz.ui5.core.BaseChart"
  ],
  elements: [
    "sap.viz.ui5.controls.common.feeds.AnalysisObject",
    "sap.viz.ui5.controls.common.feeds.FeedItem",
    "sap.viz.ui5.core.BaseStructuredType",
    "sap.viz.ui5.data.Dataset",
    "sap.viz.ui5.data.DimensionDefinition",
    "sap.viz.ui5.data.FlattenedDataset",
    "sap.viz.ui5.data.MeasureDefinition",
    "sap.viz.ui5.types.Area",
    "sap.viz.ui5.types.Area_animation",
    "sap.viz.ui5.types.Area_hoverline",
    "sap.viz.ui5.types.Area_marker",
    "sap.viz.ui5.types.Area_tooltip",
    "sap.viz.ui5.types.Axis",
    "sap.viz.ui5.types.Axis_axisTick",
    "sap.viz.ui5.types.Axis_axisline",
    "sap.viz.ui5.types.Axis_gridline",
    "sap.viz.ui5.types.Axis_indicator",
    "sap.viz.ui5.types.Axis_label",
    "sap.viz.ui5.types.Axis_layoutInfo",
    "sap.viz.ui5.types.Axis_scale",
    "sap.viz.ui5.types.Axis_title",
    "sap.viz.ui5.types.Background",
    "sap.viz.ui5.types.Background_border",
    "sap.viz.ui5.types.Background_border_bottom",
    "sap.viz.ui5.types.Background_border_left",
    "sap.viz.ui5.types.Background_border_right",
    "sap.viz.ui5.types.Background_border_top",
    "sap.viz.ui5.types.Bar",
    "sap.viz.ui5.types.Bar_animation",
    "sap.viz.ui5.types.Bar_tooltip",
    "sap.viz.ui5.types.Bubble",
    "sap.viz.ui5.types.Bubble_animation",
    "sap.viz.ui5.types.Bubble_axisTooltip",
    "sap.viz.ui5.types.Bubble_hoverline",
    "sap.viz.ui5.types.Bullet",
    "sap.viz.ui5.types.Bullet_tooltip",
    "sap.viz.ui5.types.Combination",
    "sap.viz.ui5.types.Combination_animation",
    "sap.viz.ui5.types.Combination_bar",
    "sap.viz.ui5.types.Combination_dataShape",
    "sap.viz.ui5.types.Combination_line",
    "sap.viz.ui5.types.Combination_line_marker",
    "sap.viz.ui5.types.Combination_tooltip",
    "sap.viz.ui5.types.Datalabel",
    "sap.viz.ui5.types.Datatransform",
    "sap.viz.ui5.types.Datatransform_autoBinning",
    "sap.viz.ui5.types.Datatransform_dataSampling",
    "sap.viz.ui5.types.Datatransform_dataSampling_grid",
    "sap.viz.ui5.types.Heatmap",
    "sap.viz.ui5.types.Heatmap_animation",
    "sap.viz.ui5.types.Heatmap_border",
    "sap.viz.ui5.types.Heatmap_tooltip",
    "sap.viz.ui5.types.Legend",
    "sap.viz.ui5.types.Legend_layout",
    "sap.viz.ui5.types.Line",
    "sap.viz.ui5.types.Line_animation",
    "sap.viz.ui5.types.Line_hoverline",
    "sap.viz.ui5.types.Line_marker",
    "sap.viz.ui5.types.Line_tooltip",
    "sap.viz.ui5.types.Pie",
    "sap.viz.ui5.types.Pie_animation",
    "sap.viz.ui5.types.Pie_tooltip",
    "sap.viz.ui5.types.RootContainer",
    "sap.viz.ui5.types.RootContainer_layout",
    "sap.viz.ui5.types.Scatter",
    "sap.viz.ui5.types.Scatter_animation",
    "sap.viz.ui5.types.Scatter_axisTooltip",
    "sap.viz.ui5.types.Scatter_hoverline",
    "sap.viz.ui5.types.StackedVerticalBar",
    "sap.viz.ui5.types.StackedVerticalBar_animation",
    "sap.viz.ui5.types.StackedVerticalBar_tooltip",
    "sap.viz.ui5.types.Title",
    "sap.viz.ui5.types.Title_layout",
    "sap.viz.ui5.types.Tooltip",
    "sap.viz.ui5.types.Tooltip_background",
    "sap.viz.ui5.types.Tooltip_bodyDimensionLabel",
    "sap.viz.ui5.types.Tooltip_bodyDimensionValue",
    "sap.viz.ui5.types.Tooltip_bodyMeasureLabel",
    "sap.viz.ui5.types.Tooltip_bodyMeasureValue",
    "sap.viz.ui5.types.Tooltip_closeButton",
    "sap.viz.ui5.types.Tooltip_footerLabel",
    "sap.viz.ui5.types.Tooltip_separationLine",
    "sap.viz.ui5.types.Treemap",
    "sap.viz.ui5.types.Treemap_animation",
    "sap.viz.ui5.types.Treemap_border",
    "sap.viz.ui5.types.Treemap_tooltip",
    "sap.viz.ui5.types.VerticalBar",
    "sap.viz.ui5.types.VerticalBar_animation",
    "sap.viz.ui5.types.VerticalBar_tooltip",
    "sap.viz.ui5.types.XYContainer",
    "sap.viz.ui5.types.controller.Interaction",
    "sap.viz.ui5.types.controller.Interaction_pan",
    "sap.viz.ui5.types.controller.Interaction_selectability",
    "sap.viz.ui5.types.layout.Dock",
    "sap.viz.ui5.types.layout.Stack",
    "sap.viz.ui5.types.legend.Common",
    "sap.viz.ui5.types.legend.Common_title"
  ],
  version: "1.24.4"});

/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Area_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Area_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Area_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Area_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Area_marker_shape.
jQuery.sap.declare("sap.viz.ui5.types.Area_marker_shape");


/**
 * @class List (Enum) type ui5/types/Area_marker_shape
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Area_marker_shape = {

	/**
	 * Value circle
	 * @public
	 */
	circle : "circle",

	/**
	 * Value diamond
	 * @public
	 */
	diamond : "diamond",

	/**
	 * Value triangleUp
	 * @public
	 */
	triangleUp : "triangleUp",

	/**
	 * Value triangleDown
	 * @public
	 */
	triangleDown : "triangleDown",

	/**
	 * Value triangleLeft
	 * @public
	 */
	triangleLeft : "triangleLeft",

	/**
	 * Value triangleRight
	 * @public
	 */
	triangleRight : "triangleRight",

	/**
	 * Value cross
	 * @public
	 */
	cross : "cross",

	/**
	 * Value intersection
	 * @public
	 */
	intersection : "intersection"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Area_mode.
jQuery.sap.declare("sap.viz.ui5.types.Area_mode");


/**
 * @class List (Enum) type ui5/types/Area_mode
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Area_mode = {

	/**
	 * Value comparison
	 * @public
	 */
	comparison : "comparison",

	/**
	 * Value percentage
	 * @public
	 */
	percentage : "percentage"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Area_orientation.
jQuery.sap.declare("sap.viz.ui5.types.Area_orientation");


/**
 * @class List (Enum) type ui5/types/Area_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Area_orientation = {

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical",

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Axis_gridline_type.
jQuery.sap.declare("sap.viz.ui5.types.Axis_gridline_type");


/**
 * @class List (Enum) type ui5/types/Axis_gridline_type
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Axis_gridline_type = {

	/**
	 * Value line
	 * @public
	 */
	line : "line",

	/**
	 * Value dotted
	 * @public
	 */
	dotted : "dotted",

	/**
	 * Value incised
	 * @public
	 */
	incised : "incised"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Axis_label_unitFormatType.
jQuery.sap.declare("sap.viz.ui5.types.Axis_label_unitFormatType");


/**
 * @class List (Enum) type ui5/types/Axis_label_unitFormatType
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Axis_label_unitFormatType = {

	/**
	 * Value MetricUnits
	 * @public
	 */
	MetricUnits : "MetricUnits",

	/**
	 * Value FinancialUnits
	 * @public
	 */
	FinancialUnits : "FinancialUnits"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Axis_position.
jQuery.sap.declare("sap.viz.ui5.types.Axis_position");


/**
 * @class List (Enum) type ui5/types/Axis_position
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Axis_position = {

	/**
	 * Value left
	 * @public
	 */
	left : "left",

	/**
	 * Value right
	 * @public
	 */
	right : "right",

	/**
	 * Value top
	 * @public
	 */
	top : "top",

	/**
	 * Value bottom
	 * @public
	 */
	bottom : "bottom"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Axis_type.
jQuery.sap.declare("sap.viz.ui5.types.Axis_type");


/**
 * @class List (Enum) type ui5/types/Axis_type
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Axis_type = {

	/**
	 * Value value
	 * @public
	 */
	value : "value",

	/**
	 * Value category
	 * @public
	 */
	category : "category",

	/**
	 * Value timeValue
	 * @public
	 */
	timeValue : "timeValue"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Background_direction.
jQuery.sap.declare("sap.viz.ui5.types.Background_direction");


/**
 * @class List (Enum) type ui5/types/Background_direction
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Background_direction = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Background_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Background_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Background_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Background_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Bar_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Bar_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Bar_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Bar_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Bar_orientation.
jQuery.sap.declare("sap.viz.ui5.types.Bar_orientation");


/**
 * @class List (Enum) type ui5/types/Bar_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Bar_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Bubble_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Bubble_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Bubble_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Bubble_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Bullet_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Bullet_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Bullet_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Bullet_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Bullet_orientation.
jQuery.sap.declare("sap.viz.ui5.types.Bullet_orientation");


/**
 * @class List (Enum) type ui5/types/Bullet_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Bullet_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Combination_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Combination_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Combination_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Combination_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Combination_orientation.
jQuery.sap.declare("sap.viz.ui5.types.Combination_orientation");


/**
 * @class List (Enum) type ui5/types/Combination_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Combination_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Datalabel_orientation.
jQuery.sap.declare("sap.viz.ui5.types.Datalabel_orientation");


/**
 * @class List (Enum) type ui5/types/Datalabel_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Datalabel_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Datalabel_outsidePosition.
jQuery.sap.declare("sap.viz.ui5.types.Datalabel_outsidePosition");


/**
 * @class List (Enum) type ui5/types/Datalabel_outsidePosition
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Datalabel_outsidePosition = {

	/**
	 * Value up
	 * @public
	 */
	up : "up",

	/**
	 * Value down
	 * @public
	 */
	down : "down",

	/**
	 * Value left
	 * @public
	 */
	left : "left",

	/**
	 * Value right
	 * @public
	 */
	right : "right"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Datalabel_paintingMode.
jQuery.sap.declare("sap.viz.ui5.types.Datalabel_paintingMode");


/**
 * @class List (Enum) type ui5/types/Datalabel_paintingMode
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Datalabel_paintingMode = {

	/**
	 * Value rectCoordinate
	 * @public
	 */
	rectCoordinate : "rectCoordinate",

	/**
	 * Value polarCoordinate
	 * @public
	 */
	polarCoordinate : "polarCoordinate"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Datalabel_position.
jQuery.sap.declare("sap.viz.ui5.types.Datalabel_position");


/**
 * @class List (Enum) type ui5/types/Datalabel_position
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Datalabel_position = {

	/**
	 * Value inside
	 * @public
	 */
	inside : "inside",

	/**
	 * Value outside
	 * @public
	 */
	outside : "outside"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Legend_layout_position.
jQuery.sap.declare("sap.viz.ui5.types.Legend_layout_position");


/**
 * @class List (Enum) type ui5/types/Legend_layout_position
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Legend_layout_position = {

	/**
	 * Value top
	 * @public
	 */
	top : "top",

	/**
	 * Value bottom
	 * @public
	 */
	bottom : "bottom",

	/**
	 * Value right
	 * @public
	 */
	right : "right",

	/**
	 * Value left
	 * @public
	 */
	left : "left"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Line_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Line_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Line_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Line_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Line_marker_shape.
jQuery.sap.declare("sap.viz.ui5.types.Line_marker_shape");


/**
 * @class List (Enum) type ui5/types/Line_marker_shape
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Line_marker_shape = {

	/**
	 * Value circle
	 * @public
	 */
	circle : "circle",

	/**
	 * Value diamond
	 * @public
	 */
	diamond : "diamond",

	/**
	 * Value triangleUp
	 * @public
	 */
	triangleUp : "triangleUp",

	/**
	 * Value triangleDown
	 * @public
	 */
	triangleDown : "triangleDown",

	/**
	 * Value triangleLeft
	 * @public
	 */
	triangleLeft : "triangleLeft",

	/**
	 * Value triangleRight
	 * @public
	 */
	triangleRight : "triangleRight",

	/**
	 * Value cross
	 * @public
	 */
	cross : "cross",

	/**
	 * Value intersection
	 * @public
	 */
	intersection : "intersection"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Line_orientation.
jQuery.sap.declare("sap.viz.ui5.types.Line_orientation");


/**
 * @class List (Enum) type ui5/types/Line_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Line_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Pie_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Pie_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Pie_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Pie_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Pie_valign.
jQuery.sap.declare("sap.viz.ui5.types.Pie_valign");


/**
 * @class List (Enum) type ui5/types/Pie_valign
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Pie_valign = {

	/**
	 * Value top
	 * @public
	 */
	top : "top",

	/**
	 * Value center
	 * @public
	 */
	center : "center"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Scatter_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Scatter_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Scatter_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Scatter_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.StackedVerticalBar_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.StackedVerticalBar_drawingEffect");


/**
 * @class List (Enum) type ui5/types/StackedVerticalBar_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.StackedVerticalBar_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.StackedVerticalBar_mode.
jQuery.sap.declare("sap.viz.ui5.types.StackedVerticalBar_mode");


/**
 * @class List (Enum) type ui5/types/StackedVerticalBar_mode
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.StackedVerticalBar_mode = {

	/**
	 * Value comparison
	 * @public
	 */
	comparison : "comparison",

	/**
	 * Value percentage
	 * @public
	 */
	percentage : "percentage"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.StackedVerticalBar_orientation.
jQuery.sap.declare("sap.viz.ui5.types.StackedVerticalBar_orientation");


/**
 * @class List (Enum) type ui5/types/StackedVerticalBar_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.StackedVerticalBar_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Title_alignment.
jQuery.sap.declare("sap.viz.ui5.types.Title_alignment");


/**
 * @class List (Enum) type ui5/types/Title_alignment
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Title_alignment = {

	/**
	 * Value left
	 * @public
	 */
	left : "left",

	/**
	 * Value center
	 * @public
	 */
	center : "center",

	/**
	 * Value right
	 * @public
	 */
	right : "right"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.Tooltip_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.Tooltip_drawingEffect");


/**
 * @class List (Enum) type ui5/types/Tooltip_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.Tooltip_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.VerticalBar_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.VerticalBar_drawingEffect");


/**
 * @class List (Enum) type ui5/types/VerticalBar_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.VerticalBar_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.VerticalBar_orientation.
jQuery.sap.declare("sap.viz.ui5.types.VerticalBar_orientation");


/**
 * @class List (Enum) type ui5/types/VerticalBar_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.VerticalBar_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.controller.Interaction_pan_orientation.
jQuery.sap.declare("sap.viz.ui5.types.controller.Interaction_pan_orientation");


/**
 * @class List (Enum) type ui5/types/controller/Interaction_pan_orientation
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.controller.Interaction_pan_orientation = {

	/**
	 * Value horizontal
	 * @public
	 */
	horizontal : "horizontal",

	/**
	 * Value vertical
	 * @public
	 */
	vertical : "vertical",

	/**
	 * Value both
	 * @public
	 */
	both : "both"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.controller.Interaction_selectability_mode.
jQuery.sap.declare("sap.viz.ui5.types.controller.Interaction_selectability_mode");


/**
 * @class List (Enum) type ui5/types/controller/Interaction_selectability_mode
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.controller.Interaction_selectability_mode = {

	/**
	 * Value exclusive
	 * @public
	 */
	exclusive : "exclusive",

	/**
	 * Value inclusive
	 * @public
	 */
	inclusive : "inclusive",

	/**
	 * Value single
	 * @public
	 */
	single : "single",

	/**
	 * Value multiple
	 * @public
	 */
	multiple : "multiple",

	/**
	 * Value none
	 * @public
	 */
	none : "none"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.legend.Common_alignment.
jQuery.sap.declare("sap.viz.ui5.types.legend.Common_alignment");


/**
 * @class List (Enum) type ui5/types/legend/Common_alignment
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.legend.Common_alignment = {

	/**
	 * Value start
	 * @public
	 */
	start : "start",

	/**
	 * Value middle
	 * @public
	 */
	middle : "middle",

	/**
	 * Value end
	 * @public
	 */
	end : "end"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.legend.Common_drawingEffect.
jQuery.sap.declare("sap.viz.ui5.types.legend.Common_drawingEffect");


/**
 * @class List (Enum) type ui5/types/legend/Common_drawingEffect
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.legend.Common_drawingEffect = {

	/**
	 * Value normal
	 * @public
	 */
	normal : "normal",

	/**
	 * Value glossy
	 * @public
	 */
	glossy : "glossy"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.legend.Common_position.
jQuery.sap.declare("sap.viz.ui5.types.legend.Common_position");


/**
 * @class List (Enum) type ui5/types/legend/Common_position
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.legend.Common_position = {

	/**
	 * Value top
	 * @public
	 */
	top : "top",

	/**
	 * Value bottom
	 * @public
	 */
	bottom : "bottom",

	/**
	 * Value right
	 * @public
	 */
	right : "right",

	/**
	 * Value left
	 * @public
	 */
	left : "left"

};
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

/* ----------------------------------------------------------------------------------
 * Hint: This is a derived (generated) file. Changes should be done in the underlying 
 * source files only (*.type, *.js) or they will be lost after the next generation.
 * ---------------------------------------------------------------------------------- */

// Provides enumeration sap.viz.ui5.types.legend.Common_type.
jQuery.sap.declare("sap.viz.ui5.types.legend.Common_type");


/**
 * @class List (Enum) type ui5/types/legend/Common_type
 *
 * @version 1.24.4
 * @static
 * @public
 * @since 1.7.2
 * @experimental Since version 1.7.2. 
 * Charting API is not finished yet and might change completely
 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
 */
sap.viz.ui5.types.legend.Common_type = {

	/**
	 * Value ColorLegend
	 * @public
	 */
	ColorLegend : "ColorLegend",

	/**
	 * Value BubbleColorLegend
	 * @public
	 */
	BubbleColorLegend : "BubbleColorLegend",

	/**
	 * Value SizeLegend
	 * @public
	 */
	SizeLegend : "SizeLegend",

	/**
	 * Value MeasureBasedColoringLegend
	 * @public
	 */
	MeasureBasedColoringLegend : "MeasureBasedColoringLegend"

};

// -----------------------------------------------------------------------------
// Begin of Library Initialization coding, copied from shared.js
// -----------------------------------------------------------------------------

// check whether browser supports svg
sap.viz.__svg_support = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;

if (sap.viz.__svg_support) {
    //enforce early loading of D3 and Charting lib to load sap.viz.core early
    jQuery.sap.require("sap.ui.thirdparty.d3");
    //	jQuery.sap.require("sap.viz.libs.d3");
    //	jQuery.sap.require("sap.viz.ui5.controls.libs.common.libs.jquery-ui.jquery-ui");
    jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-core");
    jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-widget");
    jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-mouse");
    jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-draggable");
    jQuery.sap.require("sap.ui.thirdparty.jqueryui.jquery-ui-droppable");
    jQuery.sap.require("sap.viz.ui5.controls.libs.common.libs.rgbcolor.rgbcolor_static");
    jQuery.sap.require("sap.viz.libs.canvg");
    jQuery.sap.require("sap.viz.libs.rgbcolor");
    jQuery.sap.require("sap.viz.libs.sap-viz");

    // include app/css
    jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("sap.viz.ui5.controls.css", "/controls.css"));
    // include control/css
    jQuery.sap.includeStyleSheet(jQuery.sap.getModulePath("sap.viz.ui5.controls.libs.css", "/sap.viz.controls.css"));
}( function() {
        function initLegacySupport() {
            var LEGACY_NAMES = {
                "sap.viz.core.BaseChart" : "sap.viz.ui5.core.BaseChart",
                "sap.viz.core.BaseStructuredType" : "sap.viz.ui5.core.BaseStructuredType",
                "sap.viz.core.Dataset" : "sap.viz.ui5.data.Dataset",
                "sap.viz.core.DimensionDefinition" : "sap.viz.ui5.data.DimensionDefinition",
                "sap.viz.core.FlattenedDataset" : "sap.viz.ui5.data.FlattenedDataset",
                "sap.viz.core.MeasureDefinition" : "sap.viz.ui5.data.MeasureDefinition",
                "sap.viz.Bar" : "sap.viz.ui5.Bar",
                "sap.viz.Bubble" : "sap.viz.ui5.Bubble",
                "sap.viz.VerticalBar" : "sap.viz.ui5.Column",
                "sap.viz.Combination" : "sap.viz.ui5.Combination",
                "sap.viz.Donut" : "sap.viz.ui5.Donut",
                "sap.viz.Line" : "sap.viz.ui5.Line",
                "sap.viz.Pie" : "sap.viz.ui5.Pie",
                "sap.viz.Scatter" : "sap.viz.ui5.Scatter",
                "sap.viz.StackedVerticalBar" : "sap.viz.ui5.StackedColumn",
                "sap.viz.PercentageStackedVerticalBar" : "sap.viz.ui5.StackedColumn100"
            };

            // create stubs for the most important legacy class names
            jQuery.each(LEGACY_NAMES, function(sOld, sNew) {
                // delegate constructor
                jQuery.sap.setObject(sOld, function() {
                    jQuery.sap.log.warning("[Deprecated] chart '" + sOld + "' has been deprecated for several releases and will be removed soon. Use '" + sNew + "' instead.");
                    var oNewClass = jQuery.sap.getObject(sNew);
                    var oInstance = jQuery.sap.newObject(oNewClass.prototype);
                    return oNewClass.apply(oInstance, arguments) || oInstance;
                });
                // delegate extend
                jQuery.sap.setObject(sOld + ".extend", function() {
                    jQuery.sap.log.warning("[Deprecated] chart '" + sOld + "' has been deprecated for several releases and will be removed soon. Use '" + sNew + "' instead.");
                    return jQuery.sap.getObject(sNew).extend.apply(this, arguments);
                });

                // delegate getMetadata
                jQuery.sap.setObject(sOld + ".getMetadata", function() {
                    jQuery.sap.log.warning("[Deprecated] chart '" + sOld + "' has been deprecated for several releases and will be removed soon. Use '" + sNew + "' instead.");
                    return jQuery.sap.getObject(sNew).getMetadata.apply(this, arguments);
                });
            });

            // create stubs for the enum types (static classes)
            var oLibrary = sap.ui.getCore().getLoadedLibraries()["sap.viz"];
            if (oLibrary && oLibrary.types) {
                jQuery.each(oLibrary.types, function(idx, sName) {
                    if (sName.indexOf("sap.viz.ui5.types.") === 0) {
                        jQuery.sap.setObject("sap.viz.types." + sName.slice("sap.viz.ui5.types.".length), jQuery.sap.getObject(sName));
                    }
                });
            }
        }

        initLegacySupport();

        var bChartResourceRequested = false;
        var vizContainerInfo = {
            // unloaded, loading, loaded
            'status' : 'unloaded'
        };

        /*
         * For Viz Chart, it only needs to load chart resources.
         */
        sap.viz._initializeVIZ = function() {
            if (!sap.viz.__svg_support) {
                return;
            }
            if (bChartResourceRequested) {
                return;
            }
            // Load chart resources only
            sap.viz._initializeENV(true, false);
            bChartResourceRequested = true;
        };

        /*
         * For VizContainer, both chart and vizContainer resource should be loaded.
         */
        sap.viz._initializeVIZContainer = function(callback) {
            if (!sap.viz.__svg_support) {
                callback(false);
            }
            if (vizContainerInfo.status === 'unloaded') {
                vizContainerInfo.callbacks = [callback];
                vizContainerInfo.status = 'loading';
                // Load
                sap.viz._initializeENV(!bChartResourceRequested, true, function() {
                    vizContainerInfo.status = 'loaded';
                    if (vizContainerInfo && vizContainerInfo.callbacks) {
                        for (var i = 0; i < vizContainerInfo.callbacks.length; i++) {
                            vizContainerInfo.callbacks[i](true);
                        }
                        delete vizContainerInfo.callbacks;
                    }
                });
                // Update status
                bChartResourceRequested = true;
            } else if (vizContainerInfo.status === 'loading') {
                vizContainerInfo.callbacks.push(callback);
            } else if (vizContainerInfo.status === 'loaded') {
                callback(true);
            }
        };

        /*
         * Initialize the environment settings.
         */
        sap.viz._initializeENV = function(bLoadChartResouce, bloadContainerResource, callback) {
            // Initialize the path
            var sPaths = sap.viz.api.env.Resource.path("sap.viz.api.env.Language.loadPaths") || [];
            if (bLoadChartResouce) {
                // Override the build in path for chart
                sPaths = [];
                sPaths.push(jQuery.sap.getModulePath("sap.viz.resources.langs.charts", "/"));
                sPaths.push(jQuery.sap.getModulePath("sap.viz.resources.langs.sdk", "/"));
            }
            if (bloadContainerResource) {
                sPaths.push(jQuery.sap.getModulePath("sap.viz.ui5.controls.libs.locale", "/"));
            }
            // Load
            if (sPaths.length > 0) {
                if (bloadContainerResource) {
	            	// Format
	            	sap.viz.api.env.Format.useDefaultFormatter(true);
                }
                // Resource path
                sap.viz.api.env.Resource.path("sap.viz.api.env.Language.loadPaths", sPaths);
                jQuery.sap.log.info("VIZ: load path for lang manager set to " + sPaths);
                // Default assets root
                if (bloadContainerResource) {
                    var GlobalConfig = sap.viz.controls.common.config.GlobalConfig;
                    GlobalConfig.defaultAssetsRoot(jQuery.sap.getModulePath('sap.viz.ui5.controls.libs', '/'));
                }
                // Theme
                if (bloadContainerResource) {
                    sap.viz.api.env.Resource.path("sap.viz.api.env.Template.loadPaths", [jQuery.sap.getModulePath("sap.viz.resources.templates", "/")]);
                    sap.ui.getCore().attachThemeChanged(function(evt) {
                        sap.viz._applyTheme();
                    });
                    sap.viz._applyTheme();
                }
                // Locale
                sap.ui.getCore().attachLocalizationChanged(function(evt) {
                    sap.viz._applyLocale();
                });
                sap.viz._applyLocale(callback);
            }
        };

        sap.viz._applyTheme = function() {
            // Get theme from ui5
            var theme = sap.ui.getCore().getConfiguration().getTheme();
            // Set template to viz
            if (theme === 'sap_bluecrystal') {
                sap.viz._changeTemplate('bluecrystal');
            } else if (theme === 'sap_hcb') {
                sap.viz._changeTemplate('highcontrast');
            } else {
                sap.viz._changeTemplate('default');
            }
            // Reset color mapping
            jQuery.sap.require("sap.ui.core.theming.Parameters");
            var mapping = {};
            var write = function(key) {
                var color = sap.ui.core.theming.Parameters.get(key);
                if (color) {
                    mapping[key] = color;
                }
            };
            // Qualitative color
            write('sapUiChartPaletteQualitativeHue1');
            write('sapUiChartPaletteQualitativeHue2');
            write('sapUiChartPaletteQualitativeHue3');
            write('sapUiChartPaletteQualitativeHue4');
            write('sapUiChartPaletteQualitativeHue5');
            write('sapUiChartPaletteQualitativeHue6');
            write('sapUiChartPaletteQualitativeHue7');
            write('sapUiChartPaletteQualitativeHue8');
            write('sapUiChartPaletteQualitativeHue9');
            write('sapUiChartPaletteQualitativeHue10');
            write('sapUiChartPaletteQualitativeHue11');
            // Semantic color
            write('sapUiChartPaletteSemanticBadLight3');
            write('sapUiChartPaletteSemanticBadLight2');
            write('sapUiChartPaletteSemanticBadLight1');
            write('sapUiChartPaletteSemanticBad');
            write('sapUiChartPaletteSemanticBadDark1');
            write('sapUiChartPaletteSemanticBadDark2');
            write('sapUiChartPaletteSemanticCriticalLight3');
            write('sapUiChartPaletteSemanticCriticalLight2');
            write('sapUiChartPaletteSemanticCriticalLight1');
            write('sapUiChartPaletteSemanticCritical');
            write('sapUiChartPaletteSemanticCriticalDark1');
            write('sapUiChartPaletteSemanticCriticalDark2');
            write('sapUiChartPaletteSemanticGoodLight3');
            write('sapUiChartPaletteSemanticGoodLight2');
            write('sapUiChartPaletteSemanticGoodLight1');
            write('sapUiChartPaletteSemanticGood');
            write('sapUiChartPaletteSemanticGoodDark1');
            write('sapUiChartPaletteSemanticGoodDark2');
            write('sapUiChartPaletteSemanticNeutralLight3');
            write('sapUiChartPaletteSemanticNeutralLight2');
            write('sapUiChartPaletteSemanticNeutralLight1');
            write('sapUiChartPaletteSemanticNeutral');
            write('sapUiChartPaletteSemanticNeutralDark1');
            write('sapUiChartPaletteSemanticNeutralDark2');
            // Sequential color
            write('sapUiChartPaletteSequentialHue1Light3');
            write('sapUiChartPaletteSequentialHue1Light2');
            write('sapUiChartPaletteSequentialHue1Light1');
            write('sapUiChartPaletteSequentialHue1');
            write('sapUiChartPaletteSequentialHue1Dark1');
            write('sapUiChartPaletteSequentialHue1Dark2');
            write('sapUiChartPaletteSequentialHue2Light3');
            write('sapUiChartPaletteSequentialHue2Light2');
            write('sapUiChartPaletteSequentialHue2Light1');
            write('sapUiChartPaletteSequentialHue2');
            write('sapUiChartPaletteSequentialHue2Dark1');
            write('sapUiChartPaletteSequentialHue2Dark2');
            write('sapUiChartPaletteSequentialHue3Light3');
            write('sapUiChartPaletteSequentialHue3Light2');
            write('sapUiChartPaletteSequentialHue3Light1');
            write('sapUiChartPaletteSequentialHue3');
            write('sapUiChartPaletteSequentialHue3Dark1');
            write('sapUiChartPaletteSequentialHue3Dark2');
            write('sapUiChartPaletteSequentialNeutralLight3');
            write('sapUiChartPaletteSequentialNeutralLight2');
            write('sapUiChartPaletteSequentialNeutralLight1');
            write('sapUiChartPaletteSequentialNeutral');
            write('sapUiChartPaletteSequentialNeutralDark1');
            write('sapUiChartPaletteSequentialNeutralDark2');
            sap.viz.api.env.globalSettings({
            	'colorMapping': mapping
            })
        };

        sap.viz._changeTemplate = function(template) {
            if (sap.viz.api.env.Template.get() !== template) {
                sap.viz.api.env.Template.set(template);
            }
        };

        sap.viz._applyLocale = function(callback) {
            // Get locale from ui5
            var oLocale = sap.ui.getCore().getConfiguration().getLocale();
            var sVIZLanguageId = oLocale.getLanguage();
            if (sVIZLanguageId === 'zh') {
                sVIZLanguageId = oLocale.getLanguage() + (oLocale.getRegion() ? "_" + oLocale.getRegion() : "");
            }
            // Set locale to viz
            sap.viz.api.env.Locale.set(sVIZLanguageId, function() {
                if (callback) {
                    callback();
                }
            });
            jQuery.sap.log.info("VIZ: env initialized (locale=" + sap.ui.getCore().getConfiguration().getLanguage() + ")");
        };
    }());
