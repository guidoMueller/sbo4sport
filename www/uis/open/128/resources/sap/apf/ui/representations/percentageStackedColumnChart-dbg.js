/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
jQuery.sap.declare("sap.apf.ui.representations.percentageStackedColumnChart");
/**
 * @class stackColumn constructor.
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
 * @returns chart object 
 */
sap.apf.ui.representations.percentageStackedColumnChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.PERCENTAGE_STACKED_COLUMN_CHART;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizChartTypes.PERCENTAGE_STACKED_COLUMN;
};

sap.apf.ui.representations.percentageStackedColumnChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);

//Set the "constructor" property to refer to percentageStackedColumnChart
sap.apf.ui.representations.percentageStackedColumnChart.prototype.constructor = sap.apf.ui.representations.percentageStackedColumnChart;

/**
 * @method setFormatString
 * @param  measure
 * @description sets the format string for axis label and tooltip
 */
sap.apf.ui.representations.percentageStackedColumnChart.prototype.setFormatString = function(measure) {
	this.chart.getXAxis().getLabel().setFormatString("");
	this.chart.getYAxis().getLabel().setFormatString("");
	this.chart.getToolTip().setFormatString([ [ "" ] ]);
};
