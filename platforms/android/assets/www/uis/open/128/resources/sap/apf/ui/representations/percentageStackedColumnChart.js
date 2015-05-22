/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");jQuery.sap.declare("sap.apf.ui.representations.percentageStackedColumnChart");
sap.apf.ui.representations.percentageStackedColumnChart=function(a,p){sap.apf.ui.representations.BaseVizChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.PERCENTAGE_STACKED_COLUMN_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizChartTypes.PERCENTAGE_STACKED_COLUMN};
sap.apf.ui.representations.percentageStackedColumnChart.prototype=Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);sap.apf.ui.representations.percentageStackedColumnChart.prototype.constructor=sap.apf.ui.representations.percentageStackedColumnChart;
sap.apf.ui.representations.percentageStackedColumnChart.prototype.setFormatString=function(m){this.chart.getXAxis().getLabel().setFormatString("");this.chart.getYAxis().getLabel().setFormatString("");this.chart.getToolTip().setFormatString([[""]])};
