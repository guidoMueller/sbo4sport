/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
jQuery.sap.declare("sap.apf.ui.representations.scatterPlotChart");
/** 
 * @class scatterPlotChart constructor.
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
 * @returns chart object 
 */
sap.apf.ui.representations.scatterPlotChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.SCATTERPLOT_CHART;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizChartTypes.SCATTERPLOT;
	this.axisType = "group";
};
sap.apf.ui.representations.scatterPlotChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);
//Set the "constructor" property to refer to scatterPlotChart
sap.apf.ui.representations.scatterPlotChart.prototype.constructor = sap.apf.ui.representations.scatterPlotChart;
/**
 *@method getThumbnailContent 
 *@description draws Thumbnail for the current chart type and returns to the calling object
 *@returns thumbnail object for the chart type
 */
sap.apf.ui.representations.scatterPlotChart.prototype.getThumbnailContent = function() {
	var self = this;
	self.thumbnailChartLayout = sap.apf.ui.representations.BaseVizChartRepresentation.prototype.getThumbnailContent.call(self);
	self.thumbnailChartParam.plotArea.markerSize = 4;
	return self.thumbnailChartLayout;
};
//Set the "constructor" property to refer to scatterPlotChart
sap.apf.ui.representations.scatterPlotChart.prototype.constructor = sap.apf.ui.representations.scatterPlotChart;
/**
 * @method setFormatString
 * @param measure
 * @description sets the format string for axis label and tooltip
 */
sap.apf.ui.representations.scatterPlotChart.prototype.setFormatString = function(measures) {
	sap.apf.ui.representations.BaseVizChartRepresentation.prototype.setFormatString.call(this, measures);
	var axisFormatString = this.formatter.getFormatString(measures[1]);
	if (axisFormatString !== undefined && axisFormatString.label !== undefined) {
		this.chart.getXAxis().getLabel().setFormatString(axisFormatString.label);
	}
};