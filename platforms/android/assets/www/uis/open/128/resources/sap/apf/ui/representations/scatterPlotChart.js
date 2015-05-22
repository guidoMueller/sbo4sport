/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");jQuery.sap.declare("sap.apf.ui.representations.scatterPlotChart");
sap.apf.ui.representations.scatterPlotChart=function(a,p){sap.apf.ui.representations.BaseVizChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.SCATTERPLOT_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizChartTypes.SCATTERPLOT;this.axisType="group"};
sap.apf.ui.representations.scatterPlotChart.prototype=Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);sap.apf.ui.representations.scatterPlotChart.prototype.constructor=sap.apf.ui.representations.scatterPlotChart;
sap.apf.ui.representations.scatterPlotChart.prototype.getThumbnailContent=function(){var s=this;s.thumbnailChartLayout=sap.apf.ui.representations.BaseVizChartRepresentation.prototype.getThumbnailContent.call(s);s.thumbnailChartParam.plotArea.markerSize=4;return s.thumbnailChartLayout};
sap.apf.ui.representations.scatterPlotChart.prototype.constructor=sap.apf.ui.representations.scatterPlotChart;
sap.apf.ui.representations.scatterPlotChart.prototype.setFormatString=function(m){sap.apf.ui.representations.BaseVizChartRepresentation.prototype.setFormatString.call(this,m);var a=this.formatter.getFormatString(m[1]);if(a!==undefined&&a.label!==undefined){this.chart.getXAxis().getLabel().setFormatString(a.label)}};
