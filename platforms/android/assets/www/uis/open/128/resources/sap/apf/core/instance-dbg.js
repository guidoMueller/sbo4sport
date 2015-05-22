/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap, OData */

jQuery.sap.declare("sap.apf.core.instance");

jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.require("sap.apf.core.utils.uriGenerator");
jQuery.sap.require("sap.apf.core.annotation");
jQuery.sap.require("sap.apf.core.metadata");
jQuery.sap.require("sap.apf.core.metadataFacade");
jQuery.sap.require("sap.apf.core.metadataProperty");
jQuery.sap.require("sap.apf.core.ajax");
jQuery.sap.require("sap.apf.core.odataRequest");
jQuery.sap.require("sap.apf.core.messageHandler");
jQuery.sap.require("sap.apf.core.entityTypeMetadata");
jQuery.sap.require("sap.apf.core.metadataFactory");
jQuery.sap.require("sap.apf.core.textResourceHandler");
jQuery.sap.require("sap.apf.core.configurationFactory");
jQuery.sap.require("sap.apf.core.path");
jQuery.sap.require("sap.apf.core.sessionHandler");
jQuery.sap.require("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.persistence");
jQuery.sap.require("sap.apf.core.readRequest");
jQuery.sap.require("sap.apf.core.readRequestByRequiredFilter");

/**
 * @class Core Component Instance
 * @name sap.apf.core.Instance
 * @description Creation of new Core Component Instance
 */
