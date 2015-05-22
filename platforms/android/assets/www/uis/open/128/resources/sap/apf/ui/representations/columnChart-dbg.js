/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.columnChart");
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");


/**
 * @class columnChart constructor.
 * @param oParametersdefines parameters required for chart such as Dimension/Measures,tooltip, axis information.
 * @returns chart object
 */
sap.apf.ui.representations.columnChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.COLUMN_CHART;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizChartTypes.COLUMN;
};

sap.apf.ui.representations.columnChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);

//Set the "constructor" property to refer to columnChart
sap.apf.ui.representations.columnChart.prototype.constructor = sap.apf.ui.representations.columnChart;

/**
 * @method getMainContent
 * @param oStepTitle title of the main chart
 * @param width width of the main chart
 * @param height height of the main chart
 * @description draws Main chart into the Chart area
 */
sap.apf.ui.representations.columnChart.prototype.getMainContent = function(oStepTitle, width, height) {
	this.chart = sap.apf.ui.representations.BaseVizChartRepresentation.prototype.getMainContent.call(this, oStepTitle, width, height);
	if (this.aDataResponse !== undefined && this.aDataResponse.length > 1200) {
		this.chartParam.css = '.v-datapoint {shape-rendering: auto}';
	}
	return this.chart;
};