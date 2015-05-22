/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.columnChart");jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
sap.apf.ui.representations.columnChart=function(a,p){sap.apf.ui.representations.BaseVizChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.COLUMN_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizChartTypes.COLUMN};
sap.apf.ui.representations.columnChart.prototype=Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);sap.apf.ui.representations.columnChart.prototype.constructor=sap.apf.ui.representations.columnChart;
sap.apf.ui.representations.columnChart.prototype.getMainContent=function(s,w,h){this.chart=sap.apf.ui.representations.BaseVizChartRepresentation.prototype.getMainContent.call(this,s,w,h);if(this.aDataResponse!==undefined&&this.aDataResponse.length>1200){this.chartParam.css='.v-datapoint {shape-rendering: auto}'}return this.chart};
