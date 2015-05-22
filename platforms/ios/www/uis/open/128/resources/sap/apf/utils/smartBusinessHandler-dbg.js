/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.utils.smartBusinessHandler');
/**
 * @private
 * @experimental The complete class interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
 * @class Smart business handler
 * @description Manages smart business context.
 * @param {object} oInject - Dependency Injection
 * @name sap.apf.utils.SmartBusinessHandler
 */
sap.apf.utils.SmartBusinessHandler = function(oInject) {
	"use strict";
	var self = this;
	var oCoreApi = {
		getApplicationConfigProperties : oInject.getApplicationConfigProperties,
		createReadRequestByRequiredFilter : oInject.createReadRequestByRequiredFilter,
		getTextNotHtmlEncoded : oInject.getTextNotHtmlEncoded
	};
	var oMessageHandler = oInject.oMessageHandler;
	var oComponent = oInject.oComponent;
	var deferredObj = new jQuery.Deferred();
	var oPromise = deferredObj.promise();
	var aFilters = [];
	var aHanaViewParameters = [];
	var aConsolidatedFilters = [];
	var constants = {
		FILTER_TYPE : "FI",
		PARAMETER_TYPE : "PA"
	};
	var getKPIEvaluationId = function() {
		var params, evalId, oComponentData;
		if (oComponent) {
			oComponentData = oComponent.getComponentData();
			if (oComponentData) {
				params = oComponentData.startupParameters;
				if (params && params.evaluationId) {
					evalId = params.evaluationId[0];
				}
			}
		}
		return evalId;
	};
	var sEvaluationId = getKPIEvaluationId();
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.SmartBusinessHandler#initialize
	 * @description Triggers fetching the smart business filters.
	 * */
	this.initialize = function() {
		oPromise = this._fetchSBData().then(this._pushAllSBFilters);
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.SmartBusinessHandler#getEvaluationId
	 * @description Getter for KPI Evaluation Id.
	 * @returns {string}
	 * */
	this.getEvaluationId = function() {
		return sEvaluationId;
	};
	this._fetchSBData = function() {
		var sbConfiguration = oCoreApi.getApplicationConfigProperties().smartBusinessService;
		var sbEvaluation = sbConfiguration.evaluation;
		var sbUrl = sbEvaluation.service + "/" + sbEvaluation.entityType + "('{evaluationId}')/FILTERS?$format=json";
		if (deferredObj.state() === "pending") {
			jQuery.ajax({ // TODO Use createReadRequestByRequiredFilter.
				url : sbUrl.replace("{evaluationId}", sEvaluationId),
				success : function(data) {
					deferredObj.resolveWith(self, [ data ]);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					var oMessageObject = oMessageHandler.createMessageObject({
						code : "6011"
					});
					oMessageHandler.putMessage(oMessageObject);
				}
			});
		}
		return deferredObj.promise();
	};
	this._pushAllSBFilters = function(sbData) {
		var aProperties = sbData.d.results;
		aProperties.forEach(function(property) {
			if (property.TYPE === constants.FILTER_TYPE) {
				aFilters.push(property);
			} else if (property.TYPE === constants.PARAMETER_TYPE) {
				aHanaViewParameters.push(property);
			}
			aConsolidatedFilters.push(property);
		});
		return aConsolidatedFilters;
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.utils.SmartBusinessHandler#getAllFilters
	 * @description Getter for all smart business filters.
	 * Returns a jQuery Promise which will be resolved with Array of filters.
	 * @returns {jQuery.Promise}
	 * */
	this.getAllFilters = function() {
		return oPromise;
	};
};