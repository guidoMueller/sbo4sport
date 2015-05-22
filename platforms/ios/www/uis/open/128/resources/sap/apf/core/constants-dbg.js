/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.core.constants');
jQuery.sap.require('sap.ui.model.FilterOperator');
/**
 * Constants of the core
 * @class sap.apf.core.constants
 */
sap.apf.core.constants = sap.apf.core.constants || {};
/**
 * The constants shall be returned from a representation with method getFilterMethodTypes.
 * @class filterMethodTypes
 * @memberOf sap.apf.core.constants
 */
sap.apf.core.constants.filterMethodTypes = {
    /**
     * @public
     * @description selectionAsArray
     */
    selectionAsArray: 'saa',
    /**
     * @public
     * @description filter
     */
    filter: 'f',
    /**
     * @public
     * @description startFilter
     */
    startFilter: 'sf'
};
/**
 * @class Enumeration for filter operators, that are supported in odata $filter part
 */
sap.apf.core.constants.FilterOperators = sap.ui.model.FilterOperator;

sap.apf.core.constants.BooleFilterOperators = {

    AND: "and",
    OR: "or",
    NOT: "not"
};
/**
 * @constant sap.apf.core.constants.aSelectOpt operators for filter terms.
 * @description All allowed constants, that can be used in filter terms.
 *              These constants correspond to the terms, that can be handled by
 *              the OData protocol.
 */
sap.apf.core.constants.aSelectOpt = [ sap.apf.core.constants.FilterOperators.EQ, sap.apf.core.constants.FilterOperators.NE, sap.apf.core.constants.FilterOperators.GT, sap.apf.core.constants.FilterOperators.LT,
    sap.apf.core.constants.FilterOperators.GE, sap.apf.core.constants.FilterOperators.LE, sap.apf.core.constants.FilterOperators.BT, sap.apf.core.constants.FilterOperators.StartsWith, sap.apf.core.constants.FilterOperators.Contains, sap.apf.core.constants.FilterOperators.EndsWith ];
/**
 * @class Constants for the resource location
 * @descriptions Properties in the configuration file for the resource locations
 */
sap.apf.core.constants.resourceLocation = {

    /**
     * @public
     * @description webAppMessageConfiguration
     */
    applicationMessageDefinitionLocation: "applicationMessageDefinitionLocation",
    /**
     * @public
     * @description webAppMessageTextBundle
     */
    applicationMessageTextBundle: "applicationMessageTextBundle",
    /**
     * @public
     * @description apfUiTextBundle
     */
    apfUiTextBundle: "apfUiTextBundle",
    /**
     * @public
     * @description webAppTextBundle
     */
    applicationUiTextBundle: "applicationUiTextBundle",
    /**
     * @public
     * @description analyticalConfigurationLocation
     */
    analyticalConfigurationLocation: "analyticalConfigurationLocation"
};
/**
 * @namespace Constants for the message handling.
 */
sap.apf.core.constants.message = {};
/**
 * @class Message severity constants
 * @description Constants for the severity of a message object.
 * @memberOf sap.apf.core.constants.message.code
 */
sap.apf.core.constants.message.severity = {
    /**
     * @public
     * @description fatal
     */
    fatal: "fatal",
    /**
     * @public
     * @description warning
     */
    warning: "warning",
    /**
     * @public
     * @description error
     */
    error: "error",
    /**
     * @public
     * @description technical error
     */
    technError: "technError"
};
/**
 * @description Unique text to identify an exception, that should be ignored by the message handler during
 * processing the window.onerror. This allows to stop the execution by throwing an error.
 */
sap.apf.core.constants.message.code = {
    suppressFurtherException: "APFapf1972",
    errorCheck: "5100",
    errorCheckWarning: "5101",
    errorCheckConfiguration: "5102",
    errorCheckConfigurationWarning: "5103",
    errorExitTriggered: "5300",
    // messages, that exist without configuration, because they are used, before message configuration is loaded
    errorUnknown: "9000",
    //fatal messages, that occur during loading
    errorLoadConfig: "9001",
    errorStopProcessing: "9002",
    errorStartUp: "9003",
    errorLoadingRessource: "9007",
    wrongRessourcePath: "9008",
    missingAnalyticalConfig: "9009",
    errorLoadingAnalyticalConfig: "9010",
    errorInAnalyticalConfig: "9011"
};
/**
 * @class Event callback constants
 * @description Constants for the events triggered from apf
 * @memberOf sap.apf.core.constants
 */
sap.apf.core.constants.eventTypes = {
    /**
     * @public
     * @description fired when the sap.apf.setContext is invoked.
     *            Callback function on this event will be executed under the context of API instance.
     *                The arguments can be an {object} or empty based on opening a path scenario and triggering a new path respectively.
     *                The {object} passed on opening a path is described below :
     *              {
	 *              	id - filterId,
	 *              	type - filterType,
	 *              	expressions - filterTopAnd expressions,
	 *              	terms - filterOr expressions
	 *              }
     */
    contextChanged: "contextChanged",
    printTriggered: "printTriggered",
    format: "format"
};
/**
 * @class Configuration object types
 * @description Object types supported by configuration factory
 * @memberOf sap.apf.core.constants
 */
sap.apf.core.constants.configurationObjectTypes = {
    facetFilter: "facetFilter"
};