sap.apf.core.Instance = function(oMessageHandler) {
    'use strict';
	var that = this;
    var oRememberedPath;
	var oInject = {
		messageHandler : oMessageHandler,
		coreApi : that
	};
	var oResourcePathHandler;
	var oMetadataFactory;
	var oTextResourceHandler;
	var oConfigurationFactory;
	var oPath;
	var oSessionHandler;
	var oPersistence;
	/**
	 * @see sap.apf.core.ajax
	 */
	this.ajax = function(oSettings) {
		return sap.apf.core.ajax(oSettings);
	};

	/**
	 * @see sap.apf.core.odataRequestWrapper
	 */
	this.odataRequest = function(oRequest, fnSuccess, fnError, oBatchHandler) {
		sap.apf.core.odataRequestWrapper(oMessageHandler, oRequest, fnSuccess, fnError, oBatchHandler);
	};

	this.getMessageHandler = function() {
		return oMessageHandler;
	};
	/**
	 * @see sap.apf#putMessage for api definition.
	 * @see sap.apf.core.MessageHandler#putMessage for implementation.
	 */
	this.putMessage = function(oMessage) {
		return oMessageHandler.putMessage(oMessage);
	};
	/**
	 * @see sap.apf.core.MessageHandler#check
	 */
	this.check = function(bExpression, sMessage, sCode) {
		return oMessageHandler.check(bExpression, sMessage, sCode);
	};

	/**
	 * @see sap.apf#createMessageObject for api definition.
	 * @see sap.apf.core.MessageHandler#createMessageObject
	 */
	this.createMessageObject = function(oConfig) {
		return oMessageHandler.createMessageObject(oConfig);
	};

	/**
	 * @see sap.apf.core.MessageHandler#activateOnErrorHandling
	 */
	this.activateOnErrorHandling = function(bOnOff) {
		oMessageHandler.activateOnErrorHandling(bOnOff);
	};

	/**
	 * @see sap.apf.core.MessageHandler#setMessageCallback
	 */
	this.setCallbackForMessageHandling = function(fnCallback) {
		oMessageHandler.setMessageCallback(fnCallback);
	};
	
	/**
	 * @see sap.apf.core.MessageHandler#setApplicationMessageCallback
	 */
	this.setApplicationCallbackForMessageHandling = function(fnCallback) {
		oMessageHandler.setApplicationMessageCallback(fnCallback);
	};

	/**
	 * @see sap.apf.core.MessageHandler#getLogMessages
	 */
	this.getLogMessages = function() {
		return oMessageHandler.getLogMessages();
	};

	/**
	 * @see sap.apf.core.checkForTimeout
	 */
	this.checkForTimeout = function(oServerResponse) {
		var oMessageObject = sap.apf.core.utils.checkForTimeout(oServerResponse);
		// up to now, the error handling was hard coded in checkForTimeout
		if (oMessageObject) {
			oMessageHandler.putMessage(oMessageObject);
		}
		return oMessageObject;
	};
	/**
	 * @description Returns the instance of the UriGenerator. For internal core using only.
	 */
	this.getUriGenerator = function() {
		return sap.apf.core.utils.uriGenerator;
	};

	/**
	 * @see sap.apf.core.MetadataFactory#getMetadata
	 */
	this.getMetadata = function(sAbsolutePathToServiceDocument) {
		return oMetadataFactory.getMetadata(sAbsolutePathToServiceDocument);
	};

	/**
	 * @see sap.apf.core.MetadataFactory#getMetadataFacade
	 */
	this.getMetadataFacade = function() {
		return oMetadataFactory.getMetadataFacade();
	};

	/**
	 * @see sap.apf.core.MetadataFactory#getEntityTypeMetadata
	 */
	this.getEntityTypeMetadata = function(sAbsolutePathToServiceDocument, sEntityType) {
		return oMetadataFactory.getEntityTypeMetadata(sAbsolutePathToServiceDocument, sEntityType);
	};

	/**
	 * @see sap.apf.core.ResourcePathHandler#loadConfigFromFilePath
	 */
	this.loadApplicationConfig = function(sFilePath) {
		oResourcePathHandler.loadConfigFromFilePath(sFilePath);
	};

	/**
	 * @see sap.apf.core.ResourcePathHandler#getConfigurationProperties
	 */
	this.getApplicationConfigProperties = function() {
		return oResourcePathHandler.getConfigurationProperties();
	};

	/**
	 * @see sap.apf.core.ResourcePathHandler#getResourceLocation
	 */
	this.getResourceLocation = function(sResourceIdentifier) {
		return oResourcePathHandler.getResourceLocation(sResourceIdentifier);
	};

	/**
	 * @see sap.apf.core.ResourcePathHandler#getPersistenceConfiguration
	 */
	this.getPersistenceConfiguration = function() {
		return oResourcePathHandler.getPersistenceConfiguration();
	};
	/**
	 * @see sap.apf.core.ResourcePathHandler#getApplicationConfigurationURL
	 */
	this.getApplicationConfigurationURL = function() {
		return oResourcePathHandler.getApplicationConfigurationURL();
	};

	// ConfigurationFactory API

	/**
	 * @see sap.apf.core.ConfigurationFactory#getCategories
	 */
	this.getCategories = function() {
		return oConfigurationFactory.getCategories();
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#existsConfiguration
	 */
	this.existsConfiguration = function(sId) {
		return oConfigurationFactory.existsConfiguration(sId);
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#getStepTemplates
	 */
	this.getStepTemplates = function() {
		return oConfigurationFactory.getStepTemplates();
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#getFacetFilterConfigurations
	 */
	this.getFacetFilterConfigurations = function() {
		return oConfigurationFactory.getFacetFilterConfigurations();
	};

	/**
	 * @description Creates a step object from the configuration object and adds it to the path.
	 * @param {string} sStepId Step id as defined in the analytical configuration.
	 * @param {function} fnStepProcessedCallback Callback function for path update.
	 * @param {string} [sRepresentationId] Parameter, that allows definition of the representation id that shall initially be selected. If omitted the first configured representation will be selected.
	 * @returns {sap.apf.core.Step} oStep Created step.
	 */
	this.createStep = function(sStepId, fnStepProcessedCallback, sRepresentationId) {
		var oStepInstance;

		oMessageHandler.check(sStepId !== undefined && typeof sStepId === "string" && sStepId.length !== 0, "sStepID is  unknown or undefined");
		oStepInstance = oConfigurationFactory.createStep(sStepId);

		setRepresentationById();

		oPath.addStep(oStepInstance, fnStepProcessedCallback);
		return oStepInstance;

		function setRepresentationById() {
			var aRepresentationInfo, i;
			if (oStepInstance && sRepresentationId && typeof sRepresentationId === 'string') {
				aRepresentationInfo = oStepInstance.getRepresentationInfo();
				for(i = 0; i < aRepresentationInfo.length; i++) {
					if (aRepresentationInfo[i].representationId === sRepresentationId) {
						oStepInstance.setSelectedRepresentation(aRepresentationInfo[i].representationId);
						break;
					}
				}
			}
		}
	};

	// Path API
	/**
	 * @see sap.apf.core.Path#getSteps
	 */
	this.getSteps = function() {
		return oPath.getSteps();
	};

	/**
	 * @see sap.apf.core.Path#getInitialStep
	 */
	this.getInitialStep = function() {
		return oPath.getInitialStep();
	};

	/**
	 * @see sap.apf.core.Path#moveStepToPosition
	 */
	this.moveStepToPosition = function(oStep, nPosition, fnStepProcessedCallback) {
		oPath.moveStepToPosition(oStep, nPosition, fnStepProcessedCallback);
	};

	/**
     * @function
     * @name sap.apf.core.Instance#updatePath
	 * @see sap.apf.core.Path#update
	 */
	this.updatePath = function(fnStepProcessedCallback, bContextChanged) {
		oPath.update(fnStepProcessedCallback, bContextChanged);
	};

	/**
	 * @see sap.apf.core.Path#removeStep
	 */
	this.removeStep = function(oStep, fnStepProcessedCallback) {
		oPath.removeStep(oStep, fnStepProcessedCallback);
	};

	/**
	 * @description Creates a new Path instance
	 * @param {boolean} [bRememberActualPath] if true, then the path can be restored
	 *  
	 */
	this.resetPath = function(bRememberActualPath) {
		if (bRememberActualPath) {
			oRememberedPath = jQuery.extend(true, {}, oPath);
		}
		oPath = new sap.apf.core.Path(oInject);
	};
	/**
	 * if resetPath has been called with bRememberActualPath, then the old path
	 * can be restored
	 */
	this.restoreOriginalPath = function() {
		if (oRememberedPath) {
			oPath = oRememberedPath;
		}
	};
	/**
	 * @see sap.apf.core.Path#stepIsActive
	 */
	this.stepIsActive = function(oStep) {
		return oPath.stepIsActive(oStep);
	};

	/**
	 * @see sap.apf.core.Path#serializePath
	 */
	this.serializePath = function() {
		return oPath.serialize();
	};

	/**
	 * @see sap.apf.core.Path#deserializePath
	 */
	this.deserializePath = function(oSerializedAnalysisPath) {
		oPath.deserialize(oSerializedAnalysisPath);
	};
	// Text Resource Handler API
	/**
	 * @see sap.apf#getTextNotHtmlEncoded
	 * @see sap.apf.core.TextResourceHandler#getTextNotHtmlEncoded
	 */
	this.getTextNotHtmlEncoded = function(oLabel, aParameters) {
		return oTextResourceHandler.getTextNotHtmlEncoded(oLabel, aParameters);
	};

	/**
	 * @see sap.apf#getTextHtmlEncoded
	 * @see sap.apf.core.TextResourceHandler#getTextHtmlEncoded
	 */
	this.getTextHtmlEncoded = function(oLabel, aParameters) {
		return oTextResourceHandler.getTextHtmlEncoded(oLabel, aParameters);
	};

	/**
	 * @see sap.apf.core.TextResourceHandler#getMessageText
	 */
	this.getMessageText = function(sCode, aParameters) {
		return oTextResourceHandler.getMessageText(sCode, aParameters);
	};

	/**
	 * @see sap.apf.core.SessionHandler#getXsrfToken
	 */
	this.getXsrfToken = function(sServiceRootPath) {
		return oSessionHandler.getXsrfToken(sServiceRootPath);
	};
	/**
	 * @see sap.apf.core.SessionHandler#setContext
	 */
	this.setContext = function(oContextFilter) {
		oSessionHandler.setContext(oContextFilter);
	};

	/**
	 * @see sap.apf.core.SessionHandler#getContext
	 */
	this.getContext = function() {
		return oSessionHandler.getContext();
	};
	/**
	 * @see sap.apf.core.SessionHandler#getLogicalSystem
	 */
	this.getLogicalSystem = function() {
		return oSessionHandler.getLogicalSystem();
	};

	/**
	 * @see sap.apf#createReadRequest
	 * @description Creates an object for performing an Odata Request get operation.
	 * @param {String|Object} sRequestConfigurationId - identifies a request configuration, which is contained in the analytical configuration.
	 *                        or the request configuration is directly passed as an object oRequestConfiguration.
	 * @returns {sap.apf.core.ReadRequest}
	 */
	this.createReadRequest = function(/* sRequestConfigurationId | oRequestConfiguration */) {
		var oRequest = oConfigurationFactory.createRequest(arguments[0]);
		if (typeof arguments[0] === 'string'){
		 var oRequestConfiguration = oConfigurationFactory.getConfigurationById(arguments[0]);
		}
		else{ 
		 oRequestConfiguration = arguments[0];	
		}
		return new sap.apf.core.ReadRequest(oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
	};
	/**
	 * @see sap.apf#createReadRequestByRequiredFilter
	 * @description Creates an object for performing an Odata Request get operation with required filter for HANA view parameter & required filters.
	 * @param {String|Object} sRequestConfigurationId - identifies a request configuration, which is contained in the analytical configuration.
	 *                        or the request configuration is directly passed as an object oRequestConfiguration.
	 * @returns {sap.apf.core.ReadRequestByRequiredFilter}
	 */
	this.createReadRequestByRequiredFilter = function(/* sRequestConfigurationId | oRequestConfiguration */) {
		var oRequest = oConfigurationFactory.createRequest(arguments[0]);
		if (typeof arguments[0] === 'string'){
		 var oRequestConfiguration = oConfigurationFactory.getConfigurationById(arguments[0]);
		}
		else{ 
		 oRequestConfiguration = arguments[0];	
		}
		return new sap.apf.core.ReadRequestByRequiredFilter(oInject, oRequest, oRequestConfiguration.service, oRequestConfiguration.entityType);
	};
	/**
	 * @description Message configurations are loaded.
	 * @see sap.apf.core.MessageHandler#loadConfig
	 */
	this.loadMessageConfiguration = function(aMessages, bResetRegistry) {
		oMessageHandler.loadConfig(aMessages, bResetRegistry);
	};
	/**
	 * @see sap.apf.core.ConfigurationFactory#loadConfig
	 */
	this.loadAnalyticalConfiguration = function(oConfig) {	
		oConfigurationFactory.loadConfig(oConfig);
	};
	/**
	 * @see sap.apf.core#savePath for api definition.
	 * @see sap.apf.core.Persistence#createPath
	 */
	this.savePath = function(arg1, arg2, arg3, arg4) {
		var sPathId;
		var sName;
		var fnCallback;
        var oExternalObject;
		if (typeof arg1 === 'string' && typeof arg2 === 'string' && typeof arg3 === 'function') {
			sPathId = arg1;
			sName = arg2;
			fnCallback = arg3;
            oExternalObject = arg4;
			oPersistence.modifyPath(sPathId, sName, fnCallback, oExternalObject);
		} else if (typeof arg1 === 'string' && typeof arg2 === 'function') {
			sName = arg1;
			fnCallback = arg2;
            oExternalObject = arg3;
			oPersistence.createPath(sName, fnCallback, oExternalObject);
		} else {
			oMessageHandler.putMessage(sap.apf.core.createMessageObject({
				code : "5027",
				aParameters : [ arg1, arg2, arg3 ]
			}));
		}
	};
	/**
	 * @see sap.apf.core.Persistence#readPaths
	 */
	this.readPaths = function(fnCallback) {
		oPersistence.readPaths(fnCallback);
	};
	/**
	 * @see sap.apf.core.Persistence#openPath
	 */
	this.openPath = function(sPathId, fnCallback, nActiveStep) {
		return oPersistence.openPath(sPathId, fnCallback, nActiveStep);
	};
	/**
	 * @see sap.apf.core.Persistence#deletePath
	 */
	this.deletePath = function(sPathId, fnCallback) {
		oPersistence.deletePath(sPathId, fnCallback);
	};
	
	/**
	 * @see sap.apf#createFilter for api definition 
	 * @see sap.apf.utils.Filter  
	 */
	this.createFilter = function() {
		return new sap.apf.utils.Filter(oMessageHandler);
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.core#getActiveStep
	 * @description Returns active step, currently selected step, of analysis path.
	 * @returns {sap.apf.core.Step}
	 */
	this.getActiveStep = function() {
		return oPath.getActiveSteps()[0];
	};
	/**
	 * @public
	 * @function
	 * @name sap.apf.core#setActiveStep
	 * @description Sets handed over step as the active one.
	 * @param {sap.apf.core.Step} oStep The step to be set as active
	 * @returns undefined 
	 */
	this.setActiveStep = function(oStep) {
		oPath.makeStepActive(oStep);
		var aActiveSteps = oPath.getActiveSteps();
		var i;
		for(i = 0; i < aActiveSteps.length; ++i) {
			oPath.makeStepInactive(aActiveSteps[i]);
		}
		return oPath.makeStepActive(oStep);
	};

	// create local singleton instances...
	oResourcePathHandler = new sap.apf.core.ResourcePathHandler(oInject);
	oTextResourceHandler = new sap.apf.core.TextResourceHandler(oInject);
	oMessageHandler.setTextResourceHandler(oTextResourceHandler);

    oConfigurationFactory = new sap.apf.core.ConfigurationFactory(oInject);

    var oInjectMetadataFactory = {
        entityTypeMetadata : sap.apf.core.EntityTypeMetadata,
        hashtable : sap.apf.utils.Hashtable,
        metadata : sap.apf.core.Metadata,
        metadataFacade : sap.apf.core.MetadataFacade,
        metadataProperty : sap.apf.core.MetadataProperty,
        messageHandler : oInject.messageHandler,
        coreApi : that,
        datajs : OData,
        annotation : sap.apf.core.annotation,
        configurationFactory : oConfigurationFactory
    };
    oMetadataFactory = new sap.apf.core.MetadataFactory(oInjectMetadataFactory);

	oPath = new sap.apf.core.Path(oInject);
	oSessionHandler = new sap.apf.core.SessionHandler(oInject);
	oPersistence = new sap.apf.core.Persistence(oInject);
};
