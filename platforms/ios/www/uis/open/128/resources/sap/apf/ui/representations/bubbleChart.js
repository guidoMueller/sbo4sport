/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.representations.bubbleChart");jQuery.sap.require("sap.apf.ui.representations.BaseVizChartRepresentation");
sap.apf.ui.representations.bubbleChart=function(a,p){sap.apf.ui.representations.BaseVizChartRepresentation.apply(this,[a,p]);this.type=sap.apf.ui.utils.CONSTANTS.representationTypes.BUBBLE_CHART;this.chartType=sap.apf.ui.utils.CONSTANTS.vizChartTypes.BUBBLE;this.axisType="group"};
sap.apf.ui.representations.bubbleChart.prototype=Object.create(sap.apf.ui.representations.BaseVizChartRepresentation.prototype);sap.apf.ui.representations.bubbleChart.prototype.constructor=sap.apf.ui.representations.bubbleChart;
sap.apf.ui.representations.bubbleChart.prototype.setFormatString=function(m){sap.apf.ui.representations.BaseVizChartRepresentation.prototype.setFormatString.call(this,m);var a=this.formatter.getFormatString(m[1]);var l=this.formatter.getFormatString(m[2]);if(a!==undefined&&a.label!==undefined){this.chart.getXAxis().getLabel().setFormatString(a.label)}if(l!==undefined&&l.tooltip!==undefined){this.chart.getSizeLegend().setFormatString(l.tooltip)}};
