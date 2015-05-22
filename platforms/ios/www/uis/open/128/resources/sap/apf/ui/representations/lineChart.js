/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.lineChart");jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
sap.apf.ui.representations.lineChart=function(a,p){sap.apf.ui.representations.BaseVizChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.LINE_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizChartTypes.LINE};
sap.apf.ui.representations.lineChart.prototype=Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);sap.apf.ui.representations.lineChart.prototype.constructor=sap.apf.ui.representations.lineChart;
