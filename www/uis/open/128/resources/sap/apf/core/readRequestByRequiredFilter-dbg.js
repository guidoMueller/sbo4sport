/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.readRequestByRequiredFilter");

jQuery.sap.require("sap.apf.core.request");

/**
 * @public
 * @class Facade for sap.apf.core.Request for getting data via the OData protocol. This corresponds to a normal HTTP GET method. Creation is done via APF API.
 * In addition to the handed over filter argument in method send(), the required filters and HANA view parameters of the configured entity type are applied, which are determined from path filter. 
 * @name sap.apf.core.ReadRequestByRequiredFilter
 * @param {object} oInject Injection object.
 * @param {object} oInject.coreApi Instance of core API.
 * @param {object} oInject.oMessageHandler The APF Message handler.
 * @param {object} oRequest The object represents an OData GET request.
 * @param {string} sService Service defined by the analytical content configuration.
 * @param {string} sEntityType Entity type defined by the analytical content configuration.
 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
 */
sap.apf.core.ReadRequestByRequiredFilter = function (oInject, oRequest, sService, sEntityType) {
	var oCoreApi = oInject.coreApi;
	var oMessageHandler = oInject.messageHandler;
	var oMetadata;
	
	/**
	 * @description Contains 'readRequestByRequiredFilter'
	 * @returns {string}
	 */
	this.type = "readRequestByRequiredFilter";
	/**
	 * @public
	 * @function
	 * @name sap.apf.core.ReadRequestByRequiredFilter#send
	 * @description Executes an OData request.
	 * @param {sap.apf.utils.Filter} oFilter
	 * @param {function} fnCallback The first argument of the callback function is the received data (as Array). The second argument is {sap.apf.core.EntityTypeMetadata}. The third argument is {sap.apf.core.MessageObject}. 
	 * @param {Object} oRequestOptions An optional object containing additional query string options
	 * Format: { orderby : [{ property : <property_name>, order : <asc|desc>}], top : <integer>, skip : <integer> }  
	 * @returns undefined
	 */
	this.send = function (oFilter, fnCallback, oRequestOptions) {
		
		var callbackForRequest = function (oResponse, bNotUpdated) {
			var oMessageObject;
			var oEntityTypeMetadata;
			var aData = [];
			if (oResponse && oResponse.type && oResponse.type === "messageObject") {
				oMessageHandler.putMessage(oResponse); // technically logging
				oMessageObject = oResponse;
			} else {
				aData = oResponse.data;
				oEntityTypeMetadata = oResponse.metadata;
			}
			fnCallback(aData, oEntityTypeMetadata, oMessageObject);
		};
		
		if (!oMetadata) {
			oMetadata = oCoreApi.getMetadata(sService);
		}
		
//		Get HANA view parameters
		var aHanaViewParameters = oMetadata.getHanaViewParameters(sEntityType);
		
//		Get required filters
		var sRequiredFilterProperty = "";
		var oEntityTypeMetadata = oMetadata.getEntityTypeMetadata(sEntityType);
		if (oEntityTypeMetadata.requiresFilter !== undefined && oEntityTypeMetadata.requiresFilter === "true") {
			if (oEntityTypeMetadata.requiredProperties !== undefined) {
				sRequiredFilterProperty = oEntityTypeMetadata.requiredProperties;
			}
		}
		
//		Join HANA view parameters & Required filters
		var aRequiredProperties = sRequiredFilterProperty.split(',');
		for(var i = 0; i<aHanaViewParameters.length; i++){
			aRequiredProperties.push(aHanaViewParameters[i].name); 
		}
		
//		Reduce the context filter to {HANA view parameters + Required filters}
		var oProjectedContextFilter = oCoreApi.getContext().getInternalFilter().reduceToProperty(aRequiredProperties);
		
//		Intersect both filters.
		var oRequestFilter = oFilter.getInternalFilter();
		oRequestFilter.addAnd(oProjectedContextFilter);
		
		oRequest.sendGetInBatch(oRequestFilter, callbackForRequest, oRequestOptions);

	};
	/**
     * @public
     * @function
     * @name sap.apf.core.ReadRequestByRequiredFilter#getMetadataFacade
     * @description Returns {sap.apf.core.MetadataFacade} which provides convenience methods for accessing metadata
     * (only for the service document, which is assigned to this read request instance).
     * @param {string} sService Service defined by the request configuration.
     * @returns {sap.apf.core.MetadataFacade}
     */
    this.getMetadataFacade = function () {
        return oCoreApi.getMetadataFacade(sService);
    };
};
