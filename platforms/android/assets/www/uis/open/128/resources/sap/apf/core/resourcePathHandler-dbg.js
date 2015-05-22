/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/*global jQuery, sap */
jQuery.sap.declare("sap.apf.core.resourcePathHandler");
jQuery.sap.require("sap.apf.core.utils.checkForTimeout");
jQuery.sap.require("sap.apf.utils.hashtable"); // ctor called
jQuery.sap.require("sap.apf.core.messageHandler"); // constants used
jQuery.sap.require("sap.apf.core.messageDefinition");

/**
 * @class Holds all paths for the message configuration, the message text bundles, other ui texts for apf, and for extensions. 
 * Furthermore it  holds the information about persistence configuration.
 */
sap.apf.core.ResourcePathHandler = function(oInject) {
    'use strict';
    var thisModule = this;

    var coreApi = oInject.coreApi;
    var messageHandler = oInject.messageHandler;

    var oHT = new sap.apf.utils.Hashtable(messageHandler);

    var oConfigurationProperties;
    var oPersistenceConfiguration;
    var oSmartBusinessConfiguration = null;
	var sApplicationConfigurationURL = "";
	var bConfigurationLoaded = false;

    //noinspection JSLint
    setDefaultLocations();

    // Declaration only ------
    function fileExists(sUrl) {
		var bFileExists = false;
		jQuery.ajax({
			url : sUrl,
			type : "HEAD",
			success : function(oData, sStatus, oJqXHR) {
				var oMessage = sap.apf.core.utils.checkForTimeout(oJqXHR);
				bFileExists = !oMessage;
			},
			error : function() {
				bFileExists = false;
			},
			async : false
		});
		return bFileExists;
	}
	/**
	 * @description returns the url of the application configuration
	 * @returns {string} url
	 */
	this.getApplicationConfigurationURL = function() {
		return sApplicationConfigurationURL;
	};
	/**
	 * @description Loads a new  application configuration in JSON format.
     * Loads only once. When called twice or more then skips processing and returns immediately.
	 * @param {string} sFilePath The absolute path of application configuration file. Host and port will be added in front of this path. 
	 */
	this.loadConfigFromFilePath = function(sFilePath) {
        if (bConfigurationLoaded) {
            return;
        };

        var sUrl = sFilePath;
        //noinspection ReuseOfLocalVariableJS
        sApplicationConfigurationURL = sFilePath;
        jQuery.ajax({
            url : sUrl,
            dataType : "json",
            success : parseConfigurationFile,
            error : function(oJqXHR, sStatus, sError) {
                var oMessageObject = messageHandler.createMessageObject({
                    code : sap.apf.core.constants.message.code.errorLoadingRessource,
                    rawText : "Error " + sError + " when loading the configuration of the resource location: " + sUrl
                });
                messageHandler.putMessage(oMessageObject);
            },
            async : false
        });
        configureMessageHandling();
        configureAnalyticalApplication();
        bConfigurationLoaded = true;

        // --- function declarations only ----------------------------
        //noinspection JSUnusedLocalSymbols,FunctionWithMoreThanThreeNegationsJS
        function parseConfigurationFile(oData, sStatus, oJqXHR) //noinspection JSLint
        {
			var oMessage = sap.apf.core.utils.checkForTimeout(oJqXHR);
			if(oMessage) {
				messageHandler.putMessage(messageHandler.createMessageObject({
					code : sap.apf.core.constants.message.code.errorStartUp,
					rawText : "Timeout when loading application configuration from " + sFilePath + "."
				}));
			}

			if (!oData || !oData.applicationConfiguration) {
				messageHandler.putMessage(messageHandler.createMessageObject({
					code : sap.apf.core.constants.message.code.errorStartUp,
					rawText : "The application configuration from " + sFilePath + " has no valid format."
				}));
				return;

			}
			if (oData.applicationConfiguration.textResourceLocations === undefined) {
				messageHandler.putMessage(messageHandler.createMessageObject({
					code : sap.apf.core.constants.message.code.errorStartUp,
					rawText : "The textResourceLocations is missing in the application configuration from " + sFilePath + "."
				}));
				return;
			}
			
			var oApplicationConfiguration = oData.applicationConfiguration;
			saveRestrictedCopyOfApplicationConfiguration(oApplicationConfiguration);
			
			var oTextResourceLocations = oData.applicationConfiguration.textResourceLocations;
			oPersistenceConfiguration = oData.applicationConfiguration.persistence;
	        checkPersistenceConfiguration(oPersistenceConfiguration);

			if(oData.applicationConfiguration.smartBusiness){
			    oSmartBusinessConfiguration = oData.applicationConfiguration.smartBusiness;
			    checkSmartBusinessConfiguration(oSmartBusinessConfiguration);
			}
			
			var oMessageObject;
			var sUrl;
			for( var oProperty in sap.apf.core.constants.resourceLocation) {
				if(!sap.apf.core.constants.resourceLocation.hasOwnProperty( oProperty )) {
					continue;
				}
				//noinspection JSUnfilteredForInLoop
                if (oApplicationConfiguration[oProperty] !== undefined) {
					//noinspection JSUnfilteredForInLoop
                    sUrl = oApplicationConfiguration[oProperty];
				} else { //noinspection JSUnfilteredForInLoop
                    if (oTextResourceLocations[oProperty] !== undefined) {
                                        //noinspection JSUnfilteredForInLoop
                        sUrl = oTextResourceLocations[oProperty];
                                    }
                    else { continue; }
                }
                if (fileExists(sUrl)) {
                    //noinspection JSUnfilteredForInLoop
                    oHT.setItem(oProperty, sUrl);
                } else {
                    oMessageObject = messageHandler.createMessageObject({
                        code : sap.apf.core.constants.message.code.wrongRessourcePath,
                        rawText : "The path " + sUrl + " for resource location " + oProperty + "is not valid."
                    });
                    messageHandler.putMessage(oMessageObject);
                }
			}
		}
        function saveRestrictedCopyOfApplicationConfiguration(oApplicationConfiguration) {
        	oConfigurationProperties = jQuery.extend(true, {}, oApplicationConfiguration)
			delete oConfigurationProperties.type;
			delete oConfigurationProperties.analyticalConfigurationLocation;
			delete oConfigurationProperties.applicationMessageDefinitionLocation;
			delete oConfigurationProperties.textResourceLocations;
			delete oConfigurationProperties.persistence;
		}
	};
	function configureAnalyticalApplication() {
		var sUrl = thisModule.getResourceLocation(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation);
		var oMessageObject;
        //noinspection JSUnusedLocalSymbols
		if (sUrl !== "") {
			jQuery.ajax({
				url : sUrl,
				dataType : "json",
				success : parseAnalyticalConfigurationFile,
				error : function(oJqXHR, sStatus, sError) {
					oMessageObject = messageHandler.createMessageObject({
						code : sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig,
						rawText : "Error " + sError + " when loading analytical configuration file" + sUrl
					});
					messageHandler.putMessage(oMessageObject);
				},
				async : false
			});
		} else {  // the case of the default value which is set by this module when the file path was undefined in the config file
			oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.missingAnalyticalConfig,
				rawText : "No analytical configuration defined in the application configuration"
			});
			messageHandler.putMessage(oMessageObject);
		}
        function parseAnalyticalConfigurationFile(oData, sStatus, oJqXHR) {
            var oMessage = sap.apf.core.utils.checkForTimeout(oJqXHR);
            if(!oMessage) {
                if (oData) {
                    coreApi.loadAnalyticalConfiguration(oData);
                } else {
                    messageHandler.putMessage( messageHandler.createMessageObject({
                        code : sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig,
                        rawText : "Undefined analytical configuration file" + sUrl
                    }));
                }
            } else {
                messageHandler.putMessage(messageHandler.createMessageObject({
                    code : sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig,
                    rawText : "Timeout error when loading analytical configuration file" + sUrl
                }));
            }
        }
	}
	function configureMessageHandling() {
		coreApi.loadMessageConfiguration(sap.apf.core.messageDefinition, true);
		loadMessagesFromConfigurationFile(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation, false);
	}
	function loadMessagesFromConfigurationFile(sResourceLocation, bResetRegistry) {
		var sUrl = thisModule.getResourceLocation(sResourceLocation);
		if (sUrl !== "") {
			jQuery.ajax({
				url : sUrl,
				dataType : "json",
				success : parseMessageConfigurationFile,
				error : function(oJqXHR, sStatus, sError) {
					var oMessageObject = messageHandler.createMessageObject({
						code : sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig,
						rawText : "Error " + sError + " when loading message configuration file" + sUrl
					});
					messageHandler.putMessage(oMessageObject);
				},
				async : false
			});
		}
        //noinspection JSUnusedLocalSymbols
        function parseMessageConfigurationFile(oData, sStatus, oJqXHR) {
            var oMessageObject;
            var oMessage = sap.apf.core.utils.checkForTimeout(oJqXHR);
            if(!oMessage) {
                if (oData.messageConfiguration) {
                    coreApi.loadMessageConfiguration(oData.messageConfiguration.definitions, bResetRegistry);
                }
            } else {
                oMessageObject = messageHandler.createMessageObject({
                    code : sap.apf.core.constants.message.code.errorLoadingAnalyticalConfig,
                    rawText : "Timeout error when loading message configuration file" + sUrl
                });
                messageHandler.putMessage(oMessageObject);
            }
        }
	}
	//noinspection FunctionWithMoreThanThreeNegationsJS
    function checkPersistenceConfiguration(oConfig) {
		var oMessageObject;

		if (!oConfig || !oConfig.path) {
			 oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
				rawText : "persistence path configuration is missing in the application configuration"
			});
			messageHandler.putMessage(oMessageObject);
		}
		if (!oConfig.path.service) {
			oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
				rawText : "service in persistence path configuration is missing"
			});
			messageHandler.putMessage(oMessageObject);
		}
		if (!oConfig.path.entityType) {
			oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
				rawText : "entity type in persistence path configuration is missing"
			});
			messageHandler.putMessage(oMessageObject);
		}
		if (!oConfig.path.type || oConfig.path.type !== "persistenceRequest") {
			oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
				rawText : "type in persistence path configuration is not persistenceRequest"
			});
			messageHandler.putMessage(oMessageObject);
		}
		if (!oConfig.logicalSystem) {
			oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
				rawText : "logical system configuration is missing in the application configuration"
			});
			messageHandler.putMessage(oMessageObject);
		}
		if (!oConfig.logicalSystem.service || !oConfig.logicalSystem.entityType) {
			oMessageObject = messageHandler.createMessageObject({
				code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
				rawText : "service or entityType are missing in logical system configuration  in the application configuration"
			});
			messageHandler.putMessage(oMessageObject);
		}
	}
    function checkSmartBusinessConfiguration(oConfig){
        var oMessageObject;
        
        if (oConfig.evaluations && !oConfig.evaluations.service) {
            oMessageObject = messageHandler.createMessageObject({
                code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
                rawText : "service in Smart Business service root configuration is missing"
            });
            messageHandler.putMessage(oMessageObject);
        }
        if (oConfig.evaluations && (!oConfig.evaluations.type || oConfig.evaluations.type !== "smartBusinessRequest")) {
            oMessageObject = messageHandler.createMessageObject({
                code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
                rawText : "type in Smart Business configuration is not smartBusinessRequest"
            });
            messageHandler.putMessage(oMessageObject);
        }
        if (oConfig.evaluations && !oConfig.evaluations.entityType) {
            oMessageObject = messageHandler.createMessageObject({
                code : sap.apf.core.constants.message.code.errorInAnalyticalConfig,
                rawText : "entityType in Smart Business service root configuration is missing"
            });
            messageHandler.putMessage(oMessageObject);
        }
    }
	/**
	 * @description This function returns the path of a specified resource. 
	 * @param {string} sResourceIdentifier type sap.apf.core.constants.resourceLocation.*
	 * @returns {string} Resource path
	 */
	this.getResourceLocation = function(sResourceIdentifier) {
		return oHT.getItem(sResourceIdentifier);
	};
	/**
	 * @description This function returns the configuration for the persistence (of the path).
	 * @returns {object} persistence configuration object
	 */
	this.getPersistenceConfiguration = function() {
		messageHandler.check(bConfigurationLoaded, "RessourcePathHandler: configuration must be loaded before access to ressources");
		return oPersistenceConfiguration;
	};
	/**
	 * @description This function returns the properties of the configuration file, which are not used internally.
	 * @returns {object} Copy of properties in configuration
	 */
	this.getConfigurationProperties = function() {
		return oConfigurationProperties;
	};
    function setDefaultLocations() {
		var sApfLocation = coreApi.getUriGenerator().getApfLocation();

		oHT.setItem(sap.apf.core.constants.resourceLocation.apfUiTextBundle, sApfLocation + "resources/i18n/apfUi.properties");
		oHT.setItem(sap.apf.core.constants.resourceLocation.applicationMessageDefinitionLocation, "");
		oHT.setItem(sap.apf.core.constants.resourceLocation.applicationMessageTextBundle, "");
		oHT.setItem(sap.apf.core.constants.resourceLocation.applicationUiTextBundle, "");
		oHT.setItem(sap.apf.core.constants.resourceLocation.analyticalConfigurationLocation, "");
	}
};
