/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.bubbleChart");
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
/**
 * @class columnChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
sap.apf.ui.representations.bubbleChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.BUBBLE_CHART;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizChartTypes.BUBBLE;
	this.axisType = "group";
};
sap.apf.ui.representations.bubbleChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);
//Set the "constructor" property to refer to bubbleChart
sap.apf.ui.representations.bubbleChart.prototype.constructor = sap.apf.ui.representations.bubbleChart;
/**
 * @method setFormatString
 * @param measure
 * @description sets the format string for axis label and tooltip
 */
sap.apf.ui.representations.bubbleChart.prototype.setFormatString = function(measures) {
	sap.apf.ui.representations.BaseVizChartRepresentation.prototype.setFormatString.call(this, measures);
	var axisFormatString = this.formatter.getFormatString(measures[1]);
	var legendFormatString = this.formatter.getFormatString(measures[2]);
	if (axisFormatString !== undefined && axisFormatString.label !== undefined) {
		this.chart.getXAxis().getLabel().setFormatString(axisFormatString.label);
	}
	if (legendFormatString !== undefined && legendFormatString.tooltip !== undefined) {
		this.chart.getSizeLegend().setFormatString(legendFormatString.tooltip);
	}
};