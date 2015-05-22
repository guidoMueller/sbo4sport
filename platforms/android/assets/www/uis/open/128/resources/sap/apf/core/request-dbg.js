/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

/*global OData */
jQuery.sap.declare("sap.apf.core.request");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");
jQuery.sap.require("sap.ui.thirdparty.datajs");

/**
 * @class The Request object represents an OData GET request. It receives a
 *        filter which is then mapped to a URI query and appended to the request
 *        URI. Its role is to send an asynchronous OData request to the server,
 *        receive the response, parse it and provision it as an array of
 *        objects. The request will use a callback mechanism handling the
 *        asynchronous request behavior. The callback routes control back to the
 *        Path object.
 * @param {Object} - Configuration Object for a Request.
 */
sap.apf.core.Request = function(oInject, oConfig) {
	var oMessageHandler = oInject.messageHandler;
	var oCoreApi = oInject.coreApi;
	var sServiceRootPath = oConfig.service;
	var entityType = oConfig.entityType;
	var selectProperties = oConfig.selectProperties;
	var oUriGenerator = oCoreApi.getUriGenerator();
	var oMessageObject;
	if (sServiceRootPath === undefined) {
		oMessageObject = oMessageHandler.createMessageObject({
			code : "5015",
			aParameters : [oConfig.id]
		});
		oMessageHandler.putMessage(oMessageObject);
	}
	var oMetadata = oCoreApi.getMetadata(sServiceRootPath);
	this.type = oConfig.type;
	/**
	 * @description A request object that can send (many) asynchronous OData GET requests to the server. It uses a POST $batch operation wrapping the GET.
	 * @param {Object} oFilter - An sap.apf.core.utils filter object.
	 * @param {Function} fnCallback - A function called after the response was successfully received and parsed.
	 * @param {Object} oRequestOptions - An optional object containing additional query string options
	 * Format: { orderby : [{ property : <property_name>, order : <asc|desc>}], top : <integer>, skip : <integer> }  
	 */
	this.sendGetInBatch = function(oFilter, fnCallback, oRequestOptions) {
		var oParameters = retrieveParameters(oFilter);
		var oReducedFilter;
		checkFilterForRequiredProperties(oFilter);
		if (oFilter && oFilter.getProperties) {
  			oReducedFilter = oFilter.reduceToProperty(oMetadata.getFilterableProperties(entityType));
		}
		
		checkRequestOptionsConsistency(oRequestOptions);
		var oPaging = oRequestOptions && oRequestOptions.paging;
		var oSortingFields = oRequestOptions && oRequestOptions.orderby;
		var sUriSuffix = oMetadata.getUriSuffix(entityType);
		var sUrlEntityType = oUriGenerator.buildUri(oMessageHandler, entityType, selectProperties, oReducedFilter, oParameters, oSortingFields, oPaging, undefined, formatValue, sUriSuffix);
		var oRequest = {
			method : 'POST',
			headers : {
				"x-csrf-token" : oCoreApi.getXsrfToken(sServiceRootPath)
			},
			requestUri : oUriGenerator.getAbsolutePath(sServiceRootPath) + '$batch',
			data : {
				__batchRequests : [ {
					requestUri : sUrlEntityType,
					method : 'GET',
					headers : {
						"Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage(),
						"x-csrf-token" : oCoreApi.getXsrfToken(sServiceRootPath)
					}
				} ]
			}
		};
		var fnSuccess = function(data, response) {
			var oResponse = {};
			var sUrl = "";
			if (data && data.__batchResponses && data.__batchResponses[0].data) {
				oResponse.data = data.__batchResponses[0].data.results;
				oResponse.metadata = oCoreApi.getEntityTypeMetadata(oConfig.service, oConfig.entityType);
				if (data.__batchResponses[0].data.__count) {
					oResponse.count = parseInt(data.__batchResponses[0].data.__count, 10);
				}
			} else if (data && data.__batchResponses[0] && data.__batchResponses[0].response && data.__batchResponses[0].message) {
				sUrl = response.requestUri;
				var sMessage = data.__batchResponses[0].message;
				var sErrorDetails = data.__batchResponses[0].response.body;
				var sHttpStatusCode = data.__batchResponses[0].response.statusCode;
				oResponse = oMessageHandler.createMessageObject({
					code : "5001",
					aParameters : [ sHttpStatusCode, sMessage, sErrorDetails, sUrl ]
				});
			} else {
				sUrl = response.requestUri || sUrlEntityType;
				oResponse = oMessageHandler.createMessageObject({
					code : "5001",
					aParameters : [ "unknown", "unknown error", "unknown error", sUrl ]
				});
			}
			fnCallback(oResponse, false);
		};
		var fnError = function(error) {
			var sMessage = "unknown error";
			var sErrorDetails = "unknown error";
			var sUrl = sUrlEntityType;
			if (error.message !== undefined) {
				sMessage = error.message;
			}
			var sHttpStatusCode = "unknown";
			if (error.response && error.response.statusCode) {
				sHttpStatusCode = error.response.statusCode;
				sErrorDetails = error.response.statusText || "";
				sUrl = error.response.requestUri || sUrlEntityType ;
			}
			
			if (error.messageObject && error.messageObject.type === "messageObject") {
				fnCallback(error.messageObject);
			} else {
				fnCallback(oMessageHandler.createMessageObject({
					code : "5001",
					aParameters : [ sHttpStatusCode, sMessage, sErrorDetails, sUrl ]
				}));
			}
			
		};
		oCoreApi.odataRequest(oRequest, fnSuccess, fnError, OData.batchHandler);
	};
	
	function formatValue(sProperty, value) {
		var strDelimiter = "'";
		var oEntityMetadata = oMetadata.getPropertyMetadata(entityType, sProperty);
		if (oEntityMetadata && oEntityMetadata.dataType) {
			return sap.apf.utils.formatValue(value, oEntityMetadata.dataType.type)
		} else {
			if (typeof value === 'number') {
				return value ;
			} else {
				return strDelimiter + sap.apf.utils.escapeOdata(value) + strDelimiter;
			}
		}
		
	};
	function checkRequestOptionsConsistency(oRequestOptions) {
		
			var aPropertyNames, i;
			
			if (!oRequestOptions) {
				return;
			}
			aPropertyNames = Object.getOwnPropertyNames(oRequestOptions);
			for (i = 0; i < aPropertyNames.length;i++) {
				if (aPropertyNames[i] !== 'orderby' && aPropertyNames[i] !== 'paging') {
					oMessageHandler.putMessage(oMessageHandler.createMessageObject({
						code : '5032',
						aParameters : [ entityType, aPropertyNames[i] ]
					}));
				}
			}
		}
	
	
	function checkFilterForRequiredProperties(oFilter) {
		var aFilterableProperties = oMetadata.getFilterableProperties(entityType);
		var sRequiredFilterProperty = "";
		var oEntityTypeMetadata = oMetadata.getEntityTypeMetadata(entityType);
		var oMessageObject;
		if (oEntityTypeMetadata.requiresFilter !== undefined && oEntityTypeMetadata.requiresFilter === "true") {
			if (oEntityTypeMetadata.requiredProperties !== undefined) {
				sRequiredFilterProperty = oEntityTypeMetadata.requiredProperties;
			}
		}
		if (sRequiredFilterProperty === "") {
			return;
		}
		if (jQuery.inArray(sRequiredFilterProperty, aFilterableProperties) === -1) {
			oMessageObject = oMessageHandler.createMessageObject({
				code : "5006",
				aParameters : [ entityType, sRequiredFilterProperty ]
			});
			oMessageHandler.putMessage(oMessageObject);
		}
		var aPropertiesInFilter = oFilter.getProperties();
		// test, whether all required properties are in filter
		if (jQuery.inArray(sRequiredFilterProperty, aPropertiesInFilter) === -1) {
			oMessageObject = oMessageHandler.createMessageObject({
				code : "5005",
				aParameters : [ entityType, sRequiredFilterProperty ]
			});
			oMessageHandler.putMessage(oMessageObject);
		}
	}
	function retrieveParameters(oFilter) {
		var oParameters = {};
		var aParameters;
		var numberOfParameters;
		var aTermsContainingParameter;
		aParameters = oMetadata.getHanaViewParameters(entityType);
		if (aParameters !== undefined) {
			numberOfParameters = aParameters.length;
		} else {
			numberOfParameters = 0;
		}
		if (numberOfParameters > 0) {
			for( var i = 0; i < numberOfParameters; i++) {
				var oParameterTerm;
				if (oFilter && oFilter instanceof sap.apf.core.utils.Filter) {
					aTermsContainingParameter = oFilter.getFilterTermsForProperty(aParameters[i].name);
					oParameterTerm = aTermsContainingParameter[aTermsContainingParameter.length - 1];
				}
				if (oParameterTerm instanceof sap.apf.core.utils.FilterTerm) {
					addParameter(i, oParameterTerm.getValue());
				} else if (aParameters[i].defaultValue) {
					addParameter(i, aParameters[i].defaultValue);
				} else {
					var oMessageObject = oMessageHandler.createMessageObject({
						code : "5016",
						aParameters : [ aParameters[i].name ]
					});
					oMessageHandler.putMessage(oMessageObject);
				}
			}
		}
		return oParameters;
		function addParameter(index, value) {
			if (aParameters[index].dataType.type === 'Edm.String') {
				oParameters[aParameters[index].name] = (jQuery.sap.encodeURL("'" + sap.apf.utils.escapeOdata(value) + "'"));
			} else if (aParameters[index].dataType.type) {
				oParameters[aParameters[index].name] = sap.apf.utils.formatValue(value,aParameters[index].dataType.type);
			} else {
				if (typeof value === "string") {
					oParameters[aParameters[index].name] = jQuery.sap.encodeURL(sap.apf.utils.escapeOdata(value));
				} else {
					oParameters[aParameters[index].name] = value;
				}
			}
		}
	}
};
