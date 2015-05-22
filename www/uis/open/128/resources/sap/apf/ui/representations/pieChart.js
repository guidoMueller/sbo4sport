/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");jQuery.sap.declare("sap.apf.ui.representations.pieChart");
sap.apf.ui.representations.pieChart=function(a,p){sap.apf.ui.representations.BaseVizChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.PIE_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizChartTypes.PIE};
sap.apf.ui.representations.pieChart.prototype=Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);sap.apf.ui.representations.pieChart.prototype.constructor=sap.apf.ui.representations.pieChart;
