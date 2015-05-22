/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 * 
 * (c) Copyright 2009-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.ui.core.Renderer");jQuery.sap.require("sap.m.DatePickerRenderer");jQuery.sap.declare("sap.m.DateRangeSelectionRenderer");sap.m.DateRangeSelectionRenderer=sap.ui.core.Renderer.extend(sap.m.DatePickerRenderer);
sap.m.DateRangeSelectionRenderer.writeInnerValue=function(r,c){r.writeAttributeEscaped("value",c._formatValue(c.getDateValue(),c.getSecondDateValue()))};
