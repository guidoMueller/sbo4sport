/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.lineChart");
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");

/** 
 * @class lineChart constructor.
 * @param oParameters defines parameters required for chart such as Dimension/Measures, tooltip, axis information.
 * @returns chart object 
 */
sap.apf.ui.representations.lineChart = function(oApi, oParameters) {
	sap.apf.ui.representations.BaseVizChartRepresentation.apply(this, [ oApi, oParameters ]);
	this.type = sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART;
	this.chartType = sap.apf.ui.utils.CONSTANTS.vizChartTypes.LINE;
};

sap.apf.ui.representations.lineChart.prototype = Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);

//Set the "constructor" property to refer to lineChart
sap.apf.ui.representations.lineChart.prototype.constructor = sap.apf.ui.representations.lineChart;
