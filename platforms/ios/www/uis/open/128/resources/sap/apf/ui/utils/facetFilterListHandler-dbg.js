/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
jQuery.sap.declare('sap.apf.ui.utils.facetFilterListHandler');
jQuery.sap.require('sap.apf.ui.representations.utils.formatter');
/**
 * @private
 * @experimental The complete class interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
 * @class Facet filter list handler
 * @description Handler for facet filter list controls
 * @param {sap.apf.core.instance} oCore Api
 * @param (sap.apf.utils.PathContextHandler} Path context handler instance.
 * @param {Array} facet filter configuration of the filter.
 * @name sap.apf.ui.utils.FacetFilterHandler
 * @returns {sap.apf.ui.utils.FacetFilterHandler}
 */
sap.apf.ui.utils.FacetFilterListHandler = function (oCoreApi, oUiApi, oPathContextHandler, oFacetFilterData) {
    "use strict";
    var oFilterTitle = oFacetFilterData.label;
    var sFilterProperty = oFacetFilterData.property;
    var sAlias = oFacetFilterData.alias;
    var sSelectProperty = sAlias || sFilterProperty;
    var sFrr = oFacetFilterData.filterResolutionRequest;
    var sVhr = oFacetFilterData.valueHelpRequest;
    var oMasterDataDeffered;
    var oSelectDataDeffered;
    var bTriedTextResolutionBefore = false; // To make sure that text resolution does not happen again on "open path scenario".
    var bHasServedBefore = false;	// To make sure that the filter value is not saved as initial context during "open path scenario".
    /**
     * @public
     * @function
     * @name sap.apf.ui.utils.FacetFilterListHandler#fetchValueHelpData
     * @description Returns a promise which will be resolved with value help data when the request is successful
     * It will be rejected with error object if the request does not succeed.
     * The promise will get resolved with an empty array if value help request is not available.
     * The promise will get resolved with an {Array} with elements of type {key: skey, text: sText}.
     * @returns {jQuery Promise}
     * */
    this.fetchValueHelpData = function () {
        oMasterDataDeffered = new jQuery.Deferred();
        if (sVhr) {
            var oVhrPromise = new sap.apf.ui.utils.PromiseBasedCreateReadRequest(oCoreApi, sVhr);
            oVhrPromise.then(this._getFormattedData).then(this._resolveMasterDataPromiseWith, this._handleError);
        } else {
            this._resolveMasterDataPromiseWith([]);
        }
        return oMasterDataDeffered.promise();
    };
    /**
     * @public
     * @function
     * @name sap.apf.ui.utils.FacetFilterListHandler#fetchSelectedFilterData
     * @description Returns a promise which will be resolved with selected filter data.
     * The promise will get resolved with an empty array if filter is not available in path context.
     * The promise will get resolved with an {Array} with elements of type {key: skey, text: sText}.
     * It will be rejected with error object if the request does not succeed.
     * @returns {jQuery Promise}
     * */
    this.fetchSelectedFilterData = function () {
        oSelectDataDeffered = new jQuery.Deferred();
        var bPropertyPresentInContext = oPathContextHandler.getAllIds().indexOf(sFilterProperty) !== -1;
        if (bPropertyPresentInContext) {
            var oFilter = oPathContextHandler.get(sFilterProperty);
            var aOperators = oFilter.getInternalFilter().getFilterTerms().map(function (term) {
                return term.getOp();
            });
            var bHasRelationalOperators = aOperators.some(function (op) {
                return op !== "EQ";
            });
            if (bHasRelationalOperators || (!sVhr && !bTriedTextResolutionBefore)) {
                bTriedTextResolutionBefore = true;
                if (sFrr) {
                    var oFrrPromise = new sap.apf.ui.utils.PromiseBasedCreateReadRequest(oCoreApi, sFrr, oFilter);
                    oFrrPromise.then(this._resolveRelationalOperatorFromPCH, this._handleError).then(this._getFormattedData).then(this._resolveSelectDataPromiseWith);
                    return oSelectDataDeffered.promise();
                }
                if (bHasRelationalOperators) {
                    this._handleFrrError();
                    return oSelectDataDeffered.promise();
                }
            }
            var aData = oFilter.getInternalFilter().getFilterTerms().map(function (term) {
                return {
                    key: term.getValue(),
                    text: term.getValue()
                };
            });
            this._resolveSelectDataPromiseWith(aData);
        } else {
            this._resolveSelectDataPromiseWith([]);
        }
        return oSelectDataDeffered.promise();
    };
    this._resolveMasterDataPromiseWith = function (aValues) {
        oMasterDataDeffered.resolveWith(this, [ aValues ]);
    };
    this._resolveSelectDataPromiseWith = function (aValues) {
        bHasServedBefore = true;
        oSelectDataDeffered.resolveWith(this, [ aValues ]);
    };
    this._getFormattedData = function (oArg) {
        var aData = oArg.aData;
        var oMetadata = oArg.oMetadata;
        var oFormatter = new sap.apf.ui.representations.utils.formatter({
            getEventCallback: oUiApi.getEventCallback.bind(oUiApi),
            getTextNotHtmlEncoded: oCoreApi.getTextNotHtmlEncoded
        }, oMetadata, aData);
        var sTextProperty = oMetadata.getPropertyMetadata(sSelectProperty).text;
        var aFormattedData = aData.map(function (oData) {
            var sFormattedKeyPropertyValue = oFormatter.getFormattedValue(sSelectProperty, oData[sSelectProperty]);
            var sTextValue;
            if (sTextProperty) {
                var sFormattedTextPropertyValue = oFormatter.getFormattedValue(sTextProperty, oData[sTextProperty]);
                sTextValue = sFormattedKeyPropertyValue + " - " + sFormattedTextPropertyValue;
            } else {
                sTextValue = sFormattedKeyPropertyValue;
            }
            return {
                key: oData[sSelectProperty],
                text: sTextValue
            };
        });
        return aFormattedData;
    };
    this._resolveRelationalOperatorFromPCH = function (oArg) {
        var aData = oArg.aData;
        var oMetadata = oArg.oMetadata;
        var oFilter = oCoreApi.createFilter();
        var oOrTerm = oFilter.getTopAnd().addOr();
        aData.forEach(function (oData) {
            var sValue = oData[sFilterProperty];
            oOrTerm.addExpression({
                name: sFilterProperty,
                operator: "EQ",
                value: sValue
            });
        });
        oPathContextHandler.update(sFilterProperty, oFilter);
        if (!bHasServedBefore) {
            oPathContextHandler.saveInitialContext([sFilterProperty]);
        }
        return {
            aData: aData,
            oMetadata: oMetadata
        }; // TO ALLOW METHOD CHAINING.
    };
    this._handleError = function () {
        var oMessageObject = oCoreApi.createMessageObject({
            code: "6010",
            aParameters: [ oCoreApi.getTextNotHtmlEncoded(oFilterTitle) ]
        });
        oCoreApi.putMessage(oMessageObject);
    };
};
/**
 * @private
 * @experimental The complete class interface is subject to ongoing work and not yet stable (as of Version 1.24.0).
 * @class Promise Based CreateReadRequest
 * @description Wraps sap.apf.core.CreateReadRequest inside a jquery promise and provides the interface.
 * @param {sap.apf.core.instance} oCore Api
 * @param {string} Request Id
 * @param {sap.apf.core.Filter} Filter Object
 * @name sap.apf.ui.utils.PromiseBasedCreateReadRequest
 * @returns {jQuery Promise}
 */
sap.apf.ui.utils.PromiseBasedCreateReadRequest = function (oCoreApi, sRequestId, oFilter) {
    var oDeferred = new jQuery.Deferred();
    var oReadRequest = oCoreApi.createReadRequestByRequiredFilter(sRequestId);
    var fnCallback = function (aData, oMetadata, oMessageObject) {
        var oArg = {
            aData: aData,
            oMetadata: oMetadata
        };
        if (aData && oMetadata) {
            oDeferred.resolveWith(this, [oArg]);
        } else {
            oDeferred.rejectWith(this, [oArg]);
        }
    };
    if (!oFilter) {
        oFilter = oCoreApi.createFilter();
    }
    oReadRequest.send(oFilter, fnCallback);
    return oDeferred.promise();
};
