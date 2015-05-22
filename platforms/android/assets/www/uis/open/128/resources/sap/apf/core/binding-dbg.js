/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

jQuery.sap.declare("sap.apf.core.binding");
jQuery.sap.require("sap.apf.core.constants");
jQuery.sap.require("sap.apf.core.utils.filter");
jQuery.sap.require("sap.apf.core.utils.filterTerm");



/** 
 * @class The binding manages the different representations, that are assigned to a step.
 * @param {sap.apf.core.Instance} oInject.coreApi provides the core api.
 * @param {sap.apf.core.MessageHandler} oInject.messageHandler provides the message handler.
 * @param {object} oBindingConfig The configuration object of the binding from the analytical configuration.
 * @param oBindingConfig.oTitle Title of binding
 * @param oBindingConfig.oLongTitle Longtitle of binding
 * @param oBindingConfig.representations Configuration of the representations
 * @param oBindingConfig.requiredFilters {string[]} required filters - Array with properties, that define the filter properties, that shall be returned.
 * @param {sap.apf.core.ConfigurationFactory} oFactory reference 
 */
sap.apf.core.Binding = function(oInject, oBindingConfig, oFactory) {
    var that = this;
	this.type = "binding";
	var nSelectedRepresentation = 0;
	var aRepresentationInstances = [];
	var aRepresentationInfo = [];
	var aCachedData = [];
	var oCachedMetadata;
	var oStartFilter;

	this.oTitle = oBindingConfig.oTitle;
	this.oLongTitle = oBindingConfig.oLongTitle;
	var aRequiredFilters = oBindingConfig.requiredFilters;

	/**
	 * @see sap.apf.core.Step#getFilter
	 */
	this.getFilter = function() {
		var oSelectedRepresentation = this.getSelectedRepresentation();
		var methodTypes = sap.apf.core.constants.filterMethodTypes;
		var aIndices = [];

		if (oSelectedRepresentation.getFilterMethodType() === methodTypes.startFilter || oSelectedRepresentation.getFilterMethodType() === methodTypes.filter) {
			var oFilterFromRepresentation = oSelectedRepresentation.getFilter().getInternalFilter();
			if (oStartFilter) {
				return oStartFilter.getInternalFilter().overwriteWith(oFilterFromRepresentation);
			} else {
				return oFilterFromRepresentation;
			}
		}
		if (oSelectedRepresentation.getSelectionAsArray) {
			aIndices = oSelectedRepresentation.getSelectionAsArray();
		} else {
			return new sap.apf.core.utils.Filter(oInject.messageHandler);
		}
		// CONTRACT: undefined = empty selection corresponds to empty rectangle in a scatter
		// following steps should get no data
		if (aIndices === undefined) {
			return sap.apf.core.utils.Filter.createEmptyFilter(oInject.messageHandler, aRequiredFilters);
		}
		// CONTRACT: nothing selected also means, that nothing is excluded -> all shall be taken over to next selection
		if (aIndices.length === aCachedData.length || aIndices.length === 0) {
			return new sap.apf.core.utils.Filter(oInject.messageHandler);
		}
		// DEFAULT: 
		return sap.apf.core.utils.Filter.createFromArray(oInject.messageHandler, aRequiredFilters, aCachedData, aIndices);
	};

	/**
	 * @description Request option like $top, $skip and $orderby are returned by the actual representation. This
	 * is required to create the OData request.
	 */
	this.getRequestOptions = function() {
		if (jQuery.isFunction(this.getSelectedRepresentation().getRequestOptions)) {
			return this.getSelectedRepresentation().getRequestOptions();
		}
		return {};
	};

	function isRepresentationForInitialStep(oRepresentation) {
		return oRepresentation.getFilterMethodType() === sap.apf.core.constants.filterMethodTypes.startFilter;
	}
	/**
	 * @see sap.apf.core.Step#setFilter
	 */
	this.setFilter = function(oFilter) {
		var oRepresentation = this.getSelectedRepresentation();
		oStartFilter = oFilter;
		if (isRepresentationForInitialStep(oRepresentation)) {
			oRepresentation.setFilter(oStartFilter);
		}
	};
	/**
	 * @see sap.apf.core.Step#setData
	 */
	this.setData = function(oDataResponse) {
		oInject.messageHandler.check(oDataResponse !== undefined, "aDataResponse is undefined (binding function setData)");
		aCachedData = oDataResponse.data;
		oCachedMetadata = oDataResponse.metadata;
		this.getSelectedRepresentation().setData(oDataResponse.data, oDataResponse.metadata);
	};

	/**
	 * @see sap.apf.core.Step#getRepresentationInfo
	 */
	this.getRepresentationInfo = function() {
		var aReprInfo = jQuery.extend(true, [], aRepresentationInfo); // clone deep
		for( var i = 0; i < aReprInfo.length; i++) {
			delete aReprInfo[i].id;
			delete aReprInfo[i].type;
			delete aReprInfo[i].constructor;
		}
		return aReprInfo;
	};

	/**
	 * @see sap.apf.core.Step#getSelectedRepresentationInfo
	 */
	this.getSelectedRepresentationInfo = function() {
		oInject.messageHandler.check(0 <= nSelectedRepresentation && nSelectedRepresentation < aRepresentationInfo.length, "index in array boundaries");
		
		var oRepType = jQuery.extend(true, {}, aRepresentationInfo[nSelectedRepresentation]);
		delete oRepType.id;
		delete oRepType.type;
		delete oRepType.constructor;
		return oRepType;
	};

	/**
	 * @see sap.apf.core.Step#getSelectedRepresentation
	 */
	this.getSelectedRepresentation = function() {
		oInject.messageHandler.check(0 <= nSelectedRepresentation && nSelectedRepresentation < aRepresentationInstances.length, "selectedRepresentation in array boundaries");
		return aRepresentationInstances[nSelectedRepresentation];
	};

	/**
	 * @see sap.apf.core.Step#setSelectedRepresentation
	 */
	this.setSelectedRepresentation = function(sRepresentationId) {
		oInject.messageHandler.check(typeof sRepresentationId === "string", "setSelectedRepresentation() - sRepresentationId missing");
		var oCurrentInstance = this.getSelectedRepresentation();
		var oSwitchParameters = determineSwitchParameters(sRepresentationId, oBindingConfig.representations);
		var oNewInstance = setNewInstance(oSwitchParameters);

		nSelectedRepresentation = oSwitchParameters.index;
		if (aCachedData !== undefined && oCachedMetadata !== undefined) {
			oNewInstance.setData(aCachedData, oCachedMetadata);
		}
		if (oNewInstance.adoptSelection) {
			oNewInstance.adoptSelection(oCurrentInstance);
		}

		function determineSwitchParameters(sRepresentationId, aRepresentationConfig) {
			for( var i = 0; i < aRepresentationConfig.length; i++) {
				if (sRepresentationId === aRepresentationConfig[i].id) {
					return {
						config : aRepresentationConfig[i],
						constructor : oFactory.getConfigurationById(aRepresentationConfig[i].representationTypeId).constructor,
						index : i
					};
				}
			}
			oInject.messageHandler.check(false, "Representation config not found");
		}
		function setNewInstance(oSwitchParam) {
			if (aRepresentationInstances[oSwitchParam.index] === undefined) {
				if (oSwitchParam.config.parameter && oSwitchParam.config.parameter.alternateRepresentationTypeId) {
					oSwitchParam.config.parameter.alternateRepresentationType = oFactory.getConfigurationById(oSwitchParam.config.parameter.alternateRepresentationTypeId);
				}
				oSwitchParam.config.parameter.requiredFilters = oBindingConfig.requiredFilters;
				aRepresentationInstances[oSwitchParam.index] = oInject.coreApi.createRepresentation(oSwitchParam.constructor, oSwitchParam.config.parameter);
				return aRepresentationInstances[oSwitchParam.index];
			} else {
				return aRepresentationInstances[oSwitchParam.index];
			}
		}
	};
	/**
	 * @description Serializes a binding object.
	 * @returns {object} serialized binding object with a serializable selectedRepresentation and the selectedRepresentationId
	 */
	this.serialize = function() {
		return {
			selectedRepresentation : that.getSelectedRepresentation().serialize(),
			selectedRepresentationId : that.getSelectedRepresentationInfo().representationId
		};
	};
	/**
	 * @description Deserialize a serializable binding object.
	 * @param {object} oSerializableBinding serializable binding object to be deserialized
	 * @returns {object} deserialized binding runtime object
	 */
	this.deserialize = function(oSerializableBinding) {
		that.setSelectedRepresentation(oSerializableBinding.selectedRepresentationId);
		that.getSelectedRepresentation().deserialize(oSerializableBinding.selectedRepresentation);
		return that;
	};

	aRepresentationInstances[0] = undefined;
	for( var index in oBindingConfig.representations) {
		var sRepTypeId = oBindingConfig.representations[index].representationTypeId;
        aRepresentationInfo[index] = jQuery.extend(true, {}, oFactory.getConfigurationById(sRepTypeId)); // return clone
		aRepresentationInfo[index].representationId = oBindingConfig.representations[index].id;
		aRepresentationInfo[index].representationLabel = oBindingConfig.representations[index].label;
	}
	if (aRepresentationInfo.length > 0) {
		this.setSelectedRepresentation(aRepresentationInfo[0].representationId);
	}
};
