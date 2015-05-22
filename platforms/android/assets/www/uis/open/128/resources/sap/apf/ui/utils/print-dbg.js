/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare("sap.apf.ui.utils.print");
/** 
 *@class PrintHelper
 *@memberOf sap.apf.ui.utils
 *@description has functions to perform printing of Analysis Path
 *  
 */
sap.apf.ui.utils.PrintHelper = function(oInject) {
	"use strict";
	this.oCoreApi = oInject.oCoreApi;
	this.oUiApi = oInject.uiApi;

	this.oPathContextHandler = oInject.oPathContextHandler;
	
	/**
	 *@method printLayout defines layout used by each step when being printed
	 *@usage printLayout has to be used to get the layout for individual steps in analysis path.
	 *@param step = Used to get the step information
	 *@param index = index of the step being printed
	 *@param stepsLength = total number of steps in an Analysis Path
	 *@returns the oPrintLayout for a Step in an Analysis Path.
	 */
	this.printLayout = function(oStep, index, stepsLength) {
		var oMessageObject;
		var date = new Date();
		var appName = this.oCoreApi.getApplicationConfigProperties().appName;
		if (!appName) {
			oMessageObject = this.oCoreApi.createMessageObject({
				code : "6003",
				aParameters : [ "appName" ]
			});
			this.oCoreApi.putMessage(oMessageObject);
		}
		var analysisPathTitle = this.oUiApi.getAnalysisPath().oSavedPathName.getTitle();
		var header = new sap.ui.core.HTML({
			content : [ '<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> ' + this.oCoreApi.getTextHtmlEncoded(appName) + ' : ' + jQuery.sap.encodeHTML(analysisPathTitle) + '</p>',
					'<p class="printHeaderDate"> ' + date.toTimeString() + ' </p></div><div class="clear"></div>', '<div class="printChipName"><p>' + this.oCoreApi.getTextHtmlEncoded("print-step-number", [ index, stepsLength ]) + '</p></div>' ]
					.join("")
		});
		var chartLayout = new sap.ui.layout.VerticalLayout();
		var oStepTitle = this.oCoreApi.getTextNotHtmlEncoded(oStep.title);
		var selectedRepresentation = oStep.getSelectedRepresentation();
		var stepRepresentation = selectedRepresentation.bIsAlternateView ? selectedRepresentation.toggleInstance : selectedRepresentation;
		if (selectedRepresentation.bIsAlternateView) {
			var data = oStep.getSelectedRepresentation().getData();
			var metadata = oStep.getSelectedRepresentation().getMetaData();
			stepRepresentation.setData(data, metadata);
		}
		var representation = {};
		if (stepRepresentation.type === "TableRepresentation") {
			representation = stepRepresentation.getPrintContent(oStepTitle);
			representation.setWidth("1000px");
		} else {
			representation = stepRepresentation.getPrintContent(oStepTitle);
		}
		//Show/Hide Legend for print content
		if (stepRepresentation.bIsLegendVisible === false) {
			if (representation.setLegend !== undefined) {
				representation.setLegend(new sap.viz.ui5.types.legend.Common({
					visible : false
				}));
			}
			if (representation.setSizeLegend !== undefined) {
				representation.setSizeLegend(new sap.viz.ui5.types.legend.Common({
					visible : false
				}));
			}
		} else {
			if (representation.setLegend !== undefined) {
				representation.setLegend(new sap.viz.ui5.types.legend.Common({
					visible : true
				}));
			}
			if (representation.setSizeLegend !== undefined) {
				representation.setSizeLegend(new sap.viz.ui5.types.legend.Common({
					visible : true
				}));
			}
		}
		chartLayout.addContent(representation);
		var oPrintLayout = new sap.ui.layout.VerticalLayout({
			content : [ header, chartLayout ]
		}).addStyleClass("representationContent"); // @comment : apfPrintLayout class not provided in css
		return oPrintLayout;
	};
	
	/**
	 *@method Format the values with respect to data type
	 *@usage format the values 
	 */
	this.formatter = function (metadata, value) {
		
		/**
		 * @memberOf sap.apf.ui.utils.PrintHelper
		 * @method doYearMonthFormat
		 * @param fieldValue
		 * @description yearMonth formatting 
		 */
		var doYearMonthFormat = function(fieldValue) {
			var jan = this.oCoreApi.getTextNotHtmlEncoded("month-1-shortName");
			var feb = this.oCoreApi.getTextNotHtmlEncoded("month-2-shortName");
			var mar = this.oCoreApi.getTextNotHtmlEncoded("month-3-shortName");
			var apr = this.oCoreApi.getTextNotHtmlEncoded("month-4-shortName");
			var may = this.oCoreApi.getTextNotHtmlEncoded("month-5-shortName");
			var jun = this.oCoreApi.getTextNotHtmlEncoded("month-6-shortName");
			var jul = this.oCoreApi.getTextNotHtmlEncoded("month-7-shortName");
			var aug = this.oCoreApi.getTextNotHtmlEncoded("month-8-shortName");
			var sep = this.oCoreApi.getTextNotHtmlEncoded("month-9-shortName");
			var oct = this.oCoreApi.getTextNotHtmlEncoded("month-10-shortName");
			var nov = this.oCoreApi.getTextNotHtmlEncoded("month-11-shortName");
			var dec = this.oCoreApi.getTextNotHtmlEncoded("month-12-shortName");
			var monthsArray = [ jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec ];
			var year = fieldValue.substr(0, 4);
			var month = monthsArray[fieldValue.substr(4, 6) - 1];
			return month + " " + year;
		};
		
		var formattedFieldValue, yearMetadata, quarterMetadata, dateFromMetadata, yearInfoFromDate, weekMetadata, dateFormat;
		
		if (metadata.getAttribute("isCalendarYearMonth")) { //calenderYearMonth
			if (originalFieldValue === null) {
				return "";
			}
			formattedFieldValue = doYearMonthFormat(value);
		} else if (metadata.type === "Edm.DateTime") { //dateTime
			if (value === null) {
				return "-";
			}
			dateFormat = new Date(parseInt(value.slice(6, value.length - 2), 10));
			dateFormat = dateFormat.toLocaleDateString();
			if (dateFormat === "Invalid Date") {
				return "-";
			}
			formattedFieldValue = dateFormat;
		} else if (metadata.getAttribute("isCalendarDate")) {
			if (value === null) {
				return "-";
			}
			yearMetadata = value.substr(0, 4);
			var monthMetadata = value.substr(4, 2);
			var dateMetadata = value.substr(6, 2);
			dateFormat = new Date(yearMetadata, monthMetadata, dateMetadata);
			dateFormat = dateFormat.toLocaleDateString();
			if (dateFormat === "Invalid Date") {
				return "-";
			}
			formattedFieldValue = dateFormat;
		} else if (metadata.getAttribute("isCalendarYearQuarter")) {
			if (value === null) {
				return "";
			}
			yearMetadata = value.substr(0, 4);
			quarterMetadata = value.substr(4, 1);
			dateFromMetadata = new Date(yearMetadata);
			yearInfoFromDate = dateFromMetadata.getFullYear();
			var quarterInfo;
			quarterInfo = "Q" + quarterMetadata;
			var formattedYearQuarter = quarterInfo + " " + yearInfoFromDate;
			formattedFieldValue = formattedYearQuarter;
		} else if (metadata.getAttribute("isCalendarYearWeek")) {
			if (value === null) {
				return "";
			}
			yearMetadata = value.substr(0, 4);
			weekMetadata = value.substr(4, 2);
			dateFromMetadata = new Date(yearMetadata);
			yearInfoFromDate = dateFromMetadata.getFullYear();
			var weekInfo;
			weekInfo = "CW" + weekMetadata;
			var formattedYearWeek = weekInfo + " " + yearInfoFromDate;
			formattedFieldValue = formattedYearWeek;
		} else { //default value
			if (value === null) {
				return "null";
			}
			formattedFieldValue = value;
		}
		
		// application formatter callback
		var callback = this.oUiApi.getEventCallback(sap.apf.core.constants.eventTypes.format);
		if (typeof callback === "function") {
			var appFormattedFieldValue = callback.apply(this.oUiApi, [ metadata, metadata.name, value, formattedFieldValue ]);
			if (appFormattedFieldValue !== undefined) {
				formattedFieldValue = appFormattedFieldValue;
			}
			if (appFormattedFieldValue === null) {
				formattedFieldValue = "";
			}
		}
		return formattedFieldValue;
	};
	
	/**
	 *@method Print used to print all the steps in Analysis Path.
	 *@usage PrintHelper().doPrint has to be used for printing Analysis Path
	 */
	this.doPrint = function() {
		this.oUiApi.createApplicationLayout(false).setBusy(true);//sets the Local Busy Indicator for the print
		var allSteps = this.oCoreApi.getSteps();
		var stepLayout = new sap.ui.layout.VerticalLayout();
		var domContent = "";
		var pTimer = 2000;
		var that = this;
		var date = new Date();
		var appName = this.oCoreApi.getApplicationConfigProperties().appName;
		var analysisPathTitle = this.oUiApi.getAnalysisPath().oSavedPathName.getTitle();
		jQuery('#apfPrintArea').remove(); // removing the div which holds the printable content
		jQuery("body").append('<div id="apfPrintArea"></div>'); //div which holds the printable content
		
		//Facet Filter Printing as the initial page 
		//Print the filter expression provided by getContext() API 
		var facetFilterExpr;
		var callback = this.oUiApi.getEventCallback(sap.apf.core.constants.eventTypes.printTriggered);
		var getAllIds = this.oPathContextHandler ? this.oPathContextHandler.getAllIds() : [];
		var filterExpr = [];
		
		//Check if pathContextHandler returns values else fallback to getContext API
		if(getAllIds.length > 0) {
			for (var i = 0; i < getAllIds.length; i++) {
				var aFilter = this.oPathContextHandler.get(getAllIds[i]).getExpressions();
				filterExpr.push(aFilter[0]);
			}
		} else {
			filterExpr = this.oCoreApi.getContext().getExpressions();
		}
		
		//Formatted Filter Values from APF
		var formattedFilters = function (context) {
			var filterValues = [];
			var filterArr = [];
			for (var i = 0; i < filterExpr.length; i++) {
				for (var j = 0; j < filterExpr[i].length; j++) {
					var filterObj = filterExpr[i][j];
					var filterName = "";
					var filterVal = "";
					context.oCoreApi.getMetadataFacade().getProperty(filterExpr[i][j].name, function (o) {
						filterName = o.label;
						filterVal = context.formatter(o, filterExpr[i][j].value);
					});
					filterObj["name"] = filterName;
					filterObj["value"] = filterVal;
					filterValues.push(filterObj);
				}
				filterArr.push(filterValues);
				filterValues = [];
			}
			
			return filterArr;
		};
		
		
		var callbackContext = {
			getTextNotHtmlEncoded : that.oCoreApi.getTextNotHtmlEncoded
		};
		
		if (callback !== undefined) {
			var facetFilterArr = callback.apply(callbackContext, [filterExpr]) || [];
			facetFilterExpr = (facetFilterArr.length > 0) ? facetFilterArr : formattedFilters(this);
		} else {
			facetFilterExpr = formattedFilters(this);
		}
		
		var header = new sap.ui.core.HTML({
			content : [ '<div class="subHeaderPrintWrapper"><p class="printHeaderTitle"> ' + this.oCoreApi.getTextHtmlEncoded(appName) + ' : ' + jQuery.sap.encodeHTML(analysisPathTitle) + '</p>',
					'<p class="printHeaderDate"> ' + date.toTimeString() + ' </p></div><div class="clear"></div>' ].join("")
		});
		var facetLayout = new sap.ui.layout.VerticalLayout();
		var filterValue = "";
		var filterName = "";
		var i,  j; 
		//Formatting the facet filter array
		for(  i = 0; i < facetFilterExpr.length; i++) {
			for(  j = 0; j < facetFilterExpr[i].length; j++) {
				filterName = facetFilterExpr[i][j].name;
				if (j !== facetFilterExpr[i].length - 1) {
					filterValue += facetFilterExpr[i][j].value + ", ";
				} else {
					filterValue += facetFilterExpr[i][j].value;
				}
			}
			var mFilterName = new sap.m.Text({
				text : filterName
			}).addStyleClass("printFilterName");
			var mFilterValue = new sap.m.Text({
				text : filterValue
			}).addStyleClass("printFilterValue");
			facetLayout.addContent(mFilterName);
			facetLayout.addContent(mFilterValue);
			//Reset the filter value
			filterValue = "";
		}
		//Facet UI Layout
		var oPrintFacetLayout = new sap.ui.layout.VerticalLayout({
			content : [ header, facetLayout ]
		}).addStyleClass("representationContent");
		stepLayout.addContent(oPrintFacetLayout);
		var k;
		for(  k = 0 ; k < allSteps.length; k++) {
			var index = parseInt(k, 10) + 1;
			stepLayout.addContent(this.printLayout(allSteps[k], index, allSteps.length));
		}
		stepLayout.placeAt("apfPrintArea");
		if (jQuery(".v-geo-container").length) {//set the timer if geomap exists
			pTimer = 4000;
		}
		window.setTimeout(function() {
			that.oUiApi.createApplicationLayout(false).setBusy(false); //Removes the Local Busy Indicator after the print
		}, pTimer - 150);
		window.setTimeout(function() { //Set Timeout to load the content on to dom
			jQuery("#" + stepLayout.sId + " > div").after("<div class='page-break'> </div>");
			domContent = stepLayout.getDomRef(); // Get the DOM Reference
			var table = jQuery('#apfPrintArea .sapUiTable');
			if (table.length) {
				var colCount = jQuery('#apfPrintArea .printTable .sapMListTblHeader .sapMListTblCell').length;
				if (colCount > 11) {
					jQuery("#setPrintMode").remove();
					jQuery("<style id='setPrintMode' > @media print and (min-resolution: 300dpi) { @page {size : landscape;}}</style>").appendTo("head");
				} else {
					jQuery("#setPrintMode").remove();
					jQuery("<style id='setPrintMode'>@media print and (min-resolution: 300dpi) { @page {size : portrait;}}</style>").appendTo("head");
				}
			}
			jQuery("#apfPrintArea").empty(); //Clear the apfPrintArea
			jQuery("#sap-ui-static > div").hide(); // Hide popup
			jQuery("#apfPrintArea").append(jQuery(domContent).html()); //Push it to apfPrintArea
			var i;
			for(  i = 0; i < jQuery("#apfPrintArea").siblings().length; i++){
				//TODO alternate way of hiding the content and printing only the representations?????     
				jQuery("#apfPrintArea").siblings()[i].hidden = true; // hiding the content apart from apfPrintArea div
			}

			window.print(); //print the content
			//Workaround to get the width of the column cell
			window.setTimeout(function() {
				for(  i = 0; i < jQuery("#apfPrintArea").siblings().length; i++){
					jQuery("#apfPrintArea").siblings()[i].hidden = false;
				}
				stepLayout.destroy(); //Destroy the reference & remove from dom

			}, 10);
		}, pTimer);
	};
};