/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
jQuery.sap.declare("sap.apf.ui.representations.stackedColumnChart");
/**
 * @class stackColumn constructor.
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
 * @returns chart object 
 */
sap.apf.ui.representations.stackedColumnChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.STACKED_COLUMN_CHART;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizChartTypes.STACKED_COLUMN;
};



sap.apf.ui.representations.stackedColumnChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);

//Set the "constructor" property to refer to stackedColumnChart
sap.apf.ui.representations.stackedColumnChart.prototype.constructor = sap.apf.ui.representations.stackedColumnChart;
