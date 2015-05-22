/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
 
 /**
   * Static helper functions
   */
jQuery.sap.declare('sap.apf.utils.utils');
jQuery.sap.require('sap.ui.core.format.DateFormat');

/**
 * @description Returns the URL parameters. Is a wrapper function for the jQuery.sap.getUriParameters function. For more details, please see SAPUI5 documentation 
 * @returns {object}
 */
sap.apf.utils.getUriParameters = function() {
	return jQuery.sap.getUriParameters().mParams;
};
/**
 * @description Eliminates duplicate values in an array
 * @param {array} aWithDuplicates
 * @returns {array}
 */
sap.apf.utils.eliminateDuplicatesInArray = function(oMsgHandler, aWithDuplicates) {
	oMsgHandler.check((aWithDuplicates !== undefined && typeof aWithDuplicates === 'object' && aWithDuplicates.hasOwnProperty('length') === true), 'Error - aArray is undefined');
	var aReturn = [];
	for( var i = 0; i < aWithDuplicates.length; i++) {
		for( var j = i + 1; j < aWithDuplicates.length; j++) {
			// If this[i] is found later in the array
			if (aWithDuplicates[i] === aWithDuplicates[j]) {
				j = ++i;
			}
		}
		aReturn.push(aWithDuplicates[i]);
	}
	return aReturn;
};
/**
 * @description Returns a hash code of a string
 * @param {string} sValue
 * @returns {number}
 */
sap.apf.utils.hashCode = function(sValue) {
	var nHash = 0;
	var i = 0;
	var nCharCode = 0;
	sValue = sValue + ''; // convert to string
	var len = sValue.length;
	for(i = 0; i < len; i++) {
		nCharCode = sValue.charCodeAt(i);
		nHash = (17 * nHash + nCharCode) << 0;
	}
	return nHash;
};
/**
 * @description Escapes data according to the SAP XSE OData specification, that is doubling the single quote
 * @param {string} sValue
 * @returns {string} || {object}
 */
sap.apf.utils.escapeOdata = function(sValue) {
	if (typeof sValue === "string") {
		return sValue.replace("'", "''");
	} else {
		return sValue;
	}
};
/**
 * @description Formats a value in json format in the javascript object.  
 * @param {object} value some value
 * @param {string} sType edm type name
 * @returns {object} javascriptValue
 */
sap.apf.utils.json2javascriptFormat = function(value, sType) {
	var intermediateValue;
	
	switch(sType) {
		case "Edm.Boolean":
			if (typeof value === "boolean") {
				return value;
			}
			if (typeof value === "string") {
				return value.toLowerCase() === "true";
			}
			return false;		 
		case "Edm.Decimal":
		case "Edm.Guid" :
		case "Edm.Int64" :
		case "Edm.String" :
			return value;
		case "Edm.Int16":
		case "Edm.Int32":
			return parseInt(value, 10);
		case "Edm.Single":
		case "Edm.Float" :
			return parseFloat(value);
		case "Edm.Time":
			return value;
		case "Edm.DateTime":
			intermediateValue = value.replace('/Date(', '').replace(')/', '')
			intermediateValue = parseFloat(intermediateValue);
			return new Date(intermediateValue);
		case "Edm.DateTimeOffset":
			intermediateValue = value.replace('/Date(', '');
			intermediateValue = intermediateValue.replace(')/', '');
			intermediateValue = parseFloat(intermediateValue);
			return new Date(intermediateValue);
			
	}
	return value; //default
};

/**
  * @description Formats a value for usage in odata conformant url as filter or parameter with given Edm type
  * @param {object} value some value
  * @param {string} sType edm type name
  * @returns {string} sFormatedValue
  */
sap.apf.utils.formatValue = function(value, sType) {
	
	function convertValueToDate (v) {
		var val;
		
		if (v instanceof Date) {
			return v;
		} else if (typeof v === 'string') {
			if (v.substring(0, 6) === '/Date(') {
				val = v.replace('/Date(', '');
				val = val.replace(')/', '');
				val = parseInt(val, 10);
				return new Date(val);
			} else {
				return new Date(v);
			}	
		}	
	}
	
	var oDate;
	var sFormatedValue = "";
	// null values should return the null literal
	if (value === null || value === undefined) {
		return "null";
	}
	
	
	switch(sType) {
		case "Edm.String":
			// quote
			sFormatedValue = "'" + String(value).replace(/'/g, "''") + "'";
			break;
		case "Edm.Time":
			if (typeof value === 'number') {
				oDate = new Date();
				oDate.setTime(value);
				var hours = oDate.getUTCHours();
				if (hours < 10) {
					hours = '0' + hours;
				}
				var minutes = oDate.getUTCMinutes();
				if (minutes < 	10) {
					minutes = '0' + minutes;
				}
				var seconds = oDate.getUTCSeconds();
				if (seconds < 10) {
					seconds = '0' + seconds;
				}
				sFormatedValue =  "time'" + hours + ':' + minutes + ':' + seconds + "'";
			} else {
				sFormatedValue = "time'" + value + "'";
				
			}
			
			break;
		case "Edm.DateTime":
			if (!sap.apf.utils.formatValue.oDateTimeFormat) {
				sap.apf.utils.formatValue.oDateTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "'datetime'''yyyy-MM-dd'T'HH:mm:ss''"
				});
			}

			oDate = convertValueToDate(value);
			sFormatedValue = sap.apf.utils.formatValue.oDateTimeFormat.format(oDate, true);
			break;
		case "Edm.DateTimeOffset":
			
			if (!sap.apf.utils.formatValue.oDateTimeOffsetFormat) {
				sap.apf.utils.formatValue.oDateTimeOffsetFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''"
				});
			}
			oDate = convertValueToDate(value); //
			sFormatedValue = sap.apf.utils.formatValue.oDateTimeOffsetFormat.format(oDate, true);
			break;
		case "Edm.Guid":
			sFormatedValue = "guid'" + value + "'";
			break;
		case "Edm.Decimal":
			sFormatedValue = value + "M";
			break;
		case "Edm.Int64":
			sFormatedValue = String(value)+ "L";
			break;
		case "Edm.Single":
			sFormatedValue = value + "f";
			break;
		case "Edm.Binary":
			sFormatedValue = "binary'" + value + "'";
			break;
		default:
			sFormatedValue = value;
			break;
	}
	return sFormatedValue;	
			
};

/**
 * @description Transforms a string into a callable function. Method should only be called internally by APF.
 * @param {string} sFunctionPath
 * @returns {function}
 */	
sap.apf.utils.extractFunctionFromModulePathString = function(sFunctionPath) {

	if (jQuery.isFunction(sFunctionPath)) {
		return sFunctionPath;
	}
	var oDeepestNameSpaceLevel, aNameSpaceParts, sFunction;
	aNameSpaceParts = sFunctionPath.split('.');
	oDeepestNameSpaceLevel = window;
	for( var i = 0; i < aNameSpaceParts.length - 1; i++) {
		oDeepestNameSpaceLevel = oDeepestNameSpaceLevel[aNameSpaceParts[i]];
	}
	sFunction = aNameSpaceParts[aNameSpaceParts.length - 1];
	return oDeepestNameSpaceLevel[sFunction];
};