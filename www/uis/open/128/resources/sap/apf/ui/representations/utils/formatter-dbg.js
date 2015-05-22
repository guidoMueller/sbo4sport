/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class utils
 * @name utils
 * @memberOf sap.apf.ui.representations
 * @description holds utility functions used by vizHelper and representations 
 */
jQuery.sap.declare("sap.apf.ui.representations.utils.formatter");
/**
 * @class formatter
 * @name formatter
 * @memberOf sap.apf.ui.representations.utils
 * @param {sap.apf.ui.representations.RepresentationInterfaceProxy} oApi - apfInstance, metadata and dataResponse
 * @param {sap.apf.core.Metadata} metadata
 * @param {array} dataResponse
 * @description holds utility functions used by vizHelper and  representations 
 */
sap.apf.ui.representations.utils.formatter = function(oApi, metadata, dataResponse) {
	var self = this;
	this.metadata = metadata;
	this.dataResponse = dataResponse;
	/**
	 * @memberOf sap.apf.ui.representations.utils.formatter
	 * @method getFormattedValue
	 * @description formats the given value
	 * @returns formatted value according to the type
	 */
	this.getFormattedValue = function(fieldName, originalFieldValue) {
		var formattedFieldValue, yearMetadata, quarterMetadata, dateFromMetadata, yearInfoFromDate, weekMetadata, dateFormat;
		var oMetadata = this.metadata.getPropertyMetadata(fieldName);
		if (oMetadata.isCalendarYearMonth) { //calenderYearMonth
			if (originalFieldValue === null) {
				return "";
			}
			formattedFieldValue = this.doYearMonthFormat(originalFieldValue);
		} else if (oMetadata.dataType.type === "Edm.DateTime") { //dateTime
			if (originalFieldValue === null) {
				return "-";
			}
			dateFormat = new Date(parseInt(originalFieldValue.slice(6, originalFieldValue.length - 2), 10));
			dateFormat = dateFormat.toLocaleDateString();
			if (dateFormat === "Invalid Date") {
				return "-";
			}
			formattedFieldValue = dateFormat;
		} else if (oMetadata.unit) { //unit for currency
			if (originalFieldValue === null) {
				return "";
			}
			var currencyMetadata = self.metadata.getPropertyMetadata(oMetadata.unit);
			if (currencyMetadata.semantics === "currency-code") {
				var precision = this.dataResponse[0][oMetadata.scale];
				originalFieldValue = parseFloat(originalFieldValue).toFixed(precision).toString();
				var store = originalFieldValue.split(".");
				var amountValue = parseFloat(store[0]).toLocaleString();
				var sample = 0.1;
				sample = sample.toLocaleString();
				if (amountValue.split(sample.substring(1, 2)).length > 1) {
					amountValue = amountValue.split(sample.substring(1, 2))[0];
				}
				amountValue = amountValue.concat(sample.substring(1, 2), store[1]);
				formattedFieldValue = amountValue;
			} else {
				formattedFieldValue = originalFieldValue;
			}
		} else if (oMetadata.isCalendarDate) {
			if (originalFieldValue === null) {
				return "-";
			}
			yearMetadata = originalFieldValue.substr(0, 4);
			var monthMetadata =parseInt(originalFieldValue.substr(4, 2), 10) - 1;
			var dateMetadata = originalFieldValue.substr(6, 2);
			dateFormat = new Date(yearMetadata, monthMetadata, dateMetadata);
			dateFormat = dateFormat.toLocaleDateString();
			if (dateFormat === "Invalid Date") {
				return "-";
			}
			formattedFieldValue = dateFormat;
		} else if (oMetadata.isCalendarYearQuarter) {
			if (originalFieldValue === null) {
				return "";
			}
			yearMetadata = originalFieldValue.substr(0, 4);
			quarterMetadata = originalFieldValue.substr(4, 1);
			dateFromMetadata = new Date(yearMetadata);
			yearInfoFromDate = dateFromMetadata.getFullYear();
			var quarterInfo;
			quarterInfo = "Q" + quarterMetadata;
			var formattedYearQuarter = quarterInfo + " " + yearInfoFromDate;
			formattedFieldValue = formattedYearQuarter;
		} else if (oMetadata.isCalendarYearWeek) {
			if (originalFieldValue === null) {
				return "";
			}
			yearMetadata = originalFieldValue.substr(0, 4);
			weekMetadata = originalFieldValue.substr(4, 2);
			dateFromMetadata = new Date(yearMetadata);
			yearInfoFromDate = dateFromMetadata.getFullYear();
			var weekInfo;
			weekInfo = "CW" + weekMetadata;
			var formattedYearWeek = weekInfo + " " + yearInfoFromDate;
			formattedFieldValue = formattedYearWeek;
		} else { //default value
			if (originalFieldValue === null) {
				return "null";
			}
			formattedFieldValue = originalFieldValue;
		}
		// application formatter callback
		var callback = oApi.getEventCallback(sap.apf.core.constants.eventTypes.format);
		var metadataObject = jQuery.extend({}, this.metadata.getPropertyMetadata(fieldName));
		if (typeof callback === "function") {
			var appFormattedFieldValue = callback.apply(oApi, [ metadataObject, fieldName, originalFieldValue, formattedFieldValue ]);
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
	 * @memberOf sap.apf.ui.representations.utils.formatter
	 * @method doYearMonthFormat
	 * @param fieldValue
	 * @description yearMonth formatting 
	 */
	this.doYearMonthFormat = function(fieldValue) {
		var jan = oApi.getTextNotHtmlEncoded("month-1-shortName");
		var feb = oApi.getTextNotHtmlEncoded("month-2-shortName");
		var mar = oApi.getTextNotHtmlEncoded("month-3-shortName");
		var apr = oApi.getTextNotHtmlEncoded("month-4-shortName");
		var may = oApi.getTextNotHtmlEncoded("month-5-shortName");
		var jun = oApi.getTextNotHtmlEncoded("month-6-shortName");
		var jul = oApi.getTextNotHtmlEncoded("month-7-shortName");
		var aug = oApi.getTextNotHtmlEncoded("month-8-shortName");
		var sep = oApi.getTextNotHtmlEncoded("month-9-shortName");
		var oct = oApi.getTextNotHtmlEncoded("month-10-shortName");
		var nov = oApi.getTextNotHtmlEncoded("month-11-shortName");
		var dec = oApi.getTextNotHtmlEncoded("month-12-shortName");
		var monthsArray = [ jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec ];
		var year = fieldValue.substr(0, 4);
		var month = monthsArray[fieldValue.substr(4, 6) - 1];
		return month + " " + year;
	};
	/**
	 * @memberOf sap.apf.ui.representations.utils.formatter
	 * @method isAmountField
	 * @param fieldName
	 * @description checks if the field is amount field 
	 */
	this.isAmountField = function(fieldName) {
		var isAmntField = false;
		if (this.metadata && this.dataResponse) {
			var oMetadata = this.metadata.getPropertyMetadata(fieldName);
			if (oMetadata !== undefined && oMetadata.unit) {
				var currencyMetadata = this.metadata.getPropertyMetadata(oMetadata.unit);
				if (currencyMetadata !== undefined && currencyMetadata.semantics === "currency-code") {
					isAmntField = true;
				}
			}
		}
		return isAmntField;
	};
	/**
	 * @method getPrecision
	 * @param fieldName
	 * @description gets the precision for a given fieldName 
	 */
	this.getPrecision = function(fieldName) {
		var oMetadata = this.metadata.getPropertyMetadata(fieldName);
		if (oMetadata !== undefined && this.dataResponse !== undefined && this.dataResponse[0] !== undefined) {
			return this.dataResponse[0][oMetadata.scale];
		}
	};
	/**
	 * @method getFormatString
	 * @param measures- measures of chart and chart type
	 * @param chartType - chart type(constant)
	 * @description returns the stringFormat for label and tooltip of the charts
	 */
	this.getFormatString = function(measure) {
		var zeroStr = "";
		var formatString = {};
		var fieldName = measure.fieldName;
		var isAmountField = this.isAmountField(fieldName);
		if (isAmountField === true) {
			//check for precision point
			var precision = this.getPrecision(fieldName);
			if (precision !== undefined) {
				for( var i = 0; i < precision; i++) {
					zeroStr = zeroStr + "0";
				}
				formatString.label = "#,#0" + "." + zeroStr;
				formatString.tooltip = "#,#" + "." + zeroStr;
			} else {
				formatString = {};
			}
		} else {
			formatString = {};
		}
		return formatString;
	};
};